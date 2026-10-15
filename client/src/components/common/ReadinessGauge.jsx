import React from 'react';

const ReadinessGauge = ({
  score = 0,
  size = 120,
  strokeWidth = 10,
  label = 'Readiness',
  subtitle = 'Industry Match',
  showLabel = true,
}) => {
  const clampedScore = Math.min(100, Math.max(0, Math.round(score)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  let strokeColor = '#2563eb'; // blue-600
  let textColor = 'text-blue-600';
  let badgeText = 'Moderate';

  if (clampedScore >= 75) {
    strokeColor = '#059669'; // emerald-600
    textColor = 'text-emerald-600';
    badgeText = 'Placement Ready';
  } else if (clampedScore >= 50) {
    strokeColor = '#2563eb'; // blue-600
    textColor = 'text-blue-600';
    badgeText = 'On Track';
  } else if (clampedScore >= 30) {
    strokeColor = '#d97706'; // amber-600
    textColor = 'text-amber-600';
    badgeText = 'Foundational';
  } else {
    strokeColor = '#dc2626'; // red-600
    textColor = 'text-red-600';
    badgeText = 'Needs Work';
  }

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold tracking-tight ${textColor}`}>
            {clampedScore}%
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
            {badgeText}
          </span>
        </div>
      </div>
      {showLabel && (
        <div className="mt-2 text-center">
          <p className="text-xs font-semibold text-slate-800">{label}</p>
          {subtitle && <p className="text-[11px] text-slate-500">{subtitle}</p>}
        </div>
      )}
    </div>
  );
};

export default ReadinessGauge;
