/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Language, ThemeMode, WeatherTelemetry, RegionPreset } from './types';
import { ALGERIAN_REGIONS } from './data/agriculturalData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ObservatoryDashboard } from './components/ObservatoryDashboard';
import { DiagnosisScreen } from './components/DiagnosisScreen';
import { WaterAdvisorScreen } from './components/WaterAdvisorScreen';
import { QuantumOptimizationScreen } from './components/QuantumOptimizationScreen';
import { SafetyScreen } from './components/SafetyScreen';
import { InstallationScreen } from './components/InstallationScreen';
import { ApiPortalScreen } from './components/ApiPortalScreen';
import { TechArchitectureModal } from './components/TechArchitectureModal';
import { FloatingAIAssistant } from './components/FloatingAIAssistant';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [lang, setLang] = useState<Language>('ar');
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [selectedRegion, setSelectedRegion] = useState<RegionPreset>(ALGERIAN_REGIONS[0]);
  const [telemetry, setTelemetry] = useState<WeatherTelemetry | null>(null);
  const [loadingTelemetry, setLoadingTelemetry] = useState<boolean>(true);
  const [isDetectingGPS, setIsDetectingGPS] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Set document direction for Arabic RTL vs English/French LTR
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Fetch Agro-weather telemetry for current coordinates
  const fetchWeather = async (lat: number, lon: number, regionName: string) => {
    setLoadingTelemetry(true);
    try {
      const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}&region=${encodeURIComponent(regionName)}`);
      const data = await res.json();
      if (data.success && data.telemetry) {
        setTelemetry(data.telemetry);
      }
    } catch (err) {
      console.warn('Weather fetch error, using default telemetry fallback:', err);
    } finally {
      setLoadingTelemetry(false);
    }
  };

  useEffect(() => {
    fetchWeather(selectedRegion.lat, selectedRegion.lon, selectedRegion.nameEn);
  }, [selectedRegion]);

  // Real GPS detection via browser Geolocation API
  const handleAutoDetectGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setIsDetectingGPS(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        const customRegion: RegionPreset = {
          id: 'custom-gps',
          nameEn: `Field GPS (${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E)`,
          nameAr: `حقل مخصص (${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E)`,
          nameFr: `Parcelle GPS (${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E)`,
          lat,
          lon,
          crops: ['Local Mixed Crops'],
          climate: 'Auto-detected Micro-Climate',
        };

        setSelectedRegion(customRegion);
        setIsDetectingGPS(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setIsDetectingGPS(false);
        alert('Could not access GPS location. Please check browser permissions.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const isDark = theme === 'dark';

  return (
    <div 
      className={`min-h-screen font-sans transition-colors duration-300 relative ${
        isDark 
          ? 'bg-[#0c1412] text-slate-100 selection:bg-emerald-500 selection:text-black' 
          : 'bg-[#f6f8f6] text-[#1f2923] selection:bg-emerald-500 selection:text-white'
      }`}
    >
      {/* Cyber-Organic Bio Grid Background & Ambient Lighting */}
      {isDark ? (
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-[radial-gradient(#00e676_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.06]" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px]" />
        </div>
      ) : (
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04]" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-200/20 rounded-full blur-[100px]" />
        </div>
      )}

      {/* 1. LEFT SIDEBAR DASHBOARD (Persistent on Desktop, Drawer on Mobile) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        theme={theme}
        setTheme={setTheme}
        selectedRegion={selectedRegion}
        onSelectRegion={setSelectedRegion}
        onAutoDetectGPS={handleAutoDetectGPS}
        isDetectingGPS={isDetectingGPS}
        telemetry={telemetry}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* 2. MAIN APPLICATION CONTENT AREA (Offset by Sidebar Width on Desktop) */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-72 sm:lg:ml-80">
        
        {/* Top Sticky Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          lang={lang}
          setLang={setLang}
          theme={theme}
          setTheme={setTheme}
          selectedRegion={selectedRegion}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        {/* Dedicated Page View (Organized per tab option) */}
        <main className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1">
          {activeTab === 'dashboard' && (
            <ObservatoryDashboard
              telemetry={telemetry}
              loadingTelemetry={loadingTelemetry}
              selectedRegion={selectedRegion}
              onSelectRegion={setSelectedRegion}
              onRefreshWeather={() => fetchWeather(selectedRegion.lat, selectedRegion.lon, selectedRegion.nameEn)}
              onAutoDetectGPS={handleAutoDetectGPS}
              isDetectingGPS={isDetectingGPS}
              onNavigateTab={setActiveTab}
              lang={lang}
              theme={theme}
            />
          )}

          {activeTab === 'diagnosis' && (
            <DiagnosisScreen
              telemetry={telemetry}
              farmRegionName={lang === 'ar' ? selectedRegion.nameAr : selectedRegion.nameEn}
              lang={lang}
              theme={theme}
            />
          )}

          {activeTab === 'water' && (
            <WaterAdvisorScreen
              telemetry={telemetry}
              lang={lang}
              theme={theme}
            />
          )}

          {activeTab === 'quantum' && (
            <QuantumOptimizationScreen
              telemetry={telemetry}
              lang={lang}
              theme={theme}
            />
          )}

          {activeTab === 'safety' && (
            <SafetyScreen
              lang={lang}
              theme={theme}
            />
          )}

          {activeTab === 'install' && (
            <InstallationScreen
              lang={lang}
              theme={theme}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'api-hub' && (
            <ApiPortalScreen
              lang={lang}
              theme={theme}
            />
          )}

          {activeTab === 'specs' && (
            <TechArchitectureModal
              lang={lang}
              theme={theme}
            />
          )}
        </main>

        {/* Footer */}
        <footer className={`mt-auto border-t py-6 relative z-10 ${
          isDark ? 'border-emerald-500/20 bg-black/40 text-zinc-400' : 'border-slate-200 bg-white/60 text-slate-600'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Zira3i AI (زرعي AI) — منصة الرصد الفلاحي والري الذكي</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('install')}
                className="text-emerald-400 hover:text-emerald-300 font-bold underline underline-offset-4"
              >
                {lang === 'ar' ? 'تثبيت التطبيق (APK مباشر)' : 'Installer l\'APK'}
              </button>
              <span className="text-zinc-600">·</span>
              <span>INPV • FAO-56 • Sentinel-2B</span>
            </div>
          </div>
        </footer>

      </div>

      {/* Floating Virtual Agronomist FAB & Chat (Dr. Zira3i) */}
      <FloatingAIAssistant
        telemetry={telemetry}
        farmRegionName={lang === 'ar' ? selectedRegion.nameAr : selectedRegion.nameEn}
        lang={lang}
        theme={theme}
      />
    </div>
  );
}
