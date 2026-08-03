export type Language = 'hi' | 'en';

export interface FarmerProfile {
  id: string;
  name: string;
  phone: string;
  state: string;
  district: string;
  mandiPreference: string;
  preferredLanguage: Language;
}

export interface Farm {
  id: string;
  name: string;
  cropName: string;
  cropVariety?: string;
  areaAcres: number;
  sowingDate: string;
  soilType: 'Alluvial' | 'Black' | 'Red' | 'Sandy' | 'Clay';
  location: {
    lat: number;
    lng: number;
    placeName: string;
  };
  healthStatus: 'Healthy' | 'Needs Attention' | 'Warning' | 'Critical';
}

export interface WeatherData {
  city: string;
  state: string;
  temp: number;
  feelsLike: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  rainProbability: number;
  uvIndex: number;
  soilMoisture: number; // %
  advisory: string;
  forecast: Array<{
    day: string;
    date: string;
    tempMax: number;
    tempMin: number;
    condition: string;
    rainProb: number;
    icon: string;
  }>;
}

export interface MandiPrice {
  id: string;
  crop: string;
  cropHindi: string;
  variety: string;
  mandi: string;
  district: string;
  state: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  unit: string;
  date: string;
  change: number; // + / - change in INR
  history: Array<{ date: string; price: number }>;
}

export interface DiseaseAnalysis {
  id: string;
  cropType: string;
  diseaseName: string;
  diseaseNameHindi: string;
  confidence: number; // e.g. 92
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  symptoms: string[];
  immediateActions: string[];
  organicTreatment: string[];
  chemicalTreatment: string[];
  preventiveMeasures: string[];
  yieldImpactEstimate: string;
  imageUrl?: string;
  createdAt: string;
}

export interface FertilizerCalculation {
  crop: string;
  area: number;
  unit: 'acre' | 'bigha' | 'hectare';
  soilType: string;
  npkRequirement: { n: number; p: number; k: number };
  bagsNeeded: {
    urea: number;
    dap: number;
    mop: number;
    zinc?: number;
    vermicompost?: number;
  };
  schedule: Array<{
    stage: string;
    stageHindi: string;
    timeframe: string;
    fertilizer: string;
    quantityKg: number;
    instructions: string;
  }>;
  totalCostEstimateInr: number;
}

export interface IrrigationRecommendation {
  crop: string;
  growthStage: string;
  waterRequirementLitersPerAcre: number;
  irrigationFrequencyDays: number;
  recommendedTime: string;
  dripMethodAdvice: string;
  rainAdjustment: string;
  nextIrrigationDate: string;
}

export interface GovernmentScheme {
  id: string;
  title: string;
  titleHindi: string;
  category: 'Financial' | 'Insurance' | 'Equipment' | 'Irrigation' | 'Soil';
  subsidyAmount: string;
  shortDesc: string;
  shortDescHindi: string;
  eligibility: string[];
  documentsRequired: string[];
  applicationUrl: string;
  deadline?: string;
  isNew?: boolean;
}

export interface NotificationItem {
  id: string;
  type: 'weather' | 'disease' | 'price' | 'scheme';
  title: string;
  titleHindi: string;
  message: string;
  messageHindi: string;
  timestamp: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  hindiText?: string;
  imageUrl?: string;
  audioUrl?: string;
  timestamp: string;
  suggestedQuestions?: string[];
  structuredCard?: {
    type: 'disease' | 'weather' | 'price' | 'fertilizer';
    data: any;
  };
}
