import React, { useState } from "react";
import ResumeForm from "./components/ResumeForm";
import Preview from "./components/Preview";
import SuggestionsPanel from "./components/SuggestionsPanel";
import axios from "axios";
import { DragDropContext } from "@hello-pangea/dnd";

export default function App() {
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

  // ✔ TEMPLATE STATE
  const [template, setTemplate] = useState("modern");

  // ================================
  //  DRAG DROP SORTING
  // ================================
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination, type } = result;

    let arrayMap = {
      skills: [...resume.skills],
      experience: [...resume.experience],
      education: [...resume.education],
    };

    if (arrayMap[type]) {
      const items = arrayMap[type];
      const [moved] = items.splice(source.index, 1);
      items.splice(destination.index, 0, moved);

      setResume((prev) => ({ ...prev, [type]: items }));
    }
  };

  // ================================
  // SAVE RESUME
  // ================================
  const saveToServer = async () => {
    try {
      await axios.post("http://localhost:4000/api/resumes", resume);
      alert("Saved!");
    } catch (error) {
      console.error(error);
      alert("Save failed");
    }
  };

  // ================================
  // AI SUGGESTIONS
  // ================================
  const getSuggestions = async () => {
    try {
      const response = await axios.post("http://localhost:4000/api/suggest", { resume });
      setSuggestions(response.data.result);
    } catch (error) {
      console.error(error);
      alert("AI Suggestion failed");
    }
  };

  // ================================
  // ATS MATCH
  // ================================
  const matchResume = async (jobDescription) => {
    try {
      const response = await axios.post("http://localhost:4000/api/match", {
        resume,
        jobDescription,
      });

      setMatchResult(response.data.result);
    } catch (err) {
      console.error("ATS Match Error:", err);
      alert("ATS Match failed");
    }
  };

  // ================================
  // DARK UI LAYOUT
  // ================================
  return (
    <div className="min-h-screen p-6 
        bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#0f172a] 
        text-white transition-all duration-700"
    >

      {/* 🔥 FIXED: Heading was INVISIBLE — now bright */}
      <h1 className="text-3xl font-bold mb-6 text-blue-100 text-center tracking-tight drop-shadow">
        Smart Resume Builder ✨
      </h1>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-12 gap-6">

          {/* LEFT PANEL — Resume Editor */}
          <div
            className="col-span-3 backdrop-blur-xl 
                       bg-white/5 border border-white/10 
                       text-white shadow-2xl rounded-2xl p-5 
                       h-[85vh] overflow-y-auto"
          >
            <h2 className="text-xl font-semibold mb-4 text-blue-300">
              Resume Editor
            </h2>

            <ResumeForm
              resume={resume}
              setResume={setResume}
              getSuggestions={getSuggestions}
              saveToServer={saveToServer}
            />
          </div>

          {/* MIDDLE PREVIEW */}
          <div
            className="col-span-6 rounded-2xl p-5 
                       backdrop-blur-xl bg-white/5 
                       border border-white/10 shadow-2xl 
                       h-[85vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-blue-300">
                Preview
              </h2>

              {/* 🔥 FIXED TEMPLATE DROPDOWN — now visible */}
              <select
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                className="
                  px-3 py-2 text-sm rounded-lg
                  bg-[#1e293b] text-white border border-white/20 shadow
                  focus:ring-2 focus:ring-blue-400 transition
                "
              >
                <option value="modern" className="bg-[#0f172a] text-white">Modern</option>
                <option value="minimal" className="bg-[#0f172a] text-white">Minimal ATS</option>
                <option value="corporate" className="bg-[#0f172a] text-white">Corporate</option>
                <option value="creative" className="bg-[#0f172a] text-white">Creative</option>
              </select>
            </div>

            <Preview resume={resume} template={template} />
          </div>

          {/* RIGHT PANEL — AI + ATS */}
          <div
            className="col-span-3 backdrop-blur-xl bg-white/5 
                       border border-white/10 text-white 
                       shadow-2xl rounded-2xl p-5 
                       h-[85vh] overflow-y-auto"
          >
            <SuggestionsPanel
              suggestions={suggestions}
              matchResult={matchResult}
              matchResume={matchResume}
              applySuggestion={(patch) => {
                if (patch.summary) {
                  setResume((r) => ({ ...r, summary: patch.summary }));
                }
                if (patch.improvedBullets) {
                  alert("Bullet patch applied. (Mapping not implemented)");
                }
              }}
            />
          </div>

        </div>
      </DragDropContext>
    </div>
  );
}
