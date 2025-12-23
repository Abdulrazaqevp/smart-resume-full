import express from "express";
import Groq from "groq-sdk";

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post("/", async (req, res) => {
  try {
    const { resume, jobDescription } = req.body;

    const prompt = `
Extract skills comparison ONLY.

Return STRICT JSON:
{
  "matchedSkills": [],
  "missingSkills": [],
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
      temperature: 0,
    });

    const text = aiRes.choices[0].message.content;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("JSON not detected");

    const parsed = JSON.parse(jsonMatch[0]);

    const matched = parsed.matchedSkills?.length || 0;
    const missing = parsed.missingSkills?.length || 0;
    const total = matched + missing || 1;

    // ✅ REALISTIC ATS SCORING
    let score = Math.round((matched / total) * 100);

    // Minimum credibility floor
    if (score < 35) score = 35;

    // Cap to avoid fake 100%
    if (score > 95) score = 95;

    res.json({
      result: {
        score,
        matchedSkills: parsed.matchedSkills,
        missingSkills: parsed.missingSkills,
        summary:
          score >= 75
            ? "Strong alignment with job requirements."
            : score >= 50
            ? "Partial alignment with job requirements."
            : "Limited alignment with job requirements.",
        recommendations: parsed.recommendations || [],
      },
    });

  } catch (err) {
    console.error("🔥 ATS Error:", err);
    res.status(500).json({ error: "ATS failed", details: err.message });
  }
});

export default router;
