import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Activity, 
  TrendingUp, 
  Clock, 
  ExternalLink, 
  RefreshCw, 
  Search, 
  Database, 
  ArrowUpRight, 
  BarChart3, 
  PieChart as PieIcon, 
  Layers, 
  ChevronRight,
  Info
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import PageHeader from '../components/PageHeader';

export default function Dashboard({ onNavigateToScanner }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/api/dashboard");
      if (res.data?.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Unable to connect to database. Ensure backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 10000); // 10s auto-refresh
    return () => clearInterval(interval);
  }, []);

  const riskPieData = stats?.risk_distribution && stats.total_scans > 0 ? stats.risk_distribution : [
    { name: "Legitimate (Safe)", value: 1, color: "#10B981" },
    { name: "Suspicious", value: 0, color: "#F59E0B" },
    { name: "Phishing (Dangerous)", value: 0, color: "#EF4444" },
  ];

  return (
    <div className="min-h-screen pb-16">
      
      {/* Enterprise Header */}
      <PageHeader 
        breadcrumb="Threat Intelligence Dashboard"
        title="Real-Time Threat Telemetry & Risk Statistics"
        description="Live operational telemetry aggregated directly from database scan records. Tracks cybersecurity threat velocity, machine learning classification rates, and recent risk evaluations."
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#0A1120] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono font-medium rounded-lg border border-slate-300 dark:border-slate-700 transition shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-blue-600 dark:text-cyan-400" : ""}`} />
              <span>Refresh Feed</span>
            </button>
            <button
              onClick={onNavigateToScanner}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#0B2545] hover:bg-[#1E3A8A] dark:bg-gradient-to-r dark:from-cyan-500 dark:to-blue-600 text-white dark:text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Scan URL</span>
            </button>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {error && (
          <div className="p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs rounded-xl flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 4 Primary KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Card 1: Total URLs Scanned */}
          <div className="bg-white dark:bg-[#0A1122] border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 shadow-xs hover:border-slate-400 dark:hover:border-slate-700 transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                  Total URLs Scanned
                </span>
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                  <Activity className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl sm:text-4xl font-extrabold text-[#0B2545] dark:text-white font-mono tracking-tight">
                  {stats?.total_scans ?? 0}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
                  Database Logged Scans
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 text-[10px] text-slate-400 font-mono">
              Live audit records
            </div>
          </div>

          {/* Card 2: Phishing Threats Neutralized */}
          <div className="bg-white dark:bg-[#0A1122] border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 shadow-xs hover:border-rose-300 dark:hover:border-rose-900/50 transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 font-mono">
                  Phishing Detected
                </span>
                <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20">
                  <ShieldAlert className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl sm:text-4xl font-extrabold text-rose-600 dark:text-rose-400 font-mono tracking-tight">
                  {stats?.phishing_detected ?? 0}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
                  High Risk attacks flagged
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 text-[10px] text-rose-600 dark:text-rose-500 font-mono">
              Action: Block & Warn
            </div>
          </div>

          {/* Card 3: Legitimate Safe Sites */}
          <div className="bg-white dark:bg-[#0A1122] border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-900/50 transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono">
                  Legitimate Sites
                </span>
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tracking-tight">
                  {stats?.legitimate_detected ?? 0}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
                  Verified structural validity
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 text-[10px] text-emerald-600 dark:text-emerald-500 font-mono">
              SSL & Domain Verified
            </div>
          </div>

          {/* Card 4: Threat Detection Rate */}
          <div className="bg-white dark:bg-[#0A1122] border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 shadow-xs hover:border-blue-300 dark:hover:border-cyan-900/50 transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-cyan-400 font-mono">
                  Threat Detection Rate
                </span>
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-cyan-500/10 text-blue-700 dark:text-cyan-400 border border-blue-200 dark:border-cyan-500/20">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl sm:text-4xl font-extrabold text-blue-700 dark:text-cyan-300 font-mono tracking-tight">
                  {stats?.threat_rate_pct ?? 0}%
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
                  Suspicious Sites: {stats?.suspicious_detected ?? 0}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 text-[10px] text-blue-700 dark:text-cyan-500 font-mono">
              Random Forest Model
            </div>
          </div>

        </div>

        {/* Charts Section: Risk Distribution Donut & Activity Bar Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chart 1: Threat Risk Distribution */}
          <div className="bg-white dark:bg-[#0A1122] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80 mb-4">
                <div className="flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-blue-700 dark:text-cyan-400" />
                  <h3 className="text-xs font-bold text-[#0B2545] dark:text-white uppercase tracking-wider font-mono">
                    Threat Risk Distribution
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                  Total: {stats?.total_scans || 0}
                </span>
              </div>

              {/* Explicit 240px container for Recharts */}
              <div className="w-full h-[240px] relative flex items-center justify-center my-2">
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={riskPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {riskPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#060A14", borderColor: "#1E293B", borderRadius: "8px", fontSize: "12px", fontFamily: "monospace", color: "#FFF" }}
                      itemStyle={{ color: "#F1F5F9" }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Center Stats Display inside Donut */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-black text-[#0B2545] dark:text-white font-mono">
                    {stats?.total_scans || 0}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono tracking-wider">
                    Scans
                  </span>
                </div>
              </div>
            </div>

            {/* Custom Legend */}
            <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800/80">
              {riskPieData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-slate-600 dark:text-slate-400">{item.name}</span>
                  </div>
                  <span className="text-slate-900 dark:text-white font-bold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chart 2: Scan Activity Velocity Bar Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-[#0A1122] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80 mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                  <h3 className="text-xs font-bold text-[#0B2545] dark:text-white uppercase tracking-wider font-mono">
                    Scan Frequency & Threat Velocity
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-blue-700 dark:text-cyan-400 bg-blue-50 dark:bg-slate-900 px-2 py-0.5 rounded border border-blue-200 dark:border-slate-800">
                  Daily Timeline
                </span>
              </div>

              {/* Explicit 240px container for BarChart */}
              <div className="w-full h-[240px] my-2">
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={stats?.activity_timeline || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" className="dark:stroke-slate-800" />
                    <XAxis dataKey="date" stroke="#64748B" fontSize={11} fontFamily="monospace" />
                    <YAxis stroke="#64748B" fontSize={11} allowDecimals={false} fontFamily="monospace" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#060A14", borderColor: "#1E293B", borderRadius: "8px", fontSize: "12px", fontFamily: "monospace", color: "#FFF" }}
                      itemStyle={{ color: "#F1F5F9" }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px", fontFamily: "monospace" }} />
                    <Bar dataKey="legitimate" name="Legitimate Sites" fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="phishing" name="Phishing Attacks" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-800/80 font-mono gap-1">
              <span>Threat Intelligence Feed: Real Scan Repository</span>
              <span>Sub-Second Response Latency</span>
            </div>
          </div>

        </div>

        {/* Recent Scans Stream Table & Mobile Card View */}
        <div className="bg-white dark:bg-[#0A1122] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-700 dark:text-cyan-400" />
              <h3 className="text-xs sm:text-sm font-bold text-[#0B2545] dark:text-white uppercase tracking-wider font-mono">
                Recent Scans Audit Stream
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              Live Feed ({stats?.recent_scans?.length || 0} Records)
            </span>
          </div>

          {stats?.recent_scans && stats.recent_scans.length > 0 ? (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50 dark:bg-[#060A14] text-slate-600 dark:text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Target Website URL / Host</th>
                      <th className="py-3 px-4">AI Prediction</th>
                      <th className="py-3 px-4">Confidence</th>
                      <th className="py-3 px-4">Risk Score</th>
                      <th className="py-3 px-4">Classification</th>
                      <th className="py-3 px-4 text-right">Scanned Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {stats.recent_scans.map((scan) => (
                      <tr key={scan.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                        <td className="py-3 px-4">
                          <div className="max-w-xs truncate text-slate-900 dark:text-slate-200 font-semibold text-xs" title={scan.url}>
                            {scan.url}
                          </div>
                          <span className="text-[10px] text-slate-500 block">{scan.domain}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`font-bold ${
                            scan.ai_prediction === "Phishing" ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"
                          }`}>
                            {scan.ai_prediction}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                          {scan.ai_confidence}%
                        </td>
                        <td className="py-3 px-4">
                          <span className={`font-bold ${
                            scan.risk_score >= 60 ? "text-rose-600 dark:text-rose-400" : scan.risk_score >= 30 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"
                          }`}>
                            {scan.risk_score}/100
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                            scan.risk_level === "High Risk" 
                              ? "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30" 
                              : scan.risk_level === "Suspicious" 
                              ? "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30" 
                              : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30"
                          }`}>
                            {scan.risk_level}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right text-slate-500 dark:text-slate-400 text-[11px]">
                          {new Date(scan.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-3">
                {stats.recent_scans.map((scan) => (
                  <div key={scan.id} className="p-3.5 bg-slate-50 dark:bg-[#060A14] rounded-lg border border-slate-200 dark:border-slate-800 space-y-2 font-mono text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div className="truncate text-slate-900 dark:text-slate-200 font-semibold text-xs" title={scan.url}>
                        {scan.url}
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider shrink-0 ${
                        scan.risk_level === "High Risk" ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400" : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"
                      }`}>
                        {scan.risk_level}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800">
                      <span>AI: <strong className={scan.ai_prediction === "Phishing" ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}>{scan.ai_prediction}</strong> ({scan.ai_confidence}%)</span>
                      <span className="font-bold text-slate-900 dark:text-white">Score: {scan.risk_score}/100</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="py-10 text-center text-xs text-slate-500 font-mono">
              No scans recorded in database yet. Click "Scan URL" to analyze your first website!
            </div>
          )}
        </div>

      </div>

    </div>
  );
}