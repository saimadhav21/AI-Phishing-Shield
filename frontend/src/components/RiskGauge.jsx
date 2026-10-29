import React from 'react';

export default function RiskGauge({ score, riskLevel }) {
  const validScore = Math.max(0, Math.min(100, Math.round(Number(score) || 0)));
  
  // Mathematical arc calculation for 240-degree gauge (open at bottom)
  const radius = 62;
  const circumference = 2 * Math.PI * radius; // ~389.55
  const arcLength = circumference * (240 / 360); // ~259.7
  const progressLength = (validScore / 100) * arcLength;

  let strokeColor = "#10B981"; // emerald
  let badgeClasses = "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800";
  let textColor = "text-emerald-600 dark:text-emerald-400";
  let statusLabel = "Low Risk (Safe)";

  if (validScore >= 60 || riskLevel === "High Risk") {
    strokeColor = "#EF4444"; // red
    badgeClasses = "bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-800";
    textColor = "text-rose-600 dark:text-rose-400";
    statusLabel = "High Risk (Threat)";
  } else if (validScore >= 30 || riskLevel === "Suspicious") {
    strokeColor = "#F59E0B"; // amber
    badgeClasses = "bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800";
    textColor = "text-amber-600 dark:text-amber-400";
    statusLabel = "Suspicious Link";
  }

  const displayBadgeText = riskLevel || (validScore >= 60 ? "High Risk" : validScore >= 30 ? "Suspicious" : "Low Risk");

  return (
    <div className="h-full w-full bg-white dark:bg-[#0A1122] rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col items-center justify-between transition-colors duration-200">
      
      {/* Header Label */}
      <div className="w-full pb-3 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
          Threat Risk Gauge
        </span>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
          Scale 0–100
        </span>
      </div>

      {/* SVG Arc Gauge Container with explicit fixed width/height */}
      <div className="relative my-4 flex items-center justify-center w-[170px] h-[170px] shrink-0">
        <svg 
          width="170" 
          height="170" 
          viewBox="0 0 170 170" 
          className="overflow-visible"
          style={{ transform: 'rotate(150deg)', transformOrigin: 'center' }}
        >
          {/* Background Track Arc (240 deg) */}
          <circle
            cx="85"
            cy="85"
            r={radius}
            stroke="currentColor"
            className="text-slate-200 dark:text-slate-800"
            strokeWidth="12"
            fill="none"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />
          {/* Active Colored Progress Arc */}
          <circle
            cx="85"
            cy="85"
            r={radius}
            stroke={strokeColor}
            strokeWidth="12"
            fill="none"
            strokeDasharray={`${progressLength} ${circumference}`}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Text (Strictly bounded and non-overlapping) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none pb-2">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 font-mono">
            RISK SCORE
          </span>
          <div className="flex items-baseline justify-center my-0.5">
            <span className={`text-3xl sm:text-4xl font-black font-mono tracking-tight leading-none ${textColor}`}>
              {validScore}
            </span>
            <span className="text-xs text-slate-400 font-mono font-bold ml-1">
              /100
            </span>
          </div>
          <span className={`text-[10px] font-bold font-mono uppercase tracking-wider ${textColor}`}>
            {statusLabel}
          </span>
        </div>
      </div>

      {/* Bottom Classification Badge & Legend */}
      <div className="w-full flex flex-col items-center space-y-3 pt-2">
        <div className={`px-4 py-1 rounded-full border text-xs font-extrabold uppercase font-mono tracking-wider shadow-xs ${badgeClasses}`}>
          {displayBadgeText}
        </div>

        {/* 3-Tier Threshold Legend */}
        <div className="w-full pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400 px-1">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
            <span>0–29 Low</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
            <span>30–59 Suspicious</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
            <span>60–100 High</span>
          </span>
        </div>
      </div>

    </div>
  );
}