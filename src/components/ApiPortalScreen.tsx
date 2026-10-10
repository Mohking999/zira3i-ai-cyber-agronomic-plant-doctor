import React, { useState, useEffect } from 'react';
import { 
  Network, 
  Send, 
  Copy, 
  Check, 
  Activity, 
  Terminal, 
  Cpu, 
  Radio, 
  Code2, 
  Key, 
  ShieldCheck, 
  RefreshCw, 
  ExternalLink,
  ChevronRight,
  Database,
  CloudLightning,
  Sparkles,
  Wifi,
  HardDrive,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Language, ThemeMode } from '../types';

interface ApiPortalScreenProps {
  lang: Language;
  theme: ThemeMode;
}

export const ApiPortalScreen: React.FC<ApiPortalScreenProps> = ({
  lang,
  theme,
}) => {
  const isDark = theme === 'dark';

  // Active code snippet tab
  const [selectedLanguage, setSelectedLanguage] = useState<'curl' | 'python' | 'javascript' | 'arduino'>('curl');
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('/api/iot/telemetry');
  const [copiedCode, setCopiedCode] = useState(false);

  // Live test runner state
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [testLatency, setTestLatency] = useState<number | null>(null);

  // IoT Sensor simulator
  const [iotSensorId, setIotSensorId] = useState('ESP32-CHELIF-01');
  const [iotSoilMoisture, setIotSoilMoisture] = useState(38.5);
  const [iotSoilTemp, setIotSoilTemp] = useState(21.4);
  const [iotBattery, setIotBattery] = useState(4.05);

  // Ingested IoT logs
  const [iotLogs, setIotLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Custom API key & webhook state
  const [customKey, setCustomKey] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [savedSettings, setSavedSettings] = useState(false);

  // Fetch latest IoT telemetry logs from server
  const fetchIoTLogs = async () => {
    setLoadingLogs(true);
    try {
      const res = await fetch('/api/iot/telemetry/latest');
      const data = await res.json();
      if (data.success && data.records) {
        setIotLogs(data.records);
      }
    } catch (err) {
      console.warn('Error fetching IoT logs:', err);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchIoTLogs();
  }, []);

  // System API Endpoints List
  const endpoints = [
    {
      path: '/api/iot/telemetry',
      method: 'POST',
      title: lang === 'ar' ? 'بوابة مستشعرات الحقول (IoT Webhook)' : 'Field IoT Webhook Port',
      desc: lang === 'ar' ? 'استقبال قراءات الرطوبة والحرارة من شرائح ESP32 وLoRaWAN مباشرة' : 'Ingest soil moisture, temperature, and battery voltage from field probes',
      icon: Radio,
      badge: 'IoT Ingest',
      color: 'emerald',
    },
    {
      path: '/api/weather',
      method: 'GET',
      title: lang === 'ar' ? 'بيانات الطقس والنتح FAO-56' : 'Agro-Weather & ET₀ Telemetry',
      desc: lang === 'ar' ? 'استعلام مباشر عن الحرارة، الرطوبة، سرعة الرياح وحساب النتح التبخري بالـ GPS' : 'Query micro-climate, wind drift risk, and FAO-56 Penman-Monteith ET₀',
      icon: CloudLightning,
      badge: 'REST GET',
      color: 'cyan',
    },
    {
      path: '/api/diagnose',
      method: 'POST',
      title: lang === 'ar' ? 'محرك فحص وتشخيص الأمراض' : 'AI Plant Doctor Vision Port',
      desc: lang === 'ar' ? 'تحليل صور الأوراق بأحدث نماذج الذكاء الاصطناعي وتقديم بروتوكول العلاج' : 'Multimodal leaf histology scan with dual biological/chemical remedies',
      icon: Sparkles,
      badge: 'Multimodal AI',
      color: 'purple',
    },
    {
      path: '/api/chat',
      method: 'POST',
      title: lang === 'ar' ? 'المستشار الفلاحي Dr. Zira3i' : 'Virtual Agronomist Chat Port',
      desc: lang === 'ar' ? 'استشارات فلاحية فورية تفاعلية باللغة العربية والدارجة الجزائرية والفرنسية' : 'Real-time conversational agronomist with regional Algerian farming knowledge',
      icon: Cpu,
      badge: 'LLM Agent',
      color: 'amber',
    },
    {
      path: '/api/download/apk/info',
      method: 'GET',
      title: lang === 'ar' ? 'بيانات حزمة تطبيق الأندرويد' : 'Android APK Package Manifest',
      desc: lang === 'ar' ? 'التحقق من بصمة SHA-256، الإصدار، وحجم ملف التثبيت المباشر' : 'Get APK package hashes, version code, and universal build metadata',
      icon: HardDrive,
      badge: 'Distribution',
      color: 'teal',
    },
  ];

  // Test an endpoint live
  const handleTestEndpoint = async () => {
    setIsTesting(true);
    setTestStatus('idle');
    const startTime = performance.now();

    try {
      let res;
      if (selectedEndpoint === '/api/iot/telemetry') {
        res = await fetch('/api/iot/telemetry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sensorId: iotSensorId,
            wilaya: 'Ain Defla - Chelif Basin',
            crop: 'Spunta Potato',
            soilMoisture: iotSoilMoisture,
            soilTemp: iotSoilTemp,
            batteryVoltage: iotBattery,
            timestamp: new Date().toISOString(),
          }),
        });
      } else if (selectedEndpoint === '/api/weather') {
        res = await fetch('/api/weather?lat=36.2642&lon=1.9683&region=Ain+Defla');
      } else if (selectedEndpoint === '/api/download/apk/info') {
        res = await fetch('/api/download/apk/info');
      } else if (selectedEndpoint === '/api/chat') {
        res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [{ role: 'user', content: 'ما هو الحل للوقاية من اللفحة المتأخرة في البطاطا Spunta؟' }],
            farmContext: { wilaya: 'Ain Defla' },
          }),
        });
      } else {
        res = await fetch('/api/system/status');
      }

      const elapsed = Math.round(performance.now() - startTime);
      setTestLatency(elapsed);

      const data = await res.json();
      setTestResult(data);
      setTestStatus(res.ok ? 'success' : 'error');

      // Refresh IoT logs if sensor webhook tested
      if (selectedEndpoint === '/api/iot/telemetry') {
        fetchIoTLogs();
      }
    } catch (err: any) {
      setTestStatus('error');
      setTestResult({ error: err.message || 'Network request failed' });
    } finally {
      setIsTesting(false);
    }
  };

  // Generate code snippet according to selected endpoint and language
  const getCodeSnippet = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.run.app';

    if (selectedEndpoint === '/api/iot/telemetry') {
      if (selectedLanguage === 'curl') {
        return `curl -X POST "${origin}/api/iot/telemetry" \\
  -H "Content-Type: application/json" \\
  -d '{
    "sensorId": "${iotSensorId}",
    "wilaya": "Ain Defla",
    "crop": "Spunta Potato",
    "soilMoisture": ${iotSoilMoisture},
    "soilTemp": ${iotSoilTemp},
    "batteryVoltage": ${iotBattery}
  }'`;
      }
      if (selectedLanguage === 'python') {
        return `import requests

url = "${origin}/api/iot/telemetry"
payload = {
    "sensorId": "${iotSensorId}",
    "wilaya": "Ain Defla",
    "crop": "Spunta Potato",
    "soilMoisture": ${iotSoilMoisture},
    "soilTemp": ${iotSoilTemp},
    "batteryVoltage": ${iotBattery}
}

response = requests.post(url, json=payload)
print(response.status_code, response.json())`;
      }
      if (selectedLanguage === 'javascript') {
        return `// Send field telemetry from Node.js / Browser
const response = await fetch("${origin}/api/iot/telemetry", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    sensorId: "${iotSensorId}",
    wilaya: "Ain Defla",
    crop: "Spunta Potato",
    soilMoisture: ${iotSoilMoisture},
    soilTemp: ${iotSoilTemp},
    batteryVoltage: ${iotBattery}
  })
});
const data = await response.json();
console.log(data);`;
      }
      if (selectedLanguage === 'arduino') {
        return `// ESP32 / ESP8266 Arduino C++ Field Node
#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "YOUR_FARM_WIFI";
const char* password = "WIFI_PASSWORD";
const char* serverUrl = "${origin}/api/iot/telemetry";

void sendSensorData() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    String json = "{\\"sensorId\\":\\"${iotSensorId}\\",\\"soilMoisture\\":38.5,\\"soilTemp\\":21.4,\\"batteryVoltage\\":4.05}";
    int httpResponseCode = http.POST(json);

    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    http.end();
  }
}`;
      }
    }

    if (selectedEndpoint === '/api/weather') {
      if (selectedLanguage === 'curl') {
        return `curl -X GET "${origin}/api/weather?lat=36.2642&lon=1.9683&region=Ain+Defla"`;
      }
      if (selectedLanguage === 'python') {
        return `import requests
res = requests.get("${origin}/api/weather", params={"lat": 36.2642, "lon": 1.9683, "region": "Ain Defla"})
data = res.json()
print("Temperature:", data["telemetry"]["temperature"])
print("FAO-56 ET0:", data["telemetry"]["et0"])`;
      }
      if (selectedLanguage === 'javascript') {
        return `const res = await fetch("${origin}/api/weather?lat=36.2642&lon=1.9683&region=Ain+Defla");
const data = await res.json();
console.log(data.telemetry);`;
      }
      if (selectedLanguage === 'arduino') {
        return `// ESP32 GET Weather
HTTPClient http;
http.begin("${origin}/api/weather?lat=36.2642&lon=1.9683");
int code = http.GET();
String payload = http.getString();
Serial.println(payload);
http.end();`;
      }
    }

    // Default generic snippet
    return `curl -X GET "${origin}${selectedEndpoint}"`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 2500);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      
      {/* 1. HERO GATEWAY CONTROL BAR */}
      <section 
        className={`rounded-2xl border p-5 sm:p-6 backdrop-blur-xl transition-all ${
          isDark 
            ? 'bg-[#0e1c18]/90 border-emerald-500/25 shadow-[0_0_30px_rgba(0,230,118,0.06)]' 
            : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5 border-emerald-500/15">
          <div className="flex items-center gap-3.5">
            <div className={`p-3 rounded-xl border ${
              isDark ? 'bg-[#142621] text-emerald-400 border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              <Network className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                <span>{lang === 'ar' ? 'بوابة الربط البرمجي والمستشعرات' : 'API Gateway & Field Connectors'}</span>
                <span className="text-zinc-600">·</span>
                <span className="text-emerald-400 font-bold">REST + IoT Webhook Ports</span>
              </div>
              <h2 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {lang === 'ar' ? 'ربط واجهات التطبيقات والمستشعرات الحقلية' : 'Connect External APIs & Field Sensors'}
              </h2>
            </div>
          </div>

          {/* Status Badge & Ping System */}
          <div className="flex items-center gap-2.5">
            <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-mono font-bold ${
              isDark ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Gateway Status: 200 OK</span>
            </div>
            <button
              onClick={fetchIoTLogs}
              className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                isDark ? 'border-emerald-500/25 bg-[#142621] text-zinc-300 hover:text-white' : 'border-slate-200 bg-slate-50 text-slate-700'
              }`}
              title="Refresh logs"
            >
              <RefreshCw className={`w-4 h-4 ${loadingLogs ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-zinc-400 mt-4 leading-relaxed max-w-3xl">
          {lang === 'ar' 
            ? 'تتيح هذه البوابة ربط منصة زرعي الذكية بكل سهولة مع أجهزة إنترنت الأشياء (ESP32 / Arduino)، محطات الرصد الحقلي، برامج إدارة المزارع (ERP)، أو استدعاء محرك الذكاء الاصطناعي لفحص أمراض المحاصيل عبر روابط برمجية موحدة.'
            : 'Effortlessly connect field IoT hardware (ESP32/LoRaWAN), automated weather stations, external agricultural ERP systems, or trigger AI pathology diagnostics using unified REST endpoints.'}
        </p>
      </section>

      {/* 2. SELECTABLE PORTS DIRECTORY */}
      <section>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {lang === 'ar' ? 'منافذ وروابط الواجهات المتاحة للربط' : 'Available API Endpoints & Ports'}
          </h3>
          <span className="text-xs font-mono text-zinc-400">
            {lang === 'ar' ? 'اضغط لتحديد المنفذ والتجربة الفورية' : 'Click to select & test live'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {endpoints.map((ep) => {
            const Icon = ep.icon;
            const isSelected = selectedEndpoint === ep.path;
            return (
              <div
                key={ep.path}
                onClick={() => {
                  setSelectedEndpoint(ep.path);
                  setTestStatus('idle');
                  setTestResult(null);
                }}
                className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? isDark
                      ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-[0_0_20px_rgba(0,230,118,0.15)] ring-1 ring-emerald-400'
                      : 'bg-emerald-50 border-emerald-500 text-slate-900 shadow-sm ring-1 ring-emerald-500'
                    : isDark
                      ? 'bg-[#0e1c18] border-emerald-500/20 text-zinc-300 hover:border-emerald-500/40'
                      : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${
                        isSelected 
                          ? isDark ? 'bg-emerald-500/30 text-emerald-300' : 'bg-emerald-600 text-white'
                          : isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded ${
                        ep.method === 'POST' ? 'bg-amber-500/20 text-amber-300' : 'bg-cyan-500/20 text-cyan-300'
                      }`}>
                        {ep.method}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-300">
                      {ep.badge}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm leading-snug">
                    {ep.title}
                  </h4>
                  <div className="text-[11px] font-mono text-emerald-400 mt-1">
                    {ep.path}
                  </div>
                  <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                    {ep.desc}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-emerald-500/10 flex items-center justify-between text-xs font-bold text-emerald-400">
                  <span>{isSelected ? (lang === 'ar' ? 'المنفذ النشط' : 'Selected Port') : (lang === 'ar' ? 'اختيار' : 'Select')}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. INTERACTIVE LIVE TESTER & CODE GENERATOR */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Column: Live Test Console (7 Cols) */}
        <div className={`lg:col-span-7 rounded-2xl border p-5 backdrop-blur-xl ${
          isDark ? 'bg-[#0e1c18]/90 border-emerald-500/25' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-4 border-b pb-3 border-emerald-500/15">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-emerald-400" />
              <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {lang === 'ar' ? 'وحدة الاختبار المباشر للمنفذ' : 'Live Endpoint Tester'}
              </h3>
            </div>
            <div className="text-xs font-mono text-emerald-400 font-bold">
              {selectedEndpoint}
            </div>
          </div>

          {/* Contextual payload editor if testing IoT Webhook */}
          {selectedEndpoint === '/api/iot/telemetry' && (
            <div className={`p-4 rounded-xl border mb-4 space-y-3 ${
              isDark ? 'bg-black/35 border-emerald-500/15' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="text-xs font-bold text-zinc-300">
                {lang === 'ar' ? 'تعديل بيانات الحقل المرسلة للاختبار:' : 'Test Sensor Payload Parameters:'}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 block mb-1">Sensor ID</label>
                  <input
                    type="text"
                    value={iotSensorId}
                    onChange={(e) => setIotSensorId(e.target.value)}
                    className={`w-full text-xs font-mono p-1.5 rounded-lg border ${
                      isDark ? 'bg-[#142621] border-emerald-500/30 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 block mb-1">Soil Moisture (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={iotSoilMoisture}
                    onChange={(e) => setIotSoilMoisture(parseFloat(e.target.value))}
                    className={`w-full text-xs font-mono p-1.5 rounded-lg border ${
                      isDark ? 'bg-[#142621] border-emerald-500/30 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 block mb-1">Soil Temp (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={iotSoilTemp}
                    onChange={(e) => setIotSoilTemp(parseFloat(e.target.value))}
                    className={`w-full text-xs font-mono p-1.5 rounded-lg border ${
                      isDark ? 'bg-[#142621] border-emerald-500/30 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 block mb-1">Battery (V)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={iotBattery}
                    onChange={(e) => setIotBattery(parseFloat(e.target.value))}
                    className={`w-full text-xs font-mono p-1.5 rounded-lg border ${
                      isDark ? 'bg-[#142621] border-emerald-500/30 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Test Button & Latency */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <button
              onClick={handleTestEndpoint}
              disabled={isTesting}
              className="py-2.5 px-5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs hover:bg-emerald-400 transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              <Send className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? (lang === 'ar' ? 'جاري الإرسال...' : 'Sending Request...') : (lang === 'ar' ? 'إرسال طلب تجريبي للمنفذ' : 'Send Test Request to Port')}</span>
            </button>

            {testLatency !== null && (
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-zinc-400">Response Time:</span>
                <span className="font-bold text-emerald-400">{testLatency} ms</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  testStatus === 'success' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {testStatus === 'success' ? '200 OK' : 'Error'}
                </span>
              </div>
            )}
          </div>

          {/* Live Response Box */}
          <div className={`p-4 rounded-xl border font-mono text-xs overflow-x-auto max-h-72 scrollbar-thin ${
            isDark ? 'bg-black/60 border-emerald-500/20 text-emerald-300' : 'bg-slate-900 border-slate-800 text-emerald-400'
          }`}>
            <div className="flex items-center justify-between text-zinc-500 text-[10px] mb-2 border-b border-zinc-800 pb-1">
              <span>HTTP/1.1 Live JSON Response Output</span>
              <span>application/json</span>
            </div>
            {testResult ? (
              <pre className="whitespace-pre-wrap leading-relaxed">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            ) : (
              <div className="text-zinc-500 italic py-6 text-center">
                {lang === 'ar' ? 'اضغط على زر "إرسال طلب تجريبي" لرؤية استجابة المنفذ الحية' : 'Click "Send Test Request" to inspect the live response'}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Copy-Paste Code Generator in 4 Languages (5 Cols) */}
        <div className={`lg:col-span-5 rounded-2xl border p-5 backdrop-blur-xl ${
          isDark ? 'bg-[#0e1c18]/90 border-emerald-500/25' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-3 border-b pb-3 border-emerald-500/15">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-emerald-400" />
              <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {lang === 'ar' ? 'كود الربط الجاهز' : 'Ready Integration Code'}
              </h3>
            </div>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition-all"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'نسخ الكود' : 'Copy')}</span>
            </button>
          </div>

          {/* Language Switcher Tabs */}
          <div className={`flex items-center rounded-xl p-1 border mb-3 ${
            isDark ? 'bg-[#142621] border-emerald-500/20' : 'bg-slate-100 border-slate-200'
          }`}>
            {(['curl', 'python', 'javascript', 'arduino'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setSelectedLanguage(l)}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all capitalize ${
                  selectedLanguage === l
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : isDark ? 'text-zinc-400 hover:text-white' : 'text-slate-600 hover:text-black'
                }`}
              >
                {l === 'arduino' ? 'ESP32 C++' : l}
              </button>
            ))}
          </div>

          {/* Code Viewer */}
          <div className={`p-4 rounded-xl border font-mono text-xs overflow-x-auto max-h-72 scrollbar-thin ${
            isDark ? 'bg-black/60 border-emerald-500/20 text-zinc-200' : 'bg-slate-900 border-slate-800 text-slate-200'
          }`}>
            <pre className="whitespace-pre-wrap leading-relaxed text-[11px]">
              {getCodeSnippet()}
            </pre>
          </div>

          <div className="mt-3 text-[11px] text-zinc-400 leading-relaxed">
            {lang === 'ar'
              ? '💡 يمكنك نسخ هذا الكود ولصقه مباشرة في شريحة ESP32، سكربت بايثون لتحليل المحاصيل، أو تطبيق هاتفي مخصص.'
              : '💡 Copy this code directly into your ESP32 board, farm Python script, or mobile app to automate field data flow.'}
          </div>
        </div>

      </section>

      {/* 4. REAL-TIME IOT SENSOR LOGS (TELEMETRY INGESTION STREAM) */}
      <section 
        className={`rounded-2xl border p-5 backdrop-blur-xl ${
          isDark ? 'bg-[#0e1c18]/90 border-emerald-500/25' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b pb-3 border-emerald-500/15">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-emerald-400" />
            <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {lang === 'ar' ? 'سجل القراءات المستلمة من مستشعرات الحقول (Live IoT Feed)' : 'Incoming Field Sensor Telemetry Feed'}
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold">
            {iotLogs.length} Packets Ingested via /api/iot/telemetry
          </span>
        </div>

        {iotLogs.length === 0 ? (
          <div className="text-center py-8 text-zinc-500 text-xs font-mono">
            No sensor telemetry packets recorded yet. Send a test packet above!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className={`border-b ${isDark ? 'border-emerald-500/20 text-zinc-400' : 'border-slate-200 text-slate-600'}`}>
                  <th className="py-2.5 px-3">Node Sensor ID</th>
                  <th className="py-2.5 px-3">Wilaya & Crop</th>
                  <th className="py-2.5 px-3">Soil Moisture</th>
                  <th className="py-2.5 px-3">Soil Temp</th>
                  <th className="py-2.5 px-3">Battery Voltage</th>
                  <th className="py-2.5 px-3">Received Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-500/10">
                {iotLogs.map((log, index) => (
                  <tr key={index} className={`hover:bg-emerald-500/5 transition-colors ${
                    isDark ? 'text-zinc-300' : 'text-slate-800'
                  }`}>
                    <td className="py-2.5 px-3 font-bold text-emerald-400 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5" />
                      <span>{log.sensorId}</span>
                    </td>
                    <td className="py-2.5 px-3">{log.wilaya} · {log.crop}</td>
                    <td className="py-2.5 px-3 font-bold text-cyan-400">{log.soilMoisture}%</td>
                    <td className="py-2.5 px-3">{log.soilTemp ? `${log.soilTemp}°C` : '—'}</td>
                    <td className="py-2.5 px-3">{log.batteryVoltage ? `${log.batteryVoltage} V` : '—'}</td>
                    <td className="py-2.5 px-3 text-zinc-500 text-[11px]">
                      {new Date(log.receivedAt).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

    </div>
  );
};
