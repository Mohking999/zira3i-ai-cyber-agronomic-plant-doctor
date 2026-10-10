import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  Mic, 
  MicOff, 
  Sparkles, 
  AlertCircle, 
  ShieldCheck, 
  Clock, 
  CheckCircle, 
  Leaf, 
  FlaskConical, 
  Printer, 
  Calendar, 
  Activity, 
  HelpCircle,
  X,
  FileImage,
  Thermometer,
  Wind,
  Code2,
  Terminal,
  Database,
  ArrowRight
} from 'lucide-react';
import { Language, ThemeMode, DiagnosisResult, WeatherTelemetry } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { LaserScanLeaf } from './LaserScanLeaf';

interface DiagnosisScreenProps {
  telemetry: WeatherTelemetry | null;
  farmRegionName: string;
  lang: Language;
  theme: ThemeMode;
}

export const DiagnosisScreen: React.FC<DiagnosisScreenProps> = ({
  telemetry,
  farmRegionName,
  lang,
  theme,
}) => {
  const t = TRANSLATIONS[lang];
  const isDark = theme === 'dark';

  // Real user input state - NO DEMO PRELOADS
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState<string>('image/jpeg');
  const [symptomsText, setSymptomsText] = useState<string>('');
  const [cropHint, setCropHint] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const [rawBackendResponse, setRawBackendResponse] = useState<any>(null);
  const [showRawBackendJson, setShowRawBackendJson] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Camera stream state
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Algerian Crop quick chips for fast input
  const algerianCropChips = [
    { labelAr: 'بطاطا Spunta', labelEn: 'Potato (Solanum tuberosum)', value: 'Potato (Solanum tuberosum)' },
    { labelAr: 'طماطم بيوت بلاستيكية', labelEn: 'Greenhouse Tomato', value: 'Tomato (Solanum lycopersicum)' },
    { labelAr: 'أشجار الزيتون', labelEn: 'Olive Orchard', value: 'Olive (Olea europaea)' },
    { labelAr: 'نخيل دقلة نور', labelEn: 'Date Palm (Deglet Nour)', value: 'Date Palm (Phoenix dactylifera)' },
    { labelAr: 'قمح صلب / لين', labelEn: 'Durum Wheat', value: 'Durum Wheat (Triticum durum)' },
    { labelAr: 'حمضيات وبرتقال', labelEn: 'Citrus / Orange', value: 'Citrus (Citrus sinensis)' },
  ];

  // Setup Web Speech API for voice dictation
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = lang === 'ar' ? 'ar-DZ' : lang === 'fr' ? 'fr-FR' : 'en-US';

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        if (currentTranscript) {
          setSymptomsText((prev) => (prev ? `${prev} ${currentTranscript}` : currentTranscript));
        }
      };

      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);

      recognitionRef.current = recognition;
    }
  }, [lang]);

  // Perform AI Multimodal Diagnosis directly against backend /api/diagnose
  const runAiDiagnosis = async () => {
    if (!imagePreview && !symptomsText && !cropHint) {
      setErrorMessage(lang === 'ar' ? 'يرجى التقاط أو رفع صورة للورقة، أو كتابة وصف الأعراض الفلاحية.' : 'Please upload a leaf photo or enter a symptom description.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const weatherPayload = telemetry ? {
        region: farmRegionName,
        temp: telemetry.temperature,
        humidity: telemetry.humidity,
        windSpeed: telemetry.windSpeed,
        et0: telemetry.et0,
        soilMoisture: telemetry.soilMoisture,
        sprayingSafe: telemetry.sprayingSafety.status === 'optimal',
      } : { region: farmRegionName };

      const response = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imagePreview,
          mimeType: imageMime,
          symptoms: symptomsText,
          cropHint: cropHint,
          weatherContext: weatherPayload,
        }),
      });

      const data = await response.json();
      setRawBackendResponse(data);

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Diagnostic evaluation failed on backend.');
      }

      setDiagnosisResult(data.diagnosis);
    } catch (err: any) {
      console.error('Diagnosis failed:', err);
      setErrorMessage(err.message || 'Error occurred during AI plant diagnosis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Voice recording toggle
  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert(t.speechNotSupported);
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.lang = lang === 'ar' ? 'ar-DZ' : lang === 'fr' ? 'fr-FR' : 'en-US';
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        setIsRecording(false);
      }
    }
  };

  // Camera start / stop / capture
  const startCamera = async () => {
    try {
      setErrorMessage(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err) {
      console.warn('Camera access denied:', err);
      setErrorMessage('Could not access camera. Please check permissions or upload a file.');
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setImagePreview(dataUrl);
      setImageMime('image/jpeg');
    }
    stopCamera();
  };

  // File upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageMime(file.type || 'image/jpeg');
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 border-emerald-500/20">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
            <Database className="w-3.5 h-3.5" />
            <span>Backend Endpoint: POST /api/diagnose</span>
            <span className="text-zinc-600">·</span>
            <span className="text-emerald-400">Live AI Plant Doctor</span>
          </div>
          <h2 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {lang === 'ar' ? 'فحص وتشخيص أمراض النباتات بالذكاء الاصطناعي' : 'Multimodal AI Plant Pathology Doctor'}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            {lang === 'ar' 
              ? 'يتم إرسال العينات مباشرة إلى الباك إند لتحليل الأنسجة، مطابقة الأوبئة، وتحديد بروتوكول العلاج البيولوجي والكيميائي' 
              : 'Directly sends plant tissue data to the backend AI engine for diagnosis, pathology cross-referencing, and treatment planning.'}
          </p>
        </div>

        {/* Real-time Field Weather Sync Indicator */}
        <div className={`px-3.5 py-2 rounded-xl border flex items-center gap-2.5 text-xs font-mono ${
          isDark ? 'bg-[#101d19] border-emerald-500/30 text-zinc-300' : 'bg-white border-slate-200 text-slate-700 shadow-sm'
        }`}>
          <div className="flex items-center gap-1.5 text-amber-400">
            <Thermometer className="w-3.5 h-3.5" />
            <span>{telemetry?.temperature?.toFixed(1) ?? '24.5'}°C</span>
          </div>
          <span className="text-zinc-600" aria-hidden="true">·</span>
          <div className="flex items-center gap-1.5 text-cyan-400">
            <Wind className="w-3.5 h-3.5" />
            <span>{telemetry?.humidity ?? 58}% RH</span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        
        {/* Left Column: Specimen Input, Laser Scanner, Voice Dictation */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Laser Scanner Specimen Box */}
          <div className={`p-4 sm:p-5 rounded-2xl border ${
            isDark ? 'bg-[#101d19]/80 border-emerald-500/30' : 'bg-white border-slate-200 shadow-md'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Optical Leaf Inspection
              </span>

              {imagePreview && (
                <button
                  onClick={() => setImagePreview(null)}
                  className="text-xs text-zinc-400 hover:text-rose-400 transition-colors"
                >
                  Clear Photo
                </button>
              )}
            </div>

            {/* Active Webcam Preview Modal or Video Element */}
            {isCameraActive ? (
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-black border-2 border-emerald-400 flex flex-col justify-between p-3">
                <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />
                <div className="relative z-10 flex justify-between">
                  <span className="bg-black/75 px-2 py-1 rounded text-xs text-emerald-300 font-mono">
                    LIVE CAMERA FEED
                  </span>
                  <button onClick={stopCamera} className="p-1 rounded-full bg-black/75 text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="relative z-10 flex justify-center pb-2">
                  <button
                    onClick={capturePhoto}
                    className="px-6 py-2.5 rounded-full bg-emerald-500 text-slate-950 font-black text-xs shadow-lg hover:scale-105 transition-transform"
                  >
                    CAPTURE & ANALYZE
                  </button>
                </div>
              </div>
            ) : imagePreview ? (
              <LaserScanLeaf
                imageSrc={imagePreview}
                isScanning={isAnalyzing}
                statusText={isAnalyzing ? t.analyzingTissue : undefined}
              />
            ) : (
              <div className="w-full aspect-square rounded-2xl border-2 border-dashed border-emerald-500/30 flex flex-col items-center justify-center p-6 text-center bg-black/20">
                <FileImage className="w-12 h-12 text-emerald-500/40 mb-3" />
                <p className="text-xs text-zinc-400 max-w-xs">
                  {lang === 'ar' ? 'قم بالتقاط صورة لورقة النبات المصابة أو رفع صورة من جهازك' : 'Capture or upload a clear photo of the infected leaf or lesion'}
                </p>
              </div>
            )}

            {/* Image Action Buttons */}
            <div className="grid grid-cols-2 gap-2.5 mt-4">
              <button
                type="button"
                onClick={startCamera}
                className="py-2.5 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Camera className="w-4 h-4 text-emerald-400" />
                <span>{t.takePhoto}</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  isDark 
                    ? 'bg-[#142420] border-emerald-500/30 text-zinc-200 hover:bg-emerald-950/40' 
                    : 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
                }`}
              >
                <Upload className="w-4 h-4 text-cyan-400" />
                <span>{t.uploadPhoto}</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Crop Selector Chips */}
          <div className={`p-4 rounded-2xl border ${
            isDark ? 'bg-[#101d19]/80 border-emerald-500/30' : 'bg-white border-slate-200 shadow-md'
          }`}>
            <label className="text-xs font-bold text-emerald-400 mb-2 block">
              {lang === 'ar' ? 'تحديد نوع المحصول:' : 'Target Crop:'}
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {algerianCropChips.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCropHint(chip.value)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                    cropHint === chip.value
                      ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold'
                      : isDark
                        ? 'bg-[#142621] border-emerald-500/20 text-zinc-300 hover:border-emerald-500/40'
                        : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {lang === 'ar' ? chip.labelAr : chip.labelEn}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={cropHint}
              onChange={(e) => setCropHint(e.target.value)}
              placeholder={lang === 'ar' ? 'أو اكتب اسم المحصول هنا...' : 'Or enter custom crop name...'}
              className={`w-full p-2.5 rounded-xl text-xs font-sans border transition-all ${
                isDark
                  ? 'bg-black/40 border-emerald-500/20 text-zinc-100 focus:border-emerald-400 focus:outline-none'
                  : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-600 focus:outline-none'
              }`}
            />
          </div>

          {/* Multilingual Voice Dictation & Symptom Description */}
          <div className={`p-4 rounded-2xl border ${
            isDark ? 'bg-[#101d19]/80 border-emerald-500/30' : 'bg-white border-slate-200 shadow-md'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <span>{t.voiceInputTitle} :</span>
              </label>

              <button
                type="button"
                onClick={toggleRecording}
                className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  isRecording
                    ? 'bg-rose-500 text-white animate-pulse'
                    : isDark
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                      : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                }`}
              >
                {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                <span>{isRecording ? t.listening : (lang === 'ar' ? 'إملاء صوتي' : 'Voice Dictate')}</span>
              </button>
            </div>

            <textarea
              rows={3}
              value={symptomsText}
              onChange={(e) => setSymptomsText(e.target.value)}
              placeholder={lang === 'ar' ? 'صف أعراض الإصابة، لون التبقعات، الذبول، ظهور الحشرات أو توقيت ظهورها...' : 'Describe lesions, color, leaf curling, wilting, pest symptoms...'}
              className={`w-full p-3 rounded-xl text-xs sm:text-sm font-sans border transition-all resize-none ${
                isDark
                  ? 'bg-black/40 border-emerald-500/20 text-zinc-100 focus:border-emerald-400 focus:outline-none'
                  : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-600 focus:outline-none'
              }`}
            />
          </div>

          {/* Primary Action Button: Send to Backend Diagnosis */}
          <button
            onClick={runAiDiagnosis}
            disabled={isAnalyzing}
            className={`w-full py-4 rounded-2xl font-black text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
              isAnalyzing
                ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 text-slate-950 hover:opacity-95 shadow-[0_0_30px_rgba(0,230,118,0.35)] hover:scale-[1.01]'
            }`}
          >
            <Sparkles className={`w-5 h-5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? t.analyzingTissue : (lang === 'ar' ? 'إرسال للباك إند للتشخيص المباشر' : 'SEND TO BACKEND AI DIAGNOSIS')}</span>
          </button>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

        </div>

        {/* Right Column: Complete Diagnosis Report from Backend */}
        <div className="lg:col-span-7">
          {isAnalyzing ? (
            /* Loading State */
            <div className={`h-full min-h-[420px] rounded-2xl border p-8 flex flex-col items-center justify-center text-center ${
              isDark ? 'bg-[#101d19]/40 border-emerald-500/20' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4 animate-spin">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {t.analyzingTissue}
              </h3>
              <p className="text-xs text-zinc-400 mt-2 font-mono">
                Calling POST /api/diagnose · Multimodal Gemini Engine
              </p>
            </div>
          ) : diagnosisResult ? (
            <div 
              id="diagnosis-report"
              className={`p-5 sm:p-7 rounded-2xl border space-y-6 transition-all ${
                isDark 
                  ? 'bg-[#101d19]/90 border-emerald-500/40 shadow-[0_0_40px_rgba(0,230,118,0.08)]' 
                  : 'bg-white border-slate-200 shadow-xl'
              }`}
            >
              
              {/* Report Header: Identification & Confidence Score */}
              <div className="border-b pb-5 border-emerald-500/20">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    Verified Backend Diagnosis (POST /api/diagnose)
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowRawBackendJson(!showRawBackendJson)}
                      className={`px-3 py-1 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 ${
                        showRawBackendJson
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                      }`}
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>{showRawBackendJson ? 'إخفاء JSON' : 'استجابة الباك إند الخام (JSON)'}</span>
                    </button>

                    <button
                      onClick={handlePrint}
                      className="px-3 py-1 rounded-lg border border-emerald-500/30 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 flex items-center gap-1.5 transition-all"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>{t.exportReport}</span>
                    </button>
                  </div>
                </div>

                {/* Raw Backend JSON Inspector */}
                {showRawBackendJson && rawBackendResponse && (
                  <div className="mb-4 p-3 rounded-xl bg-black/80 border border-emerald-500/30 font-mono text-[11px] text-emerald-300 overflow-x-auto max-h-60 scrollbar-thin">
                    <div className="text-zinc-500 text-[10px] mb-1">Response from server.ts (Status 200 OK):</div>
                    <pre>{JSON.stringify(rawBackendResponse, null, 2)}</pre>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <div>
                    <h3 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {lang === 'ar' 
                        ? diagnosisResult.diseaseCommonName.ar 
                        : lang === 'fr' 
                          ? diagnosisResult.diseaseCommonName.fr 
                          : diagnosisResult.diseaseCommonName.en}
                    </h3>
                    <p className="text-sm font-mono text-emerald-400 italic mt-0.5">
                      {diagnosisResult.pathogenTaxonomy}
                    </p>
                    <p className="text-xs text-zinc-400 mt-1">
                      Host Crop: {diagnosisResult.cropBotanicalName} ({lang === 'ar' ? diagnosisResult.cropCommonName.ar : diagnosisResult.cropCommonName.en})
                    </p>
                  </div>

                  {/* Confidence Badge & Severity */}
                  <div className="flex items-center gap-2.5 self-start sm:self-auto">
                    <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-center font-mono">
                      <span className="text-[10px] block opacity-80 uppercase">{t.confidenceScore}</span>
                      <span className="text-lg font-black">{diagnosisResult.confidence}%</span>
                    </div>

                    <div className={`px-3 py-1.5 rounded-xl text-center font-mono border ${
                      diagnosisResult.severity === 'critical'
                        ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                        : diagnosisResult.severity === 'high'
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                          : 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                    }`}>
                      <span className="text-[10px] block opacity-80 uppercase">{t.severityBadge}</span>
                      <span className="text-sm font-black uppercase">{diagnosisResult.severity}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pre-Harvest Interval (PHI / DAR) Hero Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-amber-500/15 border border-amber-500/40 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    <Clock className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-amber-300">
                      {t.phiDarTitle} : {diagnosisResult.phiDarDays} {t.phiDaysBadge}
                    </h4>
                    <p className="text-xs text-zinc-300 mt-0.5">
                      Mandatory statutory waiting interval between spraying and human consumption.
                    </p>
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-black text-amber-400">
                  {diagnosisResult.phiDarDays}d
                </div>
              </div>

              {/* Lesion Histology & Micro-Climate Correlation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Lesion Analysis */}
                <div className={`p-4 rounded-xl border ${
                  isDark ? 'bg-[#142420]/80 border-emerald-500/20' : 'bg-slate-50 border-slate-200'
                }`}>
                  <h4 className="text-xs font-bold text-emerald-400 mb-2 flex items-center gap-1.5 uppercase font-mono">
                    <Activity className="w-3.5 h-3.5" />
                    <span>{t.lesionAnalysisTitle}</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    {lang === 'ar' 
                      ? diagnosisResult.leafLesionAnalysis.ar 
                      : lang === 'fr' 
                        ? diagnosisResult.leafLesionAnalysis.fr 
                        : diagnosisResult.leafLesionAnalysis.en}
                  </p>
                </div>

                {/* Weather Correlation */}
                <div className={`p-4 rounded-xl border ${
                  isDark ? 'bg-[#142420]/80 border-cyan-500/20' : 'bg-slate-50 border-slate-200'
                }`}>
                  <h4 className="text-xs font-bold text-cyan-400 mb-2 flex items-center gap-1.5 uppercase font-mono">
                    <Thermometer className="w-3.5 h-3.5" />
                    <span>{t.meteoImpactTitle}</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    {lang === 'ar' 
                      ? diagnosisResult.meteorologicalCorrelation.ar 
                      : lang === 'fr' 
                        ? diagnosisResult.meteorologicalCorrelation.fr 
                        : diagnosisResult.meteorologicalCorrelation.en}
                  </p>
                </div>

              </div>

              {/* Dual Treatment Protocol: Biological vs Chemical */}
              <div>
                <h4 className="text-sm font-black text-white mb-3 flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-emerald-400" />
                  <span>{t.dualProtocolTitle}</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Biological & Organic Control */}
                  <div className={`p-4 rounded-xl border flex flex-col justify-between ${
                    isDark ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-emerald-50/70 border-emerald-200'
                  }`}>
                    <div>
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase font-mono mb-2">
                        <Leaf className="w-4 h-4" />
                        <span>{t.biologicalControl}</span>
                      </div>
                      <p className="text-xs text-zinc-300 mb-3 leading-relaxed">
                        {lang === 'ar' 
                          ? diagnosisResult.biologicalControl.summaryAr 
                          : lang === 'fr' 
                            ? diagnosisResult.biologicalControl.summaryFr 
                            : diagnosisResult.biologicalControl.summaryEn}
                      </p>
                      <ul className="space-y-1.5 text-xs text-emerald-200">
                        {diagnosisResult.biologicalControl.methods.map((method, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{method}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Targeted Chemical Treatment */}
                  <div className={`p-4 rounded-xl border flex flex-col justify-between ${
                    isDark ? 'bg-cyan-950/20 border-cyan-500/30' : 'bg-cyan-50/70 border-cyan-200'
                  }`}>
                    <div>
                      <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase font-mono mb-2">
                        <FlaskConical className="w-4 h-4" />
                        <span>{t.chemicalControl}</span>
                      </div>
                      
                      {/* Active Ingredients Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {diagnosisResult.chemicalControl.activeIngredients.map((ai, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            {ai}
                          </span>
                        ))}
                      </div>

                      <div className="text-xs font-mono text-zinc-300 mb-2">
                        <span className="font-bold text-cyan-400">Dosage: </span>
                        {diagnosisResult.chemicalControl.dosage}
                      </div>

                      <p className="text-xs text-zinc-300 leading-relaxed">
                        {lang === 'ar' 
                          ? diagnosisResult.chemicalControl.instructionsAr 
                          : lang === 'fr' 
                            ? diagnosisResult.chemicalControl.instructionsFr 
                            : diagnosisResult.chemicalControl.instructionsEn}
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Alternative Differential Hypotheses */}
              <div className={`p-4 rounded-xl border ${
                isDark ? 'bg-[#142420]/60 border-emerald-500/20' : 'bg-slate-50 border-slate-200'
              }`}>
                <h4 className="text-xs font-bold text-zinc-300 mb-2 flex items-center gap-1.5 uppercase font-mono">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.differentialHypothesesTitle}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {diagnosisResult.differentialHypotheses.map((hyp, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-black/30 border border-zinc-800 text-xs">
                      <div className="flex justify-between font-bold text-zinc-200 mb-1">
                        <span>{lang === 'ar' ? hyp.nameAr : hyp.nameEn}</span>
                        <span className="font-mono text-amber-400">{hyp.probability}%</span>
                      </div>
                      <p className="text-[11px] text-zinc-400">
                        {hyp.distinguishingFactor}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 7-Day Field Recovery Roadmap */}
              <div>
                <h4 className="text-xs font-bold text-emerald-400 mb-3 flex items-center gap-1.5 uppercase font-mono">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{t.roadmap7Days}</span>
                </h4>
                <div className="space-y-2">
                  {diagnosisResult.actionRoadmap7Days.map((item, idx) => (
                    <div 
                      key={idx} 
                      className={`p-3 rounded-xl border flex items-center gap-3 text-xs ${
                        isDark ? 'bg-[#142420]/50 border-emerald-500/20 text-zinc-200' : 'bg-white border-slate-200 text-slate-800'
                      }`}
                    >
                      <span className="font-mono font-black text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 shrink-0">
                        {item.day}
                      </span>
                      <span>
                        {lang === 'ar' ? item.actionAr : lang === 'fr' ? item.actionFr : item.actionEn}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            /* Clean Ready State: Waiting for real input */
            <div className={`h-full min-h-[440px] rounded-2xl border p-8 flex flex-col items-center justify-center text-center ${
              isDark ? 'bg-[#101d19]/40 border-emerald-500/20' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
                <Terminal className="w-8 h-8" />
              </div>
              <h3 className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {lang === 'ar' ? 'في انتظار إدخال العينة للفحص المباشر' : 'Ready for Field Sample Diagnosis'}
              </h3>
              <p className="text-xs text-zinc-400 max-w-sm mt-2 leading-relaxed">
                {lang === 'ar'
                  ? 'تم إزالة البيانات التجريبية. قم برفع صورة لورقة نبات مصابة أو إدخال وصف الأعراض واضغط على "إرسال للباك إند للتشخيص المباشر" لاستلام التقرير الحقيقي من السيرفر.'
                  : 'Demo data removed. Upload a leaf image or enter crop symptoms and click "Send to Backend AI Diagnosis" to receive live evaluation from the server.'}
              </p>
              <div className="mt-4 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-black/30 text-emerald-400 text-xs font-mono">
                API Endpoint: POST /api/diagnose
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
