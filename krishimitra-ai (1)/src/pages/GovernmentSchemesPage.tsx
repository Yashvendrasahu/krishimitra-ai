import React, { useState } from "react";
import {
  Building2,
  CheckCircle2,
  ExternalLink,
  FileText,
  Search,
  Sparkles,
  Award,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useFarm } from "../context/FarmContext";

export const GovernmentSchemesPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const schemes = [
    {
      id: "s1",
      title: "PM-KISAN Samman Nidhi",
      titleHindi: "पीएम-किसान सम्मान निधि योजना",
      category: "Financial",
      subsidyAmount: "₹6,000 / year",
      shortDesc: "Direct income support of ₹6,000 per year in 3 equal installments directly into land-holding farmers' bank accounts.",
      shortDescHindi: "भूमिधारक किसानों के बैंक खातों में सीधे ₹6,000 प्रति वर्ष 3 समान किस्तों में प्रत्यक्ष आय सहायता।",
      eligibility: ["Small & Marginal Farmers with cultivable land", "Aadhaar linked active bank account", "e-KYC verified"],
      documentsRequired: ["Aadhaar Card", "Land Ownership Certificate (Khasra/Khatauni)", "Bank Passbook"],
      applicationUrl: "https://pmkisan.gov.in",
      isNew: false,
    },
    {
      id: "s2",
      title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
      titleHindi: "प्रधानमंत्री फसल बीमा योजना",
      category: "Insurance",
      subsidyAmount: "Up to 90% Premium Subsidy",
      shortDesc: "Comprehensive crop insurance against non-preventable natural risks, pests & diseases from pre-sowing to post-harvest.",
      shortDescHindi: "बुआई पूर्व से कटाई के बाद तक प्राकृतिक आपदाओं, कीटों और बीमारियों के खिलाफ व्यापक फसल बीमा।",
      eligibility: ["All farmers growing notified crops in notified areas", "Sharecroppers & tenant farmers eligible"],
      documentsRequired: ["Land sowing certificate", "Aadhaar Card", "Bank Account Details"],
      applicationUrl: "https://pmfby.gov.in",
      deadline: "31st August 2026",
      isNew: true,
    },
    {
      id: "s3",
      title: "Kisan Credit Card (KCC) Scheme",
      titleHindi: "किसान क्रेडिट कार्ड (केसीसी) योजना",
      category: "Financial",
      subsidyAmount: "Loans up to ₹3 Lakh at 4% interest",
      shortDesc: "Provides timely credit to farmers for agricultural inputs, machinery maintenance, and post-harvest expenses with 3% prompt repayment incentive.",
      shortDescHindi: "3% समय पर पुनर्भुगतान प्रोत्साहन के साथ कृषि आदानों और मशीनरी के लिए 4% की रियायती ब्याज दर पर ऋण प्रदान करता है।",
      eligibility: ["Individual / Joint farmers", "Tenant farmers / Oral lessees / SHGs"],
      documentsRequired: ["Identity & Residence Proof", "Landholding documents", "Passport size photo"],
      applicationUrl: "https://myscheme.gov.in",
      isNew: false,
    },
    {
      id: "s4",
      title: "Sub-Mission on Agricultural Mechanization (SMAM)",
      titleHindi: "कृषि यांत्रिकीकरण पर उप-मिशन",
      category: "Equipment",
      subsidyAmount: "40% - 50% Subsidy on Farm Machinery",
      shortDesc: "Subsidy on purchasing tractors, rotavators, harvesters, laser land levelers, and setting up Custom Hiring Centers (CHC).",
      shortDescHindi: "ट्रैक्टर, रोटावेटर, हार्वेस्टर और कस्टम हायरिंग सेंटर स्थापित करने पर 40% से 50% की छूट।",
      eligibility: ["Farmers registered on Agrimachinery portal", "Priority to Women & SC/ST farmers"],
      documentsRequired: ["Aadhaar Card", "Bank Passbook", "Caste Certificate (if applicable)", "Land details"],
      applicationUrl: "https://agrimachinery.nic.in",
      isNew: true,
    },
    {
      id: "s5",
      title: "Pradhan Mantri Krishi Sinchayee Yojana (Micro Irrigation)",
      titleHindi: "प्रधानमंत्री कृषि सिंचाई योजना (ड्रिप/स्प्रिंकलर)",
      category: "Irrigation",
      subsidyAmount: "Up to 55% Subsidy for Drip & Sprinkler",
      shortDesc: "Promotes 'More Crop Per Drop' by granting subsidies on drip irrigation, sprinkler systems, and farm ponds to enhance water efficiency.",
      shortDescHindi: "ड्रिप और स्प्रिंकलर सिंचाई प्रणालियों पर 55% तक सब्सिडी देकर 'प्रति बूंद अधिक फसल' को बढ़ावा देता है।",
      eligibility: ["Farmers having self-owned or leased land with guaranteed water source"],
      documentsRequired: ["Soil & Water Test report", "Land Ownership Record", "Quotation from approved dealer"],
      applicationUrl: "https://pmksy.gov.in",
      isNew: false,
    },
  ];

  const categories = ["All", "Financial", "Insurance", "Equipment", "Irrigation"];

  const filteredSchemes = schemes.filter((s) => {
    const matchesCat = categoryFilter === "All" || s.category === categoryFilter;
    const matchesSearch =
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.titleHindi.includes(searchTerm) ||
      s.shortDesc.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-20 lg:pb-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-emerald-600" />
            <span>{t("governmentSchemes")}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Central & State Agricultural Subsidies, PM-KISAN, PMFBY Crop Insurance & KCC Credit
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search scheme name or benefit..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500 shadow-sm"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              categoryFilter === cat
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-emerald-100 dark:border-slate-800 hover:border-emerald-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredSchemes.map((scheme) => (
          <div
            key={scheme.id}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-emerald-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 uppercase">
                      {scheme.category}
                    </span>
                    {scheme.deadline && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {scheme.deadline}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-white mt-2">
                    {scheme.title}
                  </h3>
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    {scheme.titleHindi}
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-xs font-extrabold text-amber-900 dark:text-amber-200 block">
                    {scheme.subsidyAmount}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {language === "hi" ? scheme.shortDescHindi : scheme.shortDesc}
              </p>

              {/* Eligibility & Documents */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Eligibility:
                  </p>
                  <ul className="text-[11px] text-slate-500 dark:text-slate-400 pl-4 list-disc mt-0.5">
                    {scheme.eligibility.map((e, idx) => (
                      <li key={idx}>{e}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-emerald-600" /> Documents Required:
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {scheme.documentsRequired.join(" • ")}
                  </p>
                </div>
              </div>
            </div>

            <a
              href={scheme.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <span>Apply on Official Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
