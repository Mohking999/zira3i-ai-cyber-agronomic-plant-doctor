import React, { useState } from 'react';
import { 
  Terminal, 
  Smartphone, 
  Server, 
  Code, 
  Layers, 
  ShieldCheck, 
  Copy, 
  Check, 
  Download,
  Cpu,
  Globe
} from 'lucide-react';
import { Language, ThemeMode } from '../types';

interface TechArchitectureModalProps {
  lang: Language;
  theme: ThemeMode;
}

export const TechArchitectureModal: React.FC<TechArchitectureModalProps> = ({
  lang,
  theme,
}) => {
  const isDark = theme === 'dark';
  const [activeCodeTab, setActiveCodeTab] = useState<'manifest' | 'compose' | 'fastapi' | 'docker'>('manifest');
  const [copied, setCopied] = useState<boolean>(false);

  const codeSnippets = {
    manifest: `<!-- AndroidManifest.xml (API 24 to 36) -->
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="dz.zira3i.ai">

    <!-- Zero Storage Permissions: Android Photo Picker (PickVisualMedia) complies with zero storage permission requirements -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />

    <application
        android:name=".Zira3iApp"
        android:label="@string/app_name"
        android:icon="@mipmap/ic_launcher"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:theme="@style/Theme.Zira3iAI">

        <activity
            android:name=".presentation.MainActivity"
            android:exported="true"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`,

    compose: `// Jetpack Compose M3 Screen - DiagnosisScreen.kt
@Composable
fun DiagnosisScreen(
    viewModel: DiagnosisViewModel = hiltViewModel(),
    weatherTelemetry: WeatherTelemetry
) {
    val uiState by viewModel.uiState.collectAsState()
    val speechRecognizer = rememberSpeechRecognizer(locale = Locale("ar", "DZ"))
    val photoPickerLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.PickVisualMedia()
    ) { uri -> viewModel.onLeafImageSelected(uri) }

    Scaffold(
        topBar = { Zira3iGlassmorphicTopBar(title = stringResource(R.string.diagnosis_title)) },
        floatingActionButton = {
            VoiceDictationFab(
                isListening = uiState.isRecording,
                onClick = { speechRecognizer.toggle() }
            )
        }
    ) { padding ->
        Column(modifier = Modifier.padding(padding).verticalScroll(rememberScrollState())) {
            LaserScanLeafCard(
                imageUri = uiState.imageUri,
                isScanning = uiState.isLoading
            )
            uiState.diagnosisReport?.let { report ->
                DiagnosisReportCard(report = report, phiDays = report.phiDarDays)
            }
        }
    }
}`,

    fastapi: `# FastAPI + Gemini 3.8 + Open-Meteo Microservice Architecture (main.py)
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import google.genai as genai
import httpx
import os

app = FastAPI(title="Zira3i AI Agronomic Engine", version="1.0.0")
ai = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

class DiagnosisRequest(BaseModel):
    image_base64: str
    symptoms: str
    farm_lat: float = 36.2642
    farm_lon: float = 1.9683

@app.post("/api/v1/diagnose")
async def diagnose_crop(req: DiagnosisRequest):
    # Fetch real-time Open-Meteo FAO-56 ET0
    async with httpx.AsyncClient() as client:
        res = await client.get(
            f"https://api.open-meteo.com/v1/forecast?latitude={req.farm_lat}&longitude={req.farm_lon}&current=temperature_2m,relative_humidity_2m&daily=et0_fao_evapotranspiration"
        )
        weather = res.json()

    # Multimodal analysis with Gemini 3.8 Flash
    prompt = f"Diagnose crop pathology with farm weather: {weather}"
    response = ai.models.generate_content(
        model="gemini-3.8-flash",
        contents=[{"inline_data": {"mime_type": "image/jpeg", "data": req.image_base64}}, prompt]
    )
    return {"status": "success", "diagnosis": response.text}`,

    docker: `# Dockerfile for FastAPI + Uvicorn Production Microservice
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

# docker-compose.yml
version: '3.8'
services:
  zira3i-api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - GEMINI_API_KEY=\${GEMINI_API_KEY}
    restart: always`,
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeSnippets[activeCodeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="border-b pb-4 border-emerald-500/20">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-emerald-400" />
          <h2 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Zira3i AI — Complete Technical & Product Specification
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Full technical blueprint covering Android 100% Kotlin (M3), Gemini 3.8 Multimodal Vision, and Microservice Architecture.
        </p>
      </div>

      {/* Tech Stack Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className={`p-4 rounded-xl border ${
          isDark ? 'bg-[#142420]/80 border-emerald-500/30' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase font-mono mb-2">
            <Smartphone className="w-4 h-4" />
            <span>Mobile Platform</span>
          </div>
          <p className="font-bold text-sm text-white">Android 7.0 (API 24) to Android 15/16 (API 36)</p>
          <p className="text-xs text-zinc-400 mt-1">Kotlin 100% • Jetpack Compose M3 • Coil Image Loader</p>
        </div>

        <div className={`p-4 rounded-xl border ${
          isDark ? 'bg-[#142420]/80 border-cyan-500/30' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase font-mono mb-2">
            <Cpu className="w-4 h-4" />
            <span>AI Pathology Engine</span>
          </div>
          <p className="font-bold text-sm text-white">Google Gemini 3.8 Multimodal Vision</p>
          <p className="text-xs text-zinc-400 mt-1">Zero mock data • Histological lesion inspection • PHI calculation</p>
        </div>

        <div className={`p-4 rounded-xl border ${
          isDark ? 'bg-[#142420]/80 border-amber-500/30' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase font-mono mb-2">
            <Globe className="w-4 h-4" />
            <span>Meteorology & GPS</span>
          </div>
          <p className="font-bold text-sm text-white">Open-Meteo REST API & FusedLocation</p>
          <p className="text-xs text-zinc-400 mt-1">FAO-56 Penman-Monteith ET₀ • Spraying safety index</p>
        </div>

        <div className={`p-4 rounded-xl border ${
          isDark ? 'bg-[#142420]/80 border-teal-500/30' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-2 text-teal-400 font-bold text-xs uppercase font-mono mb-2">
            <Server className="w-4 h-4" />
            <span>Full-Stack Architecture</span>
          </div>
          <p className="font-bold text-sm text-white">Express + Node 22 / FastAPI Microservice</p>
          <p className="text-xs text-zinc-400 mt-1">Clean Architecture / MVVM • Containerized with Docker</p>
        </div>

      </div>

      {/* Permissions & Zero Storage Security Breakdown */}
      <div className={`p-5 rounded-2xl border ${
        isDark ? 'bg-[#101d19]/80 border-emerald-500/30' : 'bg-white border-slate-200 shadow-md'
      }`}>
        <h3 className={`text-base font-black mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>Device Permissions & Hardware Integration Compliance</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-black/30 border border-emerald-500/20">
            <span className="font-mono font-bold text-emerald-400">RECORD_AUDIO :</span>
            <p className="text-zinc-300 mt-0.5">Enables voice speech-to-text symptom dictation in Algerian Arabic (ar-DZ), French (fr-FR), and English (en-US).</p>
          </div>
          <div className="p-3 rounded-xl bg-black/30 border border-emerald-500/20">
            <span className="font-mono font-bold text-cyan-400">ACCESS_FINE_LOCATION :</span>
            <p className="text-zinc-300 mt-0.5">Pinpoints exact field coordinates to compute real-time FAO-56 Penman-Monteith ET₀ and wind safety thresholds.</p>
          </div>
          <div className="p-3 rounded-xl bg-black/30 border border-emerald-500/20">
            <span className="font-mono font-bold text-amber-400">INTERNET & ACCESS_NETWORK_STATE :</span>
            <p className="text-zinc-300 mt-0.5">Synchronizes with Gemini Multimodal Vision API, Sentinel-2B optical satellites, and Open-Meteo feeds.</p>
          </div>
          <div className="p-3 rounded-xl bg-black/30 border border-emerald-500/20">
            <span className="font-mono font-bold text-emerald-300">ZERO STORAGE PERMISSIONS (Privacy First) :</span>
            <p className="text-zinc-300 mt-0.5">Uses standard Android Photo Picker (PickVisualMedia) ensuring 100% privacy without broad external storage access.</p>
          </div>
        </div>
      </div>

      {/* Code Viewer: Manifest, Compose, FastAPI, Docker */}
      <div className={`rounded-2xl border overflow-hidden ${
        isDark ? 'bg-[#0c1412] border-emerald-500/30' : 'bg-slate-900 text-white border-slate-800'
      }`}>
        <div className="p-3 bg-black/60 border-b border-emerald-500/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveCodeTab('manifest')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                activeCodeTab === 'manifest'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              AndroidManifest.xml
            </button>
            <button
              onClick={() => setActiveCodeTab('compose')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                activeCodeTab === 'compose'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Jetpack Compose M3
            </button>
            <button
              onClick={() => setActiveCodeTab('fastapi')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                activeCodeTab === 'fastapi'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              FastAPI + Gemini
            </button>
            <button
              onClick={() => setActiveCodeTab('docker')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                activeCodeTab === 'docker'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Dockerfile & Compose
            </button>
          </div>

          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono hover:bg-emerald-500/20 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>

        <pre className="p-4 sm:p-6 text-xs font-mono overflow-x-auto text-emerald-300 leading-relaxed max-h-[460px] scrollbar-thin">
          <code>{codeSnippets[activeCodeTab]}</code>
        </pre>
      </div>

    </div>
  );
};
