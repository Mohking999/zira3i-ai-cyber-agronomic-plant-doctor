import React, { useState } from 'react';
import { Scan, Eye, Activity, CheckCircle2, AlertTriangle } from 'lucide-react';

interface LaserScanLeafProps {
  imageSrc: string;
  isScanning: boolean;
  statusText?: string;
}

export const LaserScanLeaf: React.FC<LaserScanLeafProps> = ({
  imageSrc,
  isScanning,
  statusText,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative w-full aspect-square max-w-md mx-auto rounded-2xl overflow-hidden border border-emerald-500/30 bg-[#07110e] shadow-[0_0_30px_rgba(0,230,118,0.12)]">
      {/* Botanical Leaf Image or Vector Fallback */}
      {!imageError ? (
        <img
          src={imageSrc}
          alt="Plant pathology leaf specimen"
          onError={() => setImageError(true)}
          className="w-full h-full object-cover select-none filter contrast-[1.05]"
        />
      ) : (
        /* Botanical Leaf Fallback SVG */
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#0f241d] to-[#081511] p-6 text-center">
          <svg className="w-24 h-24 text-emerald-400/80 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
          </svg>
          <span className="text-xs font-mono text-emerald-300 font-bold">
            Botanical Foliar Specimen
          </span>
          <span className="text-[11px] text-zinc-400 mt-1 max-w-xs">
            Pathological tissue lesion analysis mode active
          </span>
        </div>
      )}

      {/* Cyber-Organic Reticle & Subtle Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#00e676_1px,transparent_1px)] [background-size:20px_20px] opacity-15 pointer-events-none" />

      {/* Fine Hairline Corner Brackets */}
      <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-emerald-400/80 pointer-events-none" />
      <div className="absolute top-3 right-3 w-5 h-5 border-t border-r border-emerald-400/80 pointer-events-none" />
      <div className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-emerald-400/80 pointer-events-none" />
      <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-emerald-400/80 pointer-events-none" />

      {/* Center Target Reticle */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-32 h-32 border border-emerald-400/30 rounded-full flex items-center justify-center animate-[spin_16s_linear_infinite]">
          <div className="w-20 h-20 border border-cyan-400/40 rounded-full border-dashed" />
        </div>
        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_#00e676]" />
      </div>

      {/* Animated Lesion Detection Target Highlights */}
      {isScanning && (
        <>
          <div className="absolute top-1/4 left-1/3 flex items-center gap-1.5 pointer-events-none animate-pulse">
            <span className="w-3.5 h-3.5 rounded-full border border-rose-400 bg-rose-500/30 shadow-[0_0_8px_#f43f5e]" />
            <span className="text-[10px] font-mono text-rose-300 font-semibold bg-black/75 px-1.5 py-0.5 rounded border border-rose-500/30">
              Necrotic lesion margin
            </span>
          </div>

          <div className="absolute bottom-1/3 right-1/4 flex items-center gap-1.5 pointer-events-none animate-pulse delay-300">
            <span className="w-3.5 h-3.5 rounded-full border border-amber-400 bg-amber-500/30 shadow-[0_0_8px_#f59e0b]" />
            <span className="text-[10px] font-mono text-amber-300 font-semibold bg-black/75 px-1.5 py-0.5 rounded border border-amber-500/30">
              Chlorotic perimeter
            </span>
          </div>
        </>
      )}

      {/* Active Laser Scanning Beam */}
      {isScanning && (
        <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#00e676] to-transparent shadow-[0_0_15px_#00e676,0_0_30px_#00e5ff] animate-scan pointer-events-none" />
      )}

      {/* Bottom Status Ribbon */}
      <div className="absolute bottom-3 inset-x-3 py-2 px-3 bg-black/80 backdrop-blur-md rounded-xl border border-emerald-500/30 text-xs flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          {isScanning ? (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          )}
          <span className="font-medium text-emerald-200 text-xs">
            {statusText || (isScanning ? 'Analyzing leaf histology...' : 'Target acquired · Ready for analysis')}
          </span>
        </div>
      </div>
    </div>
  );
};
