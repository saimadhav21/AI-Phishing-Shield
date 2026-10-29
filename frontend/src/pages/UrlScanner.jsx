import React, { useState } from 'react';
import axios from 'axios';
import { 
  Search, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Cpu, 
  ExternalLink, 
  CheckCircle, 
  XCircle, 
  Layers, 
  Globe, 
  Lock, 
  FileText, 
  ArrowRight,
  Sparkles,
  RefreshCw,
  Info,
  CheckCircle2,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import RiskGauge from '../components/RiskGauge';
import PageHeader from '../components/PageHeader';

export default function UrlScanner({ onScanComplete }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanStep, setScanStep] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Quick Demo Presets
  const presets = [
    { label: "Legitimate: Amazon AWS", url: "https://aws.amazon.com", type: "safe" },
    { label: "Legitimate: GitHub", url: "https://github.com/explore", type: "safe" },
    { label: "Phishing: IP Host Login", url: "http://192.168.1.100/paypal/login.php", type: "danger" },
    { label: "Phishing: Subdomain Spoof", url: "http://secure.account.update.paypal.com.account-verify.xyz/login", type: "danger" },
    { label: "Suspicious: Masked Link", url: "https://bit.ly/3xXyZ9_banking_confirm", type: "warning" },
  ];

  const handleScan = async (targetUrl = url) => {
    const finalUrl = (targetUrl || url).trim();
    if (!finalUrl) {
      setError("Please enter a website URL to scan.");
      return;
    }

    setError('');
    setLoading(true);
    setResult(null);

    setScanStep("1/3 Normalizing & validating URL syntax...");
    await new Promise(r => setTimeout(r, 200));

    setScanStep("2/3 Extracting 18 lexical and domain threat features...");
    await new Promise(r => setTimeout(r, 250));

    setScanStep("3/3 Running Scikit-Learn Random Forest AI inference...");

    try {
      const response = await axios.post("http://localhost:8000/api/scan", { url: finalUrl });
      
      setScanStep("Synthesizing Explainable AI factors & storing record...");
      await new Promise(r => setTimeout(r, 200));

      if (response.data?.success) {
        setResult(response.data.data);
        if (onScanComplete) {
          onScanComplete(response.data.data);
        }
      } else {
        setError("Failed to complete scan. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Connection error to detection engine. Ensure backend is running.");
    } finally {
      setLoading(false);
      setScanStep('');
    }
  };

  const handlePresetClick = (presetUrl) => {
    setUrl(presetUrl);
    handleScan(presetUrl);
  };

  return (
    <div className="min-h-screen pb-20">
      
      {/* Institutional Breadcrumb & Header */}
      <PageHeader 
        breadcrumb="Reporting and Identification of Phishing Websites"
        title="Reporting and Identification of Phishing Websites, Malicious Links and Fake Portals"
        description="Verify any website URL or hyperlink before accessing it. Our cybersecurity detection engine extracts 18 lexical and domain features and uses a Scikit-Learn Random Forest Classifier to identify fraudulent domains, brand impersonation, and credential harvesting."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Main Content Layout (Spacious 2-column grid on desktop, single on mobile) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: URL Scanner Console */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white dark:bg-[#0A1122] border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 shadow-xs space-y-6 transition-colors duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center border border-blue-200 dark:border-blue-500/20 text-blue-800 dark:text-cyan-400">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-[#0B2545] dark:text-white uppercase tracking-wider font-mono">
                      URL Threat Inspection Console
                    </h2>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-sans block">
                      Lexical Analysis & Scikit-Learn Model Verification
                    </span>
                  </div>
                </div>
                <span className="hidden sm:inline text-[11px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                  ● Real-Time Active
                </span>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleScan(); }} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono flex items-center justify-between">
                    <span>Enter Suspicious Website URL or Domain:</span>
                    <span className="text-[11px] text-slate-400 font-normal">HTTP / HTTPS supported</span>
                  </label>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Globe className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="e.g. https://paypal-account-verify.xyz/login or http://192.168.1.100/auth"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#060A14] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-cyan-500 text-xs sm:text-sm font-mono transition"
                        disabled={loading}
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center justify-center gap-2 px-7 py-3 bg-[#0B2545] hover:bg-[#1E3A8A] dark:bg-gradient-to-r dark:from-cyan-500 dark:to-blue-600 text-white dark:text-slate-950 font-bold rounded-lg shadow-sm transition disabled:opacity-50 text-xs sm:text-sm uppercase tracking-wider shrink-0 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Scanning...</span>
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4" />
                          <span>Scan URL</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Quick Demo Presets */}
                <div className="pt-2">
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2.5 flex items-center gap-2 font-mono">
                    <span>Quick Test Samples:</span>
                    <span className="text-[11px] text-slate-400 font-normal font-sans">(Click any preset to run live detection)</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2.5">
                    {presets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handlePresetClick(preset.url)}
                        disabled={loading}
                        className="px-3 py-2 rounded-lg text-xs font-mono bg-slate-100 hover:bg-slate-200 dark:bg-[#060A14] dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-cyan-500/40 transition flex items-center gap-2"
                      >
                        <span className={`w-2 h-2 rounded-full shrink-0 ${
                          preset.type === 'safe' ? 'bg-emerald-500' : preset.type === 'danger' ? 'bg-rose-500' : 'bg-amber-500'
                        }`}></span>
                        <span>{preset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </form>

              {/* Error Alert */}
              {error && (
                <div className="p-4 rounded-lg bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2.5">
                  <XCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Progress State */}
              {loading && (
                <div className="p-5 rounded-lg bg-slate-50 dark:bg-[#060A14] border border-slate-200 dark:border-slate-800 text-center space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-center gap-2.5">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 dark:bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600 dark:bg-cyan-500"></span>
                    </span>
                    <span className="text-xs font-mono text-blue-900 dark:text-cyan-300 font-semibold">{scanStep}</span>
                  </div>
                  <div className="w-full max-w-md mx-auto bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 dark:bg-cyan-500 h-full w-3/4 animate-pulse"></div>
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* Right Column: Institutional Disclaimer & Guidelines */}
          <div className="space-y-6">
            
            {/* Disclaimer Box */}
            <div className="bg-white dark:bg-[#0A1122] border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-7 shadow-xs space-y-3.5 transition-colors duration-200">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 text-[#0B2545] dark:text-cyan-400 font-bold text-sm">
                <Info className="w-4 h-4 text-blue-700 dark:text-cyan-400 shrink-0" />
                <span className="font-mono uppercase tracking-wider text-xs">Official Advisory</span>
              </div>
              
              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  Official government departments, banks, and major institutions <strong className="text-slate-900 dark:text-white">do not request sensitive personal information, passwords, or PINs through electronic communication</strong>.
                </p>
                <p className="text-slate-500 dark:text-slate-400">
                  Do not click on links sent in unsolicited emails or text messages requesting you to verify account details or claim emergency refunds.
                </p>
              </div>
            </div>

            {/* Identification Guidelines Box */}
            <div className="bg-white dark:bg-[#0A1122] border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-7 shadow-xs space-y-3.5 transition-colors duration-200">
              <h3 className="text-xs font-bold text-[#0B2545] dark:text-slate-200 uppercase tracking-wider flex items-center gap-2 font-mono pb-2 border-b border-slate-100 dark:border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>How to Spot Fake Websites</span>
              </h3>

              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-cyan-400 font-bold shrink-0">•</span>
                  <span>Look for misspelled domains (e.g. <code className="text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded text-[11px]">paypaI.com</code> with capital I).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-cyan-400 font-bold shrink-0">•</span>
                  <span>Check if the URL contains a raw IP address instead of a domain name.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-cyan-400 font-bold shrink-0">•</span>
                  <span>Beware of unusual domain extensions like <code className="text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded text-[11px]">.xyz</code> or <code className="text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded text-[11px]">.top</code>.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* Scan Results Report (Structured Enterprise Assessment Card) */}
        {result && (
          <div className="space-y-8 pt-4 animate-fadeIn">
            
            {/* Top Security Banner */}
            <div className={`p-6 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-xs transition-colors duration-200 ${
              result.risk_level === "High Risk"
                ? "bg-rose-50 border-rose-300 text-rose-900 dark:bg-rose-950/30 dark:border-rose-600/50 dark:text-rose-200"
                : result.risk_level === "Suspicious"
                ? "bg-amber-50 border-amber-300 text-amber-900 dark:bg-amber-950/30 dark:border-amber-600/50 dark:text-amber-200"
                : "bg-emerald-50 border-emerald-300 text-emerald-900 dark:bg-emerald-950/30 dark:border-emerald-600/50 dark:text-emerald-200"
            }`}>
              <div className="flex items-start sm:items-center gap-4">
                {result.risk_level === "High Risk" ? (
                  <ShieldAlert className="w-9 h-9 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5 sm:mt-0" />
                ) : result.risk_level === "Suspicious" ? (
                  <AlertTriangle className="w-9 h-9 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
                ) : (
                  <ShieldCheck className="w-9 h-9 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
                )}
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-base sm:text-lg font-extrabold uppercase tracking-wide">
                      Detection Result: {result.risk_level}
                    </h3>
                    <span className="text-xs px-3 py-1 rounded-full bg-white/90 dark:bg-black/60 font-mono font-bold border border-current shadow-xs">
                      Threat Score: {result.risk_score}/100
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-medium opacity-90 leading-relaxed">
                    {result.recommendation}
                  </p>
                </div>
              </div>

              <div className="shrink-0 text-left md:text-right font-mono text-xs border-t md:border-t-0 pt-3 md:pt-0 border-current/20 w-full md:w-auto">
                <span className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">Analyzed Domain:</span>
                <span className="font-bold text-sm break-all">{result.domain || "N/A"}</span>
              </div>
            </div>

            {/* Core Assessment Grid: 3 Equal-Height Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              
              {/* Card 1: Risk Gauge */}
              <div className="h-full">
                <RiskGauge score={result.risk_score} riskLevel={result.risk_level} />
              </div>

              {/* Card 2: AI Machine Learning Prediction */}
              <div className="h-full bg-white dark:bg-[#0A1122] border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col justify-between shadow-xs transition-colors duration-200">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-5">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2 font-mono">
                      <Cpu className="w-4 h-4 text-blue-700 dark:text-cyan-400" />
                      AI Model Prediction
                    </span>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-blue-50 dark:bg-cyan-950 text-blue-900 dark:text-cyan-400 border border-blue-200 dark:border-cyan-800">
                      Random Forest
                    </span>
                  </div>

                  <div className="space-y-5 font-mono">
                    <div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">AI Classification Verdict:</span>
                      <div className="flex flex-wrap items-baseline gap-2.5">
                        <span className={`text-2xl sm:text-3xl font-black ${
                          result.ai_prediction === "Phishing" ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"
                        }`}>
                          {result.ai_prediction}
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                          {result.ai_confidence}% Confidence
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs pt-1">
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>Phishing Probability:</span>
                        <span className="text-rose-600 dark:text-rose-400 font-bold">{result.phishing_probability}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-900 h-2.5 rounded-full overflow-hidden flex border border-slate-200 dark:border-slate-800">
                        <div 
                          style={{ width: `${result.phishing_probability}%` }}
                          className="bg-rose-500 h-full"
                        ></div>
                        <div 
                          style={{ width: `${result.legitimate_probability}%` }}
                          className="bg-emerald-500 h-full"
                        ></div>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>Legitimate Probability:</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">{result.legitimate_probability}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 font-mono">
                  Algorithm: Scikit-Learn (100 Trees, Balanced)
                </div>
              </div>

              {/* Card 3: Target Identity */}
              <div className="h-full bg-white dark:bg-[#0A1122] border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col justify-between shadow-xs transition-colors duration-200">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-5">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2 font-mono">
                      <Globe className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                      Target Identity
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
                      ID: {result.id}
                    </span>
                  </div>

                  <div className="space-y-4 text-xs font-mono">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block text-[11px] mb-1">Normalized Target URL:</span>
                      <p className="text-slate-900 dark:text-slate-200 break-all bg-slate-50 dark:bg-[#060A14] p-3 rounded-lg border border-slate-200 dark:border-slate-800 select-all text-xs leading-relaxed">
                        {result.normalized_url}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 text-[11px]">
                      <div className="bg-slate-50 dark:bg-[#060A14] p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                        <span className="text-slate-500 block">Protocol:</span>
                        <span className={`font-bold mt-0.5 block ${result.features?.is_https ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                          {result.features?.is_https ? "HTTPS (Encrypted)" : "HTTP (Insecure)"}
                        </span>
                      </div>
                      <div className="bg-slate-50 dark:bg-[#060A14] p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                        <span className="text-slate-500 block">Root TLD:</span>
                        <span className="text-blue-700 dark:text-cyan-300 font-bold mt-0.5 block">.{result.tld || "none"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>Audit Timestamp:</span>
                  <span>{new Date(result.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>

            </div>

            {/* Explainable AI Threat Breakdown */}
            <div className="bg-white dark:bg-[#0A1122] border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 shadow-xs space-y-5 transition-colors duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-700 dark:text-cyan-400" />
                  <h3 className="text-sm font-bold text-[#0B2545] dark:text-white uppercase tracking-wider font-mono">
                    Explainable AI (XAI) Trigger Factors
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  {result.factors?.length || 0} Factors Evaluated
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.factors && result.factors.length > 0 ? (
                  result.factors.map((factor, idx) => (
                    <div 
                      key={idx}
                      className={`p-4 rounded-lg border flex items-start gap-3.5 transition ${
                        factor.severity === "danger"
                          ? "bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-950/20 dark:border-rose-800/40 dark:text-rose-200"
                          : factor.severity === "warning"
                          ? "bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/20 dark:border-amber-800/40 dark:text-amber-200"
                          : "bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/20 dark:border-emerald-800/40 dark:text-emerald-200"
                      }`}
                    >
                      {factor.severity === "danger" ? (
                        <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                      ) : factor.severity === "warning" ? (
                        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      )}
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white font-mono truncate">
                            {factor.title}
                          </span>
                          {factor.points !== undefined && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white dark:bg-black/50 border border-slate-200 dark:border-slate-800 font-bold shrink-0">
                              +{factor.points} pts
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {factor.description}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-6 text-xs text-slate-500 font-mono">
                    No threat triggers detected. URL conforms to safe structural conventions.
                  </div>
                )}
              </div>
            </div>

            {/* 18 Extracted Features Matrix */}
            <div className="bg-white dark:bg-[#0A1122] border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 shadow-xs space-y-5 transition-colors duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                  <h3 className="text-sm font-bold text-[#0B2545] dark:text-white uppercase tracking-wider font-mono">
                    Extracted Feature Matrix (18 Input Dimensions)
                  </h3>
                </div>
                <span className="text-xs font-mono text-blue-700 dark:text-cyan-400">
                  Scikit-Learn Classifier Input
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {Object.entries(result.features || {}).map(([key, val], idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-[#060A14] border border-slate-200 dark:border-slate-800 p-3 rounded-lg font-mono text-xs">
                    <span className="text-slate-500 block text-[10px] truncate" title={key}>
                      {key.replace(/_/g, ' ')}
                    </span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 block">
                      {typeof val === 'boolean' ? (val ? "Yes" : "No") : val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}