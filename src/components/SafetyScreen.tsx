import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  CheckCircle2, 
  Phone, 
  MapPin, 
  AlertTriangle, 
  FileText, 
  Clock, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { Language, ThemeMode } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { PHI_DATABASE, SPRAYING_GOLDEN_RULES, INPV_CONTACTS } from '../data/agriculturalData';

interface SafetyScreenProps {
  lang: Language;
  theme: ThemeMode;
}

export const SafetyScreen: React.FC<SafetyScreenProps> = ({
  lang,
  theme,
}) => {
  const t = TRANSLATIONS[lang];
  const isDark = theme === 'dark';

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCropFilter, setSelectedCropFilter] = useState<string>('all');

  // Filter PHI database
  const filteredPhi = PHI_DATABASE.filter((item) => {
    const matchesSearch = 
      item.activeIngredient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tradeNames.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.targetPests.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCrop = 
      selectedCropFilter === 'all' ||
      item.crops.some((c) => c.toLowerCase().includes(selectedCropFilter.toLowerCase()));

    return matchesSearch && matchesCrop;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="border-b pb-4 border-emerald-500/20">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-emerald-400" />
          <h2 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {t.safetyTitle}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          {t.safetySub}
        </p>
      </div>

      {/* 5 Golden Rules for Agricultural Spraying */}
      <div className={`p-5 sm:p-7 rounded-2xl border ${
        isDark ? 'bg-[#101d19]/80 border-emerald-500/30' : 'bg-white border-slate-200 shadow-md'
      }`}>
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <h3 className={`text-base sm:text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {t.fiveGoldenRulesTitle}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SPRAYING_GOLDEN_RULES.map((rule) => {
            const title = lang === 'ar' ? rule.titleAr : lang === 'fr' ? rule.titleFr : rule.titleEn;
            const desc = lang === 'ar' ? rule.descAr : lang === 'fr' ? rule.descFr : rule.descEn;

            return (
              <div 
                key={rule.ruleNumber}
                className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                  isDark ? 'bg-[#142420]/80 border-emerald-500/20 hover:border-emerald-500/40' : 'bg-slate-50 border-slate-200 hover:bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center font-mono">
                      {rule.ruleNumber}
                    </span>
                    <h4 className={`font-bold text-xs sm:text-sm leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {title}
                    </h4>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed mt-1">
                    {desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pre-Harvest Interval (PHI / DAR) Database */}
      <div className={`p-5 sm:p-7 rounded-2xl border space-y-5 ${
        isDark ? 'bg-[#101d19]/80 border-emerald-500/30' : 'bg-white border-slate-200 shadow-md'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <h3 className={`text-base sm:text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {t.phiDarTitle} Database (INPV Registered Actives)
              </h3>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Exact safe withdrawal days (Délai d'Attente avant Récolte) between application and food safety release.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder={t.searchPhi}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-9 pr-3 py-1.5 rounded-xl text-xs border transition-all ${
                  isDark
                    ? 'bg-black/40 border-emerald-500/30 text-white placeholder:text-zinc-500 focus:border-emerald-400 focus:outline-none'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none'
                }`}
              />
            </div>

            <select
              value={selectedCropFilter}
              onChange={(e) => setSelectedCropFilter(e.target.value)}
              className={`py-1.5 px-3 rounded-xl text-xs border ${
                isDark
                  ? 'bg-black/40 border-emerald-500/30 text-emerald-300'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <option value="all">{t.allCrops}</option>
              <option value="potatoes">Potatoes (بطاطا)</option>
              <option value="tomatoes">Tomatoes (طماطم)</option>
              <option value="olives">Olives (زيتون)</option>
              <option value="citrus">Citrus (حمضيات)</option>
              <option value="dates">Date Palms (نخيل)</option>
            </select>
          </div>
        </div>

        {/* PHI Table */}
        <div className="overflow-x-auto scrollbar-none">
          <table className="w-full text-left text-xs font-sans">
            <thead className={`border-b text-zinc-400 uppercase font-mono text-[10px] ${
              isDark ? 'border-emerald-500/20 bg-black/30' : 'border-slate-200 bg-slate-100'
            }`}>
              <tr>
                <th className="py-3 px-3">{t.activeIngredient}</th>
                <th className="py-3 px-3">{t.tradeNames}</th>
                <th className="py-3 px-3">{t.authorizedUses}</th>
                <th className="py-3 px-3 text-center">{t.phiDaysCol}</th>
                <th className="py-3 px-3 text-center">{t.inpvStatus}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredPhi.map((item) => (
                <tr 
                  key={item.id}
                  className={`transition-colors ${
                    isDark ? 'hover:bg-emerald-500/5' : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="py-3 px-3 font-bold text-white">
                    {item.activeIngredient}
                    <span className="block text-[10px] font-mono text-emerald-400 font-normal mt-0.5">
                      {item.category} • Max {item.maxTreatmentsPerSeason}x/yr
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-zinc-300">
                    {item.tradeNames}
                  </td>
                  <td className="py-3 px-3 text-zinc-300">
                    <span className="font-semibold text-emerald-300">{item.crops.join(', ')}</span>
                    <span className="block text-[11px] text-zinc-400 mt-0.5">Target: {item.targetPests}</span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-lg font-mono font-black text-xs ${
                      item.phiDays <= 3
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : item.phiDays <= 7
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {item.phiDays} days
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      INPV Homologué
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official INPV & DSA Contacts Directory */}
      <div className={`p-5 sm:p-7 rounded-2xl border space-y-4 ${
        isDark ? 'bg-[#101d19]/80 border-emerald-500/30' : 'bg-white border-slate-200 shadow-md'
      }`}>
        <div className="flex items-center gap-2">
          <Phone className="w-5 h-5 text-emerald-400" />
          <h3 className={`text-base sm:text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {t.inpvDirectoryTitle}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {INPV_CONTACTS.map((station, idx) => (
            <div 
              key={idx}
              className={`p-4 rounded-xl border flex flex-col justify-between ${
                isDark ? 'bg-[#142420]/80 border-emerald-500/20' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div>
                <h4 className={`font-bold text-sm leading-snug mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {lang === 'ar' ? station.regionAr : station.region}
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                  {lang === 'ar' ? station.roleAr : station.role}
                </p>
                <div className="space-y-1.5 text-xs font-mono text-emerald-300">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{station.phone}</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-zinc-400 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                    <span>{station.address}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
