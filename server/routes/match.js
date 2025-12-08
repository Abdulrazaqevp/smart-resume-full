
import express from "express";
import Groq from "groq-sdk";

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


router.post("/", async (req, res) => {
  try {
    const { resume, jobDescription } = req.body;

    const prompt = `
Compare this resume with the job description.
Return ONLY this JSON:

{
  "score": 0,
  "matchedSkills": [],
  "missingSkills": [],
  "summary": "",
  "recommendations": []
}

RESUME:
${JSON.stringify(resume, null, 2)}

JOB DESCRIPTION:
${jobDescription}
`;

    const aiRes = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
    });

    let text = aiRes.choices[0].message.content.trim();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("JSON not detected");

    const result = JSON.parse(jsonMatch[0]);

    res.json({ result });

  } catch (err) {
    console.error("🔥 ATS Error:", err);
    res.status(500).json({ error: "ATS failed", details: err.message });
  }
});

export default router;
console.log("DEBUG MATCH ROUTE KEY:", process.env.GROQ_API_KEY);
