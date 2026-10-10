import React from 'react';
import { 
  Menu, 
  Download, 
  MapPin, 
  Satellite, 
  LayoutDashboard, 
  Microscope, 
  Droplet, 
  Zap, 
  ShieldCheck, 
  Smartphone, 
  Terminal,
  Sun,
  Moon,
  Network
} from 'lucide-react';
import { Language, ThemeMode, RegionPreset } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  selectedRegion?: RegionPreset;
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  theme,
  setTheme,
  selectedRegion,
  onOpenMobileMenu,
}) => {
  const isDark = theme === 'dark';

  // Get active tab info
  const tabTitles: Record<string, { titleAr: string; titleFr: string; titleEn: string; icon: React.ElementType }> = {
    dashboard: { 
      titleAr: 'لوحة القيادة والمؤشرات الحية', 
      titleFr: 'Tableau de Bord & Télémétrie', 
      titleEn: 'Overview Dashboard & Telemetry', 
      icon: LayoutDashboard 
    },
    diagnosis: { 
      titleAr: 'الفحص والتشخيص الذكي للأمراض', 
      titleFr: 'Diagnostic IA des Pathologies', 
      titleEn: 'AI Plant Pathology Diagnosis', 
      icon: Microscope 
    },
    water: { 
      titleAr: 'المستشار الذكي للري (FAO-56)', 
      titleFr: 'Conseiller Irrigation & Bilan Hydro', 
      titleEn: 'Smart Irrigation Advisor (FAO-56)', 
      icon: Droplet 
    },
    quantum: { 
      titleAr: 'كفاءة الري والنبض بالتنقيط (-36% مياه)', 
      titleFr: 'Hydrodynamique & Goutte-à-Goutte Pulsé', 
      titleEn: 'Quantum Drip Pulse & Hydrodynamics', 
      icon: Zap 
    },
    safety: { 
      titleAr: 'دليل حماية النباتات وفترات الأمان (INPV)', 
      titleFr: 'Guide Sécurité Phyto & DAR (INPV)', 
      titleEn: 'INPV Phytosanitary Safety & PHI', 
      icon: ShieldCheck 
    },
    install: { 
      titleAr: 'تثبيت التطبيق وتنزيل APK الرسمي', 
      titleFr: 'Installation de l\'Application (APK)', 
      titleEn: 'Install Official Android APK', 
      icon: Smartphone 
    },
    'api-hub': {
      titleAr: 'بوابة الربط بالـ APIs والمستشعرات الحقلية',
      titleFr: 'Passerelle APIs & Connecteurs IoT',
      titleEn: 'API Gateway & Field Sensor Ports',
      icon: Network,
    },
    specs: { 
      titleAr: 'المواصفات التقنية والنظام بدون إنترنت', 
      titleFr: 'Architecture Technique & Mode Hors-Ligne', 
      titleEn: 'Technical Architecture & Offline Specs', 
      icon: Terminal 
    },
  };

  const currentTabInfo = tabTitles[activeTab] || tabTitles.dashboard;
  const ActiveIcon = currentTabInfo.icon;
  const currentTitle = lang === 'ar' ? currentTabInfo.titleAr : lang === 'fr' ? currentTabInfo.titleFr : currentTabInfo.titleEn;

  return (
    <header className={`sticky top-0 z-30 w-full border-b backdrop-blur-xl transition-colors duration-200 ${
      isDark 
        ? 'bg-[#091411]/90 border-emerald-500/20 shadow-sm' 
        : 'bg-white/95 border-slate-200 shadow-sm'
    }`}>
      <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
        
        {/* Left: Mobile Drawer Trigger & Current Page Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className={`p-2 rounded-xl lg:hidden transition-colors border ${
              isDark 
                ? 'border-emerald-500/30 bg-[#12231e] text-emerald-400 hover:bg-emerald-900/40' 
                : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            aria-label="Open navigation sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl hidden sm:flex items-center justify-center ${
              isDark ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-emerald-100 text-emerald-700'
            }`}>
              <ActiveIcon className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h1 className={`text-sm sm:text-base font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {currentTitle}
              </h1>
              {selectedRegion && (
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
                  <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="truncate max-w-[200px] sm:max-w-xs">
                    {lang === 'ar' ? selectedRegion.nameAr : selectedRegion.nameEn}
                  </span>
                  <span className="text-zinc-600 hidden md:inline">·</span>
                  <span className="text-emerald-400 hidden md:inline">Copernicus Sentinel-2B</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Quick APK Install & Quick Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Install APK Shortcut */}
          <button
            onClick={() => setActiveTab('install')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all shadow-sm ${
              activeTab === 'install'
                ? 'bg-emerald-400 text-slate-950 font-black ring-2 ring-emerald-300'
                : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 active:scale-95'
            }`}
            title="Download APK for Android"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {lang === 'ar' ? 'تحميل APK' : lang === 'fr' ? 'Installer APK' : 'Install APK'}
            </span>
            <span className="sm:hidden font-mono font-black">APK</span>
          </button>

          {/* Language Switcher */}
          <div className={`flex items-center rounded-lg p-0.5 border ${
            isDark ? 'bg-[#142621] border-emerald-500/25' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => setLang('ar')}
              className={`px-2 py-0.5 text-xs font-bold rounded transition-all ${
                lang === 'ar'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : isDark ? 'text-zinc-400 hover:text-white' : 'text-slate-600 hover:text-black'
              }`}
            >
              ع
            </button>
            <button
              onClick={() => setLang('fr')}
              className={`px-2 py-0.5 text-xs font-bold rounded transition-all ${
                lang === 'fr'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : isDark ? 'text-zinc-400 hover:text-white' : 'text-slate-600 hover:text-black'
              }`}
            >
              FR
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-0.5 text-xs font-bold rounded transition-all ${
                lang === 'en'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : isDark ? 'text-zinc-400 hover:text-white' : 'text-slate-600 hover:text-black'
              }`}
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
            title={isDark ? 'Switch to Light' : 'Switch to Dark'}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

      </div>
    </header>
  );
};
