import React, { useState } from "react";

/* ==========================
   SPINE LEVEL DEFINITIONS
   ========================== */
const CERVICAL_LEVELS = ["C2C3", "C3C4", "C4C5", "C5C6", "C6C7", "C7T1"];

const THORACIC_LEVELS = [
  "T1T2",
  "T2T3",
  "T3T4",
  "T4T5",
  "T5T6",
  "T6T7",
  "T7T8",
  "T8T9",
  "T9T10",
  "T10T11",
  "T11T12",
  "T12L1",
];

const LUMBAR_LEVELS = ["L1L2", "L2L3", "L3L4", "L4L5", "L5S1"];

const ALL_LEVELS = [
  ...CERVICAL_LEVELS,
  ...THORACIC_LEVELS,
  ...LUMBAR_LEVELS,
];

/* ==========================
   REPORT OPTIONS
   ========================== */
const REGIONS = [
  { id: "cervical", label: "Cervical" },
  { id: "thoracic", label: "Thoracic" },
  { id: "lumbar", label: "Lumbar" },
  { id: "whole", label: "Whole spine" },
];

const PFIRRMANN = [
  "I – Homogeneous bright, normal height",
  "II – Inhomogeneous, normal height",
  "III – Inhomogeneous, intermediate, normal/slightly decreased height",
  "IV – Inhomogeneous, dark, moderately decreased height",
  "V – Collapsed disc space",
];

const STENOSIS = ["None", "Mild", "Moderate", "Severe"];

const MODIC = ["None", "Type I", "Type II", "Type III", "Mixed"];

const ALIGNMENT = [
  "Physiological",
  "Straightening of lordosis",
  "Reversal of lordosis",
  "Focal kyphosis",
  "Scoliosis",
  "Spondylolisthesis",
];

/* ==========================
   UTILITY HELPERS
   ========================== */
function defaultLevel() {
  return {
    pfirrmann: "II – Inhomogeneous, normal height",
    herniation: "None",
    canal: "None",
    foraminal: "None",
    modic: "None",
    comments: "",
  };
}

function initLevels() {
  const obj = {};
  ALL_LEVELS.forEach((lvl) => (obj[lvl] = defaultLevel()));

  // mild example pre-filled at L4-L5, L5-S1
  obj["L4L5"] = {
    pfirrmann: "III – Inhomogeneous, intermediate, normal/slightly decreased height",
    herniation: "Broad-based disc bulge",
    canal: "Mild",
    foraminal: "Mild",
    modic: "Type II",
    comments: "",
  };

  obj["L5S1"] = {
    pfirrmann: "III – Inhomogeneous, intermediate, normal/slightly decreased height",
    herniation: "Central / paracentral disc protrusion",
    canal: "Mild",
    foraminal: "Moderate",
    modic: "None",
    comments: "",
  };

  return obj;
}

function regionLevels(region) {
  if (region === "cervical") return CERVICAL_LEVELS;
  if (region === "thoracic") return THORACIC_LEVELS;
  if (region === "lumbar") return LUMBAR_LEVELS;
  return ALL_LEVELS; // whole spine mode
}

/* ==========================
   SMALL UI COMPONENTS
   ========================== */
function SectionCard({ title, children }) {
  return (
    <section className="bg-slate-900/70 border border-slate-700 rounded-2xl p-4 mb-4">
      <h2 className="text-sm font-semibold tracking-wide text-slate-300 uppercase mb-3">{title}</h2>
      <div className="space-y-3 text-sm text-slate-100">{children}</div>
    </section>
  );
}

function Label({ children }) {
  return <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">{children}</label>;
}

function Input(props) {
  return (
    <input
      {...props}
      className={
        "w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:ring-2 focus:ring-emerald-500 " +
        (props.className || "")
      }
    />
  );
}

function Select({ options, ...props }) {
  return (
    <select
      {...props}
      className={
        "w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:ring-2 focus:ring-emerald-500 " +
        (props.className || "")
      }
    >
      {options.map((opt) => (
        <option key={opt} className="bg-slate-900">{opt}</option>
      ))}
    </select>
  );
}

function TextArea(props) {
  return (
    <textarea
      {...props}
      className={
        "w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 resize-y min-h-[72px] focus:ring-2 focus:ring-emerald-500 " +
        (props.className || "")
      }
    />
  );
}

function Tag({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={
        "px-3 py-1 rounded-full text-xs border " +
        (active
          ? "bg-emerald-500 text-slate-950 border-emerald-300"
          : "bg-slate-900/70 border-slate-600 text-slate-200 hover:text-emerald-100 hover:border-emerald-400")
      }
    >
      {children}
    </button>
  );
}

/* ==========================
   MAIN COMPONENT
   ========================== */
export default function App() {
  const [region, setRegion] = useState("lumbar");
  const [levels, setLevels] = useState(() => initLevels());

  const [alignment, setAlignment] = useState("Physiological");

  const [fullReport, setFullReport] = useState("");

  /* ==========================
     NORMAL STUDY AUTOPOPULATE
     ========================== */
  const handleNormalStudy = () => {
    const blank = {};
    ALL_LEVELS.forEach((lvl) => (blank[lvl] = defaultLevel()));
    setLevels(blank);
    setAlignment("Physiological");
  };

  /* ==========================
     REPORT BUILDER
     ========================== */
  const buildReport = () => {
    const out = [];

    out.push(region === "whole" ? "MRI WHOLE SPINE" : `MRI ${region.toUpperCase()} SPINE`);
    out.push("");
    out.push("ALIGNMENT:");
    out.push(" " + alignment + ".");
    out.push("");

    out.push("DISCS & NEURAL FORAMINA:");

    const displayLevels = regionLevels(region);

    displayLevels.forEach((lvl) => {
      const d = levels[lvl];
      const seg = [];

      if (d.pfirrmann !== "None") seg.push(`Pfirrmann ${d.pfirrmann}.`);
      if (d.herniation !== "None") seg.push(`Disc pathology: ${d.herniation}.`);
      if (d.canal !== "None") seg.push(`Canal stenosis: ${d.canal}.`);
      if (d.foraminal !== "None") seg.push(`Foraminal stenosis: ${d.foraminal}.`);
      if (d.modic !== "None") seg.push(`Modic: ${d.modic}.`);
      if (d.comments) seg.push(d.comments);

      if (seg.length === 0) out.push(` ${lvl}: No significant abnormality.`);
      else out.push(` ${lvl}: ${seg.join(" ")}`);
    });

    setFullReport(out.join("\n"));
  };

  /* ==========================
     RENDER
     ========================== */
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 max-w-5xl mx-auto">

      {/* HEADER */}
      <h1 className="text-xl font-semibold mb-4">Spine MRI – AI Assisted Reporting</h1>

      {/* REGION SELECT + NORMAL */}
      <SectionCard title="Study Region">
        <div className="flex gap-2 flex-wrap mb-3">
          {REGIONS.map((r) => (
            <Tag key={r.id} active={region === r.id} onClick={() => setRegion(r.id)}>
              {r.label}
            </Tag>
          ))}

          <button
            className="ml-auto px-3 py-1.5 text-xs rounded-full border border-emerald-400 text-emerald-300 hover:bg-emerald-500/20"
            onClick={handleNormalStudy}
          >
            Normal Study Autopopulate
          </button>
        </div>

        <Label>Alignment</Label>
        <Select value={alignment} onChange={(e) => setAlignment(e.target.value)} options={ALIGNMENT} />
      </SectionCard>

      {/* LEVEL-WISE */}
      <SectionCard title="Level-wise Assessment">
        <div className="text-[11px] text-slate-400 mb-2">
          Automatically shows cervical / thoracic / lumbar levels depending on region selection.
        </div>

        <div className="space-y-3 max-h-[450px] overflow-auto pr-1">
          {regionLevels(region).map((lvl) => (
            <div key={lvl} className="border border-slate-700 rounded-2xl p-3 bg-slate-950/60">

              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold">{lvl}</span>
                <button
                  className="text-[10px] px-2 py-1 border border-slate-600 rounded-full"
                  onClick={() => setLevels((prev) => ({ ...prev, [lvl]: defaultLevel() }))}
                >
                  Mark Normal
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <Label>Pfirrmann</Label>
                  <Select
                    value={levels[lvl].pfirrmann}
                    options={PFIRRMANN}
                    onChange={(e) =>
                      setLevels((prev) => ({
                        ...prev,
                        [lvl]: { ...prev[lvl], pfirrmann: e.target.value },
                      }))
                    }
                  />
                </div>

                <div>
                  <Label>Disc pathology</Label>
                  <Select
                    value={levels[lvl].herniation}
                    options={[
                      "None",
                      "Broad-based disc bulge",
                      "Focal protrusion",
                      "Extrusion",
                      "Sequestered fragment",
                      "Annular fissure",
                    ]}
                    onChange={(e) =>
                      setLevels((prev) => ({
                        ...prev,
                        [lvl]: { ...prev[lvl], herniation: e.target.value },
                      }))
                    }
                  />
                </div>

                <div>
                  <Label>Canal stenosis</Label>
                  <Select
                    value={levels[lvl].canal}
                    options={STENOSIS}
                    onChange={(e) =>
                      setLevels((prev) => ({
                        ...prev,
                        [lvl]: { ...prev[lvl], canal: e.target.value },
                      }))
                    }
                  />
                </div>

                <div>
                  <Label>Foraminal stenosis</Label>
                  <Select
                    value={levels[lvl].foraminal}
                    options={STENOSIS}
                    onChange={(e) =>
                      setLevels((prev) => ({
                        ...prev,
                        [lvl]: { ...prev[lvl], foraminal: e.target.value },
                      }))
                    }
                  />
                </div>

                <div>
                  <Label>Modic changes</Label>
                  <Select
                    value={levels[lvl].modic}
                    options={MODIC}
                    onChange={(e) =>
                      setLevels((prev) => ({
                        ...prev,
                        [lvl]: { ...prev[lvl], modic: e.target.value },
                      }))
                    }
                  />
                </div>

                <div>
                  <Label>Comments</Label>
                  <TextArea
                    value={levels[lvl].comments}
                    onChange={(e) =>
                      setLevels((prev) => ({
                        ...prev,
                        [lvl]: { ...prev[lvl], comments: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* REPORT OUTPUT */}
      <SectionCard title="Generated Report">
        <TextArea
          className="min-h-[220px] font-mono text-[12px]"
          value={fullReport}
          onChange={(e) => setFullReport(e.target.value)}
        />
        <button
          className="mt-2 px-4 py-2 rounded-xl text-sm bg-emerald-500 text-slate-950"
          onClick={buildReport}
        >
          Generate Report
        </button>
      </SectionCard>
    </div>
  );
}
