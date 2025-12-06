import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

export default function Preview({ resume, template }) {
  const printRef = useRef();

  // PDF EXPORT
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  // DOCX EXPORT
  const exportToDocx = () => {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: resume.name, size: 32, bold: true }),
              ],
              spacing: { after: 200 },
            }),
            new Paragraph(`${resume.contact.email} | ${resume.contact.phone}`),
            new Paragraph(`${resume.summary || ""}`),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `${resume.name || "resume"}.docx`);
    });
  };

  // ==========================
  // TEMPLATES
  // ==========================

  /** 🌙 MODERN TEMPLATE */
  const renderModern = () => (
    <div className="text-white space-y-6">
      <header className="border-b border-white/10 pb-3 mb-4">
        <h1 className="text-3xl font-bold tracking-tight">{resume.name}</h1>
        <p className="text-sm text-blue-200 mt-1">
          {resume.contact.email} • {resume.contact.phone} •{" "}
          {resume.contact.location}
        </p>
      </header>

      {resume.summary && (
        <section>
          <h2 className="text-blue-300 font-semibold mb-1">Summary</h2>
          <p className="text-blue-100 leading-relaxed">{resume.summary}</p>
        </section>
      )}

      {resume.skills.length > 0 && (
        <section>
          <h2 className="text-blue-300 font-semibold mb-1">Skills</h2>
          <ul className="grid grid-cols-2 list-disc ml-5 text-blue-100">
            {resume.skills.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </section>
      )}

      {resume.experience.map((exp, i) => (
        <section key={i}>
          <h3 className="font-bold text-blue-300">
            {exp.title} —{" "}
            <span className="text-blue-100 font-normal">{exp.company}</span>
          </h3>
          <p className="text-xs text-blue-400 italic mb-2">
            {exp.startDate} – {exp.endDate}
          </p>

          <ul className="list-disc ml-5 text-blue-100">
            {exp.bullets.map((b, bi) => (
              <li key={bi}>{b}</li>
            ))}
          </ul>
        </section>
      ))}

      {resume.education.length > 0 && (
        <section>
          <h2 className="text-blue-300 font-semibold mb-1">Education</h2>
          {resume.education.map((ed, i) => (
            <div key={i} className="mb-3">
              <p className="font-semibold text-blue-200">{ed.degree}</p>
              <p className="text-blue-100">{ed.school}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );

  /** 🌙 MINIMAL ATS TEMPLATE */
  const renderMinimalATS = () => (
    <div className="text-white space-y-4 font-mono">
      <h1 className="text-2xl font-bold">{resume.name}</h1>
      <p className="text-blue-200 text-sm">
        {resume.contact.email} | {resume.contact.phone}
      </p>

      <h2 className="text-blue-300 font-semibold">SUMMARY</h2>
      <p className="text-blue-100">{resume.summary}</p>

      <h2 className="text-blue-300 font-semibold">SKILLS</h2>
      <p className="text-blue-100">{resume.skills.join(", ")}</p>

      <h2 className="text-blue-300 font-semibold">EXPERIENCE</h2>
      {resume.experience.map((exp, i) => (
        <div key={i}>
          <p className="font-semibold">{exp.title}</p>
          <p className="text-blue-400 text-sm italic">{exp.company}</p>
          <ul className="list-disc ml-5 text-blue-100">
            {exp.bullets.map((b, bi) => (
              <li key={bi}>{b}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  /** 🌙 CORPORATE TEMPLATE */
  const renderCorporate = () => (
    <div className="text-white space-y-6 border-l-4 pl-4 border-blue-500">
      <h1 className="text-3xl font-bold text-blue-300">{resume.name}</h1>
      <p className="text-blue-200">
        {resume.contact.email} | {resume.contact.phone}
      </p>

      <h2 className="text-lg font-semibold text-blue-300">Summary</h2>
      <p className="text-blue-100">{resume.summary}</p>

      <h2 className="text-lg font-semibold text-blue-300">Skills</h2>
      <ul className="list-disc ml-5 text-blue-100">
        {resume.skills.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>

      <h2 className="text-lg font-semibold text-blue-300">Experience</h2>
      {resume.experience.map((exp, i) => (
        <div key={i}>
          <p className="font-semibold">{exp.title}</p>
          <p className="text-blue-100">{exp.company}</p>
          <ul className="list-disc ml-5 text-blue-100">
            {exp.bullets.map((b, bi) => (
              <li key={bi}>{b}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  /** 🌙 CREATIVE TEMPLATE */
  const renderCreative = () => (
    <div className="text-white grid grid-cols-3 gap-6">
      <div className="bg-blue-900/40 p-4 rounded-xl border border-white/10">
        <h1 className="text-2xl font-bold text-blue-300">{resume.name}</h1>
        <p className="text-blue-200">{resume.contact.email}</p>
        <p className="text-blue-200">{resume.contact.phone}</p>

        <h2 className="mt-4 text-lg font-semibold text-blue-300">Skills</h2>
        <ul className="list-disc ml-5 text-blue-100">
          {resume.skills.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>

      <div className="col-span-2 space-y-5">
        <section>
          <h2 className="text-xl font-semibold text-blue-300">Summary</h2>
          <p className="text-blue-100">{resume.summary}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-blue-300">Experience</h2>
          {resume.experience.map((exp, i) => (
            <div key={i} className="mb-4">
              <p className="font-bold text-blue-200">{exp.title}</p>
              <p className="text-blue-400">{exp.company}</p>
              <ul className="list-disc ml-6 text-blue-100">
                {exp.bullets.map((b, bi) => (
                  <li key={bi}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </div>
    </div>
  );

  const templateMap = {
    modern: renderModern,
    minimal: renderMinimalATS,
    corporate: renderCorporate,
    creative: renderCreative,
  };

  return (
    <div className="text-white">
      <div
        ref={printRef}
        className="bg-[#0f172a]/70 border border-white/10 rounded-2xl p-10 shadow-2xl shadow-blue-900/40"
      >
        {templateMap[template]()}
      </div>

      {/* BUTTONS */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={handlePrint}
          className="px-5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 transition shadow text-white"
        >
          Export to PDF
        </button>

        <button
          onClick={exportToDocx}
          className="px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition shadow text-white"
        >
          Export to DOCX
        </button>
      </div>
    </div>
  );
}
