import React from 'react';

interface ResilienceGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  title?: string;
  subtitle?: string;
  tier?: 'EXCELLENT' | 'STABLE' | 'VULNERABLE' | 'CRITICAL';
  colorMode?: 'cyan' | 'purple' | 'emerald' | 'blue';
}

export const ResilienceGauge: React.FC<ResilienceGaugeProps> = ({
  score,
  size = 180,
  strokeWidth = 14,
  title,
  subtitle,
  tier,
  colorMode = 'cyan',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const safeScore = Math.max(0, Math.min(100, score));
  const strokeDashoffset = circumference - (safeScore / 100) * circumference;

  let strokeColor = '#06B6D4'; // cyan
  let glowColor = 'rgba(6, 182, 212, 0.4)';

  if (colorMode === 'purple') {
    strokeColor = '#A855F7';
    glowColor = 'rgba(168, 85, 247, 0.4)';
  } else if (colorMode === 'emerald' || (tier === 'EXCELLENT')) {
    strokeColor = '#10B981';
    glowColor = 'rgba(16, 185, 129, 0.4)';
  } else if (tier === 'VULNERABLE') {
    strokeColor = '#F59E0B';
    glowColor = 'rgba(245, 158, 11, 0.4)';
  } else if (tier === 'CRITICAL') {
    strokeColor = '#EF4444';
    glowColor = 'rgba(239, 68, 68, 0.4)';
  } else if (colorMode === 'blue') {
    strokeColor = '#3B82F6';
    glowColor = 'rgba(59, 130, 246, 0.4)';
  }

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Background circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1E293B"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
          />
          {/* Colored progress arc with glow filter */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 1s ease-in-out, stroke 0.5s ease',
              filter: `drop-shadow(0 0 8px ${glowColor})`,
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
          <span className="text-4xl font-extrabold text-white tracking-tight tabular-nums">
            {Math.round(safeScore)}
          </span>
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">
            / 100
          </span>
          {tier && (
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 mt-1 rounded-full uppercase tracking-wider ${
                tier === 'EXCELLENT'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : tier === 'STABLE'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : tier === 'VULNERABLE'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}
            >
              {tier}
            </span>
          )}
        </div>
      </div>

      {(title || subtitle) && (
        <div className="mt-3 text-center">
          {title && <div className="text-sm font-semibold text-slate-200">{title}</div>}
          {subtitle && <div className="text-xs text-slate-400 mt-0.5">{subtitle}</div>}
        </div>
      )}
    </div>
  );
};
