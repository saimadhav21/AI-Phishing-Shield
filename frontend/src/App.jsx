import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import UrlScanner from './pages/UrlScanner';
import EmailScanner from './pages/EmailScanner';
import QrScanner from './pages/QrScanner';
import ScanHistory from './pages/ScanHistory';
import SecurityTips from './pages/SecurityTips';
import AwsArchitecture from './pages/AwsArchitecture';
import { ShieldCheck, Cloud, Server, Database, Activity, ExternalLink } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('scanner'); // Default to URL Scanner (Core Feature 1)

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#060A14] text-slate-800 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-500/20 selection:text-blue-700 dark:selection:bg-cyan-500/20 dark:selection:text-cyan-300 transition-colors duration-200">
      
      {/* Top Institutional & Cyber Navigation Bar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Dynamic Page Content */}
      <main id="main-content" className="flex-1">
        {activeTab === 'scanner' && (
          <UrlScanner onScanComplete={() => {}} />
        )}
        {activeTab === 'dashboard' && (
          <Dashboard onNavigateToScanner={() => setActiveTab('scanner')} />
        )}
        {activeTab === 'email' && (
          <EmailScanner />
        )}
        {activeTab === 'qr' && (
          <QrScanner onNavigateToScannerWithUrl={(url) => setActiveTab('scanner')} />
        )}
        {activeTab === 'history' && (
          <ScanHistory />
        )}
        {activeTab === 'tips' && (
          <SecurityTips />
        )}
        {activeTab === 'aws' && (
          <AwsArchitecture />
        )}
      </main>

      {/* Institutional Enterprise Footer (Modeled after Reference Site) */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#060A14] pt-12 pb-8 px-4 sm:px-6 lg:px-8 mt-16 text-slate-600 dark:text-slate-400 text-xs transition-colors duration-200">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Col 1: Project Identity */}
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0F2942] dark:bg-gradient-to-br dark:from-cyan-500 dark:to-blue-600 p-[1px] flex items-center justify-center">
                  <div className="w-full h-full bg-[#0F2942] dark:bg-[#080E1B] rounded-[7px] flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-white dark:text-cyan-400" />
                  </div>
                </div>
                <span className="text-base font-extrabold text-[#0B2545] dark:text-white tracking-tight">
                  Phishing Shield AI
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-100 dark:bg-cyan-950 text-blue-900 dark:text-cyan-400 border border-blue-200 dark:border-cyan-800 rounded">
                  AI Defense Portal
                </span>
              </div>
              
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-md">
                An advanced AI-powered cybersecurity defense system designed to identify zero-day phishing attacks, deceptive domain spoofing, and malicious credentials harvesting via hybrid machine learning and cloud defense architecture.
              </p>

              <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500 pt-1">
                <span>Model: Scikit-Learn Random Forest</span>
                <span>•</span>
                <span>Accuracy: 99.84% Verified</span>
              </div>
            </div>

            {/* Col 2: Navigation Links */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-[#0B2545] dark:text-white uppercase tracking-wider font-mono block">
                Security Modules
              </span>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => setActiveTab('scanner')} className="hover:text-blue-600 dark:hover:text-cyan-400 transition">
                    URL Threat Scanner
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('dashboard')} className="hover:text-blue-600 dark:hover:text-cyan-400 transition">
                    Threat Telemetry Dashboard
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('email')} className="hover:text-blue-600 dark:hover:text-cyan-400 transition">
                    Email Phishing Forensics
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('qr')} className="hover:text-blue-600 dark:hover:text-cyan-400 transition">
                    QR Code Quishing Analyzer
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('history')} className="hover:text-blue-600 dark:hover:text-cyan-400 transition">
                    Audit Log & Scan History
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Cloud Architecture */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-[#0B2545] dark:text-white uppercase tracking-wider font-mono block">
                Cloud Architecture
              </span>
              <ul className="space-y-2 text-xs font-mono">
                <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Server className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Amazon EC2 Compute</span>
                </li>
                <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Database className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>Amazon DynamoDB</span>
                </li>
                <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Cloud className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Amazon S3 Artifacts</span>
                </li>
                <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Activity className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>Amazon CloudWatch</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Copyright & Disclaimer Bar */}
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono">
            <div>
              © 2026 Phishing Shield AI – National Cyber Threat Intelligence Platform. All rights reserved.
            </div>
            
            <div className="flex items-center gap-4">
              <button onClick={() => setActiveTab('tips')} className="hover:text-blue-600 dark:hover:text-slate-400 transition">
                Security Advisory
              </button>
              <span>•</span>
              <button onClick={() => setActiveTab('aws')} className="hover:text-blue-600 dark:hover:text-slate-400 transition">
                Cloud Architecture
              </button>
              <span>•</span>
              <a href="http://localhost:8000/docs" target="_blank" rel="noreferrer" className="hover:text-blue-600 dark:hover:text-cyan-400 transition flex items-center gap-1">
                <span>API Swagger</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
