const cloudinary = require("../config/cloudinary");
const Project = require("../models/project");

// =====================================================
// Generate complete advertisement
// =====================================================

const generateAd = async (req, res) => {
  try {
    const {
      productName,
      productDescription,
      adStyle,
      platform,
      language,
      region,
      ctaText,
      aspectRatio,
    } = req.body || {};

    // =====================================================
    // STEP 1: Validate user input
    // =====================================================

    if (!productName || !productDescription) {
      return res.status(400).json({
        message: "Product name and product description are required.",
      });
    }

    // =====================================================
    // STEP 2: Prompt for Cloudflare TEXT AI
    // =====================================================

    const prompt = `
You are an expert advertising copywriter.

Create an advertisement for this product.

Product Name: ${productName}
Product Description: ${productDescription}
Ad Style: ${adStyle || "Professional"}
Platform: ${platform || "Social Media"}
Language: ${language || "English"}
Region: ${region || "India"}
CTA: ${ctaText || "Shop Now"}

You must generate exactly three fields:

- headline
- subtext
- imagePrompt

Rules:

headline:
Create a short and catchy advertising headline.

subtext:
Create a short supporting advertising sentence.

imagePrompt:
Create a detailed professional prompt for an AI image generation model.

The imagePrompt must describe:
- the product
- visual style
- composition
- lighting
- background
- colors
- professional commercial advertising appearance

IMPORTANT:
Return ONLY a JSON object.

The JSON must have exactly these three fields:

{
  "headline": "short catchy headline",
  "subtext": "short supporting text",
  "imagePrompt": "detailed professional image generation prompt"
}

Do NOT add explanations.
Do NOT add markdown.
Do NOT add code fences.
Do NOT add Image Details.
Do NOT add resolution.
Do NOT add dimensions.
Do NOT add aspect ratio.
`;

    // =====================================================
    // STEP 3: Cloudflare TEXT AI
    // =====================================================

    const textResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/meta/llama-3.1-8b-instruct`,
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          prompt: prompt,

          max_tokens: 250,

          temperature: 0.2,

          // Cloudflare JSON Mode
          response_format: {
            type: "json_object",
          },
        }),
      }
    );

    const textData = await textResponse.json();

    // =====================================================
    // STEP 4: Check Cloudflare TEXT response
    // =====================================================

    if (!textResponse.ok) {
      console.error("Cloudflare text error:");
      console.error(textData);

      throw new Error(
        textData?.errors?.[0]?.message ||
          "Cloudflare text generation failed"
      );
    }

    // =====================================================
    // STEP 5: Get generated response
    // =====================================================

    const generatedText = textData?.result?.response;

    if (!generatedText) {
      console.error("Cloudflare response:");
      console.error(textData);

      throw new Error(
        "Cloudflare did not return generated text."
      );
    }

    console.log("=================================");
    console.log("CLOUDFLARE TEXT GENERATED:");
    console.log(generatedText);
    console.log("=================================");

    // =====================================================
    // STEP 6: Parse JSON response
    // =====================================================

    let adContent;

    try {
      // Sometimes response is already an object
      if (typeof generatedText === "object") {
        adContent = generatedText;
      } else {
        adContent = JSON.parse(generatedText);
      }
    } catch (error) {
      console.error("❌ JSON PARSE FAILED");
      console.error("RAW CLOUDFLARE RESPONSE:");
      console.error(generatedText);

      throw new Error(
        "Cloudflare returned invalid advertisement JSON."
      );
    }

    // =====================================================
    // STEP 7: Validate advertisement
    // =====================================================

    if (!adContent || typeof adContent !== "object") {
      throw new Error(
        "Cloudflare returned an invalid advertisement object."
      );
    }

    if (
      typeof adContent.headline !== "string" ||
      !adContent.headline.trim()
    ) {
      throw new Error(
        'Cloudflare response is missing a valid "headline".'
      );
    }

    if (
      typeof adContent.subtext !== "string" ||
      !adContent.subtext.trim()
    ) {
      throw new Error(
        'Cloudflare response is missing a valid "subtext".'
      );
    }

    if (
      typeof adContent.imagePrompt !== "string" ||
      !adContent.imagePrompt.trim()
    ) {
      throw new Error(
        'Cloudflare response is missing a valid "imagePrompt".'
      );
    }

    // Clean values
    adContent.headline =
      adContent.headline.trim();

    adContent.subtext =
      adContent.subtext.trim();

    adContent.imagePrompt =
      adContent.imagePrompt.trim();

    console.log("✅ AD CONTENT:");
    console.log(adContent);

    // =====================================================
    // STEP 8: Cloudflare IMAGE GENERATION
    // =====================================================

    const cloudflareImageResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/black-forest-labs/flux-1-schnell`,
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,

          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          prompt: adContent.imagePrompt,

          // Keep steps low to save usage
          steps: 4,
        }),
      }
    );

    const cloudflareImageData =
      await cloudflareImageResponse.json();

    // =====================================================
    // STEP 9: Check IMAGE response
    // =====================================================

    if (!cloudflareImageResponse.ok) {
      console.error("Cloudflare image error:");
      console.error(cloudflareImageData);

      throw new Error(
        cloudflareImageData?.errors?.[0]?.message ||
          "Cloudflare image generation failed"
      );
    }

    console.log("✅ CLOUDFLARE IMAGE GENERATED");

    // =====================================================
    // STEP 10: Get Base64 image
    // =====================================================

    const base64Image =
      cloudflareImageData?.result?.image;

    if (!base64Image) {
      console.error("Cloudflare image response:");
      console.error(cloudflareImageData);

      throw new Error(
        "Cloudflare did not return an image."
      );
    }

    console.log("✅ BASE64 IMAGE RECEIVED");

    // =====================================================
    // STEP 11: Upload image to Cloudinary
    // =====================================================

    const cloudinaryResult =
      await cloudinary.uploader.upload(
        `data:image/jpeg;base64,${base64Image}`,
        {
          folder: "ai-ad-generator",
          resource_type: "image",
        }
      );

    const imageUrl =
      cloudinaryResult.secure_url;
      const project = await Project.create({
  userId: req.user.id,
  title: productName,
  status: "Active",
  type: "image",
  imageUrl: imageUrl,
  headline: adContent.headline,
  subtext: adContent.subtext,
  cta: ctaText,
});

   

    // =====================================================
    // STEP 12: Send result to frontend
    // =====================================================

    return res.status(200).json({
      success: true,

      headline:
        adContent.headline,

      subtext:
        adContent.subtext,

      imagePrompt:
        adContent.imagePrompt,

      imageUrl:
        imageUrl,

      aspectRatio:
        aspectRatio || "1:1",
    });

  } catch (error) {
    console.error("=================================");
    console.error("AD GENERATION ERROR:");
    console.error(error);
    console.error("=================================");

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  generateAd,
};