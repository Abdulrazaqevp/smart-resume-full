import React from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";

export default function ResumeForm({
  resume,
  setResume,
  getSuggestions,
  saveToServer,
}) {
  const update = (path, value) => {
    const parts = path.split(".");
    setResume((prev) => {
      const copy = structuredClone(prev);
      let ref = copy;

      for (let i = 0; i < parts.length - 1; i++) ref = ref[parts[i]];
      ref[parts[parts.length - 1]] = value;

      return copy;
    });
  };

  // REMOVE HANDLERS
  const removeSkill = (i) => {
    const copy = [...resume.skills];
    copy.splice(i, 1);
    setResume({ ...resume, skills: copy });
  };

  const removeExperience = (i) => {
    const copy = [...resume.experience];
    copy.splice(i, 1);
    setResume({ ...resume, experience: copy });
  };

  const removeEducation = (i) => {
    const copy = [...resume.education];
    copy.splice(i, 1);
    setResume({ ...resume, education: copy });
  };

  const removeBullet = (expIndex, bulletIndex) => {
    const copy = structuredClone(resume.experience);
    copy[expIndex].bullets.splice(bulletIndex, 1);
    setResume({ ...resume, experience: copy });
  };

  // ADD HANDLERS
  const addSkill = () =>
    setResume((prev) => ({ ...prev, skills: [...prev.skills, ""] }));

  const addExperience = () =>
    setResume((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { company: "", title: "", startDate: "", endDate: "", bullets: [""] },
      ],
    }));

  const addEducation = () =>
    setResume((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { school: "", degree: "", startYear: "", endYear: "" },
      ],
    }));

  // UNIVERSAL DARK-THEME INPUT STYLE
  const inputClass =
    "w-full px-3 py-2 rounded-lg shadow-sm bg-white/10 border border-white/20 " +
    "text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400";

  return (
    <div className="space-y-6 text-sm text-white">

      {/* BASIC INFO */}
      <div className="space-y-3">
        <input
          className={inputClass}
          placeholder="Full Name"
          value={resume.name}
          onChange={(e) => update("name", e.target.value)}
        />

        <input
          className={inputClass}
          placeholder="Email"
          value={resume.contact.email}
          onChange={(e) => update("contact.email", e.target.value)}
        />

        <input
          className={inputClass}
          placeholder="Phone"
          value={resume.contact.phone}
          onChange={(e) => update("contact.phone", e.target.value)}
        />

        <textarea
          className={inputClass}
          rows={3}
          placeholder="Summary"
          value={resume.summary}
          onChange={(e) => update("summary", e.target.value)}
        />
      </div>

      {/* SKILLS */}
      <div>
        <h3 className="font-semibold text-blue-300 mb-2 text-base">Skills</h3>

        <Droppable droppableId="skills" type="skills">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {resume.skills.map((skill, i) => (
                <Draggable key={i} draggableId={`skill-${i}`} index={i}>
                  {(drag) => (
                    <div
                      ref={drag.innerRef}
                      {...drag.draggableProps}
                      {...drag.dragHandleProps}
                      className="flex items-center gap-2 mb-2 bg-white/10 p-2 rounded-lg border border-white/10"
                    >
                      <input
                        className={inputClass}
                        value={skill}
                        placeholder="Skill"
                        onChange={(e) => {
                          const copy = [...resume.skills];
                          copy[i] = e.target.value;
                          setResume({ ...resume, skills: copy });
                        }}
                      />

                      <button
                        className="px-2 py-1 bg-red-500/80 text-white rounded-lg hover:bg-red-600"
                        onClick={() => removeSkill(i)}
                      >
                        ❌
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <button
          className="w-full mt-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition shadow"
          onClick={addSkill}
        >
          + Add Skill
        </button>
      </div>

      {/* EXPERIENCE */}
      <div>
        <h3 className="font-semibold text-blue-300 mb-2 text-base">Experience</h3>

        <Droppable droppableId="experience" type="experience">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {resume.experience.map((exp, i) => (
                <Draggable key={i} draggableId={`exp-${i}`} index={i}>
                  {(drag) => (
                    <div
                      ref={drag.innerRef}
                      {...drag.draggableProps}
                      {...drag.dragHandleProps}
                      className="relative bg-white/10 border border-white/10 p-4 rounded-xl mb-3"
                    >
                      <button
                        className="absolute top-2 right-2 px-2 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        onClick={() => removeExperience(i)}
                      >
                        ❌
                      </button>

                      <input
                        className={inputClass}
                        placeholder="Company"
                        value={exp.company}
                        onChange={(e) => {
                          const copy = structuredClone(resume.experience);
                          copy[i].company = e.target.value;
                          setResume({ ...resume, experience: copy });
                        }}
                      />

                      <input
                        className={inputClass + " mt-2"}
                        placeholder="Job Title"
                        value={exp.title}
                        onChange={(e) => {
                          const copy = structuredClone(resume.experience);
                          copy[i].title = e.target.value;
                          setResume({ ...resume, experience: copy });
                        }}
                      />

                      {(exp.bullets || []).map((b, bi) => (
                        <div key={bi} className="flex items-center gap-2 mt-2">
                          <input
                            className={inputClass}
                            placeholder="Bullet point"
                            value={b}
                            onChange={(e) => {
                              const copy = structuredClone(resume.experience);
                              copy[i].bullets[bi] = e.target.value;
                              setResume({ ...resume, experience: copy });
                            }}
                          />

                          <button
                            className="px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            onClick={() => removeBullet(i, bi)}
                          >
                            ❌
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <button
          className="w-full mt-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition shadow"
          onClick={addExperience}
        >
          + Add Experience
        </button>
      </div>

      {/* EDUCATION */}
      <div>
        <h3 className="font-semibold text-blue-300 mb-2 text-base">Education</h3>

        <Droppable droppableId="education" type="education">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {resume.education.map((ed, i) => (
                <Draggable key={i} draggableId={`edu-${i}`} index={i}>
                  {(drag) => (
                    <div
                      ref={drag.innerRef}
                      {...drag.draggableProps}
                      {...drag.dragHandleProps}
                      className="relative bg-white/10 border border-white/10 p-4 rounded-xl mb-3"
                    >
                      <button
                        className="absolute top-2 right-2 px-2 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        onClick={() => removeEducation(i)}
                      >
                        ❌
                      </button>

                      <input
                        className={inputClass}
                        placeholder="School"
                        value={ed.school}
                        onChange={(e) => {
                          const copy = structuredClone(resume.education);
                          copy[i].school = e.target.value;
                          setResume({ ...resume, education: copy });
                        }}
                      />

                      <input
                        className={inputClass + " mt-2"}
                        placeholder="Degree"
                        value={ed.degree}
                        onChange={(e) => {
                          const copy = structuredClone(resume.education);
                          copy[i].degree = e.target.value;
                          setResume({ ...resume, education: copy });
                        }}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <button
          className="w-full mt-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition shadow"
          onClick={addEducation}
        >
          + Add Education
        </button>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-3 pt-3">
        <button
          className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 shadow text-white"
          onClick={getSuggestions}
        >
          Get AI Suggestions
        </button>

        <button
          className="flex-1 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 shadow text-white"
          onClick={saveToServer}
        >
          Save Resume
        </button>
      </div>
    </div>
  );
}
