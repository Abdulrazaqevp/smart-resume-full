import express from "express";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    if (!process.env.GROQ_API_KEY) {
      console.log("🚨 Missing GROQ_API_KEY");
      return res.status(500).json({ error: "Server missing API key" });
    }

    const { resume } = req.body;

    const prompt = `
      Improve this resume summary, give tips, and rewrite bullet points:

      Resume:
      ${JSON.stringify(resume, null, 2)}
    `;

    const result = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    return res.json({ result: JSON.parse(result.choices[0].message.content) });

  } catch (err) {
    console.error("🔥 GROQ ERROR:", err);
    return res.status(500).json({ error: "AI Suggestion failed" });
  }
});

export default router;
