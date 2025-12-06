import express from "express";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const { resume, jobDescription } = req.body;

    const prompt = `
You are an ATS scoring engine.  
Compare the resume with the job description and return ONLY valid JSON.
Never add explanations or text outside the JSON.

### YOU MUST FOLLOW THIS STRICT FORMAT ###
{
  "score": number,
  "matchedSkills": [],
  "missingSkills": [],
  "summary": "",
  "recommendations": []
}

### SCORING RULE ###
- Extract skills from resume and job description.
- Identify matchedSkills and missingSkills.
- Calculate score using this exact formula:
  score = Math.round( (matchedSkills.length / (matchedSkills.length + missingSkills.length)) * 100 )

### RULES ###
- Score must be between 0–100.
- JSON must be valid and strictly follow the structure.
- No extra commentary.
- Respond inside triple backticks like this:

\`\`\`json
{ ... }
\`\`\`

### RESUME ###
${JSON.stringify(resume, null, 2)}

### JOB DESCRIPTION ###
${jobDescription}
`;

    // call Groq for ATS scoring
    const ai = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.0,
    });

    let content = ai.choices[0].message.content;

    // extract JSON inside ```json ... ```
    const jsonMatch = content.match(/```json([\s\S]*?)```/);

    if (!jsonMatch) {
      throw new Error("AI returned invalid JSON:\n" + content);
    }

    const jsonString = jsonMatch[1].trim();
    const result = JSON.parse(jsonString);

    res.json({ result });

  } catch (err) {
    console.error("🔥 ATS Error:", err);
    res.status(500).json({ error: "ATS Match failed", details: err.message });
  }
});

export default router;
