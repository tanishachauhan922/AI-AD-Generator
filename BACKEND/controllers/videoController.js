const Project = require("../models/project");
const cloudinary = require("../config/cloudinary");

const MAGIC_HOUR_API_URL = "https://api.magichour.ai/v1";

const getMagicHourHeaders = () => {
  const apiKey = process.env.MAGIC_HOUR_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("MAGIC_HOUR_API_KEY is not configured in the backend .env file.");
  }

  return {
    Authorization: `Bearer ${apiKey.replace(/^Bearer\s+/i, "")}`,
    "Content-Type": "application/json",
  };
};

const readJsonResponse = async (response) => {
  const responseText = await response.text();

  if (!responseText) {
    return {};
  }

  try {
    return JSON.parse(responseText);
  } catch {
    return { message: responseText.slice(0, 500) };
  }
};

const getProviderErrorMessage = (data, fallback) => (
  [
    data?.error?.message,
    data?.message,
    data?.errors?.[0]?.message,
  ].find((message) => typeof message === "string" && message.trim()) || fallback
);

const generateVideo = async (req, res) => {
  try {
    const {
      productName,
      productDescription,
      ctaText,
      region,
      language,
      adStyle,
      platform,
      aspectRatio,
      duration,
      voiceover,
      audioTrack,
    } = req.body || {};

    if (
      typeof productName !== "string" ||
      !productName.trim() ||
      typeof productDescription !== "string" ||
      !productDescription.trim()
    ) {
      return res.status(400).json({
        message: "Product name and product description are required.",
      });
    }

    const videoDuration = duration === undefined ? 3 : Number(duration);
    if (!Number.isFinite(videoDuration) || videoDuration < 1) {
      return res.status(400).json({
        message: "Video duration must be at least 1 second.",
      });
    }
    if (videoDuration > 8) {
      return res.status(400).json({
        message: "Cannot generate a video longer than 8 seconds.",
      });
    }

    const allowedAspectRatios = ["9:16", "1:1", "16:9"];
    const videoAspectRatio = allowedAspectRatios.includes(aspectRatio)
      ? aspectRatio
      : "9:16";

    const prompt = [
      `Create a ${adStyle || "professional"} advertisement video for ${productName.trim()}.`,
      `Product details: ${productDescription.trim()}`,
      `Call to action: ${ctaText || "Learn More"}`,
      `Target region: ${region || "Global"}`,
      `Language: ${language || "English"}`,
      `Platform: ${platform || "Instagram Reels"}`,
      voiceover ? `Voiceover direction: ${voiceover}.` : "",
      audioTrack ? `Background music direction: ${audioTrack}.` : "",
      "Show the product clearly, use attractive lighting, smooth camera movement, and a polished commercial style.",
    ].filter(Boolean).join("\n\n");

    const magicHourResponse = await fetch(`${MAGIC_HOUR_API_URL}/text-to-video`, {
      method: "POST",
      headers: getMagicHourHeaders(),
      signal: AbortSignal.timeout(30_000),
      body: JSON.stringify({
        name: `${productName.trim()} Video Ad`,
        end_seconds: videoDuration,
        aspect_ratio: videoAspectRatio,
        resolution: "480p",
        audio: true,
        style: { prompt },
      }),
    });

    const magicHourData = await readJsonResponse(magicHourResponse);

    if (!magicHourResponse.ok) {
      console.error("Magic Hour video creation failed:", magicHourData);
      return res.status(502).json({
        message: getProviderErrorMessage(
          magicHourData,
          "Magic Hour could not start video generation."
        ),
      });
    }

    if (typeof magicHourData.id !== "string" || !magicHourData.id) {
      console.error("Magic Hour returned no video project ID:", magicHourData);
      return res.status(502).json({
        message: "Magic Hour accepted no usable video project ID.",
      });
    }

    const project = await Project.create({
      userId: req.user.id,
      title: `${productName.trim()} Video Ad`,
      type: "video",
      status: "Active",
      prompt,
      duration: videoDuration,
      aspectRatio: videoAspectRatio,
      magicHourProjectId: magicHourData.id,
    });

    return res.status(202).json({
      message: "Video generation started.",
      project,
      magicHourProjectId: magicHourData.id,
      status: magicHourData.status || "queued",
    });
  } catch (error) {
    console.error("Video generation error:", error);
    return res.status(500).json({
      message: error instanceof Error
        ? error.message
        : "Failed to start video generation.",
    });
  }
};

const getVideoStatus = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findOne({
      magicHourProjectId: projectId,
      userId: req.user.id,
    });

    if (!project) {
      return res.status(404).json({ message: "Video project not found." });
    }

    if (project.videoUrl) {
      return res.status(200).json({
        status: "complete",
        videoUrl: project.videoUrl,
        project,
      });
    }

    const response = await fetch(
      `${MAGIC_HOUR_API_URL}/video-projects/${encodeURIComponent(projectId)}`,
      {
        method: "GET",
        headers: getMagicHourHeaders(),
        signal: AbortSignal.timeout(30_000),
      }
    );
    const data = await readJsonResponse(response);

    if (!response.ok) {
      console.error("Magic Hour status request failed:", data);
      return res.status(502).json({
        message: getProviderErrorMessage(data, "Failed to get video status."),
      });
    }

    if (data.status === "error" || data.status === "canceled") {
      return res.status(502).json({
        status: data.status,
        message: getProviderErrorMessage(data, "Video generation failed."),
      });
    }

    if (data.status !== "complete") {
      return res.status(200).json({
        status: data.status || "queued",
        message: "Video is still processing.",
      });
    }

    const downloadUrl = data.downloads?.[0]?.url;
    if (typeof downloadUrl !== "string" || !downloadUrl) {
      console.error("Completed Magic Hour video has no download URL:", data);
      return res.status(502).json({
        message: "Video completed, but Magic Hour did not return a download URL.",
      });
    }

    const cloudinaryResult = await cloudinary.uploader.upload(downloadUrl, {
      resource_type: "video",
      folder: "ad-creative-studio/videos",
    });

    if (!cloudinaryResult.secure_url) {
      throw new Error("Cloudinary did not return a URL for the generated video.");
    }

    project.videoUrl = cloudinaryResult.secure_url;
    project.status = "Completed";
    await project.save();

    return res.status(200).json({
      status: "complete",
      videoUrl: project.videoUrl,
      project,
    });
  } catch (error) {
    console.error("Video status error:", error);
    return res.status(500).json({
      message: error instanceof Error
        ? error.message
        : "Failed to check video status.",
    });
  }
};

module.exports = {
  generateVideo,
  getVideoStatus,
};
