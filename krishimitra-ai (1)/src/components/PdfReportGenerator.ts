import { jsPDF } from "jspdf";
import { DiseaseAnalysis, FertilizerCalculation, Farm } from "../types";

export const downloadCropDiseasePdf = (report: DiseaseAnalysis, farm?: Farm | null) => {
  const doc = new jsPDF();

  // Header Banner
  doc.setFillColor(22, 163, 74); // Leaf Green #16a34a
  doc.rect(0, 0, 210, 32, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("KrishiMitra AI - Crop Health Report", 14, 18);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated: ${new Date().toLocaleDateString("en-IN")} | AI Pathology Scan`, 14, 26);

  // Farm Details
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("1. Farm & Crop Overview", 14, 42);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Crop Name: ${report.cropType}`, 14, 50);
  doc.text(`Report ID: ${report.id}`, 14, 56);
  if (farm) {
    doc.text(`Farm Location: ${farm.location.placeName}`, 14, 62);
    doc.text(`Area: ${farm.areaAcres} Acres | Soil: ${farm.soilType}`, 14, 68);
  }

  // Diagnostic Results
  let y = farm ? 80 : 68;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("2. AI Diagnosis Summary", 14, y);

  y += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`Disease Identified: ${report.diseaseName} (${report.diseaseNameHindi})`, 14, y);

  y += 6;
  doc.text(`AI Confidence: ${report.confidence}% | Severity Level: ${report.severity}`, 14, y);

  y += 6;
  doc.setFont("helvetica", "normal");
  doc.text(`Yield Impact Estimate: ${report.yieldImpactEstimate}`, 14, y);

  // Immediate Actions
  y += 12;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("3. Immediate Recommended Actions", 14, y);

  y += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  report.immediateActions.forEach((action) => {
    doc.text(`• ${action}`, 16, y);
    y += 6;
  });

  // Treatment Options
  y += 6;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("4. Chemical & Organic Treatments", 14, y);

  y += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Organic / Biological Solution:", 14, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  report.organicTreatment.forEach((org) => {
    doc.text(`• ${org}`, 16, y);
    y += 6;
  });

  y += 4;
  doc.setFont("helvetica", "bold");
  doc.text("Chemical Dosage:", 14, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  report.chemicalTreatment.forEach((chem) => {
    doc.text(`• ${chem}`, 16, y);
    y += 6;
  });

  // Preventive Measures
  y += 6;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("5. Preventive Measures", 14, y);

  y += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  report.preventiveMeasures.forEach((prev) => {
    doc.text(`• ${prev}`, 16, y);
    y += 6;
  });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("KrishiMitra AI - Supporting Indian Agriculture with Smart Precision Technology", 14, 285);

  doc.save(`KrishiMitra_Disease_Report_${report.cropType}_${report.id}.pdf`);
};

export const downloadFertilizerPdf = (calc: FertilizerCalculation) => {
  const doc = new jsPDF();

  // Header Banner
  doc.setFillColor(22, 163, 74);
  doc.rect(0, 0, 210, 32, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("KrishiMitra AI - Precision Fertilizer Schedule", 14, 18);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated: ${new Date().toLocaleDateString("en-IN")}`, 14, 26);

  // Field details
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Field Configuration", 14, 42);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Crop: ${calc.crop} | Land Area: ${calc.area} ${calc.unit}`, 14, 50);
  doc.text(`Soil Type: ${calc.soilType} | Est. Input Cost: ₹${calc.totalCostEstimateInr}`, 14, 56);

  // Bag Requirement
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Recommended Quantity (50kg Bags)", 14, 68);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`• Urea (46% N): ${calc.bagsNeeded.urea} Bags`, 16, 76);
  doc.text(`• DAP (18:46:0): ${calc.bagsNeeded.dap} Bags`, 16, 82);
  doc.text(`• MOP (60% K): ${calc.bagsNeeded.mop} Bags`, 16, 88);
  if (calc.bagsNeeded.zinc) {
    doc.text(`• Zinc Sulphate (21%): ${calc.bagsNeeded.zinc} kg`, 16, 94);
  }

  // Application Schedule
  let y = 106;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Stage-wise Application Schedule", 14, y);

  y += 8;
  doc.setFontSize(10);
  calc.schedule.forEach((stage, idx) => {
    doc.setFont("helvetica", "bold");
    doc.text(`${idx + 1}. ${stage.stage} (${stage.timeframe})`, 16, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.text(`   Fertilizer: ${stage.fertilizer} (${stage.quantityKg} kg)`, 16, y);
    y += 6;
    doc.text(`   Instructions: ${stage.instructions}`, 16, y);
    y += 8;
  });

  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("KrishiMitra AI - Empowering Farmers with Precision Soil Nutrition", 14, 285);

  doc.save(`KrishiMitra_Fertilizer_Schedule_${calc.crop}.pdf`);
};
