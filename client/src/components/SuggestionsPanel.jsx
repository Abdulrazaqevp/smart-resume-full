import React, { useState, useMemo } from "react";
import AnimatedButton from "./AnimatedButton";
import { motion, AnimatePresence } from "framer-motion";

export default function SuggestionsPanel({
  suggestions,
  matchResult,
  matchResume,
  applySuggestion,
}) {
  const [jobDescription, setJobDescription] = useState("");
  const [openATS, setOpenATS] = useState(true);
  const [openAI, setOpenAI] = useState(true);
  const [isApplyingAll, setIsApplyingAll] = useState(false);

  const score = matchResult?.score ?? null;
  const ringColor = useMemo(() => {
    if (score == null) return "#60A5FA"; 
    if (score >= 75) return "#10B981";
    if (score >= 45) return "#F59E0B";
    return "#EF4444";
  }, [score]);

  const R = 36;
  const C = 2 * Math.PI * R;

  const handleRunMatch = () => {
    if (!jobDescription.trim()) return alert("Paste job description first.");
    matchResume(jobDescription);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard");
    } catch {
      alert("Copy failed");
    }
  };

  const applyAllSuggestions = async () => {
    if (!suggestions) return;
    setIsApplyingAll(true);

    try {
      if (suggestions.summary) applySuggestion({ summary: suggestions.summary });
      if (suggestions.improvedBullets?.length)
        applySuggestion({ improvedBullets: suggestions.improvedBullets });

      setTimeout(() => alert("All suggestions applied!"), 300);
    } catch {
      alert("Failed to apply");
    }
    setIsApplyingAll(false);
  };

  return (
    <div className="relative">

      {/* Blue ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          animate={{ opacity: [0.4, 0.7, 0.4], y: [0, -12, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute w-64 h-64 bg-blue-400/20 blur-3xl rounded-full -top-16 -left-20"
        />
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3], y: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute w-48 h-48 bg-indigo-400/20 blur-3xl rounded-full top-10 right-0"
        />
      </div>

      {/* PANEL */}
      <div
        className="relative p-4 rounded-2xl border shadow-lg"
        style={{
          background: "rgba(30,41,59,0.5)",
          backdropFilter: "blur(12px)",
          borderColor: "rgba(148,163,184,0.2)",
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">AI & ATS Tools</h3>
            <p className="text-sm text-blue-100/80 mt-1">
              Paste a job description to analyze your resume, detect missing skills,
              and enhance your summary.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setOpenAI((s) => !s)}
              className="px-2 py-1 text-sm rounded-md bg-white/10 text-blue-100 hover:bg-white/20"
            >
              {openAI ? "Hide AI" : "Show AI"}
            </button>

            <button
              onClick={() => setOpenATS((s) => !s)}
              className="px-2 py-1 text-sm rounded-md bg-white/10 text-blue-100 hover:bg-white/20"
            >
              {openATS ? "Hide ATS" : "Show ATS"}
            </button>
          </div>
        </div>

        {/* TEXTAREA */}
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste job description here..."
          rows={5}
          className="w-full mt-4 p-3 rounded-lg bg-blue-900/30 border border-blue-300/20 text-white placeholder-blue-200/60"
        />

        <div className="mt-3 flex gap-3">
          <AnimatedButton color="indigo" className="flex-1" onClick={handleRunMatch}>
            Run ATS Match
          </AnimatedButton>

          <AnimatedButton color="blue" className="flex-none" onClick={() => setJobDescription("")}>
            Clear
          </AnimatedButton>
        </div>

        {/* ========================== ATS RESULTS ========================== */}
        <AnimatePresence>
          {openATS && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="mt-4"
            >
              <div className="p-4 rounded-xl bg-blue-900/20 border border-blue-300/20">

                {/* Score + Summary Row */}
                <div className="flex gap-4 items-center">

                  {/* Score Ring */}
                  <svg width="96" height="96" viewBox="0 0 96 96">
                    <g transform="translate(8,8)">
                      <circle cx="40" cy="40" r={R} fill="rgba(255,255,255,0.08)" />
                      <motion.circle
                        cx="40"
                        cy="40"
                        r={R}
                        stroke={ringColor}
                        strokeWidth="6"
                        fill="transparent"
                        strokeDasharray={C}
                        strokeDashoffset={
                          C - (score ? (C * Math.min(score, 100)) / 100 : 0)
                        }
                        initial={{ strokeDashoffset: C }}
                        animate={{
                          strokeDashoffset:
                            C - (score ? (C * Math.min(score, 100)) / 100 : 0),
                        }}
                        transition={{ duration: 1 }}
                      />
                      <text
                        x="40"
                        y="46"
                        textAnchor="middle"
                        fill={ringColor}
                        fontSize="18"
                        fontWeight="700"
                      >
                        {score != null ? `${score}%` : "—"}
                      </text>
                    </g>
                  </svg>

                  {/* Summary */}
                  <div className="flex-1">
                    <h4 className="text-white font-semibold">
                      {score == null
                        ? "No score yet"
                        : score >= 75
                        ? "Strong Match"
                        : score >= 45
                        ? "Partial Match"
                        : "Weak Match"}
                    </h4>

                    <p className="text-blue-100 mt-1">
                      {matchResult?.summary ||
                        "Run ATS match to analyze resume vs job description."}
                    </p>

                    <div className="mt-3 flex gap-3 text-xs text-blue-200">
                      <span className="bg-white/10 px-2 py-1 rounded-md">
                        Matched: {matchResult?.matchedSkills?.length ?? 0}
                      </span>
                      <span className="bg-white/10 px-2 py-1 rounded-md">
                        Missing: {matchResult?.missingSkills?.length ?? 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Skill Lists */}
                <div className="mt-4">

                  <h5 className="text-white font-semibold mb-2">Matched Skills</h5>
                  <div className="flex flex-wrap gap-2">
                    {matchResult?.matchedSkills?.length ? (
                      matchResult.matchedSkills.map((s, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-200 border border-green-500/30"
                        >
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-blue-200 text-sm">None matched</span>
                    )}
                  </div>

                  <h5 className="text-white font-semibold mt-4 mb-2">
                    Missing Skills
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {matchResult?.missingSkills?.length ? (
                      matchResult.missingSkills.map((s, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-200 border border-red-500/30"
                        >
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-blue-200 text-sm">
                        No missing skills
                      </span>
                    )}
                  </div>

                  <h5 className="text-white font-semibold mt-4 mb-2">
                    Recommendations
                  </h5>
                  <ul className="list-disc ml-5 text-blue-100 marker:text-blue-300">
                    {matchResult?.recommendations?.length ? (
                      matchResult.recommendations.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))
                    ) : (
                      <li>No recommendations</li>
                    )}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================== AI SUGGESTIONS ========================== */}
        <AnimatePresence>
          {openAI && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="mt-4"
            >
              <div className="p-4 rounded-xl bg-blue-900/20 border border-blue-300/20">

                <div className="flex justify-between items-center">
                  <h4 className="text-white font-semibold">AI Suggestions</h4>

                  <div className="flex gap-2">
                    <AnimatedButton
                      color="emerald"
                      onClick={applyAllSuggestions}
                      className="text-xs"
                    >
                      {isApplyingAll ? "Applying..." : "Apply All"}
                    </AnimatedButton>

                    <AnimatedButton
                      color="blue"
                      onClick={() =>
                        suggestions?.summary &&
                        copyToClipboard(suggestions.summary)
                      }
                      className="text-xs"
                    >
                      Copy Summary
                    </AnimatedButton>
                  </div>
                </div>

                <div className="mt-3 space-y-4">

                  {/* Summary */}
                  {suggestions?.summary && (
                    <div className="p-3 rounded-lg bg-blue-800/20 border border-blue-500/20">
                      <h5 className="text-white font-semibold">Improved Summary</h5>
                      <p className="text-blue-100 mt-2">{suggestions.summary}</p>

                      <div className="mt-3 flex gap-2">
                        <AnimatedButton
                          color="emerald"
                          onClick={() => applySuggestion({ summary: suggestions.summary })}
                          className="text-xs"
                        >
                          Apply Summary
                        </AnimatedButton>

                        <AnimatedButton
                          color="blue"
                          onClick={() => copyToClipboard(suggestions.summary)}
                          className="text-xs"
                        >
                          Copy
                        </AnimatedButton>
                      </div>
                    </div>
                  )}

                  {/* Tips */}
                  {suggestions?.tips?.length > 0 && (
                    <div className="p-3 rounded-lg bg-blue-800/20 border border-blue-500/20">
                      <h5 className="text-white font-semibold">Tips</h5>
                      <ul className="list-disc ml-5 text-blue-100 mt-2">
                        {suggestions.tips.map((t, i) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Bullets */}
                  {suggestions?.improvedBullets?.length > 0 && (
                    <div className="p-3 rounded-lg bg-blue-800/20 border border-blue-500/20">
                      <h5 className="text-white font-semibold">
                        Improved Bullet Points
                      </h5>

                      <div className="mt-2 space-y-2">
                        {suggestions.improvedBullets.map((b, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-2 rounded bg-blue-900/30"
                          >
                            <p className="text-blue-200 text-xs">
                              <strong>Old:</strong> {b.old}
                            </p>
                            <p className="text-blue-50 text-sm mt-1">
                              <strong>Improved:</strong> {b.improved}
                            </p>

                            <div className="mt-2 flex gap-2">
                              <AnimatedButton
                                color="emerald"
                                onClick={() => applySuggestion({ improvedBullets: [b] })}
                                className="text-xs"
                              >
                                Apply
                              </AnimatedButton>

                              <AnimatedButton
                                color="blue"
                                onClick={() => copyToClipboard(b.improved)}
                                className="text-xs"
                              >
                                Copy
                              </AnimatedButton>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
