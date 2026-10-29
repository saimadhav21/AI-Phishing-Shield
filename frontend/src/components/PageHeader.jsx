import React from 'react';
import { ChevronRight, Shield, Globe } from 'lucide-react';

export default function PageHeader({ 
  breadcrumb, 
  title, 
  description, 
  actions 
}) {
  return (
    <div className="bg-white dark:bg-[#070D18] border-b border-slate-200 dark:border-slate-800 py-6 px-4 sm:px-6 lg:px-8 mb-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        <div className="space-y-2">
          {/* Breadcrumb Trail (Exactly like Reference Website) */}
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span className="text-blue-700 dark:text-cyan-400 hover:underline cursor-pointer">Home</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
            <span className="text-slate-800 dark:text-slate-200 font-semibold">{breadcrumb}</span>
          </nav>

          {/* Institutional Heading */}
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0B2545] dark:text-white tracking-tight leading-snug">
            {title}
          </h1>

          {/* Subtitle / Description */}
          {description && (
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-4xl leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Optional Action / Status */}
        {actions && (
          <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
            {actions}
          </div>
        )}

      </div>
    </div>
  );
}
