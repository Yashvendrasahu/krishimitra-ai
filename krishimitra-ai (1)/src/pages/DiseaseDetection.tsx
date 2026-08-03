import React, { useState, useRef } from "react";
import {
  Upload,
  Camera,
  ScanEye,
  FileText,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Loader2,
  RefreshCw,
  Leaf,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useFarm } from "../context/FarmContext";
import { DiseaseAnalysis } from "../types";
import { downloadCropDiseasePdf } from "../components/PdfReportGenerator";

export const DiseaseDetection: React.FC = () => {
  const { t, language } = useLanguage();
  const { activeFarm, addDiseaseReport, diseaseReports } = useFarm();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [cropType, setCropType] = useState<string>(activeFarm?.cropName || "Wheat (गेहूं)");
  const [notes, setNotes] = useState<string>("");
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [currentResult, setCurrentResult] = useState<DiseaseAnalysis | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleDiseaseImages = [
    {
      name: "Wheat Yellow Rust (गेहूं पीला रतुआ)",
      url: "https://picsum.photos/seed/wheat_yellow_rust/600/400",
      crop: "Wheat (गेहूं)",
    },
    {
      name: "Tomato Early Blight (टमाटर अगेती झुलसा)",
      url: "https://picsum.photos/seed/tomato_leaf_blight/600/400",
      crop: "Tomato (टमाटर)",
    },
    {
      name: "Paddy Bacterial Blight (धान पत्ती धब्बा)",
      url: "https://picsum.photos/seed/paddy_leaf_spot/600/400",
      crop: "Paddy (धान)",
    },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setCurrentResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSampleClick = (sample: typeof sampleDiseaseImages[0]) => {
    setSelectedImage(sample.url);
    setCropType(sample.crop);
    setCurrentResult(null);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setAnalyzing(true);
    setCurrentResult(null);

    try {
      // If sample image URL, convert to base64 or fetch
      let base64 = selectedImage;
      if (selectedImage.startsWith("http")) {
        const response = await fetch(selectedImage);
        const blob = await response.blob();
        base64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
      }

      const res = await fetch("/api/analyze-crop-disease", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64,
          cropType,
          additionalNotes: notes,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to analyze image");
      }

      const result: DiseaseAnalysis = await res.json();
      result.imageUrl = selectedImage;

      setCurrentResult(result);
      addDiseaseReport(result);
    } catch (error: any) {
      console.error(error);
      alert("Error processing crop image. Please check image quality and try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ScanEye className="w-6 h-6 text-emerald-600" />
            <span>{t("diseaseDetection")}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Instant Gemini AI pathology diagnosis & dosage recommendations for infected leaves
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Upload Box & Settings */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-emerald-100 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-emerald-600" />
              <span>Step 1: Upload Leaf Photo</span>
            </h2>

            {/* Hidden Input */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Dropzone Container */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`relative cursor-pointer border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                selectedImage
                  ? "border-emerald-500 bg-emerald-50/30 dark:bg-slate-800/50"
                  : "border-slate-200 dark:border-slate-700 hover:border-emerald-400 bg-slate-50 dark:bg-slate-800/30"
              }`}
            >
              {selectedImage ? (
                <div className="space-y-3">
                  <img
                    src={selectedImage}
                    alt="Selected leaf"
                    className="max-h-48 mx-auto rounded-xl object-cover shadow"
                    referrerPolicy="no-referrer"
                  />
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 font-bold flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Change Image
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                    <Camera className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Click to Take Photo or Upload File
                  </p>
                  <p className="text-[11px] text-slate-400">
                    JPG, PNG up to 10MB. Ensure leaf is well-lit.
                  </p>
                </div>
              )}
            </div>

            {/* Crop Info Form */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Crop Type
                </label>
                <select
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500"
                >
                  <option value="Wheat (गेहूं)">Wheat (गेहूं)</option>
                  <option value="Tomato (टमाटर)">Tomato (टमाटर)</option>
                  <option value="Paddy / Rice (धान)">Paddy / Rice (धान)</option>
                  <option value="Potato (आलू)">Potato (आलू)</option>
                  <option value="Cotton (कपास)">Cotton (कपास)</option>
                  <option value="Sugarcane (गन्ना)">Sugarcane (गन्ना)</option>
                  <option value="Mustard (सरसों)">Mustard (सरसों)</option>
                  <option value="Maize (मक्का)">Maize (मक्का)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Observed Symptoms (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Yellowing spots on lower leaves..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500"
                />
              </div>

              <button
                onClick={handleAnalyze}
                disabled={!selectedImage || analyzing}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>AI Pathology Scanning...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze Disease with AI</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Preset Samples */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-emerald-100 dark:border-slate-800 shadow-sm space-y-3">
            <p className="text-xs font-bold text-slate-900 dark:text-white">Or Try Sample Leaf Photos:</p>
            <div className="grid grid-cols-3 gap-2">
              {sampleDiseaseImages.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSampleClick(sample)}
                  className="group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-colors text-left"
                >
                  <img
                    src={sample.url}
                    alt={sample.name}
                    className="w-full h-16 object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <p className="p-1.5 text-[10px] font-semibold text-slate-700 dark:text-slate-300 truncate">
                    {sample.crop}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Analysis Result Display */}
        <div className="lg:col-span-7">
          {analyzing ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 border border-emerald-100 dark:border-slate-800 shadow-sm text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
                <Leaf className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Examining Leaf Pathology...
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Gemini AI is cross-referencing fungal, bacterial, and nutritional deficiency pattern databases.
              </p>
            </div>
          ) : currentResult ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-emerald-100 dark:border-slate-800 shadow-sm space-y-6">
              {/* Top Summary Banner */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      Severity: {currentResult.severity}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      AI Confidence: {currentResult.confidence}%
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-2">
                    {currentResult.diseaseName}
                  </h2>
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                    {currentResult.diseaseNameHindi}
                  </p>
                </div>

                <button
                  onClick={() => downloadCropDiseasePdf(currentResult, activeFarm)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>PDF Report</span>
                </button>
              </div>

              {/* Yield Impact Warning */}
              <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 flex items-start gap-3 text-xs text-red-900 dark:text-red-200">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Yield Risk Assessment:</p>
                  <p className="mt-0.5 opacity-90">{currentResult.yieldImpactEstimate}</p>
                </div>
              </div>

              {/* Symptoms & Immediate Actions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2">
                  <h3 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                    <ScanEye className="w-4 h-4 text-emerald-600" />
                    <span>Identified Symptoms</span>
                  </h3>
                  <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                    {currentResult.symptoms.map((sym, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{sym}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2">
                  <h3 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Immediate Containment</span>
                  </h3>
                  <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                    {currentResult.immediateActions.map((act, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Treatments Section */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Recommended Treatment Plan
                </h3>

                <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-2">
                  <p className="font-bold text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                    🌿 Organic / Eco-Friendly Solution
                  </p>
                  <ul className="space-y-1 text-xs text-emerald-800 dark:text-emerald-300">
                    {currentResult.organicTreatment.map((org, i) => (
                      <li key={i}>✓ {org}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 space-y-2">
                  <p className="font-bold text-xs text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                    🧪 Chemical Spray & Exact Dosage
                  </p>
                  <ul className="space-y-1 text-xs text-blue-800 dark:text-blue-300">
                    {currentResult.chemicalTreatment.map((chem, i) => (
                      <li key={i}>✓ {chem}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Preventive Measures */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700 space-y-2">
                <p className="font-bold text-xs text-slate-900 dark:text-white">
                  Preventive Measures for Next Season
                </p>
                <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  {currentResult.preventiveMeasures.map((prev, i) => (
                    <li key={i}>• {prev}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 border border-emerald-100 dark:border-slate-800 shadow-sm text-center space-y-3">
              <ScanEye className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                No Scan Active
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Upload or select a leaf photo on the left panel to trigger AI crop pathology diagnosis.
              </p>
            </div>
          )}

          {/* Previous Scan History */}
          {diseaseReports.length > 0 && (
            <div className="mt-6 bg-white dark:bg-slate-900 rounded-3xl p-5 border border-emerald-100 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="font-bold text-xs text-slate-900 dark:text-white">
                Saved Diagnostic History ({diseaseReports.length})
              </h3>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {diseaseReports.map((report) => (
                  <div
                    key={report.id}
                    onClick={() => setCurrentResult(report)}
                    className="py-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 px-2 rounded-xl transition-colors text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">
                        {report.diseaseName} ({report.diseaseNameHindi})
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {report.cropType} • {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      View Report
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
