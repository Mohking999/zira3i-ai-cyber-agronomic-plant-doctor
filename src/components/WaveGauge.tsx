import React, { useEffect, useRef } from 'react';

interface WaveGaugeProps {
  percentage: number; // 0 to 100
  title: string;
  fieldCapacityLabel: string;
  wiltingPointLabel: string;
  isDark: boolean;
}

export const WaveGauge: React.FC<WaveGaugeProps> = ({
  percentage,
  title,
  fieldCapacityLabel,
  wiltingPointLabel,
  isDark,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Retina DPI scaling
    const dpr = window.devicePixelRatio || 1;
    const logicalWidth = 240;
    const logicalHeight = 280;

    canvas.width = logicalWidth * dpr;
    canvas.height = logicalHeight * dpr;
    ctx.scale(dpr, dpr);

    let animationFrameId: number;
    let step = 0;

    const render = () => {
      ctx.clearRect(0, 0, logicalWidth, logicalHeight);

      const margin = 12;
      const width = logicalWidth - margin * 2;
      const height = logicalHeight - margin * 2;
      const radius = 24;

      // Draw container capsule
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(margin, margin, width, height, radius);
      ctx.clip();

      // Background fill
      ctx.fillStyle = isDark ? '#0b1613' : '#edf3ee';
      ctx.fillRect(margin, margin, width, height);

      // Water height calculation
      const clampedPct = Math.min(Math.max(percentage, 5), 95);
      const fillHeight = (clampedPct / 100) * height;
      const waterY = margin + height - fillHeight;

      step += 0.04;

      // Wave 1
      ctx.beginPath();
      ctx.moveTo(margin, margin + height);
      for (let x = margin; x <= margin + width; x += 1) {
        const y = waterY + Math.sin((x - margin) * 0.035 + step) * 5 + Math.cos((x - margin) * 0.02 + step * 0.8) * 3;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(margin + width, margin + height);
      ctx.closePath();

      // Fluid Gradient
      const grad = ctx.createLinearGradient(0, waterY, 0, margin + height);
      if (percentage < 30) {
        grad.addColorStop(0, 'rgba(245, 158, 11, 0.85)');
        grad.addColorStop(1, 'rgba(180, 83, 9, 0.95)');
      } else if (percentage > 85) {
        grad.addColorStop(0, 'rgba(6, 182, 212, 0.85)');
        grad.addColorStop(1, 'rgba(14, 116, 144, 0.95)');
      } else {
        grad.addColorStop(0, 'rgba(0, 230, 118, 0.85)');
        grad.addColorStop(1, 'rgba(13, 148, 136, 0.95)');
      }
      ctx.fillStyle = grad;
      ctx.fill();

      // Wave 2 (translucent overlay for fluid depth)
      ctx.beginPath();
      ctx.moveTo(margin, margin + height);
      for (let x = margin; x <= margin + width; x += 1) {
        const y = waterY + Math.cos((x - margin) * 0.025 - step * 1.1) * 4;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(margin + width, margin + height);
      ctx.closePath();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.fill();

      // Field Capacity dashed line (75%)
      const fcY = margin + height - 0.75 * height;
      ctx.strokeStyle = isDark ? 'rgba(6, 182, 212, 0.7)' : 'rgba(2, 132, 199, 0.8)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(margin + 6, fcY);
      ctx.lineTo(margin + width - 6, fcY);
      ctx.stroke();

      // Permanent Wilting Point dashed line (25%)
      const wpY = margin + height - 0.25 * height;
      ctx.strokeStyle = isDark ? 'rgba(244, 63, 94, 0.7)' : 'rgba(225, 29, 72, 0.8)';
      ctx.beginPath();
      ctx.moveTo(margin + 6, wpY);
      ctx.lineTo(margin + width - 6, wpY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.restore();

      // Outer border frame
      ctx.strokeStyle = isDark ? '#00e676' : '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(margin, margin, width, height, radius);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [percentage, isDark]);

  return (
    <div className="flex flex-col items-center select-none">
      <div className="relative w-52 h-64 sm:w-60 sm:h-72">
        <canvas ref={canvasRef} className="w-full h-full drop-shadow-md" />
        
        {/* Crisp Center Numeric Indicator */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-4xl sm:text-5xl font-black tracking-tight font-mono text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
            {percentage}%
          </div>
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-200 mt-1 drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]">
            {title}
          </div>
        </div>
      </div>

      {/* Clean Unboxed Legend with subtle separators */}
      <div className="mt-3 flex items-center justify-center gap-4 text-xs font-mono">
        <div className="flex items-center gap-1.5 text-cyan-400 font-medium">
          <span className="w-2.5 h-0.5 bg-cyan-400 inline-block" />
          <span>{fieldCapacityLabel}</span>
          <span className="text-zinc-400">· 75%</span>
        </div>
        <span className="text-zinc-600" aria-hidden="true">|</span>
        <div className="flex items-center gap-1.5 text-rose-400 font-medium">
          <span className="w-2.5 h-0.5 bg-rose-400 inline-block" />
          <span>{wiltingPointLabel}</span>
          <span className="text-zinc-400">· 25%</span>
        </div>
      </div>
    </div>
  );
};
