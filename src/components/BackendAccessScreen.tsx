import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Terminal, 
  Send, 
  RefreshCw, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  Activity, 
  Database, 
  Cpu, 
  Clock, 
  HardDrive,
  ShieldCheck,
  ChevronRight,
  Code2
} from 'lucide-react';
import { Language, ThemeMode } from '../types';

interface BackendAccessScreenProps {
  lang: Language;
  theme: ThemeMode;
}

export const BackendAccessScreen: React.FC<BackendAccessScreenProps> = ({
  lang,
  theme,
}) => {
  const isDark = theme === 'dark';

  // Server info state
  const [backendInfo, setBackendInfo] = useState<any>(null);
  const [loadingInfo, setLoadingInfo] = useState(false);

  // Request console state
  const [selectedMethod, setSelectedMethod] = useState<'GET' | 'POST'>('GET');
  const [endpointUrl, setEndpointUrl] = useState<string>('/api/system/status');
  const [requestBody, setRequestBody] = useState<string>('{\n  "test": true\n}');
  const [isExecuting, setIsExecuting] = useState(false);
  const [responseOutput, setResponseOutput] = useState<any>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseLatency, setResponseLatency] = useState<number | null>(null);

  // Live access logs
  const [accessLogs, setAccessLogs] = useState<any[]>([]);
  const [autoRefreshLogs, setAutoRefreshLogs] = useState(true);
  const [copiedResponse, setCopiedResponse] = useState(false);

  // Pre-configured accessible backend endpoints
  const quickEndpoints = [
    { method: 'GET', url: '/api/system/status', label: 'System Health & Engine Status' },
    { method: 'GET', url: '/api/backend/info', label: 'Detailed Server Diagnostics & Memory' },
    { method: 'GET', url: '/api/backend/logs', label: 'Recent Server HTTP Request Logs' },
    { method: 'GET', url: '/api/weather?lat=36.2642&lon=1.9683&region=Ain+Defla', label: 'Live Agro-Weather & FAO-56 ET₀' },
    { method: 'GET', url: '/api/download/apk/info', label: 'APK Cryptographic Hashes & Manifest' },
    { method: 'GET', url: '/api/iot/telemetry/latest', label: 'Field Sensor Ingested Telemetry Feed' },
    { 
      method: 'POST', 
      url: '/api/iot/telemetry', 
      label: 'Send Sensor Reading (IoT Webhook)', 
      defaultBody: '{\n  "sensorId": "ESP32-FIELD-CHECK",\n  "wilaya": "Ain Defla",\n  "crop": "Spunta Potato",\n  "soilMoisture": 37.8,\n  "soilTemp": 22.1,\n  "batteryVoltage": 4.10\n}' 
    },
    { 
      method: 'POST', 
      url: '/api/diagnose', 
      label: 'Run Multimodal AI Diagnosis (POST)', 
      defaultBody: '{\n  "cropHint": "Potato",\n  "symptoms": "بقع مائية بنية داكنة على حواف الأوراق مع رطوبة عالية"\n}' 
    },
    { 
      method: 'POST', 
      url: '/api/chat', 
      label: 'Dr. Zira3i Agronomist Consult (POST)', 
      defaultBody: '{\n  "messages": [\n    {"role": "user", "content": "ما هي الجرعة الموصى بها لمكافحة الميلديو في البطاطا؟"}\n  ]\n}' 
    },
  ];

  // Fetch backend runtime info
  const fetchBackendInfo = async () => {
    setLoadingInfo(true);
    try {
      const res = await fetch('/api/backend/info');
      const data = await res.json();
      if (data.success) {
        setBackendInfo(data);
      }
    } catch (err) {
      console.warn('Backend info fetch error:', err);
    } finally {
      setLoadingInfo(false);
    }
  };

  // Fetch HTTP access logs
  const fetchAccessLogs = async () => {
    try {
      const res = await fetch('/api/backend/logs');
      const data = await res.json();
      if (data.success && data.logs) {
        setAccessLogs(data.logs);
      }
    } catch (err) {
      console.warn('Access logs fetch error:', err);
    }
  };

  useEffect(() => {
    fetchBackendInfo();
    fetchAccessLogs();
  }, []);

  // Polling for live logs if enabled
  useEffect(() => {
    if (!autoRefreshLogs) return;
    const interval = setInterval(() => {
      fetchAccessLogs();
    }, 4000);
    return () => clearInterval(interval);
  }, [autoRefreshLogs]);

  // Execute request against backend
  const handleExecuteRequest = async () => {
    setIsExecuting(true);
    setResponseStatus(null);
    setResponseOutput(null);
    const start = performance.now();

    try {
      const options: RequestInit = {
        method: selectedMethod,
        headers: { 'Content-Type': 'application/json' },
      };

      if (selectedMethod === 'POST') {
        try {
          // validate json
          JSON.parse(requestBody);
          options.body = requestBody;
        } catch (jsonErr: any) {
          alert('Invalid JSON in request body: ' + jsonErr.message);
          setIsExecuting(false);
          return;
        }
      }

      const res = await fetch(endpointUrl, options);
      const elapsed = Math.round(performance.now() - start);
      setResponseLatency(elapsed);
      setResponseStatus(res.status);

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const json = await res.json();
        setResponseOutput(json);
      } else {
        const text = await res.text();
        setResponseOutput({ rawResponse: text });
      }

      // Immediately refresh logs
      fetchAccessLogs();
    } catch (err: any) {
      setResponseStatus(500);
      setResponseOutput({ error: err.message || 'Failed to connect to backend' });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCopyResponse = () => {
    if (responseOutput) {
      navigator.clipboard.writeText(JSON.stringify(responseOutput, null, 2));
      setCopiedResponse(true);
      setTimeout(() => setCopiedResponse(false), 2000);
    }
  };

  const handleSelectQuickEndpoint = (ep: typeof quickEndpoints[0]) => {
    setSelectedMethod(ep.method as any);
    setEndpointUrl(ep.url);
    if (ep.defaultBody) {
      setRequestBody(ep.defaultBody);
    }
    setResponseOutput(null);
    setResponseStatus(null);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      
      {/* 1. BACKEND ACCESS HEADER & STATUS */}
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
              <Server className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                <span>{lang === 'ar' ? 'الوصول المباشر للباك إند' : 'Direct Backend Access & API Inspector'}</span>
                <span className="text-zinc-600">·</span>
                <span className="text-emerald-400 font-bold">Express.js Node Runtime</span>
              </div>
              <h2 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {lang === 'ar' ? 'وحدة فحص وتجربة السيرفر والباك إند' : 'Backend Server Console & API Tester'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-mono font-bold ${
              isDark ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Backend: ONLINE 200 OK</span>
            </div>
            <button
              onClick={() => { fetchBackendInfo(); fetchAccessLogs(); }}
              className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                isDark ? 'border-emerald-500/25 bg-[#142621] text-zinc-300 hover:text-white' : 'border-slate-200 bg-slate-50 text-slate-700'
              }`}
              title="Refresh server stats"
            >
              <RefreshCw className={`w-4 h-4 ${loadingInfo ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Runtime Diagnostics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className={`p-3 rounded-xl border ${
            isDark ? 'bg-black/35 border-emerald-500/20' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-[10px] font-mono text-zinc-400 block mb-1">Server Status</span>
            <span className="text-sm font-black font-mono text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{backendInfo?.server?.status || 'ONLINE'}</span>
            </span>
          </div>

          <div className={`p-3 rounded-xl border ${
            isDark ? 'bg-black/35 border-emerald-500/20' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-[10px] font-mono text-zinc-400 block mb-1">Node Environment</span>
            <span className="text-sm font-black font-mono text-cyan-400">
              {backendInfo?.server?.nodeVersion || 'Node.js'} · {backendInfo?.server?.platform || 'linux'}
            </span>
          </div>

          <div className={`p-3 rounded-xl border ${
            isDark ? 'bg-black/35 border-emerald-500/20' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-[10px] font-mono text-zinc-400 block mb-1">Server Memory (RSS)</span>
            <span className="text-sm font-black font-mono text-amber-400">
              {backendInfo?.server?.memoryRssMb ? `${backendInfo.server.memoryRssMb} MB` : 'Active'}
            </span>
          </div>

          <div className={`p-3 rounded-xl border ${
            isDark ? 'bg-black/35 border-emerald-500/20' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-[10px] font-mono text-zinc-400 block mb-1">AI Engine Connection</span>
            <span className="text-sm font-black font-mono text-emerald-300">
              Gemini 2.5 Flash
            </span>
          </div>
        </div>
      </section>

      {/* 2. DIRECT TEST CONSOLE (SEND REQUESTS & INSPECT RAW OUTPUT) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left: Quick Endpoints Selector (4 Cols) */}
        <div className={`lg:col-span-4 rounded-2xl border p-4 sm:p-5 backdrop-blur-xl ${
          isDark ? 'bg-[#0e1c18]/90 border-emerald-500/25' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-3 border-b pb-2 border-emerald-500/15">
            <h3 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {lang === 'ar' ? 'منافذ الباك إند المباشرة' : 'Direct Endpoints'}
            </h3>
            <span className="text-[10px] font-mono text-zinc-400">Click to load</span>
          </div>

          <div className="space-y-1.5">
            {quickEndpoints.map((ep, idx) => {
              const isSelected = endpointUrl === ep.url && selectedMethod === ep.method;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectQuickEndpoint(ep)}
                  className={`w-full p-2.5 rounded-xl border text-left flex flex-col gap-0.5 transition-all text-xs font-mono ${
                    isSelected
                      ? 'bg-emerald-500/20 border-emerald-400 text-white font-bold'
                      : isDark
                        ? 'bg-[#142621]/60 border-emerald-500/15 text-zinc-300 hover:border-emerald-500/35 hover:bg-[#142621]'
                        : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                      ep.method === 'POST' ? 'bg-amber-500/20 text-amber-300' : 'bg-cyan-500/20 text-cyan-300'
                    }`}>
                      {ep.method}
                    </span>
                    <a
                      href={ep.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-zinc-500 hover:text-emerald-400 p-0.5"
                      title="Open raw URL in new tab"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="text-[11px] truncate text-emerald-400 mt-1">
                    {ep.url}
                  </div>
                  <div className="text-[10px] text-zinc-400 truncate">
                    {ep.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Live Request Execution & Raw Output (8 Cols) */}
        <div className={`lg:col-span-8 rounded-2xl border p-5 backdrop-blur-xl ${
          isDark ? 'bg-[#0e1c18]/90 border-emerald-500/25' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-4 border-b pb-3 border-emerald-500/15">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-emerald-400" />
              <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {lang === 'ar' ? 'تنفيذ الطلب وفحص الاستجابة الحية' : 'Execute & Inspect Live Response'}
              </h3>
            </div>
            {responseStatus !== null && (
              <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                responseStatus >= 200 && responseStatus < 300
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}>
                HTTP Status: {responseStatus} · {responseLatency}ms
              </span>
            )}
          </div>

          {/* Request URL Input Bar */}
          <div className="flex items-center gap-2 mb-3">
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value as any)}
              className={`text-xs font-mono font-bold py-2.5 px-3 rounded-xl border focus:outline-none ${
                isDark 
                  ? 'bg-[#142621] border-emerald-500/30 text-emerald-300' 
                  : 'bg-slate-100 border-slate-300 text-slate-800'
              }`}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
            </select>

            <input
              type="text"
              value={endpointUrl}
              onChange={(e) => setEndpointUrl(e.target.value)}
              className={`flex-1 text-xs font-mono p-2.5 rounded-xl border focus:outline-none ${
                isDark 
                  ? 'bg-black/50 border-emerald-500/30 text-white focus:border-emerald-400' 
                  : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500'
              }`}
            />

            <button
              onClick={handleExecuteRequest}
              disabled={isExecuting}
              className="py-2.5 px-5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs hover:bg-emerald-400 transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              <Send className={`w-3.5 h-3.5 ${isExecuting ? 'animate-spin' : ''}`} />
              <span>{isExecuting ? 'Calling...' : (lang === 'ar' ? 'تنفيذ الطلب' : 'Send')}</span>
            </button>
          </div>

          {/* Request Body Editor for POST */}
          {selectedMethod === 'POST' && (
            <div className="mb-4">
              <label className="text-[11px] font-mono text-zinc-400 mb-1 block">
                Request JSON Body (Payload):
              </label>
              <textarea
                rows={4}
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                className={`w-full p-2.5 rounded-xl font-mono text-xs border resize-none focus:outline-none ${
                  isDark ? 'bg-black/50 border-emerald-500/25 text-emerald-300' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>
          )}

          {/* Live Response Box */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-1.5">
              <span>Raw Backend JSON Output:</span>
              {responseOutput && (
                <button
                  onClick={handleCopyResponse}
                  className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  {copiedResponse ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedResponse ? 'Copied' : 'Copy Response'}</span>
                </button>
              )}
            </div>

            <div className={`p-4 rounded-xl border font-mono text-xs overflow-x-auto max-h-80 scrollbar-thin ${
              isDark ? 'bg-black/70 border-emerald-500/20 text-emerald-300' : 'bg-slate-900 border-slate-800 text-emerald-400'
            }`}>
              {responseOutput ? (
                <pre className="whitespace-pre-wrap leading-relaxed">
                  {JSON.stringify(responseOutput, null, 2)}
                </pre>
              ) : (
                <div className="text-zinc-500 italic py-8 text-center">
                  {lang === 'ar' 
                    ? 'اضغط على "تنفيذ الطلب" لفحص استجابة الباك إند الحية مباشرة.' 
                    : 'Click "Send" to execute and inspect the live backend response.'}
                </div>
              )}
            </div>
          </div>
        </div>

      </section>

      {/* 3. REAL-TIME HTTP ACCESS LOGS (VERIFY ALL REQUESTS HIT THE BACKEND) */}
      <section 
        className={`rounded-2xl border p-5 backdrop-blur-xl ${
          isDark ? 'bg-[#0e1c18]/90 border-emerald-500/25' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b pb-3 border-emerald-500/15">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {lang === 'ar' ? 'سجل الطلبات الحية الواصلة للباك إند (Live HTTP Access Log)' : 'Live Backend HTTP Request Log'}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-mono text-zinc-400 cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefreshLogs}
                onChange={(e) => setAutoRefreshLogs(e.target.checked)}
                className="rounded border-emerald-500 text-emerald-500 focus:ring-0"
              />
              <span>Auto-refresh (4s)</span>
            </label>
            <button
              onClick={fetchAccessLogs}
              className={`p-1.5 rounded-lg border text-xs ${
                isDark ? 'border-emerald-500/20 bg-black/30 text-emerald-400' : 'border-slate-200 bg-slate-50 text-slate-700'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {accessLogs.length === 0 ? (
          <div className="text-center py-8 text-zinc-500 text-xs font-mono">
            No incoming API requests logged yet. Execute an endpoint above to see it recorded live!
          </div>
        ) : (
          <div className="overflow-x-auto max-h-72 scrollbar-thin">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className={`border-b ${isDark ? 'border-emerald-500/20 text-zinc-400' : 'border-slate-200 text-slate-600'}`}>
                  <th className="py-2 px-3">Timestamp</th>
                  <th className="py-2 px-3">Method</th>
                  <th className="py-2 px-3">Path / Endpoint</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Latency</th>
                  <th className="py-2 px-3">Client IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-500/10">
                {accessLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-emerald-500/5 transition-colors">
                    <td className="py-2 px-3 text-zinc-500 text-[11px]">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-2 px-3">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                        log.method === 'POST' ? 'bg-amber-500/20 text-amber-400' : 'bg-cyan-500/20 text-cyan-400'
                      }`}>
                        {log.method}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-bold text-emerald-300">
                      {log.path}
                    </td>
                    <td className="py-2 px-3">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        log.statusCode < 400 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {log.statusCode}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-zinc-400">{log.durationMs}ms</td>
                    <td className="py-2 px-3 text-zinc-500">{log.ip}</td>
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
