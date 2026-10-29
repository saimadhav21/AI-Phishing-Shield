import React, { useState, useRef } from 'react';
import jsQR from 'jsqr';
import { 
  QrCode, 
  Upload, 
  Search, 
  ExternalLink, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw,
  Camera,
  Image as ImageIcon,
  Info,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import axios from 'axios';
import RiskGauge from '../components/RiskGauge';
import PageHeader from '../components/PageHeader';

export default function QrScanner({ onNavigateToScannerWithUrl }) {
  const [decodedUrl, setDecodedUrl] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [scanningUrl, setScanningUrl] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const sampleQrs = [
    { name: "Phishing QR (Fake PayPal)", url: "http://secure.account.update.paypal.com.account-verify.xyz/login" },
    { name: "Legitimate QR (AWS Console)", url: "https://aws.amazon.com/console" },
    { name: "Suspicious QR (Shortener)", url: "https://bit.ly/3xXyZ9_banking_confirm" }
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setDecodedUrl('');
    setScanResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target.result);
      processImageForQR(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const processImageForQR = (imgSrc) => {
    const image = new Image();
    image.src = imgSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0, image.width, image.height);
      const imageData = ctx.getImageData(0, 0, image.width, image.height);

      const code = jsQR(imageData.data, imageData.width, imageData.height);
      if (code && code.data) {
        setDecodedUrl(code.data);
      } else {
        setError("Could not parse QR matrix pattern from image. Ensure image is clear or select a demo preset below.");
      }
    };
  };

  const handleScanDecodedUrl = async (target = decodedUrl) => {
    if (!target) return;
    setScanningUrl(true);
    setError('');

    try {
      const res = await axios.post("http://localhost:8000/api/scan", { url: target });
      if (res.data?.success) {
        setScanResult(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to analyze extracted URL. Please check connection.");
    } finally {
      setScanningUrl(false);
    }
  };

  const handleSelectPreset = (url) => {
    setDecodedUrl(url);
    setImagePreview(null);
    handleScanDecodedUrl(url);
  };

  return (
    <div className="min-h-screen pb-16">
      
      {/* Enterprise Header */}
      <PageHeader 
        breadcrumb="Reporting and Inspection of QR Code Threats"
        title="Reporting and Inspection of QR Code Threats & Malicious QR Codes ('Quishing')"
        description="Decode and inspect physical and digital QR codes. Attackers increasingly embed malicious URLs in QR codes to bypass email link filtering and trick mobile users into visiting credential harvesting sites."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: QR Code Input & Extraction Console */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white dark:bg-[#0A1122] border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-7 shadow-xs space-y-5 transition-colors duration-200">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-blue-800 dark:text-cyan-400" />
                  <h2 className="text-sm sm:text-base font-bold text-[#0B2545] dark:text-white uppercase tracking-wider font-mono">
                    QR Matrix Decoding Console
                  </h2>
                </div>
                <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                  Client-side jsQR Engine
                </span>
              </div>

              {/* Upload Dropzone */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 dark:border-slate-700/80 hover:border-blue-600 dark:hover:border-cyan-500/60 rounded-xl p-8 text-center cursor-pointer transition bg-slate-50 hover:bg-slate-100 dark:bg-[#060A14] dark:hover:bg-[#070D1A] group space-y-3"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="p-3.5 rounded-lg bg-blue-100 dark:bg-cyan-500/10 text-blue-800 dark:text-cyan-400 border border-blue-200 dark:border-cyan-500/20 group-hover:scale-105 transition">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-[#0B2545] dark:text-white block">
                      Click to upload QR Code image or screenshot
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1 block">
                      Supports PNG, JPG, WEBP, SVG • Automatic parsing
                    </span>
                  </div>
                </div>

                {imagePreview && (
                  <div className="pt-2 flex justify-center">
                    <img 
                      src={imagePreview} 
                      alt="QR Preview" 
                      className="max-h-36 rounded-lg border border-slate-300 dark:border-slate-700 object-contain shadow-xs"
                    />
                  </div>
                )}
              </div>

              {/* Quick Expo Demo Presets */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block font-mono">
                  Quick Demo QR Targets:
                </span>
                <div className="flex flex-wrap gap-2">
                  {sampleQrs.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPreset(item.url)}
                      className="px-2.5 py-1.5 rounded text-xs font-mono bg-slate-100 hover:bg-slate-200 dark:bg-[#060A14] dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-cyan-500/40 transition"
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="p-3.5 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Decoded URL Output Bar */}
              {decodedUrl && (
                <div className="p-4 bg-slate-50 dark:bg-[#060A14] border border-slate-200 dark:border-slate-800 rounded-lg space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800/80">
                    <span className="text-xs font-bold text-blue-800 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      Extracted Destination URL
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">Decoded Link</span>
                  </div>
                  
                  <p className="font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200 break-all p-3 bg-white dark:bg-slate-900/80 rounded border border-slate-200 dark:border-slate-800 select-all">
                    {decodedUrl}
                  </p>

                  <div className="flex items-center justify-end gap-3 pt-1">
                    <button
                      onClick={() => handleScanDecodedUrl()}
                      disabled={scanningUrl}
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#0B2545] hover:bg-[#1E3A8A] dark:bg-gradient-to-r dark:from-cyan-500 dark:to-blue-600 text-white dark:text-slate-950 font-bold rounded-lg text-xs uppercase tracking-wider shadow-sm transition disabled:opacity-50"
                    >
                      {scanningUrl ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                      <span>Analyze Extracted Link</span>
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* Right Column: Quishing Advisory Panel */}
          <div className="space-y-6">
            
            <div className="bg-white dark:bg-[#0A1122] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4 transition-colors duration-200">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 text-[#0B2545] dark:text-cyan-400 font-bold text-xs uppercase tracking-wider font-mono">
                <Info className="w-4 h-4" />
                <span>Understanding "Quishing" Attacks</span>
              </div>

              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  <strong className="text-[#0B2545] dark:text-white">What is Quishing?</strong><br />
                  "Quishing" (QR Code Phishing) is a growing threat vector where malicious actors place fraudulent QR code stickers over legitimate QR signage on public kiosks, payment counters, or email attachments.
                </p>
                <p className="text-slate-500 dark:text-slate-400">
                  Because QR codes are graphical pixel grids, traditional link security scanners cannot inspect the destination URL until decoded, making them dangerous for mobile visitors.
                </p>
              </div>

              <div className="pt-2 text-[11px] font-mono text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80">
                Defense: Inspect Decoded Domain Before Accessing
              </div>
            </div>

            <div className="bg-white dark:bg-[#0A1122] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-3 transition-colors duration-200">
              <h3 className="text-xs font-bold text-[#0B2545] dark:text-slate-200 uppercase tracking-wider flex items-center gap-2 font-mono">
                <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                Quishing Prevention Checklist
              </h3>

              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-blue-700 dark:text-cyan-400 font-bold">•</span>
                  <span><strong className="text-slate-800 dark:text-slate-200">Inspect Physical Signs:</strong> Check for peeling stickers placed over official printed QR codes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-700 dark:text-cyan-400 font-bold">•</span>
                  <span><strong className="text-slate-800 dark:text-slate-200">Verify Root Domain:</strong> Confirm the decoded web address ends in the organization's legitimate root domain.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-700 dark:text-cyan-400 font-bold">•</span>
                  <span><strong className="text-slate-800 dark:text-slate-200">Avoid Immediate Login:</strong> Never type login credentials or financial PINs immediately after scanning a physical QR code.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* Scan Results Display */}
        {scanResult && (
          <div className="space-y-6 pt-4 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              
              <div className="h-full">
                <RiskGauge score={scanResult.risk_score} riskLevel={scanResult.risk_level} />
              </div>

              <div className="md:col-span-2 h-full bg-white dark:bg-[#0A1122] border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-7 flex flex-col justify-between shadow-xs transition-colors duration-200">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                      Decoded Link Assessment
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider font-mono ${
                      scanResult.risk_level === "High Risk" 
                        ? "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950 dark:text-rose-400 dark:border-rose-800" 
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800"
                    }`}>
                      {scanResult.risk_level}
                    </span>
                  </div>

                  <h3 className={`text-xl font-black font-mono ${
                    scanResult.risk_level === "High Risk" ? "text-rose-600 dark:text-rose-400" : scanResult.risk_level === "Suspicious" ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"
                  }`}>
                    {scanResult.risk_level} ({scanResult.risk_score}/100) — {scanResult.ai_prediction}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                    {scanResult.recommendation}
                  </p>

                  <div className="mt-4 p-3.5 bg-slate-50 dark:bg-[#060A14] rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-mono space-y-1.5">
                    <div className="text-slate-600 dark:text-slate-400">Host Domain: <span className="text-slate-900 dark:text-white font-bold">{scanResult.domain}</span></div>
                    <div className="text-slate-600 dark:text-slate-400">Security Protocol: <span className={scanResult.features?.is_https ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-amber-600 dark:text-amber-400 font-bold"}>{scanResult.features?.is_https ? "HTTPS (Encrypted)" : "HTTP (Insecure)"}</span></div>
                    <div className="text-slate-600 dark:text-slate-400">Threat Indicators Flagged: <span className="text-rose-600 dark:text-rose-400 font-bold">{scanResult.factors?.length || 0} factors</span></div>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 font-mono">
                  Recorded in Audit Log Database
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
}