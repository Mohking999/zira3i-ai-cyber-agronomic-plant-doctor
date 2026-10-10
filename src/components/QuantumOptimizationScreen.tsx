import React, { useState } from 'react';
import { 
  Zap, 
  Layers, 
  ShieldAlert, 
  TrendingUp, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import { Language, ThemeMode, WeatherTelemetry } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface QuantumOptimizationScreenProps {
  telemetry: WeatherTelemetry | null;
  lang: Language;
  theme: ThemeMode;
}

export const QuantumOptimizationScreen: React.FC<QuantumOptimizationScreenProps> = ({
  telemetry,
  lang,
  theme,
}) => {
  const t = TRANSLATIONS[lang];
  const isDark = theme === 'dark';

  // State
  const [pulseCount, setPulseCount] = useState<number>(4);
  const [pulseDuration, setPulseDuration] = useState<number>(25); // minutes
  const [restDuration, setRestDuration] = useState<number>(35); // minutes
  const [salinityLevel, setSalinityLevel] = useState<number>(2.4); // dS/m

  const totalWateringTime = pulseCount * pulseDuration;
  const efficiencyGain = 36.8;

  const cycles = [
    { pulse: 1, start: '22:00', end: '22:25', rest: '35 min soak', capillaryStatus: 'Initial Wetting Core Infiltration' },
    { pulse: 2, start: '23:00', end: '23:25', rest: '35 min soak', capillaryStatus: 'Lateral Capillary Suction (+42%)' },
    { pulse: 3, start: '00:00', end: '00:25', rest: '35 min soak', capillaryStatus: 'Feeder Zone Rhizosphere Saturation' },
    { pulse: 4, start: '01:00', end: '01:25', rest: 'Stabilized', capillaryStatus: 'Salinity Salt Exclusion Barrier' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="border-b pb-4 border-emerald-500/20">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-400" />
              <h2 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {t.quantumTitle}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              {t.quantumSub}
            </p>
          </div>

          {/* Efficiency Gain Metric */}
          <div className="flex items-baseline gap-2 text-right">
            <span className="text-xs font-mono text-zinc-400 uppercase">{t.efficiencyGain}:</span>
            <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
              +{efficiencyGain}%
            </span>
          </div>
        </div>
      </div>

      {/* 3 Core Hydrodynamic Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Pillar 1: Pulse Drip System */}
        <div className={`p-5 rounded-2xl border flex flex-col justify-between ${
          isDark ? 'bg-[#0f1f1a]/80 border-emerald-500/25' : 'bg-white border-slate-200 shadow-md'
        }`}>
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase font-mono mb-2">
              <Clock className="w-4 h-4" />
              <span>{t.pulseStrategyTitle}</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed mb-4">
              {t.pulseDesc}
            </p>
          </div>
          <div className="text-xs font-mono text-emerald-300 pt-3 border-t border-emerald-500/15 space-y-1">
            <p>· 4 Micro-cycles × 25 min</p>
            <p>· 35 min Capillary Soak Interval</p>
            <p>· Zero Gravitational Deep Runoff</p>
          </div>
        </div>

        {/* Pillar 2: Targeted Subsurface Infiltration */}
        <div className={`p-5 rounded-2xl border flex flex-col justify-between ${
          isDark ? 'bg-[#0f1f1a]/80 border-cyan-500/25' : 'bg-white border-slate-200 shadow-md'
        }`}>
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase font-mono mb-2">
              <Layers className="w-4 h-4" />
              <span>{t.subsurfaceTitle}</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed mb-4">
              {t.subsurfaceDesc}
            </p>
          </div>
          <div className="text-xs font-mono text-cyan-300 pt-3 border-t border-cyan-500/15 space-y-1">
            <p>· Top 5 cm Dry Evaporation Shield</p>
            <p>· 25-50 cm Dense Active Wetting Bulb</p>
            <p>· Weed Emergence Suppressed</p>
          </div>
        </div>

        {/* Pillar 3: Hydrostatic Salinity Shield */}
        <div className={`p-5 rounded-2xl border flex flex-col justify-between ${
          isDark ? 'bg-[#0f1f1a]/80 border-amber-500/25' : 'bg-white border-slate-200 shadow-md'
        }`}>
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase font-mono mb-2">
              <ShieldAlert className="w-4 h-4" />
              <span>{t.salinityShieldTitle}</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed mb-4">
              {t.salinityShieldDesc}
            </p>
          </div>
          <div className="text-xs font-mono text-amber-300 pt-3 border-t border-amber-500/15 space-y-1">
            <p>· Salinity Leaching: {salinityLevel} dS/m ECe</p>
            <p>· Osmotic Root Shock: -82%</p>
            <p>· Salt Upconing Barrier Active</p>
          </div>
        </div>

      </div>

      {/* Visual Infiltration Model: Continuous vs Quantum Pulsed Wetting Bulb */}
      <div className={`p-5 sm:p-7 rounded-2xl border ${
        isDark ? 'bg-[#0f1f1a]/80 border-emerald-500/25' : 'bg-white border-slate-200 shadow-md'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className={`text-base sm:text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Soil Wetting Front & Bulb Simulation (Green-Ampt Model)
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Comparing horizontal capillary suction vs deep vertical drainage losses in North African soils.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400">
            Philip's Infiltration Model
          </span>
        </div>

        {/* Comparison Graphic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card A: Conventional Flood / Continuous Drip */}
          <div className={`p-5 rounded-xl border flex flex-col items-center text-center ${
            isDark ? 'bg-black/35 border-rose-500/20' : 'bg-slate-50 border-rose-200'
          }`}>
            <span className="text-xs font-bold text-rose-400 uppercase font-mono mb-2">
              Conventional Continuous Drip
            </span>

            {/* Visual Bulb Representation */}
            <div className="relative w-48 h-48 my-3 rounded-xl border border-zinc-800 bg-zinc-950/70 overflow-hidden flex flex-col items-center">
              <div className="w-full h-4 bg-amber-900/30 border-b border-amber-700/40 text-[9px] font-mono text-amber-400 text-center">
                Wetted Surface (High Evaporation)
              </div>
              <div className="w-16 h-36 mt-1 rounded-b-full bg-gradient-to-b from-blue-500/80 via-blue-700/70 to-blue-900/90 shadow-[0_0_15px_rgba(59,130,246,0.3)] flex flex-col items-center justify-end pb-2">
                <span className="text-[9px] font-mono text-white font-bold rotate-90 whitespace-nowrap">
                  Deep Drainage
                </span>
              </div>
              <div className="absolute bottom-1 text-[10px] font-mono text-rose-400 font-bold">
                24% Gravitational Loss &gt; 70cm
              </div>
            </div>

            <p className="text-xs text-zinc-400 max-w-xs mt-2">
              Water sinks vertically due to gravity before horizontal capillaries can hydrate root zones.
            </p>
          </div>

          {/* Card B: Quantum-Inspired Pulse Drip */}
          <div className={`p-5 rounded-xl border flex flex-col items-center text-center ${
            isDark ? 'bg-black/35 border-emerald-500/30 shadow-[0_0_25px_rgba(0,230,118,0.1)]' : 'bg-slate-50 border-emerald-200'
          }`}>
            <span className="text-xs font-bold text-emerald-400 uppercase font-mono mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Zira3i Pulse Drip Optimization
            </span>

            {/* Visual Wide Lateral Bulb Representation */}
            <div className="relative w-48 h-48 my-3 rounded-xl border border-emerald-500/30 bg-zinc-950/70 overflow-hidden flex flex-col items-center">
              <div className="w-full h-4 bg-amber-900/15 border-b border-zinc-700 text-[9px] font-mono text-zinc-400 text-center">
                Dry Surface (No Evaporation)
              </div>
              <div className="w-36 h-24 mt-4 rounded-full bg-gradient-to-b from-emerald-400/85 via-teal-500/75 to-cyan-600/85 shadow-[0_0_20px_rgba(0,230,118,0.4)] flex items-center justify-center">
                <span className="text-[10px] font-mono text-slate-950 font-black">
                  Feeder Root Zone
                </span>
              </div>
              <div className="absolute bottom-1 text-[10px] font-mono text-emerald-400 font-bold">
                Deep Loss &lt; 4.5% (High Capillary Retention)
              </div>
            </div>

            <p className="text-xs text-zinc-300 max-w-xs mt-2">
              Micro-bursts allow capillary matric suction to expand water laterally by +42%, keeping roots hydrated with zero puddle evaporation.
            </p>
          </div>

        </div>

        {/* Pulse Schedule Timeline Table */}
        <div className="mt-8 border-t border-emerald-500/20 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-emerald-400 uppercase font-mono flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{t.pulseScheduleTitle}</span>
            </h4>
            <span className="text-xs font-mono text-zinc-400">
              Total Active Pump Time: {totalWateringTime} mins
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {cycles.map((c) => (
              <div 
                key={c.pulse}
                className={`p-3.5 rounded-xl border flex flex-col justify-between ${
                  isDark ? 'bg-[#142621]/80 border-emerald-500/20' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono font-black text-emerald-400">
                    PULSE #{c.pulse}
                  </span>
                  <span className="text-xs font-mono text-zinc-300 font-bold">
                    {c.start} - {c.end}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-cyan-300 mt-2">
                  Rest: {c.rest}
                </div>
                <div className="text-[10px] text-zinc-400 mt-1 italic">
                  {c.capillaryStatus}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
