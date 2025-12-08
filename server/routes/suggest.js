import express from "express";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "HARDCODE_TEMP_KEY"
});

router.post("/", async (req, res) => {
  try {
    const { resume } = req.body;

    const prompt = `
Return ONLY valid JSON.
Without any text, markdown, or explanation.

JSON Format:
{
  "summary": "",
  "tips": [],
  "improvedBullets": []
}

Resume Data:
${JSON.stringify(resume, null, 2)}
`;

    const ai = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    let content = ai.choices[0].message.content.trim();

    // Remove markdown wrapping if present
    content = content.replace(/```json/g, "").replace(/```/g, "").trim();

    const result = JSON.parse(content);

    res.json({ result });

  } catch (err) {
    console.error("🔥 Suggest Error:", err);
    res.status(500).json({ error: "Suggest failed", details: err.message });
  }
});

export default router;
