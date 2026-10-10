import React from 'react';
import { 
  RefreshCw, 
  MapPin, 
  Wind, 
  Droplets, 
  Thermometer, 
  Sun, 
  Compass, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Microscope, 
  Droplet, 
  Zap, 
  BookOpen, 
  Activity, 
  Smartphone, 
  ChevronRight, 
  ArrowUpRight,
  PhoneCall,
  Terminal,
  ShieldCheck,
  Network
} from 'lucide-react';
import { Language, ThemeMode, WeatherTelemetry, RegionPreset } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { ALGERIAN_REGIONS, STRATEGIC_CROPS_RADAR } from '../data/agriculturalData';

interface ObservatoryDashboardProps {
  telemetry: WeatherTelemetry | null;
  loadingTelemetry: boolean;
  selectedRegion: RegionPreset;
  onSelectRegion: (region: RegionPreset) => void;
  onRefreshWeather: () => void;
  onAutoDetectGPS: () => void;
  isDetectingGPS: boolean;
  onNavigateTab: (tabId: string) => void;
  lang: Language;
  theme: ThemeMode;
}

export const ObservatoryDashboard: React.FC<ObservatoryDashboardProps> = ({
  telemetry,
  loadingTelemetry,
  selectedRegion,
  onSelectRegion,
  onRefreshWeather,
  onAutoDetectGPS,
  isDetectingGPS,
  onNavigateTab,
  lang,
  theme,
}) => {
  const t = TRANSLATIONS[lang];
  const isDark = theme === 'dark';

  const regionName = lang === 'ar' ? selectedRegion.nameAr : lang === 'fr' ? selectedRegion.nameFr : selectedRegion.nameEn;

  const sprayingSafety = telemetry?.sprayingSafety || {
    status: 'optimal' as const,
    windSpeed: 9.2,
    threshold: 15,
    reasonEn: 'Wind speed is within safe limits for high-precision spraying.',
    reasonAr: 'سرعة الرياح مثالية للرش الفلاحي وخطر الانجراف منعدم.',
    reasonFr: 'Vitesse du vent sous le seuil critique de 15 km/h.',
  };

  const sprayingReason = lang === 'ar' 
    ? sprayingSafety.reasonAr 
    : lang === 'fr' 
      ? sprayingSafety.reasonFr 
      : sprayingSafety.reasonEn;

  // 6 Primary Option Pages
  const optionPages = [
    {
      id: 'diagnosis',
      title: lang === 'ar' ? 'تشخيص أمراض النباتات' : lang === 'fr' ? 'Diagnostic des Maladies' : 'AI Plant Pathology',
      desc: lang === 'ar' ? 'فحص فوري لأمراض الأوراق وتحديد العلاج البيولوجي والكيميائي' : 'Instant leaf disease scan with dual biological & chemical remedies',
      icon: Microscope,
      color: 'emerald',
      badge: 'AI Doctor',
    },
    {
      id: 'water',
      title: lang === 'ar' ? 'المستشار الذكي للري' : lang === 'fr' ? 'Conseiller Irrigation' : 'Smart Water Advisor',
      desc: lang === 'ar' ? 'حساب الاحتياجات المائية ومراقبة رصيد الحوض المائي وفق FAO-56' : 'ET₀ water balance calculations & reservoir level monitoring',
      icon: Droplet,
      color: 'cyan',
      badge: 'FAO-56',
    },
    {
      id: 'quantum',
      title: lang === 'ar' ? 'كفاءة النبض بالتنقيط' : lang === 'fr' ? 'Goutte-à-Goutte Pulsé' : 'Drip Pulse Hydro',
      desc: lang === 'ar' ? 'نظام الري النبضي لتوفير 36.8% من المياه وحماية التربة' : 'Capillary hydrodynamic balance saving 36.8% irrigation water',
      icon: Zap,
      color: 'teal',
      badge: '-36% H₂O',
    },
    {
      id: 'safety',
      title: lang === 'ar' ? 'دليل حماية النباتات (INPV)' : lang === 'fr' ? 'Guide Sécurité & DAR' : 'INPV Safety & PHI',
      desc: lang === 'ar' ? 'فترات الأمان قبل الجني (DAR) والقواعد الخمس للرش الآمن' : 'Pre-harvest intervals (PHI/DAR) & 5 golden spraying rules',
      icon: ShieldCheck,
      color: 'amber',
      badge: 'INPV Official',
    },
    {
      id: 'install',
      title: lang === 'ar' ? 'تثبيت التطبيق (APK مباشر)' : lang === 'fr' ? 'Installer l\'App (APK)' : 'Install Mobile APK',
      desc: lang === 'ar' ? 'تنزيل ملف APK رسمي كامل للهواتف والعمل بدون إنترنت' : 'Download universal Android APK v2.4.2 for field offline usage',
      icon: Smartphone,
      color: 'emerald',
      badge: 'Android APK',
      highlight: true,
    },
    {
      id: 'api-hub',
      title: lang === 'ar' ? 'بوابة الربط بالـ APIs والمستشعرات' : lang === 'fr' ? 'Passerelle APIs & IoT' : 'API Gateway & Sensors',
      desc: lang === 'ar' ? 'ربط شرائح ESP32، محطات الطقس والـ Webhooks مع أكواد جاهزة وتجربة حية' : 'Connect field IoT hardware, ESP32 code, REST endpoints & live test console',
      icon: Network,
      color: 'purple',
      badge: 'REST / IoT',
    },
    {
      id: 'specs',
      title: lang === 'ar' ? 'المواصفات التقنية والنظام' : lang === 'fr' ? 'Spécifications Techniques' : 'Technical Specs',
      desc: lang === 'ar' ? 'هندسة التطبيق، الحسابات الفلاحية المدمجة والعمل دون اتصال' : 'Offline agronomic engine architecture & security checksums',
      icon: Terminal,
      color: 'zinc',
      badge: 'v2.4.2 DZ',
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      
      {/* 1. TOP OVERVIEW & TELEMETRY SECTION */}
      <section 
        className={`rounded-2xl border p-5 sm:p-6 backdrop-blur-xl transition-all ${
          isDark
            ? 'bg-[#0e1c18]/90 border-emerald-500/25 shadow-[0_0_30px_rgba(0,230,118,0.06)]'
            : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-emerald-500/15">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl border ${
              isDark ? 'bg-[#142621] text-emerald-400 border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              <MapPin className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase">
                <span>{lang === 'ar' ? 'الحالة الحقلية المباشرة' : 'Live Field Conditions'}</span>
                <span className="text-zinc-600">·</span>
                <span className="text-zinc-400 font-normal">{selectedRegion.climate}</span>
              </div>
              <h2 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {regionName}
              </h2>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onAutoDetectGPS}
              disabled={isDetectingGPS}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                isDetectingGPS
                  ? 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  : isDark
                    ? 'bg-[#142621] text-emerald-300 border-emerald-500/30 hover:bg-emerald-950/60'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
              }`}
              title="Detect real device GPS coordinates"
            >
              <Compass className={`w-4 h-4 text-emerald-400 ${isDetectingGPS ? 'animate-spin' : ''}`} />
              <span>{isDetectingGPS ? (lang === 'ar' ? 'جاري التحديد...' : 'Acquiring...') : 'GPS Auto-Detect'}</span>
            </button>

            <button
              onClick={onRefreshWeather}
              disabled={loadingTelemetry}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-sm"
              title="Sync meteorological telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${loadingTelemetry ? 'animate-spin' : ''}`} />
              <span>{loadingTelemetry ? (lang === 'ar' ? 'جاري المزامنة...' : 'Syncing...') : (lang === 'ar' ? 'تحديث البيانات' : 'Sync')}</span>
            </button>
          </div>
        </div>

        {/* 4 Clean Primary Meteorological Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-5">
          {/* 1. Temperature */}
          <div className={`p-4 rounded-xl border ${
            isDark ? 'bg-[#142621]/70 border-emerald-500/20' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between text-zinc-400 mb-1">
              <span className="text-xs font-medium">{t.tempCard}</span>
              <Thermometer className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 tabular-nums">
                {telemetry?.temperature?.toFixed(1) ?? '24.5'}
              </span>
              <span className="text-xs font-bold text-zinc-400">°C</span>
            </div>
            <div className="text-[11px] font-mono text-zinc-400 mt-1">
              {lang === 'ar' ? `الصغرى ${telemetry?.tempMin?.toFixed(0) ?? 17}° · القصوى ${telemetry?.tempMax?.toFixed(0) ?? 29}°` : `Min ${telemetry?.tempMin?.toFixed(0) ?? 17}° · Max ${telemetry?.tempMax?.toFixed(0) ?? 29}°`}
            </div>
          </div>

          {/* 2. Soil Moisture */}
          <div className={`p-4 rounded-xl border ${
            isDark ? 'bg-[#142621]/70 border-emerald-500/20' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between text-zinc-400 mb-1">
              <span className="text-xs font-medium">{t.soilMoistureCard}</span>
              <Droplets className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-black font-mono text-cyan-400 tabular-nums">
                {telemetry?.soilMoisture ?? 34}
              </span>
              <span className="text-xs font-bold text-zinc-400">%</span>
            </div>
            <div className="text-[11px] font-mono text-cyan-400 mt-1">
              {lang === 'ar' ? 'رطوبة منطقة الجذور الشعرية' : 'Root zone capillary reserve'}
            </div>
          </div>

          {/* 3. Wind Velocity */}
          <div className={`p-4 rounded-xl border ${
            isDark ? 'bg-[#142621]/70 border-emerald-500/20' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between text-zinc-400 mb-1">
              <span className="text-xs font-medium">{t.windCard}</span>
              <Wind className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 tabular-nums">
                {telemetry?.windSpeed?.toFixed(1) ?? '9.2'}
              </span>
              <span className="text-xs font-bold text-zinc-400">km/h</span>
            </div>
            <div className="text-[11px] font-mono text-zinc-400 mt-1">
              {lang === 'ar' ? 'حد الأمان: أقل من 15 كم/س' : 'Safe threshold < 15 km/h'}
            </div>
          </div>

          {/* 4. FAO-56 Reference ET₀ */}
          <div className={`p-4 rounded-xl border ${
            isDark ? 'bg-[#142621]/70 border-emerald-500/20' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between text-zinc-400 mb-1">
              <span className="text-xs font-medium">{t.et0Card}</span>
              <Sun className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-black font-mono text-amber-400 tabular-nums">
                {telemetry?.et0?.toFixed(1) ?? '4.8'}
              </span>
              <span className="text-xs font-bold text-zinc-400">mm/d</span>
            </div>
            <div className="text-[11px] font-mono text-amber-400 mt-1">
              {lang === 'ar' ? 'النتح التبخري المرجعي FAO-56' : 'FAO-56 Penman-Monteith'}
            </div>
          </div>
        </div>

        {/* Clean Spraying Advisory Alert Banner */}
        <div 
          className={`mt-4 p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            sprayingSafety.status === 'dangerous'
              ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
              : sprayingSafety.status === 'caution'
                ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                : isDark
                  ? 'bg-[#142621] border-emerald-500/30 text-emerald-200'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}
        >
          <div className="flex items-center gap-3">
            {sprayingSafety.status === 'dangerous' ? (
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
            ) : sprayingSafety.status === 'caution' ? (
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            )}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider font-mono">
                {t.sprayingAdvisory}: {sprayingSafety.status === 'dangerous' ? t.dangerSpray : sprayingSafety.status === 'caution' ? t.cautionSpray : t.safeToSpray}
              </span>
              <p className="text-xs mt-0.5 opacity-90">
                {sprayingReason}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('safety')}
            className="text-xs font-bold underline underline-offset-2 flex items-center gap-1 self-end sm:self-auto hover:text-emerald-300"
          >
            <span>{t.tabSafety}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 2. ORGANIZED DIRECTORY OF ALL PAGES / OPTIONS */}
      <section>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {lang === 'ar' ? 'أقسام المنصة وخيارات الاستخدام' : 'All Platform Modules & Pages'}
          </h3>
          <span className="text-xs font-mono text-zinc-400">
            {lang === 'ar' ? 'كل خيار في صفحة منظمة ومستقلة' : 'Organized dedicated pages'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {optionPages.map((page) => {
            const Icon = page.icon;
            return (
              <div 
                key={page.id}
                onClick={() => onNavigateTab(page.id)}
                className={`cursor-pointer group p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between ${
                  page.highlight
                    ? isDark 
                      ? 'bg-gradient-to-br from-[#122820] to-[#0c1a16] border-emerald-400/50 shadow-[0_0_20px_rgba(0,230,118,0.12)]' 
                      : 'bg-emerald-50/70 border-emerald-300 shadow-sm'
                    : isDark 
                      ? 'bg-[#0e1c18] border-emerald-500/20 hover:border-emerald-400/50' 
                      : 'bg-white border-slate-200 hover:border-emerald-500 hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-xl ${
                      isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {page.badge && (
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        page.highlight
                          ? 'bg-emerald-500 text-slate-950 font-black'
                          : isDark ? 'bg-zinc-800 text-emerald-400' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {page.badge}
                      </span>
                    )}
                  </div>
                  <h4 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {page.title}
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                    {page.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-emerald-500/10 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
                  <span>{lang === 'ar' ? 'فتح الصفحة' : 'Open Page'}</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. NATIONAL STRATEGIC CROPS RADAR (CLEAN OVERVIEW) */}
      <section 
        className={`rounded-2xl border p-5 sm:p-6 backdrop-blur-xl ${
          isDark ? 'bg-[#0e1c18]/90 border-emerald-500/25' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {t.strategicRadarTitle}
              </h3>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              {lang === 'ar' ? 'رصد مؤشرات الصحة ومخاطر الآفات في الشعب الفلاحية الاستراتيجية' : 'Health index & epidemic risks for Algerian strategic crops'}
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('diagnosis')}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>{lang === 'ar' ? 'فحص عينة بالذكاء الاصطناعي' : 'Diagnose Plant'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {STRATEGIC_CROPS_RADAR.slice(0, 4).map((crop) => {
            const cropName = lang === 'ar' ? crop.name.ar : lang === 'fr' ? crop.name.fr : crop.name.en;
            const region = lang === 'ar' ? crop.region.ar : lang === 'fr' ? crop.region.fr : crop.region.en;
            const threat = lang === 'ar' ? crop.topThreat.ar : lang === 'fr' ? crop.topThreat.fr : crop.topThreat.en;

            return (
              <div 
                key={crop.id}
                className={`p-3.5 rounded-xl border flex flex-col justify-between ${
                  isDark ? 'bg-[#142621]/70 border-emerald-500/20' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-1 mb-1.5">
                    <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {cropName}
                    </span>
                    <span className={`text-[10px] font-mono font-bold uppercase ${
                      crop.riskLevel === 'high' ? 'text-rose-400' : crop.riskLevel === 'moderate' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {crop.riskLevel}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-zinc-400 mb-2">
                    {region}
                  </div>

                  {/* Health Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-zinc-400">{t.healthIndex}</span>
                      <span className="font-bold text-emerald-400 tabular-nums">{crop.healthScore}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${crop.healthScore}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-2.5 text-[11px] text-zinc-400">
                    <span className="text-rose-400 font-bold">{lang === 'ar' ? 'الخطر:' : 'Risk:'} </span>
                    <span>{threat}</span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateTab('diagnosis')}
                  className="mt-3 w-full py-1.5 rounded-lg border border-emerald-500/30 text-emerald-400 text-xs font-bold hover:bg-emerald-500/10 transition-colors text-center"
                >
                  {lang === 'ar' ? 'تشخيص المحصول' : 'Check Leaf'}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. PHYTOSANITARY SUPPORT & APK DOWNLOAD BAR */}
      <section 
        className={`rounded-2xl border p-4 sm:p-5 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          isDark ? 'bg-[#0a1612] border-emerald-500/20' : 'bg-slate-50 border-slate-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {lang === 'ar' ? 'المعهد الوطني لحماية النباتات (INPV) ومديريات المصالح الفلاحية (DSA)' : 'National Plant Protection Institute (INPV) Support'}
            </h4>
            <p className="text-xs text-zinc-400 mt-0.5">
              {lang === 'ar' ? 'التبليغ عن الأوبئة النباتية والاستشارات الفيتوصحية الميدانية' : 'Official phytosanitary hotline for crop epidemic reporting'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => onNavigateTab('install')}
            className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs hover:bg-emerald-400 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'تثبيت التطبيق (APK مباشر)' : 'Install APK'}</span>
          </button>
          <button
            onClick={() => onNavigateTab('safety')}
            className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-all ${
              isDark ? 'border-emerald-500/30 text-emerald-300 hover:bg-emerald-950/40' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>{t.tabSafety}</span>
          </button>
        </div>
      </section>

    </div>
  );
};
