const parseCriticResponse = (response) => {
  if (typeof response !== "string") {
    if (response && typeof response === "object" && !Array.isArray(response)) {
      return response;
    }
    throw new Error("AI response was empty or not text");
  }

  const cleanedResponse = response
    .replace(/```(?:json)?/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleanedResponse);
  } catch {
    const jsonStart = cleanedResponse.indexOf("{");
    const jsonEnd = cleanedResponse.lastIndexOf("}");

    if (jsonStart !== -1 && jsonEnd > jsonStart) {
      try {
        return JSON.parse(cleanedResponse.slice(jsonStart, jsonEnd + 1));
      } catch {
        // The model returned prose rather than a JSON object.
      }
    }
  }

  const labels = {
    overallScore: ["overall score", "overall ad quality"],
    visualAppeal: ["visual appeal"],
    readability: ["text readability", "readability"],
    layoutComposition: ["layout and composition", "layout & composition", "layout composition"],
    brandConsistency: ["brand consistency"],
    ctaEffectiveness: ["cta effectiveness", "call to action effectiveness"]
  };
  const allLabels = Object.values(labels).flat();
  const normalized = cleanedResponse.toLowerCase();
  const result = {};

  for (const [field, aliases] of Object.entries(labels)) {
    const labelIndex = aliases
      .map((label) => normalized.indexOf(label))
      .filter((index) => index !== -1)
      .sort((a, b) => a - b)[0];

    if (labelIndex === undefined) continue;

    const label = aliases.find((alias) => normalized.indexOf(alias) === labelIndex);
    const sectionStart = labelIndex + label.length;
    const nextLabelIndex = allLabels
      .map((nextLabel) => normalized.indexOf(nextLabel, sectionStart))
      .filter((index) => index !== -1)
      .sort((a, b) => a - b)[0];
    const section = cleanedResponse.slice(
      sectionStart,
      nextLabelIndex === undefined ? undefined : nextLabelIndex
    );
    const scoreMatch = section.match(
      /(?:score\s*[:\-]?\s*|[:\-]\s*)(\d{1,3})(?:\s*(?:\/|out of)\s*(10|100))?/i
    );

    if (scoreMatch) {
      const score = Number(scoreMatch[1]);
      const denominator = Number(scoreMatch[2] || 100);
      if (score <= denominator) {
        result[field] = denominator === 10 ? score * 10 : score;
      }
    }
  }

  if (Object.keys(labels).every((field) => Number.isFinite(result[field]))) {
    return result;
  }

  throw new Error("AI response did not contain all required critic scores");
};

const analyzeCreative = async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        message: "Image URL is required"
      });
    }

    // Fetch image from Cloudinary / provided URL
    const imageResponse = await fetch(imageUrl);

    if (!imageResponse.ok) {
      return res.status(400).json({
        message: "Unable to fetch image"
      });
    }

    const imageBuffer = await imageResponse.arrayBuffer();

    // Convert image to base64
    const base64Image = Buffer.from(imageBuffer).toString("base64");

    // Detect image type
    const contentType =
      imageResponse.headers.get("content-type") || "image/jpeg";

    const imageData = `data:${contentType};base64,${base64Image}`;

    const prompt = `
You are an AI advertising creative critic.

Analyze the provided advertisement image carefully.

Evaluate it on these criteria:

1. Visual Appeal
2. Text Readability
3. Layout and Composition
4. Brand Consistency
5. CTA Effectiveness
6. Overall Ad Quality

Give each category a score from 0 to 100.

Then calculate an overall score from 0 to 100.

Also provide:
- 2 things the advertisement does well
- 2 things that could be improved
- one short overall recommendation

Do not judge the quality based on personal taste.
Evaluate it as a professional digital advertisement.
`;

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/meta/llama-3.2-11b-vision-instruct`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You are a professional advertising creative analyst. Return only valid JSON."
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: prompt
                },
                {
                  type: "image_url",
                  image_url: {
                    url: imageData
                  }
                }
              ]
            }
          ],

          response_format: {
            type: "json_schema",
            json_schema: {
              type: "object",
              properties: {
                overallScore: {
                  type: "number"
                },
                visualAppeal: {
                  type: "number"
                },
                readability: {
                  type: "number"
                },
                layoutComposition: {
                  type: "number"
                },
                brandConsistency: {
                  type: "number"
                },
                ctaEffectiveness: {
                  type: "number"
                },
                strengths: {
                  type: "array",
                  items: {
                    type: "string"
                  }
                },
                improvements: {
                  type: "array",
                  items: {
                    type: "string"
                  }
                },
                recommendation: {
                  type: "string"
                }
              },
              required: [
                "overallScore",
                "visualAppeal",
                "readability",
                "layoutComposition",
                "brandConsistency",
                "ctaEffectiveness",
                "strengths",
                "improvements",
                "recommendation"
              ]
            }
          },

          max_tokens: 500,
          temperature: 0.2
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Cloudflare Critic Error:", data);

      return res.status(response.status).json({
        message: "AI Critic analysis failed",
        error: data
      });
    }

    let result;
    try {
      result = parseCriticResponse(data.result?.response);
    } catch (error) {
      console.error("AI Critic returned an invalid response:", error.message);
      return res.status(502).json({
        message: "AI Critic returned an unreadable analysis. Please try again."
      });
    }

    return res.json({
      success: true,
      critic: result
    });

  } catch (error) {
    console.error("AI Critic Error:", error);

    return res.status(500).json({
      message: "Failed to analyze advertisement",
      error: error.message
    });
  }
};

module.exports = {
  analyzeCreative
};