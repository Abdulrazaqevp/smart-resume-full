import React, { useState } from "react";
import ResumeForm from "./components/ResumeForm";
import Preview from "./components/Preview";
import SuggestionsPanel from "./components/SuggestionsPanel";
import axios from "axios";
import { DragDropContext } from "@hello-pangea/dnd";
import { FaGithub, FaLinkedin, FaInstagram, FaBug } from "react-icons/fa";
import { motion } from "framer-motion";

export default function App() {
  // Works on both local and deployed
  const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

  const [resume, setResume] = useState({
    name: "",
    contact: { email: "", phone: "", location: "", linkedin: "" },
    summary: "",
    skills: [],
    experience: [],
    education: []
  });

  const [suggestions, setSuggestions] = useState(null);
  const [matchResult, setMatchResult] = useState(null);

  const [template, setTemplate] = useState("modern");

  // ============================================================
  // DRAG–DROP SORTING
  // ============================================================
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination, type } = result;

    const updated = [...resume[type]];
    const [moved] = updated.splice(source.index, 1);
    updated.splice(destination.index, 0, moved);

    setResume((prev) => ({ ...prev, [type]: updated }));
  };

  // ============================================================
  // SAVE RESUME
  // ============================================================
  const saveToServer = async () => {
    try {
      await axios.post(`${API}/api/resumes`, resume);
      alert("Saved!");
    } catch (error) {
      console.error(error);
      alert("Save failed");
    }
  };

  // ============================================================
  // AI SUGGESTIONS
  // ============================================================
  const getSuggestions = async () => {
    try {
      const response = await axios.post(`${API}/api/suggest`, { resume });
      setSuggestions(response.data.result);
    } catch (error) {
      console.error(error);
      alert("AI Suggestion failed");
    }
  };

  // ============================================================
  // ATS MATCH
  // ============================================================
  const matchResume = async (jobDescription) => {
    try {
      const response = await axios.post(`${API}/api/match`, {
        resume,
        jobDescription
      });
      setMatchResult(response.data.result);
    } catch (err) {
      console.error("ATS Match Error:", err);
      alert("ATS Match failed");
    }
  };

  // ============================================================
  // FOOTER COMPONENT
  // ============================================================
  const Footer = () => (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="
        mt-14 py-8 text-center rounded-xl
        bg-white/5 backdrop-blur-xl 
        border border-white/10 shadow-inner
      "
    >
      <h3 className="text-blue-100 font-semibold text-lg tracking-wide">
        Smart Resume Builder — Beta Release
      </h3>

      <p className="text-blue-200/80 text-sm mt-1">
        © {new Date().getFullYear()} Abdul Razaqe vallippadan.All rights reserved.
      </p>

      <p className="text-blue-300/70 text-xs mt-2 max-w-lg mx-auto leading-relaxed">
        The platform is under active development.  
        AI features, ATS scoring, and export tools may behave inconsistently.
      </p>

      {/* SOCIAL ICONS */}
      <div className="flex justify-center gap-6 mt-4 text-blue-100 text-2xl">
        <a href="https://linkedin.com" target="_blank" className="hover:text-blue-400 transition">
          <FaLinkedin />
        </a>
        <a href="https://github.com" target="_blank" className="hover:text-blue-400 transition">
          <FaGithub />
        </a>
        <a href="https://instagram.com" target="_blank" className="hover:text-pink-400 transition">
          <FaInstagram />
        </a>
        <a
          href="https://github.com/Abdulrazaqevp/smart-resume-full/issues"
          target="_blank"
          className="hover:text-red-400 transition"
          title="Report an Issue"
        >
          <FaBug />
        </a>
      </div>
    </motion.footer>
  );

  // ============================================================
  // UI LAYOUT
  // ============================================================
  return (
    <div
      className="min-h-screen p-6 
      bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#0f172a] 
      text-white transition-all duration-700"
    >
      <h1 className="text-3xl font-bold mb-6 text-blue-100 text-center tracking-tight drop-shadow">
        Smart Resume Builder
      </h1>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-12 gap-6">

          {/* ============ LEFT PANEL ============ */}
          <div className="col-span-12 md:col-span-3 backdrop-blur-xl bg-white/5 border border-white/10 
                          text-white shadow-2xl rounded-2xl p-5 h-[85vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4 text-blue-300">Resume Editor</h2>

            <ResumeForm
              resume={resume}
              setResume={setResume}
              getSuggestions={getSuggestions}
              saveToServer={saveToServer}
            />
          </div>

          {/* ============ PREVIEW PANEL ============ */}
          <div className="col-span-12 md:col-span-6 rounded-2xl p-5 backdrop-blur-xl bg-white/5 
                          border border-white/10 shadow-2xl h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-blue-300">Preview</h2>

              <select
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                className="px-3 py-2 text-sm rounded-lg
                           bg-[#1e293b] text-white border border-white/20 shadow
                           focus:ring-2 focus:ring-blue-400 transition"
              >
                <option value="modern">Modern</option>
                <option value="minimal">Minimal ATS</option>
                <option value="corporate">Corporate</option>
                <option value="creative">Creative</option>
              </select>
            </div>

            <Preview resume={resume} template={template} />
          </div>

          {/* ============ RIGHT PANEL (AI + ATS) ============ */}
          <div className="col-span-12 md:col-span-3 backdrop-blur-xl bg-white/5 border border-white/10 
                          text-white shadow-2xl rounded-2xl p-5 h-[85vh] overflow-y-auto">
            <SuggestionsPanel
              suggestions={suggestions}
              matchResult={matchResult}
              matchResume={matchResume}
              applySuggestion={(patch) => {
                if (patch.summary) {
                  setResume((r) => ({ ...r, summary: patch.summary }));
                }
                if (patch.improvedBullets) {
                  alert("Bullet patch applied (mapping needed).");
                }
              }}
            />
          </div>

        </div>
      </DragDropContext>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
