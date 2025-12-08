import express from "express";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    // Load API key safely inside request
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      console.error("❌ Missing GROQ_API_KEY in environment!");
      return res.status(500).json({
        error: "Server missing GROQ API key",
        result: null
      });
    }

    const client = new Groq({ apiKey });

    const { resume } = req.body;

    const prompt = `
Return ONLY this JSON structure:

{
  "summary": "",
  "tips": [],
  "improvedBullets": []
}

Improve the resume content below:

${JSON.stringify(resume, null, 2)}
    `;

    const ai = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      messages: [{ role: "user", content: prompt }]
    });

    let text = ai.choices[0].message.content.trim();

    // -------------------------------
    // 1) Extract JSON if wrapped
    // -------------------------------
    let jsonString = text;

    const jsonMatch = text.match(/```json([\s\S]*?)```/);
    if (jsonMatch) {
      jsonString = jsonMatch[1].trim();
    }

    // -------------------------------
    // 2) Try parsing JSON
    // -------------------------------
    let result;
    try {
      result = JSON.parse(jsonString);
    } catch (e) {
      console.error("❌ JSON parse error:", e);
      return res.status(500).json({
        error: "AI returned invalid JSON",
        raw: text
      });
    }

    return res.json({ result });

  } catch (err) {
    console.error("🔥 Suggest Error:", err);
    return res.status(500).json({
      error: "AI Suggestion failed",
      details: err.message
    });
  }
});

export default router;
