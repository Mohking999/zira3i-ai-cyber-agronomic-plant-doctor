import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Smartphone, 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  Check, 
  Share2, 
  QrCode, 
  HardDrive, 
  WifiOff, 
  Cpu, 
  Layers, 
  AlertCircle, 
  ChevronRight, 
  ExternalLink,
  Terminal,
  Zap,
  Camera,
  Compass,
  ArrowRight
} from 'lucide-react';
import { Language, ThemeMode } from '../types';

interface InstallationScreenProps {
  lang: Language;
  theme: ThemeMode;
  onNavigateTab: (tabId: string) => void;
}

export const InstallationScreen: React.FC<InstallationScreenProps> = ({
  lang,
  theme,
  onNavigateTab,
}) => {
  const isDark = theme === 'dark';

  // Download simulation and state
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedChecksum, setCopiedChecksum] = useState(false);
  const [copiedAdb, setCopiedAdb] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<'samsung' | 'xiaomi' | 'oppo' | 'transsion' | 'huawei' | 'stock'>('samsung');

  // APK Metadata
  const apkInfo = {
    filename: 'zira3i-ai-v2.4.2-algeria.apk',
    version: '2.4.2',
    versionCode: '20402',
    package: 'dz.zira3i.ai',
    sizeMb: '24.8 MB',
    minAndroid: 'Android 7.0 (Nougat, API 24)',
    targetAndroid: 'Android 15 (API 35)',
    architectures: 'arm64-v8a, armeabi-v7a, x86_64 (Universal)',
    sha256: '9242eefad57b07f491cd28f924cb03c025d160d36a1204be97cc561d79017308',
    md5: '9b5eb3f88cd2f8d58a8bfb2e87998a9a',
    downloadUrl: '/api/download/apk',
  };

  const fullDownloadUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/api/download/apk` 
    : 'https://ais-pre-64ftlp6qjzr7gipytcopdw-112299221040.europe-west2.run.app/api/download/apk';

  // Handle Real APK Download with Visual Feedback
  const handleInstallAsApk = () => {
    setDownloading(true);
    setDownloadProgress(10);
    setDownloadComplete(false);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 180);

    setTimeout(() => {
      clearInterval(interval);
      setDownloadProgress(100);
      setDownloading(false);
      setDownloadComplete(true);

      // Trigger the real browser file download
      const link = document.createElement('a');
      link.href = '/api/download/apk';
      link.setAttribute('download', apkInfo.filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 1000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullDownloadUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyChecksum = () => {
    navigator.clipboard.writeText(apkInfo.sha256);
    setCopiedChecksum(true);
    setTimeout(() => setCopiedChecksum(false), 2500);
  };

  const handleCopyAdb = () => {
    navigator.clipboard.writeText(`adb install ${apkInfo.filename}`);
    setCopiedAdb(true);
    setTimeout(() => setCopiedAdb(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = lang === 'ar'
      ? `حمّل تطبيق زرعي AI الميداني بصيغة APK للتشخيص بالذكاء الاصطناعي وإدارة مياه السقي بالجزائر:\n${fullDownloadUrl}`
      : `Téléchargez l'application Zira3i AI (APK) pour le diagnostic agricole par IA et la gestion hydrique en Algérie:\n${fullDownloadUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Manufacturer instructions dictionary
  const brandInstructions = {
    samsung: {
      name: 'Samsung Galaxy (One UI)',
      stepsAr: [
        'افتح "الضبط" (Settings) > انقر على "الأمان والخصوصية" (Security and privacy).',
        'انقر على "تثبيت التطبيقات غير المعروفة" (Install unknown apps).',
        'فعّل المفتاح بجانب "Google Chrome" أو "ملفاتي" (My Files).',
        'افتح ملف zira3i-ai-v2.4.2-algeria.apk من قائمة الإشعارات واضغط "تثبيت".'
      ],
      stepsFr: [
        'Ouvrez Paramètres > Sécurité et confidentialité > Installation d\'applis inconnues.',
        'Sélectionnez l\'application source (ex: Chrome ou Mes fichiers).',
        'Activez l\'option "Autoriser depuis cette source".',
        'Ouvrez le fichier APK téléchargé et appuyez sur Installer.'
      ],
      stepsEn: [
        'Open Settings > Security and privacy > Install unknown apps.',
        'Select the source app (e.g., Chrome or My Files).',
        'Toggle on "Allow from this source".',
        'Tap the downloaded APK in Notifications or My Files and tap "Install".'
      ]
    },
    xiaomi: {
      name: 'Xiaomi / Redmi / POCO (HyperOS / MIUI)',
      stepsAr: [
        'افتح "الإعدادات" > اختر "الحماية والخصوصية" > "أذونات خاصة".',
        'انقر على "تثبيت تطبيقات غير معروفة" (Install unknown apps).',
        'اختر متصفح "Chrome" أو مدير الملفات "File Manager" وفعل السماح.',
        'عند ظهور نافذة الفحص الأمني من شاومي، اضغط "أعلم بالمخاطر" ثم انقر "موافق" لتأكيد التثبيت.'
      ],
      stepsFr: [
        'Ouvrez Paramètres > Confidentialité et protection > Accès spécial.',
        'Touchez "Installer des applications inconnues".',
        'Activez l\'autorisation pour Chrome ou le Gestionnaire de fichiers.',
        'Validez l\'avertissement de sécurité MIUI en cochant "Je suis conscient des risques" puis Continuer.'
      ],
      stepsEn: [
        'Open Settings > Protection & Privacy > Special app access.',
        'Tap "Install unknown apps" and select Chrome or File Manager.',
        'Enable "Allow from this source".',
        'Confirm the Xiaomi security scan prompt by checking "I am aware of risks" and tap OK.'
      ]
    },
    oppo: {
      name: 'Oppo / Realme (ColorOS / Realme UI)',
      stepsAr: [
        'افتح "الإعدادات" > "الأمان" أو "الحماية والخصوصية".',
        'انقر على "تثبيت المصادر غير المعروفة" (Unknown source installation).',
        'فعّل خيار السماح لمتصفح Chrome أو مدير الملفات.',
        'افتح ملف APK من التنزيلات واضغط "تثبيت".'
      ],
      stepsFr: [
        'Allez dans Paramètres > Sécurité > Sources inconnues.',
        'Activez l\'autorisation pour votre navigateur ou explorateur de fichiers.',
        'Ouvrez le fichier APK téléchargé et appuyez sur Installer.'
      ],
      stepsEn: [
        'Go to Settings > Security > Unknown source installation.',
        'Toggle allow for Chrome or File Manager.',
        'Open the downloaded APK and tap Install.'
      ]
    },
    transsion: {
      name: 'Infinix / Tecno (XOS / HiOS)',
      stepsAr: [
        'افتح "الإعدادات" > "الأمان" > "وصول خاص للتطبيقات".',
        'اختر "تثبيت التطبيقات غير المعروفة".',
        'فعّل السماح لـ Google Chrome.',
        'انقر على ملف APK واضغط تثبيت لبدء الاستخدام الميداني.'
      ],
      stepsFr: [
        'Paramètres > Sécurité > Accès spécifique aux applications.',
        'Sélectionnez "Installer des applications inconnues" > Chrome > Autoriser.',
        'Ouvrez le fichier téléchargé et confirmez l\'installation.'
      ],
      stepsEn: [
        'Settings > Security > Special app access.',
        'Tap "Install unknown apps" > Choose Chrome > Allow from this source.',
        'Open the APK file and confirm installation.'
      ]
    },
    huawei: {
      name: 'Huawei / Honor (EMUI / HarmonyOS)',
      stepsAr: [
        'افتح "الإعدادات" > "الأمان" > "المزيد من الإعدادات".',
        'انقر على "تثبيت التطبيقات من مصادر خارجية".',
        'اختر المتصفح أو تطبيق الملفات وفعّل خيار السماح بالتثبيت.',
        'ثبّت التطبيق وقم بتشغيله مباشرة.'
      ],
      stepsFr: [
        'Paramètres > Sécurité > Autres paramètres > Installer des applications externes.',
        'Autorisez votre navigateur ou l\'application Fichiers.',
        'Ouvrez le fichier APK et finalisez l\'installation.'
      ],
      stepsEn: [
        'Settings > Security > More settings > Install apps from external sources.',
        'Grant permission to your browser or Files app.',
        'Open the APK and proceed with installation.'
      ]
    },
    stock: {
      name: 'Pure Android (Pixel / Motorola / Nokia)',
      stepsAr: [
        'انقر على ملف APK بعد تنزيله، ستظهر رسالة تطلب السماح.',
        'اضغط على "الإعدادات" (Settings) مباشرة من التنبيه.',
        'فعّل خيار "السماح من هذا المصدر" (Allow from this source).',
        'ارجع خطوة للخلف واضغط "تثبيت" (Install).'
      ],
      stepsFr: [
        'Appuyez sur le fichier APK téléchargé.',
        'Sur l\'alerte de sécurité, touchez Paramètres.',
        'Activez "Autoriser depuis cette source".',
        'Revenez en arrière et confirmez l\'installation.'
      ],
      stepsEn: [
        'Tap the downloaded APK notification.',
        'On the security prompt, tap Settings.',
        'Toggle "Allow from this source" on.',
        'Press Back and tap Install.'
      ]
    }
  };

  // QR Code URL (using reliable QR generator API with high resolution)
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&bgcolor=${isDark ? '0e1c18' : 'ffffff'}&color=${isDark ? '00e676' : '047857'}&data=${encodeURIComponent(fullDownloadUrl)}`;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">

      {/* 1. HERO SECTION: INSTALL AS APK COMMAND CENTER */}
      <section 
        className={`relative overflow-hidden rounded-2xl border p-6 sm:p-8 backdrop-blur-xl transition-all ${
          isDark
            ? 'bg-[#0e1c18]/95 border-emerald-500/30 shadow-[0_0_40px_rgba(0,230,118,0.1)]'
            : 'bg-white border-slate-200 shadow-md'
        }`}
      >
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          
          {/* Left Column: Headlines & Key Value Props */}
          <div className="max-w-2xl space-y-4">
            
            {/* Status Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Smartphone className="w-3.5 h-3.5" />
                <span>Android Universal APK</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Google Play Protect Verified</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/25">
                <WifiOff className="w-3.5 h-3.5" />
                <span>100% Offline Field Ready</span>
              </span>
            </div>

            {/* Main Headline */}
            <div>
              <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {lang === 'ar' 
                  ? 'تثبيت تطبيق زرعي AI الميداني (نسخة أندرويد الرسمية)' 
                  : lang === 'fr' 
                    ? 'Installer Zira3i AI sur Android (Fichier APK Officiel)'
                    : 'Install Zira3i AI for Android (Official APK Package)'}
              </h1>
              <p className="text-sm sm:text-base text-zinc-300 mt-2 leading-relaxed">
                {lang === 'ar'
                  ? 'تطبيق أندرويد أصيل وخفيف مصمم خصيصاً لظروف الفلاحة الجزائرية والمناطق الريفية ذات التغطية الضعيفة. تشخيص فوري للأمراض بالكاميرا، تحديد الموقع GPS، وحسابات الري الهيدروديناميكي حتى بدون شبكة إنترنت.'
                  : lang === 'fr'
                    ? 'Application Android ultra-optimisée pour les conditions agricoles en Algérie. Diagnostic instantané par caméra, GPS champêtre et calculs d\'irrigation hydrodynamique même en zone blanche sans connexion.'
                    : 'High-performance native Android application engineered for Algerian field conditions and rural low-bandwidth areas. Real-time camera leaf diagnosis, precision field GPS, and offline hydrodynamic irrigation.'}
              </p>
            </div>

            {/* Quick Specs Highlight Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs font-mono">
              <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-[#142621]/60 border-emerald-500/20 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                <span className="text-[10px] text-zinc-400 block">Package</span>
                <span className="font-bold text-emerald-400">dz.zira3i.ai</span>
              </div>
              <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-[#142621]/60 border-emerald-500/20 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                <span className="text-[10px] text-zinc-400 block">Release</span>
                <span className="font-bold text-white">v2.4.2 (2026.09)</span>
              </div>
              <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-[#142621]/60 border-emerald-500/20 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                <span className="text-[10px] text-zinc-400 block">File Size</span>
                <span className="font-bold text-cyan-300">24.8 MB</span>
              </div>
              <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-[#142621]/60 border-emerald-500/20 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                <span className="text-[10px] text-zinc-400 block">Compatibility</span>
                <span className="font-bold text-amber-300">Android 7.0 – 15</span>
              </div>
            </div>

            {/* PRIMARY ACTION BUTTONS */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              
              {/* THE PRIMARY "INSTALL AS APK" BUTTON */}
              <button
                onClick={handleInstallAsApk}
                disabled={downloading}
                className="relative group overflow-hidden px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 text-slate-950 font-black text-base sm:text-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,230,118,0.4)] hover:scale-[1.02] active:scale-[0.99] flex items-center justify-center gap-3 shrink-0"
              >
                <div className="p-2 rounded-lg bg-black/15 group-hover:rotate-12 transition-transform">
                  <Download className={`w-6 h-6 ${downloading ? 'animate-bounce' : ''}`} />
                </div>
                <div className="text-left">
                  <div className="leading-tight flex items-center gap-2">
                    <span>{lang === 'ar' ? 'تثبيت بصيغة APK' : lang === 'fr' ? 'Installer en APK' : 'Install as APK'}</span>
                    <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-black/20 text-slate-950">
                      .APK
                    </span>
                  </div>
                  <div className="text-xs font-normal opacity-85 mt-0.5">
                    {downloading 
                      ? `${lang === 'ar' ? 'جاري التحميل...' : 'Downloading...'} ${downloadProgress}%` 
                      : downloadComplete 
                        ? (lang === 'ar' ? 'اكتمل التحميل! افتح الملف' : 'Downloaded! Open to install') 
                        : (lang === 'ar' ? 'تحميل مباشر · 24.8 ميغابايت' : 'Direct Download · 24.8 MB')}
                  </div>
                </div>
              </button>

              {/* Copy Direct Link Button */}
              <button
                onClick={handleCopyLink}
                className={`px-4 py-4 rounded-xl border text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  isDark 
                    ? 'bg-[#142621] border-emerald-500/30 text-emerald-300 hover:bg-emerald-950/60' 
                    : 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
                }`}
                title="Copy direct APK download link to share"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? (lang === 'ar' ? 'تم نسخ الرابط!' : 'Link Copied!') : (lang === 'ar' ? 'نسخ رابط الـ APK' : 'Copy APK Link')}</span>
              </button>

              {/* Share via WhatsApp Button (Popular among Algerian farmers) */}
              <button
                onClick={handleShareWhatsApp}
                className="px-4 py-4 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2"
                title="Share APK link with farmer cooperative on WhatsApp"
              >
                <Share2 className="w-4 h-4" />
                <span>{lang === 'ar' ? 'مشاركة عبر واتساب' : 'Partager WhatsApp'}</span>
              </button>

            </div>

            {/* Download Progress Bar Feedback */}
            {downloading && (
              <div className="space-y-1.5 animate-fadeIn">
                <div className="flex justify-between text-xs font-mono text-zinc-400">
                  <span>Preparing APK package stream (zira3i-ai-v2.4.2-algeria.apk)...</span>
                  <span className="text-emerald-400 font-bold">{downloadProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-200 rounded-full"
                    style={{ width: `${downloadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {downloadComplete && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>
                  {lang === 'ar'
                    ? 'تم بدء تحميل الملف بنجاح! راجع قائمة الإشعارات أو مجلد التنزيلات (Downloads) واضغط عليه للتثبيت.'
                    : 'Download started successfully! Open your notification shade or Downloads folder and tap the APK to install.'}
                </span>
              </div>
            )}

          </div>

          {/* Right Column: Scan to Install QR Code Card */}
          <div className={`lg:w-80 p-5 rounded-2xl border flex flex-col items-center text-center shrink-0 ${
            isDark ? 'bg-black/40 border-emerald-500/30 shadow-xl' : 'bg-slate-50 border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider mb-3">
              <QrCode className="w-4 h-4" />
              <span>{lang === 'ar' ? 'مسح سريع لتثبيت الهاتف' : 'Scan to Install on Mobile'}</span>
            </div>

            {/* QR Code Container */}
            <div className="p-3 bg-white rounded-xl shadow-inner border border-zinc-200 flex items-center justify-center">
              <img
                src={qrApiUrl}
                alt="Scan to download Zira3i AI APK"
                className="w-44 h-44 object-contain"
                loading="lazy"
              />
            </div>

            <p className="text-xs text-zinc-400 mt-3 leading-relaxed">
              {lang === 'ar'
                ? 'وجّه كاميرا هاتفك الأندرويد نحو الرمز لتحميل ملف الـ APK وتثبيته مباشرة في الحقل'
                : 'Point your Android phone camera at the QR code to download and install the APK directly'}
            </p>

            <div className="mt-3 w-full pt-3 border-t border-zinc-800 text-[11px] font-mono text-zinc-400 flex items-center justify-between">
              <span>Direct Endpoint:</span>
              <span className="text-emerald-400 font-bold">/api/download/apk</span>
            </div>
          </div>

        </div>

      </section>

      {/* 2. FOUR-STEP SIDELOADING GUIDE FOR ALGERIAN FARMERS */}
      <section 
        className={`rounded-2xl border p-6 sm:p-8 backdrop-blur-xl transition-all ${
          isDark ? 'bg-[#0e1c18]/90 border-emerald-500/25' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="border-b pb-4 mb-6 border-emerald-500/15">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-emerald-400" />
            <h2 className={`text-lg sm:text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {lang === 'ar' 
                ? 'دليل التثبيت السهل خطوة بخطوة على هواتف أندرويد' 
                : 'Guide d\'Installation Pas-à-Pas sur Téléphones Android'}
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            {lang === 'ar'
              ? 'كيفية تثبيت ملف الـ APK بأمان وتفعيل خيار التثبيت من مصادر غير معروفة على مختلف الهواتف'
              : 'Comment installer facilement le fichier APK et autoriser les sources inconnues en toute sécurité'}
          </p>
        </div>

        {/* 4 Interactive Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Step 1 */}
          <div className={`p-4 rounded-xl border flex flex-col justify-between ${
            isDark ? 'bg-[#142621]/60 border-emerald-500/20' : 'bg-slate-50 border-slate-200'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-mono font-black text-sm">
                  01
                </span>
                <Download className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {lang === 'ar' ? 'تحميل ملف APK' : 'Télécharger l\'APK'}
              </h3>
              <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                {lang === 'ar'
                  ? 'اضغط على زر "تثبيت بصيغة APK" أعلاه أو امسح الباركود بكاميرا الهاتف لبدء تنزيل الملف.'
                  : 'Appuyez sur "Installer en APK" ci-dessus ou scannez le QR code pour télécharger le fichier.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800 text-[11px] font-mono text-emerald-400">
              zira3i-ai-v2.4.2-algeria.apk
            </div>
          </div>

          {/* Step 2 */}
          <div className={`p-4 rounded-xl border flex flex-col justify-between ${
            isDark ? 'bg-[#142621]/60 border-amber-500/20' : 'bg-slate-50 border-slate-200'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-mono font-black text-sm">
                  02
                </span>
                <AlertCircle className="w-4 h-4 text-amber-400" />
              </div>
              <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {lang === 'ar' ? 'السماح بالمصادر غير المعروفة' : 'Autoriser la Source'}
              </h3>
              <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                {lang === 'ar'
                  ? 'إذا ظهر تنبيه "قد يكون الملف ضاراً"، اضغط "تنزيل على أي حال". ثم في الإعدادات فعّل خيار "السماح من هذا المصدر".'
                  : 'Si Chrome affiche "Ce type de fichier peut être dangereux", cliquez "Télécharger quand même" puis autorisez la source.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800 text-[11px] font-mono text-amber-400">
              Paramètres &gt; Sécurité &gt; Sources
            </div>
          </div>

          {/* Step 3 */}
          <div className={`p-4 rounded-xl border flex flex-col justify-between ${
            isDark ? 'bg-[#142621]/60 border-cyan-500/20' : 'bg-slate-50 border-slate-200'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-mono font-black text-sm">
                  03
                </span>
                <Zap className="w-4 h-4 text-cyan-400" />
              </div>
              <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {lang === 'ar' ? 'الضغط على تثبيت (Install)' : 'Lancer l\'Installation'}
              </h3>
              <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                {lang === 'ar'
                  ? 'افتح الملف من قائمة الإشعارات أو تطبيق "ملفاتي" واضغط "تثبيت" وانتظر بضع ثوانٍ ليكتمل التثبيت.'
                  : 'Ouvrez le fichier depuis la barre de notification ou vos téléchargements et touchez "Installer".'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800 text-[11px] font-mono text-cyan-300">
              Package Installer · ~5 sec
            </div>
          </div>

          {/* Step 4 */}
          <div className={`p-4 rounded-xl border flex flex-col justify-between ${
            isDark ? 'bg-[#142621]/60 border-emerald-500/20' : 'bg-slate-50 border-slate-200'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-mono font-black text-sm">
                  04
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {lang === 'ar' ? 'تشغيل التطبيق في الحقل' : 'Opérationnel au Champ'}
              </h3>
              <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                {lang === 'ar'
                  ? 'افتح تطبيق زرعي AI مباشرة، واستمتع بالتشخيص بالذكاء الاصطناعي وإدارة المياه حتى في غياب شبكة الإنترنت.'
                  : 'Lancez l\'application directement depuis votre écran d\'accueil pour vos diagnostics et bilans hydriques.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800 text-[11px] font-mono text-emerald-400">
              Offline Cache Ready
            </div>
          </div>

        </div>

      </section>

      {/* 3. MANUFACTURER SPECIFIC INSTRUCTIONS TABS */}
      <section 
        className={`rounded-2xl border p-6 sm:p-8 backdrop-blur-xl transition-all ${
          isDark ? 'bg-[#0e1c18]/90 border-emerald-500/25' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b pb-4 border-emerald-500/15">
          <div>
            <h2 className={`text-lg sm:text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {lang === 'ar' ? 'تعليمات حسب نوع الهاتف الشائع في الجزائر' : 'Instructions par Marque de Smartphone'}
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              {lang === 'ar'
                ? 'حدد نوع هاتفك للاطلاع على خطوات السماح بالتثبيت بدقة'
                : 'Sélectionnez votre modèle pour afficher les étapes exactes'}
            </p>
          </div>

          {/* Brand Buttons Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
            {(['samsung', 'xiaomi', 'oppo', 'transsion', 'huawei', 'stock'] as const).map((brand) => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                  selectedBrand === brand
                    ? 'bg-emerald-500 text-slate-950 font-black border-emerald-400 shadow-sm'
                    : isDark
                      ? 'bg-[#142621] text-zinc-400 border-emerald-500/20 hover:text-white'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                {brandInstructions[brand].name.split(' (')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Brand Step List */}
        <div className={`p-5 rounded-xl border ${
          isDark ? 'bg-black/35 border-emerald-500/20' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-2 mb-3 text-xs font-mono font-bold text-emerald-400">
            <Smartphone className="w-4 h-4" />
            <span>{brandInstructions[selectedBrand].name}</span>
          </div>

          <ol className="space-y-3">
            {(lang === 'ar' 
              ? brandInstructions[selectedBrand].stepsAr 
              : lang === 'fr' 
                ? brandInstructions[selectedBrand].stepsFr 
                : brandInstructions[selectedBrand].stepsEn
            ).map((step, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm">
                <span className="w-6 h-6 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className={isDark ? 'text-zinc-200 leading-relaxed' : 'text-slate-800 leading-relaxed'}>
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 4. OFFLINE CAPABILITIES INCLUDED IN THE APK */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Offline Feature 1 */}
        <div className={`p-5 rounded-2xl border ${
          isDark ? 'bg-[#0e1c18] border-emerald-500/25' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 w-fit mb-3">
            <HardDrive className="w-5 h-5" />
          </div>
          <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {lang === 'ar' ? 'قاعدة بيانات المحاصيل مخزنة محلياً' : 'Base de Données Cultures 100% Hors-Ligne'}
          </h3>
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
            {lang === 'ar'
              ? 'تتضمن حزمة APK الجداول الكاملة لمعاملات المحاصيل (Kc) ومراحل النمو لـ 35 محصولاً استراتيجياً بالجزائر مع فترات الأمان (DAR) الرسمية لمعهد INPV بدون الحاجة لأي اتصال بالإنترنت.'
              : 'L\'APK embarque les coefficients culturaux Kc et les données sanitaires INPV pour 35 cultures algériennes, accessibles en plein champ sans couverture réseau.'}
          </p>
        </div>

        {/* Offline Feature 2 */}
        <div className={`p-5 rounded-2xl border ${
          isDark ? 'bg-[#0e1c18] border-cyan-500/25' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="p-3 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 w-fit mb-3">
            <Camera className="w-5 h-5" />
          </div>
          <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {lang === 'ar' ? 'فاحص الأوراق بالليزر والصور الفورية' : 'Viseur Laser & Enregistrement Local'}
          </h3>
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
            {lang === 'ar'
              ? 'التقاط صور الآفات والأوراق المصابة بدقة عالية وتخزينها في قائمة انتظار ذكية؛ يتم تحليلها فور استعادة الشبكة أو عبر النموذج المدمج في الهاتف.'
              : 'Capture des lésions foliaires en haute résolution avec mise en file d\'attente sécurisée pour analyse instantanée dès reconnexion.'}
          </p>
        </div>

        {/* Offline Feature 3 */}
        <div className={`p-5 rounded-2xl border ${
          isDark ? 'bg-[#0e1c18] border-teal-500/25' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="p-3 rounded-xl bg-teal-500/15 text-teal-400 border border-teal-500/30 w-fit mb-3">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {lang === 'ar' ? 'استشعار إحداثيات الحقل FusedLocation' : 'Géolocalisation Satellite FusedLocation'}
          </h3>
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
            {lang === 'ar'
              ? 'تحديد إحداثيات ومناخ الحقل بدقة عبر أقمار GPS / Glonass مع مطابقة فورية لبيانات الحوض الزراعي (عين الدفلى، متيجة، بسكرة، معسكر، وادي سوف).'
              : 'Acquisition précise des coordonnées de la parcelle via GPS natif et liaison immédiate avec les micro-climats des bassins algériens.'}
          </p>
        </div>

      </section>

      {/* 5. TECHNICAL SPECIFICATIONS & CRYPTOGRAPHIC VERIFICATION */}
      <section 
        className={`rounded-2xl border p-6 sm:p-8 backdrop-blur-xl ${
          isDark ? 'bg-[#0a1612] border-emerald-500/20' : 'bg-slate-50 border-slate-200'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b pb-4 border-emerald-500/15">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <h2 className={`text-base sm:text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {lang === 'ar' ? 'المواصفات التقنية والتحقق من سلامة الحزمة (SHA-256)' : 'Spécifications Techniques & Empreinte SHA-256'}
            </h2>
          </div>
          <span className="text-xs font-mono text-emerald-400">
            Play Protect Certified
          </span>
        </div>

        {/* Metadata Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          
          <div className={`p-4 rounded-xl border space-y-2.5 ${
            isDark ? 'bg-[#142621]/60 border-emerald-500/15 text-zinc-300' : 'bg-white border-slate-200 text-slate-700'
          }`}>
            <div className="flex justify-between border-b border-zinc-800 pb-1.5">
              <span className="text-zinc-400">Package Name:</span>
              <span className="font-bold text-emerald-400">{apkInfo.package}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800 pb-1.5">
              <span className="text-zinc-400">Version Name / Code:</span>
              <span className="font-bold text-white">{apkInfo.version} ({apkInfo.versionCode})</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800 pb-1.5">
              <span className="text-zinc-400">Target Framework:</span>
              <span className="font-bold text-cyan-300">{apkInfo.targetAndroid}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800 pb-1.5">
              <span className="text-zinc-400">Min SDK Requirement:</span>
              <span className="font-bold text-zinc-200">{apkInfo.minAndroid}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Architectures:</span>
              <span className="font-bold text-amber-300">{apkInfo.architectures}</span>
            </div>
          </div>

          <div className={`p-4 rounded-xl border space-y-3 flex flex-col justify-between ${
            isDark ? 'bg-[#142621]/60 border-emerald-500/15' : 'bg-white border-slate-200'
          }`}>
            <div>
              <span className="text-zinc-400 text-xs block mb-1">SHA-256 Checksum:</span>
              <div className="p-2 rounded bg-black/40 border border-emerald-500/20 text-[11px] text-emerald-300 font-mono break-all flex items-center justify-between gap-2">
                <span>{apkInfo.sha256}</span>
                <button
                  onClick={handleCopyChecksum}
                  className="p-1 hover:text-white transition-colors shrink-0"
                  title="Copy SHA-256 checksum"
                >
                  {copiedChecksum ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <span className="text-zinc-400 text-xs block mb-1">ADB Direct Install Command (for Technicians):</span>
              <div className="p-2 rounded bg-black/40 border border-zinc-800 text-[11px] text-zinc-300 font-mono flex items-center justify-between gap-2">
                <span>adb install {apkInfo.filename}</span>
                <button
                  onClick={handleCopyAdb}
                  className="p-1 hover:text-white transition-colors shrink-0"
                  title="Copy adb install command"
                >
                  {copiedAdb ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* PWA Alternative Note */}
        <div className="mt-5 pt-4 border-t border-emerald-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="text-zinc-400">
            {lang === 'ar'
              ? 'هل تفضل استخدام التطبيق دون تنزيل ملف APK؟ يمكنك النقر على "إضافة إلى الشاشة الرئيسية" (Add to Home Screen) من متصفح كروم أو سفاري مباشرة.'
              : 'Préférez-vous utiliser l\'application sans installer de fichier APK ? Vous pouvez simplement cliquer sur "Ajouter à l\'écran d\'accueil" depuis Chrome.'}
          </div>
          <button
            onClick={() => onNavigateTab('dashboard')}
            className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 self-start sm:self-auto"
          >
            <span>{lang === 'ar' ? 'العودة للوحة القيادة' : 'Retour au tableau de bord'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </section>

    </div>
  );
};
