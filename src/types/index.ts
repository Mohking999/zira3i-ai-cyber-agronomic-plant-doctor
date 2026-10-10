export type Language = 'ar' | 'fr' | 'en';
export type ThemeMode = 'dark' | 'light';

export interface WeatherTelemetry {
  temperature: number;
  tempMax: number;
  tempMin: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  weatherCode: number;
  precipitation: number;
  et0: number; // mm/day (FAO-56)
  soilMoisture: number; // %
  solarRadiation: number; // W/m2
  sprayingSafety: {
    status: 'optimal' | 'caution' | 'dangerous';
    windSpeed: number;
    threshold: number;
    reasonEn: string;
    reasonAr: string;
    reasonFr: string;
  };
  sentinelSync: {
    connected: boolean;
    satellite: string;
    resolution: string;
    lastPass: string;
    ndviIndex: number;
  };
}

export interface RegionPreset {
  id: string;
  nameEn: string;
  nameAr: string;
  nameFr: string;
  lat: number;
  lon: number;
  crops: string[];
  climate: string;
}

export interface DiagnosisResult {
  cropBotanicalName: string;
  cropCommonName: {
    ar: string;
    fr: string;
    en: string;
  };
  diseaseCommonName: {
    ar: string;
    fr: string;
    en: string;
  };
  pathogenTaxonomy: string;
  confidence: number;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  leafLesionAnalysis: {
    ar: string;
    fr: string;
    en: string;
  };
  meteorologicalCorrelation: {
    ar: string;
    fr: string;
    en: string;
  };
  differentialHypotheses: Array<{
    nameAr: string;
    nameFr: string;
    nameEn: string;
    probability: number;
    distinguishingFactor: string;
  }>;
  biologicalControl: {
    summaryAr: string;
    summaryFr: string;
    summaryEn: string;
    methods: string[];
  };
  chemicalControl: {
    activeIngredients: string[];
    dosage: string;
    instructionsAr: string;
    instructionsFr: string;
    instructionsEn: string;
  };
  phiDarDays: number;
  actionRoadmap7Days: Array<{
    day: string;
    actionAr: string;
    actionFr: string;
    actionEn: string;
  }>;
}

export interface CropProfile {
  id: string;
  nameKey: string;
  botanical: string;
  kcInit: number;
  kcMid: number;
  kcEnd: number;
  rootDepthMin: number;
  rootDepthMax: number;
  criticalStages: {
    en: string;
    ar: string;
    fr: string;
  };
  droughtTips: {
    en: string[];
    ar: string[];
    fr: string[];
  };
}

export interface PhiRecord {
  id: string;
  activeIngredient: string;
  tradeNames: string;
  category: 'Fungicide' | 'Insecticide' | 'Acaricide' | 'Herbicide';
  crops: string[];
  targetPests: string;
  phiDays: number; // Pre-Harvest Interval / DAR in days
  maxTreatmentsPerSeason: number;
  protectiveEquipment: string;
  inpvStatus: 'Authorized' | 'Restricted' | 'Prohibited';
}

export interface StrategicCropRadar {
  id: string;
  name: {
    ar: string;
    fr: string;
    en: string;
  };
  region: {
    ar: string;
    fr: string;
    en: string;
  };
  healthScore: number; // 0 - 100
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  topThreat: {
    ar: string;
    fr: string;
    en: string;
  };
  pathogen: string;
  alertNote: {
    ar: string;
    fr: string;
    en: string;
  };
}
