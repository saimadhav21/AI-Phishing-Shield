import React, { useState } from 'react';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Search, 
  Mail, 
  QrCode, 
  History, 
  Lightbulb, 
  Cloud,
  Menu,
  X,
  Sun,
  Moon,
  Laptop,
  HelpCircle,
  Activity,
  Globe,
  ChevronDown
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ activeTab, setActiveTab }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  const navItems = [
    { id: "scanner", label: "URL Threat Scanner", icon: Search },
    { id: "dashboard", label: "Threat Dashboard", icon: LayoutDashboard },
    { id: "email", label: "Email Forensics", icon: Mail },
    { id: "qr", label: "QR Quishing Scanner", icon: QrCode },
    { id: "history", label: "Audit Logs & History", icon: History },
    { id: "tips", label: "Security Advisory", icon: Lightbulb },
    { id: "aws", label: "Cloud Infrastructure", icon: Cloud },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 shadow-md">
      
      {/* 1. Top Institutional Utility Bar (Modeled exactly after Income Tax reference site) */}
      <div className="bg-[#F1F5F9] dark:bg-[#070D1A] border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 py-1.5 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Left utility items */}
          <div className="flex items-center gap-4">
            <a href="#main-content" className="hover:text-blue-700 dark:hover:text-cyan-400 transition hidden sm:inline">
              Skip to main content
            </a>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
            <span className="flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Cyber Defense System: Active
            </span>
          </div>

          {/* Right Utility items: Theme Switcher & Accessibility */}
          <div className="flex items-center gap-4">
            
            {/* Theme Toggle (Light, Dark, Device) */}
            <div className="relative">
              <button
                onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-500 transition shadow-xs"
                title="Change display theme"
              >
                {theme === 'light' && <Sun className="w-3.5 h-3.5 text-amber-500" />}
                {theme === 'dark' && <Moon className="w-3.5 h-3.5 text-cyan-400" />}
                {theme === 'system' && <Laptop className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />}
                
                <span className="capitalize font-medium text-[11px]">
                  {theme === 'system' ? 'Device' : theme}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {themeDropdownOpen && (
                <div 
                  className="absolute right-0 mt-1 w-32 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-1 z-50 text-xs"
                  onMouseLeave={() => setThemeDropdownOpen(false)}
                >
                  <button
                    onClick={() => { setTheme('light'); setThemeDropdownOpen(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 text-left hover:bg-slate-100 dark:hover:bg-slate-800 ${
                      theme === 'light' ? 'text-blue-600 dark:text-cyan-400 font-bold' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>Light</span>
                  </button>
                  <button
                    onClick={() => { setTheme('dark'); setThemeDropdownOpen(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 text-left hover:bg-slate-100 dark:hover:bg-slate-800 ${
                      theme === 'dark' ? 'text-blue-600 dark:text-cyan-400 font-bold' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Dark</span>
                  </button>
                  <button
                    onClick={() => { setTheme('system'); setThemeDropdownOpen(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 text-left hover:bg-slate-100 dark:hover:bg-slate-800 ${
                      theme === 'system' ? 'text-blue-600 dark:text-cyan-400 font-bold' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Laptop className="w-3.5 h-3.5 text-slate-400" />
                    <span>Device</span>
                  </button>
                </div>
              )}
            </div>

            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>

            <button 
              onClick={() => setActiveTab('tips')}
              className="hidden sm:flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-blue-700 dark:hover:text-cyan-400 transition"
            >
              <HelpCircle className="w-3 h-3" />
              <span>Help & Guidelines</span>
            </button>

          </div>

        </div>
      </div>

      {/* 2. Institutional Branding Bar (Modeled after Income Tax Department header) */}
      <div className="bg-white dark:bg-[#0A1122] border-b border-slate-200 dark:border-slate-800 py-3 sm:py-4 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div 
            onClick={() => handleNavClick("scanner")}
            className="flex items-center gap-3.5 cursor-pointer group select-none"
          >
            {/* Security Emblem Logo */}
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl bg-[#0F2942] dark:bg-gradient-to-br dark:from-cyan-600 dark:to-blue-700 p-0.5 shadow flex items-center justify-center">
              <div className="w-full h-full bg-[#0F2942] dark:bg-[#070D18] rounded-[9px] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-white dark:text-cyan-400" />
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-2xl font-black tracking-tight text-[#0F2942] dark:text-white">
                  Phishing Shield AI
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-900 dark:bg-cyan-950 dark:text-cyan-400 border border-blue-200 dark:border-cyan-800 rounded">
                  Cyber Defense Portal
                </span>
              </div>
              <span className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 font-medium">
                National Cyber Threat Intelligence & Link Verification System
              </span>
            </div>
          </div>

          {/* Quick Threat Check Button on Right */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => handleNavClick("scanner")}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#0F2942] hover:bg-[#1E3A8A] dark:bg-gradient-to-r dark:from-cyan-500 dark:to-blue-600 text-white dark:text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg shadow transition"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Verify Suspicious URL</span>
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-white"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-blue-600 dark:text-cyan-400" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </div>

      {/* 3. Primary Solid Navigation Bar (Deep Navy, identical to reference website) */}
      <div className="bg-[#0B2545] dark:bg-[#071324] text-white border-b border-[#081B33] dark:border-slate-800 hidden lg:block transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-0.5 xl:space-x-1 overflow-x-auto scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3 xl:px-4 py-3 text-xs font-semibold tracking-wide border-b-2 transition-all duration-150 whitespace-nowrap shrink-0 ${
                    isActive
                      ? "bg-[#081E38] dark:bg-cyan-500/15 border-white dark:border-cyan-400 text-white dark:text-cyan-300 font-bold"
                      : "border-transparent text-slate-200 hover:text-white hover:bg-[#0E2F56] dark:hover:bg-slate-800/40"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-cyan-300" : "text-slate-300"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#0A1122] border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-5 space-y-2 shadow-xl animate-fadeIn">
          <div className="grid grid-cols-1 gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center justify-between p-3 rounded-lg text-xs font-semibold tracking-wide border transition ${
                    isActive
                      ? "bg-blue-50 dark:bg-cyan-500/15 border-blue-300 dark:border-cyan-500/40 text-blue-900 dark:text-cyan-300 font-bold"
                      : "bg-slate-50 dark:bg-[#060A14] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? "text-blue-600 dark:text-cyan-400" : "text-slate-500 dark:text-slate-400"}`} />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-2">
            <button
              onClick={() => handleNavClick("scanner")}
              className="w-full py-2.5 bg-[#0F2942] dark:bg-gradient-to-r dark:from-cyan-500 dark:to-blue-600 text-white dark:text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg shadow"
            >
              Verify Suspicious URL
            </button>
          </div>
        </div>
      )}

    </header>
  );
}
