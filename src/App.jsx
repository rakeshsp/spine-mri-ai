import React, { useState } from "react";

// ----- Level definitions -----
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

const ALL_LEVEL_KEYS = [
  ...CERVICAL_LEVELS,
  ...THORACIC_LEVELS,
  ...LUMBAR_LEVELS,
];

// ----- Region options -----
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

// helpers
function makeDefaultLevel() {
  return {
    pfirrmann: "II – Inhomogeneous, normal height",
    herniation: "None",
    canal: "None",
    foraminal: "None",
    modic: "None",
    comments: "",
  };
}

function makeInitialLevels() {
  const levels = {};
  ALL_LEVEL_KEYS.forEach((key) => {
    levels[key] = makeDefaultLevel();
  });

  // keep your earlier “example” pathology at L4–5 and L5–S1
  levels["L4L5"] = {
    ...levels["L4L5"],
    pfirrmann:
      "III – Inhomogeneous, intermediate, normal/slightly decreased height",
    herniation: "Broad-based disc bulge",
    canal: "Mild",
    foraminal: "Mild",
    modic: "Type II",
  };
  levels["L5S1"] = {
    ...levels["L5S1"],
    pfirrmann:
      "III – Inhomogeneous, intermediate, normal/slightly decreased height",
    herniation: "Central / paracentral disc protrusion",
    canal: "Mild",
    foraminal: "Moderate",
    modic: "None",
  };

  return levels;
}

function getRegionLevelKeys(region) {
  if (region === "cervical") return CERVICAL_LEVELS;
  if (region === "thoracic") return THORACIC_LEVELS;
  if (region === "lumbar") return LUMBAR_LEVELS;
  return ALL_LEVEL_KEYS; // whole spine
}

function SectionCard({ title, children }) {
  return (
    <section className="bg-slate-900/70 border border-slate-700 rounded-2xl p-4 md:p-5 mb-4 shadow-sm">
      <h2 className="text-sm font-semibold tracking-wide text-slate-300 uppercase mb-3">
        {title}
      </h2>
      <div className="space-y-3 text-sm text-slate-100">{children}</div>
    </section>
  );
}

function Label({ children }) {
  return (
    <label className="block text-xs font-semibold tracking-wide text-slate-300 uppercase mb-1">
      {children}
    </label>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className={
        "w-full rounded-xl bg-slate-900/80 border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 " +
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
        "w-full rounded-xl bg-slate-900/80 border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 " +
        (props.className || "")
      }
    >
      {options.map((opt) => (
        <option key={opt} value={opt} className="bg-slate-900">
          {opt}
        </option>
      ))}
    </select>
  );
}

function TextArea(props) {
  return (
    <textarea
      {...props}
      className={
        "w-full min-h-[72px] rounded-xl bg-slate-900/80 border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-y " +
        (props.className || "")
      }
    />
  );
}

function TagToggle({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "px-3 py-1 rounded-full text-xs border transition " +
        (active
          ? "bg-emerald-500/90 border-emerald-300 text-slate-950 font-semibold"
          : "bg-slate-900/70 border-slate-600 text-slate-200 hover:border-emerald-400 hover:text-emerald-100")
      }
    >
      {children}
    </button>
  );
}

export default function App() {
  const [region, setRegion] = useState("lumbar");
  const [patient, setPatient] = useState({
    name: "",
    id: "",
    age: "",
    sex: "",
    studyDate: "",
    referring: "",
  });

  const [technique, setTechnique] = useState(
    "Sagittal T1, T2, STIR; axial T2 and T1-weighted images. Additional sequences as indicated."
  );

  const [alignmentVal, setAlignmentVal] = useState("Physiological");

  const [levels, setLevels] = useState(() => makeInitialLevels());

  const [cordCauda, setCordCauda] = useState({
    signal: "Normal",
    compression: "None",
    myelomalacia: "Absent",
    comments: "",
  });

  const [others, setOthers] = useState({
    vertebrae:
      "Vertebral body heights and marrow signal are maintained. No suspicious focal lesion.",
    ligaments: "Posterior elements and ligamentum flavum are unremarkable.",
    paraspinal: "No significant paraspinal or epidural collection.",
    conus: "Conus terminates at L1 with normal morphology and signal.",
  });

  const [impressionKeyPoints, setImpressionKeyPoints] = useState(
    "Multilevel lumbar spondylosis with maximal changes at L4-5 and L5-S1 as detailed above. No high-grade central canal stenosis. No cord signal abnormality."
  );

  const [fullReport, setFullReport] = useState("");
  const [aiImpression, setAiImpression] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handlePatientChange = (field, value) => {
    setPatient((prev) => ({ ...prev, [field]: value }));
  };

  const handleLevelChange = (levelKey, field, value) => {
    setLevels((prev) => ({
      ...prev,
      [levelKey]: {
        ...prev[levelKey],
        [field]: value,
      },
    }));
  };

  const handleOthersChange = (field, value) => {
    setOthers((prev) => ({ ...prev, [field]: value }));
  };

  const handleCordCaudaChange = (field, value) => {
    setCordCauda((prev) => ({ ...prev, [field]: value }));
  };

  // ---- Normal study autopopulate ----
  const applyNormalStudy = () => {
    const normalLevels = {};
    ALL_LEVEL_KEYS.forEach((key) => {
      normalLevels[key] = {
        pfirrmann: "II – Inhomogeneous, normal height",
        herniation: "None",
        canal: "None",
        foraminal: "None",
        modic: "None",
        comments: "",
      };
    });
    setLevels(normalLevels);
    setAlignmentVal("Physiological");
    setCordCauda({
      signal: "Normal",
      compression: "None",
      myelomalacia: "Absent",
      comments: "",
    });
    setOthers({
      vertebrae:
        "Vertebral body heights and marrow signal are maintained. No suspicious focal lesion.",
      ligaments: "Posterior elements and ligamentum flavum are unremarkable.",
      paraspinal: "No significant paraspinal or epidural collection.",
      conus: "Conus terminates at L1 with normal morphology and signal.",
    });

    let imp;
    if (region === "lumbar") {
      imp =
        "MRI lumbar spine within normal limits. No significant disc bulge, spinal canal or neural foraminal stenosis.";
    } else if (region === "cervical") {
      imp =
        "MRI cervical spine within normal limits. No disc herniation or spinal canal stenosis. No cord signal abnormality.";
    } else if (region === "thoracic") {
      imp =
        "MRI thoracic spine within normal limits. No disc herniation or spinal canal stenosis. No cord signal abnormality.";
    } else {
      imp =
        "MRI whole spine within normal limits. No significant disc herniation, spinal canal or neural foraminal stenosis. No abnormal cord or conus signal.";
    }
    setImpressionKeyPoints(imp);
  };

  const buildReport = () => {
    const lines = [];

    const regionTitle =
      region === "whole"
        ? "MRI WHOLE SPINE"
        : "MRI SPINE (" + region.toUpperCase() + ")";
    lines.push(regionTitle);
    lines.push("");

    const demographics = [
      patient.name && `Name: ${patient.name}`,
      patient.id && `ID: ${patient.id}`,
      patient.age && `Age/Sex: ${patient.age} / ${patient.sex}`,
      patient.studyDate && `Study date: ${patient.studyDate}`,
      patient.referring && `Referring physician: ${patient.referring}`,
    ]
      .filter(Boolean)
      .join(" | ");

    if (demographics) {
      lines.push(demographics);
      lines.push("");
    }

    lines.push("TECHNIQUE:");
    lines.push(" " + technique.trim());
    lines.push("");

    lines.push("ALIGNMENT:");
    lines.push(" " + alignmentVal + ".");
    lines.push("");

    lines.push("VERTEBRAE & MARROW SIGNAL:");
    lines.push(" " + (others.vertebrae || ""));
    lines.push("");

    lines.push("DISCS & NEURAL FORAMINA:");
    const regionLevelKeys = getRegionLevelKeys(region);
    regionLevelKeys.forEach((key) => {
      const val = levels[key];
      if (!val) return;

      const segLines = [];
      if (val.pfirrmann) segLines.push(`Pfirrmann grade: ${val.pfirrmann}.`);
      if (val.herniation && val.herniation !== "None")
        segLines.push(`Disc pathology: ${val.herniation}.`);
      if (val.canal && val.canal !== "None")
        segLines.push(`Central canal stenosis: ${val.canal}.`);
      if (val.foraminal && val.foraminal !== "None")
        segLines.push(`Neural foraminal stenosis: ${val.foraminal}.`);
      if (val.modic && val.modic !== "None")
        segLines.push(`Endplate changes: ${val.modic}.`);
      if (val.comments) segLines.push(val.comments.trim());

      if (segLines.length > 0) {
        lines.push(` ${key}: ` + segLines.join(" "));
      } else {
        lines.push(` ${key}: No significant abnormality.`);
      }
    });
    lines.push("");

    const cordHeading =
      region === "cervical" || region === "thoracic"
        ? "SPINAL CORD:"
        : region === "whole"
        ? "SPINAL CORD / CONUS / CAUDA EQUINA:"
        : "CAUDA EQUINA / CONUS:";
    lines.push(cordHeading);

    const cordBits = [];
    cordBits.push(`Signal: ${cordCauda.signal || ""}.`);
    if (cordCauda.compression && cordCauda.compression !== "None")
      cordBits.push(`Compression: ${cordCauda.compression}.`);
    if (cordCauda.myelomalacia && cordCauda.myelomalacia !== "Absent")
      cordBits.push(`Myelomalacia / gliosis: ${cordCauda.myelomalacia}.`);
    if (cordCauda.comments) cordBits.push(cordCauda.comments.trim());
    lines.push(" " + cordBits.join(" "));
    lines.push("");

    lines.push("POSTERIOR ELEMENTS / LIGAMENTS:");
    lines.push(" " + (others.ligaments || ""));
    lines.push("");

    lines.push("PARASPINAL / EPIDURAL SOFT TISSUES:");
    lines.push(" " + (others.paraspinal || ""));
    lines.push("");

    if (region === "lumbar" || region === "whole") {
      lines.push("CONUS:");
      lines.push(" " + (others.conus || ""));
      lines.push("");
    }

    lines.push("IMPRESSION:");
    if (impressionKeyPoints.trim()) {
      impressionKeyPoints
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .forEach((line) => lines.push(" • " + line));
    } else {
      lines.push(" • Multilevel spondylotic changes as detailed above.");
    }

    const reportText = lines.join("\n");
    setFullReport(reportText);
  };

  const copyReport = async () => {
    if (!fullReport) return;
    try {
      await navigator.clipboard.writeText(fullReport);
      alert("Report copied to clipboard.");
    } catch {
      alert("Could not access clipboard. Please copy manually.");
    }
  };

  const handleAiRefine = async () => {
    if (!fullReport) {
      alert("Generate the base report first.");
      return;
    }
    setIsAiLoading(true);
    try {
      const res = await fetch("/api/ai-refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          baseReport: fullReport,
          region,
        }),
      });

      if (!res.ok) throw new Error("AI endpoint not configured");

      const data = await res.json();
      setAiImpression(data.impression || data.text || "");
    } catch (err) {
      console.error(err);
      alert(
        "AI endpoint /api/ai-refine is not configured. For now, treat this as a structured template only."
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-lg md:text-xl font-semibold tracking-tight">
              Spine MRI AI-Assisted Reporting
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Structured template with auto-generated text and optional LLM
              refinement.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="px-2 py-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 font-mono">
              v0.2 – Full C/T/L + whole spine
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-4 md:py-6 flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-[52%] space-y-4">
          <SectionCard title="Study Context">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-xs text-slate-400 mr-1">Region:</span>
              {REGIONS.map((r) => (
                <TagToggle
                  key={r.id}
                  active={region === r.id}
                  onClick={() => setRegion(r.id)}
                >
                  {r.label}
                </TagToggle>
              ))}
              <button
                type="button"
                onClick={applyNormalStudy}
                className="ml-auto text-[11px] px-3 py-1.5 rounded-full border border-emerald-500/60 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20"
              >
                Normal study autopopulate
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Patient name</Label>
                <Input
                  value={patient.name}
                  onChange={(e) =>
                    handlePatientChange("name", e.target.value)
                  }
                  placeholder="Optional"
                />
              </div>
              <div>
                <Label>Patient ID</Label>
                <Input
                  value={patient.id}
                  onChange={(e) => handlePatientChange("id", e.target.value)}
                  placeholder="Optional"
                />
              </div>
              <div>
                <Label>Age</Label>
                <Input
                  value={patient.age}
                  onChange={(e) =>
                    handlePatientChange("age", e.target.value)
                  }
                  placeholder="e.g. 52"
                />
              </div>
              <div>
                <Label>Sex</Label>
                <Input
                  value={patient.sex}
                  onChange={(e) =>
                    handlePatientChange("sex", e.target.value)
                  }
                  placeholder="M / F"
                />
              </div>
              <div>
                <Label>Study date</Label>
                <Input
                  type="date"
                  value={patient.studyDate}
                  onChange={(e) =>
                    handlePatientChange("studyDate", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>Referring physician</Label>
                <Input
                  value={patient.referring}
                  onChange={(e) =>
                    handlePatientChange("referring", e.target.value)
                  }
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Technique & Alignment">
            <div className="mb-3">
              <Label>Technique</Label>
              <TextArea
                value={technique}
                onChange={(e) => setTechnique(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label>Alignment</Label>
                <Select
                  value={alignmentVal}
                  onChange={(e) => setAlignmentVal(e.target.value)}
                  options={ALIGNMENT}
                />
              </div>
              <div className="text-[11px] text-slate-400 self-end">
                Use this block to capture straightening, listhesis, or
                scoliosis explicitly.
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Level-wise assessment">
            <div className="text-[11px] text-slate-400 mb-2">
              Displays relevant cervical / thoracic / lumbar levels based on the
              selected region. Whole-spine mode shows all levels.
            </div>
            <div className="space-y-3 max-h-[460px] overflow-auto pr-1">
              {getRegionLevelKeys(region).map((key) => {
                const val = levels[key];
                if (!val) return null;
                return (
                  <div
                    key={key}
                    className="border border-slate-700/80 rounded-2xl p-3 bg-slate-950/60"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-xs font-semibold text-slate-200 tracking-wide">
                        {key}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleLevelChange(key, "herniation", "None")
                        }
                        className="text-[10px] px-2 py-1 rounded-full border border-slate-600 text-slate-300 hover:border-emerald-400"
                      >
                        Mark as normal
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                      <div>
                        <Label>Pfirrmann grade</Label>
                        <Select
                          value={val.pfirrmann}
                          onChange={(e) =>
                            handleLevelChange(
                              key,
                              "pfirrmann",
                              e.target.value
                            )
                          }
                          options={PFIRRMANN}
                        />
                      </div>
                      <div>
                        <Label>Disc pathology</Label>
                        <Select
                          value={val.herniation}
                          onChange={(e) =>
                            handleLevelChange(
                              key,
                              "herniation",
                              e.target.value
                            )
                          }
                          options={[
                            "None",
                            "Broad-based disc bulge",
                            "Focal protrusion",
                            "Extrusion",
                            "Sequestered fragment",
                            "Annular fissure",
                          ]}
                        />
                      </div>
                      <div>
                        <Label>Central canal stenosis</Label>
                        <Select
                          value={val.canal}
                          onChange={(e) =>
                            handleLevelChange(
                              key,
                              "canal",
                              e.target.value
                            )
                          }
                          options={STENOSIS}
                        />
                      </div>
                      <div>
                        <Label>Foraminal stenosis</Label>
                        <Select
                          value={val.foraminal}
                          onChange={(e) =>
                            handleLevelChange(
                              key,
                              "foraminal",
                              e.target.value
                            )
                          }
                          options={STENOSIS}
                        />
                      </div>
                      <div>
                        <Label>Modic / endplate changes</Label>
                        <Select
                          value={val.modic}
                          onChange={(e) =>
                            handleLevelChange(
                              key,
                              "modic",
                              e.target.value
                            )
                          }
                          options={MODIC}
                        />
                      </div>
                      <div>
                        <Label>Additional comments</Label>
                        <TextArea
                          value={val.comments}
                          onChange={(e) =>
                            handleLevelChange(
                              key,
                              "comments",
                              e.target.value
                            )
                          }
                          placeholder="e.g. Left paracentral component indenting the thecal sac, contacting the traversing nerve root."
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard
            title={
              region === "cervical" || region === "thoracic"
                ? "Spinal cord & canal"
                : region === "whole"
                ? "Cord / conus / cauda equina & canal"
                : "Conus / cauda equina & canal"
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label>Signal</Label>
                <Select
                  value={cordCauda.signal}
                  onChange={(e) =>
                    handleCordCaudaChange("signal", e.target.value)
                  }
                  options={[
                    "Normal",
                    "T2 hyperintense",
                    "Myelomalacic",
                    "Syrinx",
                  ]}
                />
              </div>
              <div>
                <Label>Compression</Label>
                <Select
                  value={cordCauda.compression}
                  onChange={(e) =>
                    handleCordCaudaChange("compression", e.target.value)
                  }
                  options={[
                    "None",
                    "Indentation",
                    "Flattening",
                    "Severe compression",
                  ]}
                />
              </div>
              <div>
                <Label>Myelomalacia / gliosis</Label>
                <Select
                  value={cordCauda.myelomalacia}
                  onChange={(e) =>
                    handleCordCaudaChange("myelomalacia", e.target.value)
                  }
                  options={["Absent", "Present"]}
                />
              </div>
            </div>
            <div className="mt-2">
              <Label>Comments</Label>
              <TextArea
                value={cordCauda.comments}
                onChange={(e) =>
                  handleCordCaudaChange("comments", e.target.value)
                }
                placeholder="e.g. Focal T2 hyperintensity at C4-5 suggesting chronic myelomalacia."
              />
            </div>
          </SectionCard>

          <SectionCard title="Other compartments">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label>Vertebrae & marrow</Label>
                <TextArea
                  value={others.vertebrae}
                  onChange={(e) =>
                    handleOthersChange("vertebrae", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>Posterior elements / ligaments</Label>
                <TextArea
                  value={others.ligaments}
                  onChange={(e) =>
                    handleOthersChange("ligaments", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>Paraspinal / epidural soft tissues</Label>
                <TextArea
                  value={others.paraspinal}
                  onChange={(e) =>
                    handleOthersChange("paraspinal", e.target.value)
                  }
                />
              </div>
              {(region === "lumbar" || region === "whole") && (
                <div>
                  <Label>Conus description</Label>
                  <TextArea
                    value={others.conus}
                    onChange={(e) =>
                      handleOthersChange("conus", e.target.value)
                    }
                  />
                </div>
              )}
            </div>
          </SectionCard>

          <SectionCard title="Key points for impression (fed to AI)">
            <TextArea
              value={impressionKeyPoints}
              onChange={(e) => setImpressionKeyPoints(e.target.value)}
              placeholder="High-yield bullet points that you want emphasised in the impression. One per line."
            />
          </SectionCard>

          <div className="flex flex-wrap gap-2 justify-end mb-4">
            <button
              type="button"
              onClick={buildReport}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-500 text-slate-950 hover:bg-emerald-400 border border-emerald-300 shadow-sm"
            >
              Generate structured report
            </button>
          </div>
        </div>

        <div className="w-full lg:w-[48%] flex flex-col gap-4">
          <SectionCard title="Generated report (editable)">
            <TextArea
              className="min-h-[260px] font-mono text-[12px]"
              value={fullReport}
              onChange={(e) => setFullReport(e.target.value)}
              placeholder="Click 'Generate structured report' to build a draft. You can freely edit this text before copying."
            />
            <div className="flex flex-wrap gap-2 justify-between mt-2">
              <div className="text-[11px] text-slate-400 self-center">
                This is deterministic, template-based text built from your
                selections.
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={copyReport}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 border border-slate-600 hover:border-emerald-400"
                >
                  Copy report
                </button>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="AI-refined impression (optional)">
            <div className="text-[11px] text-slate-400 mb-2">
              Hook this block to your LLM backend: send the full report + key
              points, receive a concise, exam-ready impression.
            </div>
            <TextArea
              className="min-h-[120px] font-mono text-[12px]"
              value={aiImpression}
              onChange={(e) => setAiImpression(e.target.value)}
              placeholder="Once wired, the AI endpoint should return a polished impression paragraph or bullet list here."
            />
            <div className="flex flex-wrap gap-2 justify-between mt-2">
              <button
                type="button"
                onClick={handleAiRefine}
                disabled={isAiLoading}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-fuchsia-500/90 text-slate-950 border border-fuchsia-200 hover:bg-fuchsia-400 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isAiLoading ? "Contacting AI..." : "Send to AI backend"}
              </button>
              <div className="text-[10px] text-slate-500 max-w-[60%] text-right">
                Backend contract: POST /api/ai-refine → {"{\"impression\": \"string\"}"}. You
                control the prompt and model (OpenAI, Azure, local, etc.).
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Implementation notes">
            <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-1">
              <li>
                Region selector now supports cervical, thoracic, lumbar and
                whole-spine contexts with level lists filtered accordingly.
              </li>
              <li>
                The normal-study button resets alignment, levels, cord and
                impression to a clean baseline for the active region.
              </li>
              <li>
                You can continue to evolve text blocks to match your reporting
                style without changing the overall structure.
              </li>
            </ul>
          </SectionCard>
        </div>
      </main>
    </div>
  );
}
