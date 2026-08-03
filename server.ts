import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Mock / Initial Data Sets
const MOCK_MANDI_PRICES = [
  {
    id: "m1",
    crop: "Tomato",
    cropHindi: "टमाटर",
    variety: "Hybrid Red",
    mandi: "Azadpur Mandi",
    district: "New Delhi",
    state: "Delhi",
    minPrice: 2200,
    maxPrice: 3200,
    modalPrice: 2800,
    unit: "Quintal",
    date: "Today",
    change: +250,
    history: [
      { date: "Jul 27", price: 2400 },
      { date: "Jul 28", price: 2500 },
      { date: "Jul 29", price: 2450 },
      { date: "Jul 30", price: 2600 },
      { date: "Jul 31", price: 2700 },
      { date: "Aug 01", price: 2750 },
      { date: "Aug 02", price: 2800 },
    ],
  },
  {
    id: "m2",
    crop: "Wheat",
    cropHindi: "गेहूं",
    variety: "Sharbati / Lok1",
    mandi: "Khanna Mandi",
    district: "Ludhiana",
    state: "Punjab",
    minPrice: 2275,
    maxPrice: 2550,
    modalPrice: 2420,
    unit: "Quintal",
    date: "Today",
    change: +30,
    history: [
      { date: "Jul 27", price: 2380 },
      { date: "Jul 28", price: 2390 },
      { date: "Jul 29", price: 2400 },
      { date: "Jul 30", price: 2410 },
      { date: "Jul 31", price: 2400 },
      { date: "Aug 01", price: 2415 },
      { date: "Aug 02", price: 2420 },
    ],
  },
  {
    id: "m3",
    crop: "Paddy / Rice",
    cropHindi: "धान / चावल",
    variety: "Basmati 1121",
    mandi: "Karnal Mandi",
    district: "Karnal",
    state: "Haryana",
    minPrice: 3600,
    maxPrice: 4200,
    modalPrice: 3950,
    unit: "Quintal",
    date: "Today",
    change: -120,
    history: [
      { date: "Jul 27", price: 4100 },
      { date: "Jul 28", price: 4050 },
      { date: "Jul 29", price: 4020 },
      { date: "Jul 30", price: 4000 },
      { date: "Jul 31", price: 3980 },
      { date: "Aug 01", price: 3970 },
      { date: "Aug 02", price: 3950 },
    ],
  },
  {
    id: "m4",
    crop: "Potato",
    cropHindi: "आलू",
    variety: "Jyoti / Kufri",
    mandi: "Agra Mandi",
    district: "Agra",
    state: "Uttar Pradesh",
    minPrice: 1400,
    maxPrice: 1850,
    modalPrice: 1650,
    unit: "Quintal",
    date: "Today",
    change: +80,
    history: [
      { date: "Jul 27", price: 1520 },
      { date: "Jul 28", price: 1550 },
      { date: "Jul 29", price: 1580 },
      { date: "Jul 30", price: 1600 },
      { date: "Jul 31", price: 1620 },
      { date: "Aug 01", price: 1630 },
      { date: "Aug 02", price: 1650 },
    ],
  },
  {
    id: "m5",
    crop: "Onion",
    cropHindi: "प्याज",
    variety: "Red Nasik",
    mandi: "Lasalgaon Mandi",
    district: "Nashik",
    state: "Maharashtra",
    minPrice: 1800,
    maxPrice: 2600,
    modalPrice: 2250,
    unit: "Quintal",
    date: "Today",
    change: +150,
    history: [
      { date: "Jul 27", price: 2000 },
      { date: "Jul 28", price: 2050 },
      { date: "Jul 29", price: 2100 },
      { date: "Jul 30", price: 2150 },
      { date: "Jul 31", price: 2200 },
      { date: "Aug 01", price: 2220 },
      { date: "Aug 02", price: 2250 },
    ],
  },
  {
    id: "m6",
    crop: "Cotton",
    cropHindi: "कपास / रुई",
    variety: "Medium Staple",
    mandi: "Rajkot Mandi",
    district: "Rajkot",
    state: "Gujarat",
    minPrice: 6800,
    maxPrice: 7500,
    modalPrice: 7150,
    unit: "Quintal",
    date: "Today",
    change: -50,
    history: [
      { date: "Jul 27", price: 7250 },
      { date: "Jul 28", price: 7220 },
      { date: "Jul 29", price: 7200 },
      { date: "Jul 30", price: 7180 },
      { date: "Jul 31", price: 7160 },
      { date: "Aug 01", price: 7150 },
      { date: "Aug 02", price: 7150 },
    ],
  },
  {
    id: "m7",
    crop: "Mustard",
    cropHindi: "सरसों",
    variety: "Bold Black",
    mandi: "Jaipur Mandi",
    district: "Jaipur",
    state: "Rajasthan",
    minPrice: 5200,
    maxPrice: 5850,
    modalPrice: 5600,
    unit: "Quintal",
    date: "Today",
    change: +100,
    history: [
      { date: "Jul 27", price: 5450 },
      { date: "Jul 28", price: 5500 },
      { date: "Jul 29", price: 5520 },
      { date: "Jul 30", price: 5550 },
      { date: "Jul 31", price: 5580 },
      { date: "Aug 01", price: 5590 },
      { date: "Aug 02", price: 5600 },
    ],
  },
];

const MOCK_SCHEMES = [
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

// --- API ENDPOINTS ---

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "KrishiMitra AI", timestamp: new Date().toISOString() });
});

// Weather Endpoint
app.get("/api/weather", async (req, res) => {
  try {
    const { lat, lon, city = "Ludhiana" } = req.query;

    // Default simulated high-accuracy weather data tailored for agricultural decision making
    const weatherData = {
      city: String(city),
      state: "Punjab",
      temp: 31,
      feelsLike: 34,
      condition: "Partly Cloudy with Humid Breeze",
      humidity: 78,
      windSpeed: 14,
      rainProbability: 65,
      uvIndex: 6,
      soilMoisture: 42,
      advisory: "Favorable humidity for fungal rust spores. Delay pesticide spray until rain passes tomorrow afternoon. Ensure field drainage.",
      forecast: [
        { day: "Today", date: "02 Aug", tempMax: 33, tempMin: 26, condition: "Partly Cloudy", rainProb: 65, icon: "cloud-rain" },
        { day: "Sun", date: "03 Aug", tempMax: 30, tempMin: 25, condition: "Moderate Rain", rainProb: 85, icon: "cloud-drizzle" },
        { day: "Mon", date: "04 Aug", tempMax: 32, tempMin: 24, condition: "Sunny", rainProb: 20, icon: "sun" },
        { day: "Tue", date: "05 Aug", tempMax: 34, tempMin: 26, condition: "Clear Sky", rainProb: 10, icon: "sun" },
        { day: "Wed", date: "06 Aug", tempMax: 35, tempMin: 27, condition: "Hot & Humid", rainProb: 15, icon: "sun" },
        { day: "Thu", date: "07 Aug", tempMax: 33, tempMin: 25, condition: "Light Thunderstorm", rainProb: 55, icon: "cloud-lightning" },
        { day: "Fri", date: "08 Aug", tempMax: 31, tempMin: 24, condition: "Scattered Showers", rainProb: 60, icon: "cloud-rain" },
      ],
    };

    res.json(weatherData);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch weather" });
  }
});

// Mandi Prices Endpoint
app.get("/api/market-prices", (req, res) => {
  res.json({
    updatedAt: new Date().toLocaleDateString("en-IN"),
    prices: MOCK_MANDI_PRICES,
  });
});

// Government Schemes Endpoint
app.get("/api/schemes", (req, res) => {
  res.json({
    schemes: MOCK_SCHEMES,
  });
});

// AI Crop Disease Detection Endpoint
app.post("/api/analyze-crop-disease", async (req, res) => {
  try {
    const { imageBase64, cropType = "Unknown Crop", additionalNotes = "" } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "Image data is required" });
    }

    // Remove data URL prefix if present
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const promptText = `You are KrishiMitra AI, an expert agricultural pathologist and agronomy scientist for Indian farmers.
Analyze this crop image carefully. Crop type reported by farmer: "${cropType}". Additional context: "${additionalNotes}".

Provide a comprehensive, accurate diagnostic report in JSON format matching this exact schema:
{
  "cropType": "Identified Crop Name",
  "diseaseName": "Scientific & Common English Disease Name (e.g. Yellow Rust / Leaf Spot)",
  "diseaseNameHindi": "Hindi Name (e.g. पीला रतुआ / पत्ती धब्बा रोग)",
  "confidence": 92,
  "severity": "Low" | "Medium" | "High" | "Critical",
  "symptoms": ["Symptom 1", "Symptom 2", "Symptom 3"],
  "immediateActions": ["Action 1 to contain infection", "Action 2"],
  "organicTreatment": ["Neem Oil spray 5ml/liter", "Cow urine bio-formulation recipe"],
  "chemicalTreatment": ["Recommended Fungicide/Insecticide with exact dosage e.g. Propiconazole 25% EC @ 1ml/liter"],
  "preventiveMeasures": ["Measure 1 for future crops", "Measure 2"],
  "yieldImpactEstimate": "Estimated 10-15% reduction if left untreated in 7 days"
}

Ensure high accuracy, practical dosage for Indian farming conditions, and clear step-by-step guidance.`;

    const imagePart = {
      inlineData: {
        mimeType: "image/jpeg",
        data: cleanBase64,
      },
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: {
        parts: [imagePart, { text: promptText }],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cropType: { type: Type.STRING },
            diseaseName: { type: Type.STRING },
            diseaseNameHindi: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            severity: { type: Type.STRING },
            symptoms: { type: Type.ARRAY, items: { type: Type.STRING } },
            immediateActions: { type: Type.ARRAY, items: { type: Type.STRING } },
            organicTreatment: { type: Type.ARRAY, items: { type: Type.STRING } },
            chemicalTreatment: { type: Type.ARRAY, items: { type: Type.STRING } },
            preventiveMeasures: { type: Type.ARRAY, items: { type: Type.STRING } },
            yieldImpactEstimate: { type: Type.STRING },
          },
          required: [
            "cropType",
            "diseaseName",
            "diseaseNameHindi",
            "confidence",
            "severity",
            "symptoms",
            "immediateActions",
            "organicTreatment",
            "chemicalTreatment",
            "preventiveMeasures",
            "yieldImpactEstimate",
          ],
        },
      },
    });

    const responseText = response.text || "{}";
    const resultJson = JSON.parse(responseText);

    res.json({
      id: "diag_" + Date.now(),
      createdAt: new Date().toISOString(),
      ...resultJson,
    });
  } catch (error: any) {
    console.error("Error analyzing crop disease:", error);
    res.status(500).json({
      error: "AI Diagnosis system failed to process the image. Please try again with a clearer leaf photo.",
      details: error.message,
    });
  }
});

// Fertilizer & Irrigation Calculator Endpoint
app.post("/api/fertilizer-calculator", async (req, res) => {
  try {
    const { crop = "Wheat", area = 1, unit = "acre", soilType = "Alluvial", season = "Rabi" } = req.body;

    const promptText = `You are a precision soil scientist and fertilizer expert for Indian agriculture.
Calculate the exact NPK (Nitrogen, Phosphorus, Potassium) and recommended fertilizer bag quantities for:
Crop: ${crop}
Land Area: ${area} ${unit}
Soil Type: ${soilType}
Season: ${season}

Return a valid JSON object matching this schema:
{
  "crop": "${crop}",
  "area": ${area},
  "unit": "${unit}",
  "soilType": "${soilType}",
  "npkRequirement": { "n": 120, "p": 60, "k": 40 },
  "bagsNeeded": {
    "urea": 2.5,
    "dap": 1.2,
    "mop": 0.8,
    "zinc": 5,
    "vermicompost": 100
  },
  "schedule": [
    {
      "stage": "Basal Application (At Sowing)",
      "stageHindi": "बुआई के समय (बेसल खुराक)",
      "timeframe": "Day 0",
      "fertilizer": "Full DAP + Full MOP + 1/3 Urea + Zinc",
      "quantityKg": 60,
      "instructions": "Mix into soil before sowing seeds."
    },
    {
      "stage": "First Top Dressing (Crown Root Initiation)",
      "stageHindi": "पहली टॉप ड्रेसिंग (20-25 दिन)",
      "timeframe": "Day 21-25",
      "fertilizer": "1/3 Urea",
      "quantityKg": 45,
      "instructions": "Apply after first irrigation."
    },
    {
      "stage": "Second Top Dressing (Tillering / Jointing)",
      "stageHindi": "दूसरी टॉप ड्रेसिंग (40-45 दिन)",
      "timeframe": "Day 40-45",
      "fertilizer": "Remaining 1/3 Urea",
      "quantityKg": 45,
      "instructions": "Broadcast evenly in moist soil."
    }
  ],
  "totalCostEstimateInr": 2850
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: promptText,
      config: {
        responseMimeType: "application/json",
      },
    });

    const resultJson = JSON.parse(response.text || "{}");
    res.json(resultJson);
  } catch (error: any) {
    console.error("Fertilizer calculation error:", error);
    res.status(500).json({ error: "Failed to calculate fertilizer schedule" });
  }
});

// AI Chat Assistant Endpoint (Handles Hindi + English + Audio/Image)
app.post("/api/chat", async (req, res) => {
  try {
    const { prompt, language = "hi", imageBase64, farmContext } = req.body;

    if (!prompt && !imageBase64) {
      return res.status(400).json({ error: "Prompt or image is required" });
    }

    const systemInstruction = `You are "KrishiMitra AI" (कृषि मित्र AI), an empathetic, highly knowledgeable AI Agricultural Expert created for Indian farmers.
Language Preference: ${language === "hi" ? "Hindi (हिंदी) - use warm, easy-to-understand conversational Hindi mixed with standard farming terms (or Hinglish if appropriate)" : "English (or dual Hindi/English)"}.

User context:
${farmContext ? JSON.stringify(farmContext) : "General Farmer in India"}

Your goal:
1. Answer farmer questions regarding crop management, pest symptoms, fertilizer dosage, weather impact, market rates, government subsidies (PM-KISAN, PMFBY, KCC), and smart irrigation.
2. If the user asks in Hindi ("मेरी गेहूं की फसल में पीले पत्ते आ रहे हैं", "आज टमाटर का रेट क्या है?", "बारिश कब होगी?"), respond in clear, structured, friendly Hindi script with bullet points.
3. Keep recommendations practical, affordable, and safe for soil health.
4. Always provide 3 relevant follow-up questions the farmer might want to ask next.

Always return JSON matching this schema:
{
  "text": "Detailed answer in preferred language...",
  "hindiText": "हिंदी अनुवाद यदि आवश्यक हो...",
  "suggestedQuestions": [
    "अगला सवाल 1...",
    "अगला सवाल 2...",
    "अगला सवाल 3..."
  ],
  "category": "disease" | "weather" | "price" | "general" | "scheme"
}`;

    const parts: any[] = [];
    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: cleanBase64,
        },
      });
    }

    parts.push({
      text: prompt || "कृपया इस फसल चित्र का विश्लेषण करें और मार्गदर्शन प्रदान करें।",
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: { parts },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const resultJson = JSON.parse(response.text || "{}");
    res.json(resultJson);
  } catch (error: any) {
    console.error("Chat API error:", error);
    res.status(500).json({
      error: "Unable to reach KrishiMitra AI server. Please check internet connection.",
      details: error.message,
    });
  }
});

// Notifications API Endpoint
app.get("/api/notifications", (req, res) => {
  res.json({
    notifications: [
      {
        id: "n1",
        type: "weather",
        title: "Rain Forecast Alert",
        titleHindi: "भारी बारिश का पूर्वानुमान",
        message: "Rain probability 85% tomorrow in Punjab/Haryana. Hold pesticide spray.",
        messageHindi: "कल पंजाब/हरियाणा में 85% बारिश की संभावना है। कीटनाशक छिड़काव रोकें।",
        timestamp: "10 mins ago",
        read: false,
        priority: "high",
      },
      {
        id: "n2",
        type: "price",
        title: "Tomato Price Rise in Azadpur",
        titleHindi: "आजादपुर मंडी में टमाटर के दाम बढ़े",
        message: "Tomato modal price increased by ₹250/Quintal to ₹2,800 today.",
        messageHindi: "टमाटर का भाव आज ₹250 बढ़कर ₹2,800 प्रति कुंतल हो गया है।",
        timestamp: "2 hours ago",
        read: false,
        priority: "medium",
      },
      {
        id: "n3",
        type: "scheme",
        title: "PMFBY Crop Insurance Deadline",
        titleHindi: "पीएम फसल बीमा योजना की अंतिम तिथि",
        message: "Kharif crop insurance application closes August 31, 2026. Apply now.",
        messageHindi: "खरीफ फसल बीमा आवेदन 31 अगस्त 2026 को बंद हो रहा है। आज ही आवेदन करें।",
        timestamp: "1 day ago",
        read: true,
        priority: "high",
      },
      {
        id: "n4",
        type: "disease",
        title: "Pest Risk Warning: Armyworm",
        titleHindi: "कीट चेतावनी: फॉल आर्मीवर्म",
        message: "High humidity may trigger Armyworm in Maize/Sugarcane fields. Inspect leaves.",
        messageHindi: "अधिक नमी से मक्का और गन्ने में फॉल आर्मीवर्म फैलने की आशंका। पत्तों की जांच करें।",
        timestamp: "2 days ago",
        read: true,
        priority: "medium",
      },
    ],
  });
});

// Vite Development Server Middleware / Static Fallback
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🌾 KrishiMitra AI Server listening on http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
