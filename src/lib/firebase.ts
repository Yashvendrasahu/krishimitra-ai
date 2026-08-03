import { initializeApp, getApps, getApp, setLogLevel } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { Farm, DiseaseAnalysis, ChatMessage, FarmerProfile } from "../types";
import firebaseConfig from "../../firebase-applet-config.json";

// Silence transient connection logs
setLogLevel("error");

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore & Auth
export const db = getFirestore(
  app,
  firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== "(default)"
    ? firebaseConfig.firestoreDatabaseId
    : undefined
);

export const auth = getAuth(app);

export const isFirebaseConfigured = Boolean(firebaseConfig.projectId && firebaseConfig.apiKey);

// Anonymous Auth Sign-in for secure Firestore access
if (isFirebaseConfigured) {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      signInAnonymously(auth).catch((err) => {
        console.warn("Firebase anonymous auth error:", err);
      });
    }
  });
}

// LocalStorage Keys for instant initial load and offline resilience
const KEYS = {
  PROFILE: "krishimitra_profile",
  FARMS: "krishimitra_farms",
  DISEASE_REPORTS: "krishimitra_disease_reports",
  CHAT_HISTORY: "krishimitra_chat_history",
  NOTIFICATIONS: "krishimitra_notifications",
};

// Initial default profile
const DEFAULT_PROFILE: FarmerProfile = {
  id: "f_1001",
  name: "Ramesh Patel",
  phone: "+91 98765 43210",
  state: "Punjab",
  district: "Ludhiana",
  mandiPreference: "Khanna Mandi",
  preferredLanguage: "hi",
};

// Initial default farms
const DEFAULT_FARMS: Farm[] = [
  {
    id: "farm_1",
    name: "Green Acres (गेहूं का खेत)",
    cropName: "Wheat (गेहूं)",
    cropVariety: "Sharbati Lok-1",
    areaAcres: 4.5,
    sowingDate: "2025-11-15",
    soilType: "Alluvial",
    location: {
      lat: 30.901,
      lng: 75.8573,
      placeName: "Ludhiana, Punjab",
    },
    healthStatus: "Needs Attention",
  },
  {
    id: "farm_2",
    name: "Riverview Plot (टमाटर एवं मिर्च)",
    cropName: "Tomato (टमाटर)",
    cropVariety: "Hybrid Sona 2",
    areaAcres: 2.0,
    sowingDate: "2026-02-01",
    soilType: "Clay",
    location: {
      lat: 30.85,
      lng: 75.9,
      placeName: "Samrala, Punjab",
    },
    healthStatus: "Healthy",
  },
];

// Helper to clean undefined values before sending to Firestore
function removeUndefined<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) {
    return obj.map(removeUndefined) as unknown as T;
  }
  const cleanObj: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      cleanObj[key] = typeof value === "object" && value !== null ? removeUndefined(value) : value;
    }
  }
  return cleanObj as T;
}

// High performance Firebase + Local Cache hybrid storage service
export const storageService = {
  // --- Profile ---
  getProfile(): FarmerProfile {
    try {
      const data = localStorage.getItem(KEYS.PROFILE);
      return data ? JSON.parse(data) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  },

  async fetchProfileFromFirebase(): Promise<FarmerProfile | null> {
    if (!isFirebaseConfigured) return null;
    try {
      const docRef = doc(db, "profiles", DEFAULT_PROFILE.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const fetched = docSnap.data() as FarmerProfile;
        this.saveProfile(fetched);
        return fetched;
      }
    } catch (e) {
      console.error("Error fetching profile from Firebase:", e);
    }
    return null;
  },

  saveProfile(profile: FarmerProfile): void {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
    if (isFirebaseConfigured) {
      const docRef = doc(db, "profiles", profile.id || DEFAULT_PROFILE.id);
      setDoc(docRef, removeUndefined(profile), { merge: true }).catch((e) =>
        console.error("Firebase profile save error:", e)
      );
    }
  },

  // --- Farms ---
  getFarms(): Farm[] {
    try {
      const data = localStorage.getItem(KEYS.FARMS);
      return data ? JSON.parse(data) : DEFAULT_FARMS;
    } catch {
      return DEFAULT_FARMS;
    }
  },

  async fetchFarmsFromFirebase(): Promise<Farm[] | null> {
    if (!isFirebaseConfigured) return null;
    try {
      const farmsCol = collection(db, "farms");
      const snapshot = await getDocs(farmsCol);
      if (!snapshot.empty) {
        const farmsList: Farm[] = [];
        snapshot.forEach((doc) => {
          farmsList.push({ id: doc.id, ...doc.data() } as Farm);
        });
        localStorage.setItem(KEYS.FARMS, JSON.stringify(farmsList));
        return farmsList;
      }
    } catch (e) {
      console.error("Error fetching farms from Firebase:", e);
    }
    return null;
  },

  saveFarm(farm: Farm): Farm[] {
    const farms = this.getFarms();
    const existingIndex = farms.findIndex((f) => f.id === farm.id);
    if (existingIndex >= 0) {
      farms[existingIndex] = farm;
    } else {
      farms.unshift(farm);
    }
    localStorage.setItem(KEYS.FARMS, JSON.stringify(farms));

    if (isFirebaseConfigured) {
      const farmDocRef = doc(db, "farms", farm.id);
      setDoc(farmDocRef, removeUndefined(farm), { merge: true }).catch((e) =>
        console.error("Firebase farm save error:", e)
      );
    }
    return farms;
  },

  deleteFarm(id: string): Farm[] {
    const farms = this.getFarms().filter((f) => f.id !== id);
    localStorage.setItem(KEYS.FARMS, JSON.stringify(farms));

    if (isFirebaseConfigured) {
      const farmDocRef = doc(db, "farms", id);
      deleteDoc(farmDocRef).catch((e) => console.error("Firebase farm delete error:", e));
    }
    return farms;
  },

  // --- Disease Reports ---
  getDiseaseReports(): DiseaseAnalysis[] {
    try {
      const data = localStorage.getItem(KEYS.DISEASE_REPORTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async fetchDiseaseReportsFromFirebase(): Promise<DiseaseAnalysis[] | null> {
    if (!isFirebaseConfigured) return null;
    try {
      const reportsCol = collection(db, "diseaseReports");
      const snapshot = await getDocs(reportsCol);
      if (!snapshot.empty) {
        const list: DiseaseAnalysis[] = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as DiseaseAnalysis);
        });
        localStorage.setItem(KEYS.DISEASE_REPORTS, JSON.stringify(list));
        return list;
      }
    } catch (e) {
      console.error("Error fetching disease reports from Firebase:", e);
    }
    return null;
  },

  saveDiseaseReport(report: DiseaseAnalysis): DiseaseAnalysis[] {
    const reports = this.getDiseaseReports();
    reports.unshift(report);
    localStorage.setItem(KEYS.DISEASE_REPORTS, JSON.stringify(reports));

    if (isFirebaseConfigured) {
      const reportRef = doc(db, "diseaseReports", report.id);
      setDoc(reportRef, removeUndefined(report), { merge: true }).catch((e) =>
        console.error("Firebase report save error:", e)
      );
    }
    return reports;
  },

  // --- Chat History ---
  getChatHistory(): ChatMessage[] {
    try {
      const data = localStorage.getItem(KEYS.CHAT_HISTORY);
      if (data) return JSON.parse(data);
    } catch {}

    return [
      {
        id: "msg_init",
        sender: "assistant",
        text: "Namaste! I am your KrishiMitra AI assistant. How can I help your farm today? You can ask in Hindi or English, upload crop leaf photos, or use voice command.",
        hindiText: "नमस्ते! मैं आपका कृषि मित्र AI सहायक हूँ। आज मैं आपकी फसल की सुरक्षा, खाद, मौसम या मंडी भाव में कैसे मदद कर सकता हूँ? आप बोलकर या फोटो भेजकर भी सवाल पूछ सकते हैं।",
        timestamp: "Just now",
        suggestedQuestions: [
          "मेरी गेहूं की फसल में पीले पत्ते आ रहे हैं।",
          "आज आजादपुर मंडी में टमाटर का भाव क्या है?",
          "1 एकड़ में कितना यूरिया और डीएपी डालना चाहिए?",
          "पीएम किसान योजना की अगली किस्त कब आएगी?",
        ],
      },
    ];
  },

  saveChatMessage(msg: ChatMessage): ChatMessage[] {
    const history = this.getChatHistory();
    history.push(msg);
    localStorage.setItem(KEYS.CHAT_HISTORY, JSON.stringify(history));

    if (isFirebaseConfigured) {
      const chatRef = doc(db, "chatHistory", msg.id);
      setDoc(chatRef, removeUndefined(msg), { merge: true }).catch((e) =>
        console.error("Firebase chat message save error:", e)
      );
    }
    return history;
  },

  clearChatHistory(): void {
    localStorage.removeItem(KEYS.CHAT_HISTORY);
  },
};
