import React, { useState } from 'react';
import { 
  Droplet, 
  Sun, 
  Layers, 
  Calculator, 
  Lightbulb, 
  Clock, 
  Zap, 
  HelpCircle,
  TrendingDown,
  Gauge
} from 'lucide-react';
import { Language, ThemeMode, WeatherTelemetry } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { CROP_PROFILES } from '../data/agriculturalData';
import { WaveGauge } from './WaveGauge';

interface WaterAdvisorScreenProps {
  telemetry: WeatherTelemetry | null;
  lang: Language;
  theme: ThemeMode;
}

export const WaterAdvisorScreen: React.FC<WaterAdvisorScreenProps> = ({
  telemetry,
  lang,
  theme,
}) => {
  const t = TRANSLATIONS[lang];
  const isDark = theme === 'dark';

  // State
  const [selectedCropId, setSelectedCropId] = useState<string>('potatoes');
  const [soilType, setSoilType] = useState<string>('sandy-loam');
  const [areaHa, setAreaHa] = useState<number>(1.5);
  const [emitterRateLh, setEmitterRateLh] = useState<number>(4.0);
  const [lateralSpacingM, setLateralSpacingM] = useState<number>(0.8);
  const [emitterSpacingM, setEmitterSpacingM] = useState<number>(0.4);
  const [interactiveMoisture, setInteractiveMoisture] = useState<number>(telemetry?.soilMoisture ?? 62);

  const selectedCrop = CROP_PROFILES.find((c) => c.id === selectedCropId) || CROP_PROFILES[0];
  const et0 = telemetry?.et0 ?? 4.8;
  const etc = Math.round(et0 * selectedCrop.kcMid * 10) / 10;

  // Calculation: Net irrigation requirement per ha in m3/day (1 mm = 10 m3/ha)
  const dailyVolumePerHaM3 = Math.round(etc * 10 * 10) / 10;
  const totalVolumeM3 = Math.round(dailyVolumePerHaM3 * areaHa * 10) / 10;

  // Emitters calculation:
  // emitters per ha = 10,000 / (lateralSpacing * emitterSpacing)
  const emittersPerHa = Math.round(10000 / (lateralSpacingM * emitterSpacingM));
  const totalEmitters = Math.round(emittersPerHa * areaHa);
  const systemFlowRateM3h = (totalEmitters * emitterRateLh) / 1000;
  const pumpHours = Math.round((totalVolumeM3 / systemFlowRateM3h) * 10) / 10;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      
      {/* Page Title & Subtitle */}
      <div className="border-b pb-4 border-emerald-500/20">
        <h2 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {t.waterAdvisorTitle}
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          {t.waterAdvisorSub}
        </p>
      </div>

      {/* FAO-56 Penman-Monteith ET₀ Evapotranspiration Banner & Sonelgaz Off-Peak Window */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* ET₀ Banner */}
        <div className={`p-5 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
          isDark 
            ? 'bg-gradient-to-r from-emerald-950/40 to-[#101d19] border-emerald-500/30' 
            : 'bg-emerald-50 border-emerald-200'
        }`}>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider mb-1">
              <Sun className="w-4 h-4 text-amber-400" />
              <span>FAO-56 Penman-Monteith Reference ET₀</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black font-mono text-emerald-400">
                {et0.toFixed(1)}
              </span>
              <span className="text-sm font-bold text-zinc-400">mm / day</span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Current Crop ET_c ({selectedCrop.botanical}): <span className="font-bold text-emerald-300">{etc} mm/day</span> (Kc = {selectedCrop.kcMid})
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Droplet className="w-8 h-8 animate-pulse" />
          </div>
        </div>

        {/* Sonelgaz Energy-Saving Pump Advice */}
        <div className={`p-5 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
          isDark 
            ? 'bg-gradient-to-r from-cyan-950/40 to-[#101d19] border-cyan-500/30' 
            : 'bg-cyan-50 border-cyan-200'
        }`}>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-1">
              <Clock className="w-4 h-4" />
              <span>{t.sonelgazAdvice}</span>
            </div>
            <h4 className="text-sm sm:text-base font-black text-cyan-200">
              Optimal Window: 22:00 – 06:00
            </h4>
            <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
              {t.sonelgazAdviceText}
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Zap className="w-8 h-8" />
          </div>
        </div>

      </div>

      {/* Main Two-Column Layout: Left (Crop Profiles & Wave Gauge) & Right (Hectare Calculator & Drought Tips) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        
        {/* Left Column: Dynamic Crop Profiles & Animated Reservoir Wave Gauge */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Dynamic Crop Profiles Selector */}
          <div className={`p-5 rounded-2xl border ${
            isDark ? 'bg-[#101d19]/80 border-emerald-500/30' : 'bg-white border-slate-200 shadow-md'
          }`}>
            <label className="text-xs font-bold text-emerald-400 uppercase font-mono mb-3 block">
              {t.selectCropProfile} :
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {CROP_PROFILES.map((crop) => {
                const isSelected = selectedCropId === crop.id;
                return (
                  <button
                    key={crop.id}
                    onClick={() => setSelectedCropId(crop.id)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? isDark
                          ? 'bg-emerald-500/25 border-emerald-400 text-white shadow-[0_0_15px_rgba(0,230,118,0.2)]'
                          : 'bg-emerald-600 border-emerald-700 text-white shadow-sm'
                        : isDark
                          ? 'bg-[#142420]/60 border-emerald-500/20 text-zinc-300 hover:border-emerald-500/40'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-bold text-xs uppercase tracking-wide">
                      {crop.nameKey.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-mono opacity-80 italic truncate mt-1">
                      {crop.botanical}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-emerald-400 mt-2">
                      Kc: {crop.kcMid}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Critical Vegetative Stage Note */}
            <div className="mt-4 p-3 rounded-xl bg-black/30 border border-emerald-500/20 text-xs text-zinc-300">
              <span className="font-bold text-emerald-400 block mb-0.5">Critical Moisture Stage:</span>
              <p>
                {lang === 'ar' ? selectedCrop.criticalStages.ar : lang === 'fr' ? selectedCrop.criticalStages.fr : selectedCrop.criticalStages.en}
              </p>
            </div>
          </div>

          {/* Animated Wave Reservoir Gauge */}
          <div className={`p-5 rounded-2xl border flex flex-col items-center justify-center text-center ${
            isDark ? 'bg-[#101d19]/80 border-emerald-500/30' : 'bg-white border-slate-200 shadow-md'
          }`}>
            <h3 className={`text-base font-black mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t.waveGaugeTitle}
            </h3>
            <p className="text-xs text-zinc-400 mb-4 max-w-sm">
              Root-zone hydraulic status for {selectedCrop.nameKey} (effective root depth: {selectedCrop.rootDepthMin}-{selectedCrop.rootDepthMax} cm).
            </p>

            <WaveGauge
              percentage={interactiveMoisture}
              title={t.currentMoisture}
              fieldCapacityLabel={t.fieldCapacity}
              wiltingPointLabel={t.wiltingPoint}
              isDark={isDark}
            />

            {/* Interactive Moisture Slider */}
            <div className="w-full max-w-xs mt-4">
              <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
                <span>Drought Stress (20%)</span>
                <span>Saturation (90%)</span>
              </div>
              <input
                type="range"
                min="15"
                max="95"
                value={interactiveMoisture}
                onChange={(e) => setInteractiveMoisture(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>
          </div>

        </div>

        {/* Right Column: Hectare Water Volume Calculator & Drought Mitigation Tips */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Hectare Water Volume Calculator */}
          <div className={`p-5 rounded-2xl border space-y-5 ${
            isDark ? 'bg-[#101d19]/80 border-emerald-500/30' : 'bg-white border-slate-200 shadow-md'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-emerald-500/20">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-400" />
                <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {t.calculateVolume}
                </h3>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                4 L/h Drip Spec
              </span>
            </div>

            {/* Input Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Field Area (Ha) */}
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                  {t.fieldArea} :
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={areaHa}
                  onChange={(e) => setAreaHa(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                  className={`w-full p-2.5 rounded-xl text-sm font-mono border ${
                    isDark
                      ? 'bg-black/30 border-emerald-500/30 text-emerald-300'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              {/* Soil Texture Selection */}
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                  {t.soilTexture} :
                </label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className={`w-full p-2.5 rounded-xl text-xs sm:text-sm font-sans border ${
                    isDark
                      ? 'bg-black/30 border-emerald-500/30 text-emerald-300'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                >
                  <option value="sandy-loam">{t.sandyLoam}</option>
                  <option value="clay-loam">{t.clayLoam}</option>
                  <option value="silt">{t.silt}</option>
                </select>
              </div>

              {/* Emitter Flow Rate (L/h) */}
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                  {t.emitterDischarge} :
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="1.0"
                  max="10.0"
                  value={emitterRateLh}
                  onChange={(e) => setEmitterRateLh(parseFloat(e.target.value) || 4.0)}
                  className={`w-full p-2.5 rounded-xl text-sm font-mono border ${
                    isDark
                      ? 'bg-black/30 border-emerald-500/30 text-emerald-300'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              {/* Lateral Spacing (m) */}
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                  Lateral Spacing (m) :
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.4"
                  max="3.0"
                  value={lateralSpacingM}
                  onChange={(e) => setLateralSpacingM(parseFloat(e.target.value) || 0.8)}
                  className={`w-full p-2.5 rounded-xl text-sm font-mono border ${
                    isDark
                      ? 'bg-black/30 border-emerald-500/30 text-emerald-300'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

            </div>

            {/* Calculated Results Banner */}
            <div className={`p-4 rounded-xl border grid grid-cols-2 gap-4 ${
              isDark ? 'bg-[#142420] border-emerald-500/40' : 'bg-emerald-50 border-emerald-200'
            }`}>
              <div>
                <span className="text-[11px] font-mono text-zinc-400 block uppercase">
                  {t.hectareVolume}
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
                    {totalVolumeM3}
                  </span>
                  <span className="text-xs font-bold text-zinc-400">m³</span>
                </div>
                <span className="text-[10px] text-zinc-400 block mt-0.5">
                  ({dailyVolumePerHaM3} m³/ha/day)
                </span>
              </div>

              <div>
                <span className="text-[11px] font-mono text-zinc-400 block uppercase">
                  {t.pumpDuration}
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-cyan-400">
                    {pumpHours}
                  </span>
                  <span className="text-xs font-bold text-zinc-400">hours</span>
                </div>
                <span className="text-[10px] text-zinc-400 block mt-0.5">
                  Total {totalEmitters.toLocaleString()} emitters
                </span>
              </div>
            </div>

          </div>

          {/* Agronomist's Drought Mitigation Tips */}
          <div className={`p-5 rounded-2xl border space-y-4 ${
            isDark ? 'bg-[#101d19]/80 border-emerald-500/30' : 'bg-white border-slate-200 shadow-md'
          }`}>
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {t.droughtTipsTitle} ({selectedCrop.nameKey})
              </h3>
            </div>

            <ul className="space-y-3">
              {(lang === 'ar' ? selectedCrop.droughtTips.ar : lang === 'fr' ? selectedCrop.droughtTips.fr : selectedCrop.droughtTips.en).map((tip, idx) => (
                <li 
                  key={idx} 
                  className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed ${
                    isDark ? 'bg-[#142420]/60 border-emerald-500/20 text-zinc-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 mt-0.5 font-mono text-xs">
                    {idx + 1}
                  </span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
};
