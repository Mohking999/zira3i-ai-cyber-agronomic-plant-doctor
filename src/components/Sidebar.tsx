import React from 'react';
import { 
  LayoutDashboard, 
  Microscope, 
  Droplet, 
  Zap, 
  ShieldCheck, 
  Smartphone, 
  Terminal, 
  Sprout, 
  MapPin, 
  Compass, 
  Download, 
  Sun, 
  Moon, 
  Satellite, 
  X,
  Layers,
  ChevronRight,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Network,
  Server
} from 'lucide-react';
import { Language, ThemeMode, RegionPreset, WeatherTelemetry } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { ALGERIAN_REGIONS } from '../data/agriculturalData';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  selectedRegion: RegionPreset;
  onSelectRegion: (region: RegionPreset) => void;
  onAutoDetectGPS: () => void;
  isDetectingGPS: boolean;
  telemetry: WeatherTelemetry | null;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: string;
  label: string;
  subLabel: string;
  icon: React.ElementType;
  badge: string | null;
  highlight?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  theme,
  setTheme,
  selectedRegion,
  onSelectRegion,
  onAutoDetectGPS,
  isDetectingGPS,
  telemetry,
  isOpenMobile,
  onCloseMobile,
}) => {
  const t = TRANSLATIONS[lang];
  const isDark = theme === 'dark';

  // Navigation items grouped cleanly
  const navSections: NavSection[] = [
    {
      title: lang === 'ar' ? 'الرئيسية والمراقبة' : lang === 'fr' ? 'Observatoire Principal' : 'Main Hub',
      items: [
        {
          id: 'dashboard',
          label: lang === 'ar' ? 'لوحة القيادة والمؤشرات' : lang === 'fr' ? 'Tableau de Bord' : 'Overview Dashboard',
          subLabel: lang === 'ar' ? 'الطقس الفلاحي وري المحاصيل' : 'Agro-weather & live status',
          icon: LayoutDashboard,
          badge: null,
        },
      ]
    },
    {
      title: lang === 'ar' ? 'صحة المحاصيل والوقاية' : lang === 'fr' ? 'Santé Végétale & IA' : 'Crop Health & Diagnostics',
      items: [
        {
          id: 'diagnosis',
          label: lang === 'ar' ? 'فحص وتشخيص الأمراض' : lang === 'fr' ? 'Diagnostic des Maladies' : 'AI Plant Pathology',
          subLabel: lang === 'ar' ? 'تحليل الأوراق عبر الذكاء الاصطناعي' : 'Laser leaf scan & treatment',
          icon: Microscope,
          badge: 'AI',
        },
        {
          id: 'safety',
          label: lang === 'ar' ? 'دليل حماية النباتات (INPV)' : lang === 'fr' ? 'Guide Sécurité & DAR' : 'INPV Phytosanitary Guide',
          subLabel: lang === 'ar' ? 'فترات الأمان DAR والقواعد الذهبية' : 'PHI pre-harvest intervals',
          icon: ShieldCheck,
          badge: 'INPV',
        },
      ]
    },
    {
      title: lang === 'ar' ? 'المياه والري الذكي' : lang === 'fr' ? 'Gestion Hydro & Irrigation' : 'Water & Smart Irrigation',
      items: [
        {
          id: 'water',
          label: lang === 'ar' ? 'المستشار الذكي للري' : lang === 'fr' ? 'Conseiller Irrigation' : 'Smart Water Advisor',
          subLabel: lang === 'ar' ? 'حساب الاحتياجات وفق FAO-56' : 'ET₀ Penman-Monteith hydro plan',
          icon: Droplet,
          badge: null,
        },
        {
          id: 'quantum',
          label: lang === 'ar' ? 'كفاءة الري والنبض بالتنقيط' : lang === 'fr' ? 'Goutte-à-Goutte Pulsé' : 'Drip Pulse Efficiency',
          subLabel: lang === 'ar' ? 'توفير 36% من استهلاك المياه' : 'Capillary hydrodynamic balance',
          icon: Zap,
          badge: '-36% H₂O',
        },
      ]
    },
    {
      title: lang === 'ar' ? 'الربط البرمجي والمستشعرات' : lang === 'fr' ? 'Passerelle APIs & IoT' : 'API Ports & Connectors',
      items: [
        {
          id: 'backend-access',
          label: lang === 'ar' ? 'الوصول للباك إند وفحص السيرفر' : lang === 'fr' ? 'Accès Backend & Console' : 'Backend Access & Console',
          subLabel: lang === 'ar' ? 'فحص السيرفر المباشر، السجلات وتجربة الروابط' : 'Server diagnostics, live logs & tester',
          icon: Server,
          badge: 'ONLINE 200',
        },
        {
          id: 'api-hub',
          label: lang === 'ar' ? 'بوابة الربط بالـ APIs والمستشعرات' : lang === 'fr' ? 'Passerelle APIs & IoT' : 'API Gateway & Sensors',
          subLabel: lang === 'ar' ? 'منافذ REST، كود ESP32 واختبار الاتصال' : 'REST endpoints, ESP32 code & test',
          icon: Network,
          badge: 'REST / IoT',
        },
      ]
    },
    {
      title: lang === 'ar' ? 'تثبيت التطبيق والنظام' : lang === 'fr' ? 'Application & Système' : 'App & System Specs',
      items: [
        {
          id: 'install',
          label: lang === 'ar' ? 'تثبيت التطبيق (APK)' : lang === 'fr' ? 'Installer l\'App (APK)' : 'Install APK App',
          subLabel: lang === 'ar' ? 'تحميل مباشر للأندرويد بدون متجر' : 'Direct APK download for Android',
          icon: Smartphone,
          badge: 'APK v2.4',
          highlight: true,
        },
        {
          id: 'specs',
          label: lang === 'ar' ? 'المواصفات التقنية والمصادر' : lang === 'fr' ? 'Spécifications Techniques' : 'Tech Architecture',
          subLabel: lang === 'ar' ? 'العمل بدون إنترنت وحسابات FAO' : 'Offline engine & security',
          icon: Terminal,
          badge: null,
        },
      ]
    }
  ];

  const handleItemClick = (id: string) => {
    setActiveTab(id);
    onCloseMobile();
  };

  const sprayingSafety = telemetry?.sprayingSafety || {
    status: 'optimal' as const,
    windSpeed: 9.2,
    threshold: 15,
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Main Left Sidebar */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 sm:w-80 flex flex-col border-r transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        } ${
          isDark 
            ? 'bg-[#091411] border-emerald-500/20 text-slate-200' 
            : 'bg-white border-slate-200 text-slate-800 shadow-xl lg:shadow-none'
        }`}
      >
        {/* 1. Header & Brand */}
        <div className={`p-4 sm:p-5 border-b flex items-center justify-between ${
          isDark ? 'border-emerald-500/15 bg-black/20' : 'border-slate-100 bg-slate-50/70'
        }`}>
          <div 
            onClick={() => handleItemClick('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-md transition-transform group-hover:scale-105 ${
              isDark 
                ? 'bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 shadow-[0_0_15px_rgba(0,230,118,0.2)]' 
                : 'bg-emerald-600 text-white shadow-emerald-600/20'
            }`}>
              <Sprout className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-xl font-black tracking-tight text-emerald-400">Zira3i</span>
                <span className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>AI</span>
                <span className="text-sm font-bold text-emerald-500/90 ms-1">زرعي</span>
              </div>
              <p className={`text-[11px] mt-1 font-medium ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                {lang === 'ar' ? 'منصة الرصد الفلاحي والري' : 'Cyber-Agronomic Observatory'}
              </p>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={onCloseMobile}
            className={`p-2 rounded-lg lg:hidden transition-colors ${
              isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-slate-500 hover:bg-slate-200'
            }`}
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Wilaya / Agricultural Basin Selector */}
        <div className={`p-3.5 border-b ${isDark ? 'border-emerald-500/15 bg-[#0b1714]' : 'border-slate-100 bg-slate-50'}`}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-mono font-bold text-emerald-400 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {lang === 'ar' ? 'الحوض الفلاحي / الولاية:' : 'Wilaya / Agricultural Basin:'}
            </span>
            <button
              onClick={onAutoDetectGPS}
              disabled={isDetectingGPS}
              className={`text-[10px] font-bold flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors ${
                isDetectingGPS 
                  ? 'text-zinc-500' 
                  : 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10'
              }`}
              title="Detect device GPS coordinates"
            >
              <Compass className={`w-3 h-3 ${isDetectingGPS ? 'animate-spin' : ''}`} />
              <span>{isDetectingGPS ? 'GPS...' : 'GPS'}</span>
            </button>
          </div>

          <select
            value={selectedRegion.id}
            onChange={(e) => {
              const reg = ALGERIAN_REGIONS.find((r) => r.id === e.target.value);
              if (reg) onSelectRegion(reg);
            }}
            className={`w-full text-xs font-semibold py-1.5 px-2.5 rounded-lg border focus:outline-none transition-colors ${
              isDark 
                ? 'bg-[#142621] border-emerald-500/30 text-white focus:border-emerald-400' 
                : 'bg-white border-slate-300 text-slate-800 focus:border-emerald-500'
            }`}
          >
            {ALGERIAN_REGIONS.map((reg) => (
              <option key={reg.id} value={reg.id}>
                {lang === 'ar' ? reg.nameAr : lang === 'fr' ? reg.nameFr : reg.nameEn}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Navigation List with clean sections */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 scrollbar-thin">
          {navSections.map((section, idx) => (
            <div key={idx}>
              <div className="px-2 mb-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                {section.title}
              </div>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item.id)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all duration-150 group ${
                        isActive
                          ? isDark
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(0,230,118,0.15)] font-bold'
                            : 'bg-emerald-600 text-white shadow-sm font-bold'
                          : isDark
                            ? item.highlight 
                              ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/50'
                              : 'text-zinc-300 hover:bg-[#12231e] hover:text-white'
                            : item.highlight
                              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                              : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-1.5 rounded-lg shrink-0 ${
                          isActive
                            ? isDark ? 'bg-emerald-500/30 text-emerald-300' : 'bg-emerald-700 text-white'
                            : isDark 
                              ? item.highlight ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800/60 text-zinc-400 group-hover:text-emerald-400' 
                              : item.highlight ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200/70 text-slate-600 group-hover:text-emerald-600'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 text-start">
                          <div className="text-xs truncate font-semibold leading-tight">
                            {item.label}
                          </div>
                          <div className={`text-[10px] truncate mt-0.5 font-normal ${
                            isActive 
                              ? isDark ? 'text-emerald-200/80' : 'text-white/80' 
                              : isDark ? 'text-zinc-400' : 'text-slate-500'
                          }`}>
                            {item.subLabel}
                          </div>
                        </div>
                      </div>

                      {item.badge && (
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 ms-1.5 ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : item.highlight
                              ? 'bg-emerald-500 text-slate-950 font-black'
                              : isDark ? 'bg-zinc-800 text-emerald-400' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 4. Live Telemetry & Spraying Status Badge */}
        <div className={`mx-3 mb-3 p-3 rounded-xl border ${
          isDark ? 'bg-black/40 border-emerald-500/20' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-[11px] mb-1.5">
            <span className="font-mono text-zinc-400 flex items-center gap-1.5">
              <Satellite className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span>Sentinel-2B Live</span>
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400 text-[11px]">
              {lang === 'ar' ? 'حالة الرش الفيتوصحي:' : 'Spraying Condition:'}
            </span>
            <span className={`font-bold text-[11px] flex items-center gap-1 ${
              sprayingSafety.status === 'dangerous' 
                ? 'text-rose-400' 
                : sprayingSafety.status === 'caution' 
                  ? 'text-amber-400' 
                  : 'text-emerald-400'
            }`}>
              {sprayingSafety.status === 'dangerous' ? (
                <ShieldAlert className="w-3 h-3" />
              ) : sprayingSafety.status === 'caution' ? (
                <AlertTriangle className="w-3 h-3" />
              ) : (
                <CheckCircle2 className="w-3 h-3" />
              )}
              <span>{sprayingSafety.status === 'dangerous' ? t.dangerSpray : sprayingSafety.status === 'caution' ? t.cautionSpray : t.safeToSpray}</span>
            </span>
          </div>
        </div>

        {/* 5. Sidebar Bottom Controls (Language, Theme, Quick APK Install) */}
        <div className={`p-3 border-t flex flex-col gap-2.5 ${
          isDark ? 'border-emerald-500/20 bg-black/30' : 'border-slate-200 bg-slate-50/80'
        }`}>
          {/* Quick Install Button */}
          <button
            onClick={() => handleItemClick('install')}
            className={`w-full py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-sm ${
              activeTab === 'install'
                ? 'bg-emerald-400 text-slate-950 font-black'
                : 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:brightness-110 active:scale-95'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'تثبيت التطبيق (APK مباشر)' : 'Installer l\'App (APK)'}</span>
          </button>

          {/* Language & Theme Controls Bar */}
          <div className="flex items-center justify-between gap-2">
            {/* Language Selection */}
            <div className={`flex items-center rounded-lg p-0.5 border flex-1 justify-center ${
              isDark ? 'bg-[#142621] border-emerald-500/20' : 'bg-white border-slate-200'
            }`}>
              <button
                onClick={() => setLang('ar')}
                className={`flex-1 py-1 text-[11px] font-bold rounded transition-all text-center ${
                  lang === 'ar'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : isDark ? 'text-zinc-400 hover:text-white' : 'text-slate-600 hover:text-black'
                }`}
                title="العربية (الجزائر)"
              >
                عربية
              </button>
              <button
                onClick={() => setLang('fr')}
                className={`flex-1 py-1 text-[11px] font-bold rounded transition-all text-center ${
                  lang === 'fr'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : isDark ? 'text-zinc-400 hover:text-white' : 'text-slate-600 hover:text-black'
                }`}
                title="Français"
              >
                FR
              </button>
              <button
                onClick={() => setLang('en')}
                className={`flex-1 py-1 text-[11px] font-bold rounded transition-all text-center ${
                  lang === 'en'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : isDark ? 'text-zinc-400 hover:text-white' : 'text-slate-600 hover:text-black'
                }`}
                title="English"
              >
                EN
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className={`p-1.5 rounded-lg border transition-all ${
                isDark 
                  ? 'bg-[#142621] border-emerald-500/25 text-amber-300 hover:bg-emerald-950/40' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
              title={isDark ? 'Light Mode' : 'Dark Mode'}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
