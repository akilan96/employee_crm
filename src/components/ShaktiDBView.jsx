import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Cpu,
  Database,
  Sparkles,
  ArrowRight,
  Download,
  BookOpen,
  Terminal,
  Play,
  Check,
  Copy,
  ExternalLink,
  ChevronDown,
  Moon,
  Sun,
  Layers,
  Zap,
  Lock,
  Globe,
  Server,
  Activity,
  Award,
  Users,
  Code2,
  CheckCircle2,
  RefreshCw,
  X,
  FileCode
} from 'lucide-react';
import {
  INSTITUTIONAL_PARTNERS,
  NAV_ITEMS,
  SQL_PLAYGROUND_PRESETS,
  BENCHMARK_COMPARISONS,
  CORE_PILLARS,
  RELEASE_PACKAGES
} from '../data/shaktiData';

export default function ShaktiDBView({
  theme,
  toggleTheme,
  onOpenDirectory,
  onShowToast
}) {
  // Navigation & Active Section State
  const [activeNav, setActiveNav] = useState('home');
  const [selectedLang, setSelectedLang] = useState('English');
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  // SQL Terminal Interactive State
  const [selectedPresetId, setSelectedPresetId] = useState('banking');
  const [isExecutingSql, setIsExecutingSql] = useState(false);
  const [sqlOutput, setSqlOutput] = useState(null);
  const [hasExecuted, setHasExecuted] = useState(true);

  // Copy state for curl command & SQL
  const [isCurlCopied, setIsCurlCopied] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState(null);

  // Modals state
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [selectedPackage, setSelectedPackage] = useState(RELEASE_PACKAGES[0]);

  // Current active SQL Preset
  const activePreset = SQL_PLAYGROUND_PRESETS.find(p => p.id === selectedPresetId) || SQL_PLAYGROUND_PRESETS[0];

  useEffect(() => {
    setSqlOutput(activePreset.output);
  }, [selectedPresetId]);

  const handleRunSql = () => {
    setIsExecutingSql(true);
    setTimeout(() => {
      setIsExecutingSql(false);
      setSqlOutput(activePreset.output);
      setHasExecuted(true);
      if (onShowToast) {
        onShowToast('✓ Query executed with Post-Quantum Enclave Attestation!', 'success');
      }
    }, 450);
  };

  const handleCopyCurl = () => {
    navigator.clipboard.writeText('curl -sSL https://get.shaktidb.org | sh');
    setIsCurlCopied(true);
    setTimeout(() => setIsCurlCopied(false), 2500);
    if (onShowToast) onShowToast('✓ Installation command copied to clipboard!', 'success');
  };

  const handleCopyText = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
    if (onShowToast) onShowToast('✓ Copied to clipboard!', 'success');
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 selection:bg-cyan-500 selection:text-slate-950 relative overflow-x-hidden font-sans pb-24">
      {/* Dynamic Background Aurora Glows & Grid */}
      <div className="absolute inset-0 shakti-grid-bg pointer-events-none opacity-40 z-0"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-cyan-600/15 via-blue-600/10 to-transparent blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute top-[600px] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 blur-[160px] pointer-events-none z-0"></div>
      <div className="absolute top-[1200px] left-[-10%] w-[600px] h-[600px] bg-emerald-600/10 blur-[160px] pointer-events-none z-0"></div>

      {/* 1. TOP HEADER WITH INSTITUTIONAL BADGES & CONTROLS */}
      <header className="relative z-30 pt-4 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Institutional Logos Pill Container (MeitY, IITM Pravartak, IIT Madras, C-DAC) */}
          <div className="bg-white text-slate-900 px-3.5 py-1.5 rounded-2xl shadow-xl border border-slate-200/80 flex items-center gap-3 sm:gap-4 shrink-0 transition-transform hover:scale-[1.01]">
            
            {/* MeitY */}
            <div className="flex items-center gap-1.5 pr-2.5 border-r border-slate-200">
              <div className="w-7 h-7 flex items-center justify-center">
                {/* Government of India Ashoka Lion Pillar Icon SVG */}
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-amber-600 fill-current">
                  <path d="M12 2L15 8H9L12 2Z" opacity="0.8"/>
                  <path d="M7 9H17V11H7V9Z"/>
                  <path d="M8 12H16V17H8V12Z"/>
                  <path d="M5 18H19V20H5V18Z"/>
                  <circle cx="12" cy="14.5" r="1.5" fill="#1e293b"/>
                </svg>
              </div>
              <div className="leading-tight">
                <div className="text-[12px] font-black tracking-tight text-slate-900">MeitY</div>
                <div className="text-[8px] font-semibold text-slate-600 leading-none">Govt. of India</div>
              </div>
            </div>

            {/* IITM Pravartak */}
            <div className="flex items-center gap-1.5 pr-2.5 border-r border-slate-200">
              <div className="leading-tight text-left">
                <div className="text-[11px] font-black tracking-tight text-slate-900 flex items-center gap-0.5">
                  <span>IITM</span>
                  <span className="text-emerald-700 font-extrabold">PRAVARTAK</span>
                </div>
                <div className="text-[7.5px] font-bold text-emerald-800 tracking-wider uppercase leading-none">
                  Catalysing Innovation
                </div>
              </div>
            </div>

            {/* IIT Madras Seal */}
            <div className="flex items-center gap-1 pr-2.5 border-r border-slate-200" title="Indian Institute of Technology Madras">
              <div className="w-6 h-6 rounded-full bg-[#800000] text-white flex items-center justify-center text-[8px] font-serif font-black shadow-xs">
                IITM
              </div>
            </div>

            {/* C-DAC */}
            <div className="flex items-center gap-1.5">
              <div className="leading-tight text-left">
                <div className="text-[12px] font-black text-sky-800 tracking-tight">सी डैक</div>
                <div className="text-[10px] font-extrabold text-slate-800 tracking-widest leading-none">CDAC</div>
              </div>
            </div>

          </div>

          {/* Right Utility Cluster: Language, Theme, Auth, Directory Switch */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 backdrop-blur-md transition-all"
              >
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>{selectedLang}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-slate-900/95 border border-slate-800 rounded-xl shadow-2xl backdrop-blur-xl py-1 z-50 animate-fadeIn">
                  {['English', 'हिंदी', 'தமிழ்'].map(lang => (
                    <button
                      key={lang}
                      onClick={() => {
                        setSelectedLang(lang);
                        setIsLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs font-medium transition-colors ${
                        selectedLang === lang ? 'bg-cyan-500/15 text-cyan-400 font-bold' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle (Dark/Light) */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="p-2 rounded-full border border-slate-800 bg-slate-900/80 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/30 transition-all backdrop-blur-md"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
            </button>

            {/* Sign In Button */}
            <button
              onClick={() => {
                setAuthMode('login');
                setIsAuthModalOpen(true);
              }}
              className="px-4 py-1.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-full transition-colors"
            >
              Sign In
            </button>

            {/* Create Account Glowing Pill CTA */}
            <button
              onClick={() => {
                setAuthMode('register');
                setIsAuthModalOpen(true);
              }}
              className="px-4 sm:px-5 py-1.5 text-xs font-black tracking-wider uppercase rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 shadow-md shadow-cyan-500/20 active:scale-95 transition-all"
            >
              CREATE ACCOUNT
            </button>

            {/* Back to Employee Directory Portal Button */}
            {onOpenDirectory && (
              <button
                onClick={onOpenDirectory}
                title="Switch to Internal Employee Directory"
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-slate-800/80 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-all"
              >
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                <span>Team CRM</span>
              </button>
            )}

          </div>
        </div>

        {/* 2. FLOATING CENTER NAVIGATION PILL (Exact match from user's image) */}
        <div className="mt-6 flex justify-center">
          <nav className="inline-flex items-center gap-1 p-1 bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 rounded-full shadow-2xl overflow-x-auto max-w-full">
            {NAV_ITEMS.map(item => {
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveNav(item.id);
                    if (item.id === 'downloads') setIsDownloadModalOpen(true);
                    if (item.id === 'documentation') setIsDocsModalOpen(true);
                  }}
                  className={`px-3.5 sm:px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-slate-950 font-bold shadow-md shadow-white/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* 3. MAIN HERO CONTAINER (The central glowing card from the screenshot) */}
      <main className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Main Hero Card Container */}
        <div className="relative rounded-[2.5rem] bg-gradient-to-b from-[#080e1e] to-[#040711] border border-cyan-500/20 shadow-2xl p-6 sm:p-10 md:p-14 text-center overflow-hidden shakti-border-glow">
          
          {/* Ambient Glows Inside the Card */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute -bottom-24 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
          
          {/* Animated 3D Quantum ShaktiDB Logo */}
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center cursor-pointer group">
              
              {/* Outer Orbit Ring 1 */}
              <div className="absolute inset-0 rounded-full border border-cyan-400/40 animate-spin-slow group-hover:border-cyan-400 transition-colors">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_6px_#2dd4bf]"></div>
              </div>

              {/* Orbit Ring 2 (Tilted) */}
              <div className="absolute inset-1 rounded-full border border-dashed border-blue-400/30 animate-spin-reverse-slow">
                <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]"></div>
              </div>

              {/* Orbit Ring 3 (Geometric Petals) */}
              <div className="absolute inset-2.5 rounded-full border border-cyan-500/20 rotate-45"></div>

              {/* Central Glowing Core with 'S' */}
              <div className="relative z-10 w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">
                <span className="font-black text-slate-950 text-xl font-mono tracking-tighter">S</span>
              </div>

            </div>

            {/* ShaktiDB Brand Title */}
            <div className="mt-3 flex items-center gap-1.5">
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-white font-sans">
                ShaktiDB
              </span>
              <span className="text-xs font-bold text-cyan-400 tracking-widest align-super">TM</span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15] mb-5">
            An Indigenous PostgreSQL-Forked Database Ecosystem
          </h1>

          {/* Subtitle / Description */}
          <p className="text-sm sm:text-base md:text-lg text-slate-300/90 max-w-3xl mx-auto font-normal leading-relaxed mb-6">
            A secure, scalable database platform built for Digital India and global enterprise needs.
            Designed to power India's digital transformation with proven, open-source technology.
          </p>

          {/* IBM LinuxONE Validation Announcement Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs sm:text-sm font-semibold text-slate-200 shadow-inner mb-8 transition-all hover:border-cyan-400 hover:shadow-cyan-500/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span>
              ShaktiDB is now validated and fully supported on <span className="text-cyan-300 font-bold">IBM LinuxONE™</span>.
            </span>
          </div>

          {/* Action CTAs (READ DOCUMENTATION, GET STARTED, DOWNLOAD CLI) */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 mb-8">
            
            {/* Read Documentation Button */}
            <button
              onClick={() => setIsDocsModalOpen(true)}
              className="px-6 py-3 rounded-full text-xs sm:text-sm font-bold tracking-wider uppercase text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 shadow-md backdrop-blur-md transition-all active:scale-95 flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-slate-400" />
              <span>READ DOCUMENTATION</span>
            </button>

            {/* Get Started Button */}
            <button
              onClick={() => {
                setAuthMode('register');
                setIsAuthModalOpen(true);
              }}
              className="px-7 py-3 rounded-full text-xs sm:text-sm font-black tracking-wider uppercase text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-500 hover:from-cyan-300 hover:to-teal-300 shadow-lg shadow-cyan-500/25 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>GET STARTED</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Download Icon Button */}
            <button
              onClick={() => setIsDownloadModalOpen(true)}
              title="Download ShaktiDB Release Packages"
              className="p-3 rounded-full text-slate-300 hover:text-cyan-400 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 shadow-md backdrop-blur-md active:scale-95 transition-all"
            >
              <Download className="w-4 h-4" />
            </button>

          </div>

          {/* Quick Copyable Installation Command Strip */}
          <div className="max-w-xl mx-auto bg-slate-950/90 border border-slate-800/90 rounded-2xl p-2 sm:p-2.5 flex items-center justify-between gap-3 shadow-inner">
            <div className="flex items-center gap-2.5 pl-2 overflow-x-auto text-xs font-mono text-cyan-300">
              <span className="text-slate-500 select-none">$</span>
              <span className="whitespace-nowrap select-all font-semibold">
                curl -sSL https://get.shaktidb.org | sh
              </span>
            </div>
            <button
              onClick={handleCopyCurl}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 shrink-0 transition-colors"
            >
              {isCurlCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

        </div>

      </main>

      {/* 4. LIVE INTERACTIVE SQL & ENCLAVE TERMINAL PLAYGROUND */}
      <section className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Terminal className="w-3.5 h-3.5" />
            <span>Interactive SQL & Hardware Enclave Simulator</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Experience Sub-Millisecond Post-Quantum Queries
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto mt-1">
            Test real-world mission-critical workloads executed on the ShaktiDB sovereign kernel.
          </p>
        </div>

        {/* Terminal Sandbox Box */}
        <div className="bg-[#0b101d] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
          
          {/* Terminal Window Top Bar */}
          <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
              <span className="text-xs font-mono font-bold text-slate-400 ml-2">
                psql (ShaktiDB 16.4-sovereign-pqc on IBM LinuxONE)
              </span>
            </div>

            {/* Query Presets Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto max-w-full">
              {SQL_PLAYGROUND_PRESETS.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => setSelectedPresetId(preset.id)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                    selectedPresetId === preset.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {preset.category}
                </button>
              ))}
            </div>

            {/* Run Button */}
            <button
              onClick={handleRunSql}
              disabled={isExecutingSql}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black flex items-center gap-1.5 active:scale-95 transition-all shadow-md shadow-emerald-500/20 disabled:opacity-60"
            >
              {isExecutingSql ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Executing...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run Query</span>
                </>
              )}
            </button>
          </div>

          {/* Terminal Code Editor & Results Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
            
            {/* Left: SQL Query Code */}
            <div className="p-5 bg-[#070b14] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-bold text-slate-300">{activePreset.title}</span>
                  <span className="text-[11px] font-mono text-cyan-400">PostgreSQL 16 Dialect</span>
                </div>
                <pre className="font-mono text-xs text-slate-200 leading-relaxed overflow-x-auto p-3 rounded-xl bg-slate-950/70 border border-slate-900">
                  <code>{activePreset.query}</code>
                </pre>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="text-[11px] text-slate-400 italic">
                  {activePreset.description}
                </span>
                <button
                  onClick={() => handleCopyText(activePreset.query, activePreset.id)}
                  className="p-1 text-slate-400 hover:text-white transition-colors"
                  title="Copy SQL Query"
                >
                  {copiedCodeId === activePreset.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Right: Live Execution Plan & Metrics */}
            <div className="p-5 bg-[#090e1c] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    {sqlOutput?.status}
                  </span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold">
                    ⏱ {sqlOutput?.executionTime}
                  </span>
                </div>

                {/* Performance Metrics Cards */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Throughput</div>
                    <div className="text-xs font-black text-cyan-300 font-mono mt-0.5">{sqlOutput?.throughput}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Hardware Enclave</div>
                    <div className="text-xs font-bold text-amber-300 font-mono mt-0.5 truncate">{sqlOutput?.enclaveStatus}</div>
                  </div>
                </div>

                {/* Output Result Table */}
                <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950/80">
                  <div className="text-[11px] font-bold text-slate-400 uppercase bg-slate-900/80 px-3 py-1.5 border-b border-slate-800">
                    Enclave Result Stream ({sqlOutput?.rowsAffected} rows)
                  </div>
                  <div className="overflow-x-auto max-h-44 text-xs font-mono">
                    <table className="w-full text-left border-collapse">
                      <tbody className="divide-y divide-slate-800/80">
                        {sqlOutput?.resultTable?.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-900/50">
                            {Object.entries(row).map(([key, val]) => (
                              <td key={key} className="p-2 text-slate-300">
                                <span className="text-slate-500 text-[10px] block font-sans font-semibold uppercase">{key}</span>
                                <span className="text-slate-200">{String(val)}</span>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Direct kernel execution via libpq wire protocol</span>
                <span className="text-emerald-400 font-mono font-bold">100% ACID Guaranteed</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. CORE PILLARS & ARCHITECTURE SECTION */}
      <section className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Architecture & Capabilities</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            Built for National Scale & Enterprise Resilience
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto mt-2">
            Engineered to safeguard sovereign datasets while delivering world-record transaction throughput.
          </p>
        </div>

        {/* Pillars 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CORE_PILLARS.map(pillar => (
            <div
              key={pillar.id}
              className="p-7 rounded-3xl bg-gradient-to-b from-[#0a0f1e] to-[#050811] border border-slate-800 hover:border-cyan-500/40 shadow-xl transition-all hover:-translate-y-1 relative group overflow-hidden"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${pillar.color} flex items-center justify-center text-white shadow-lg`}>
                  {pillar.id === 'sovereignty' && <ShieldCheck className="w-6 h-6" />}
                  {pillar.id === 'linuxone' && <Cpu className="w-6 h-6" />}
                  {pillar.id === 'postgres' && <Database className="w-6 h-6" />}
                  {pillar.id === 'vector_ai' && <Sparkles className="w-6 h-6" />}
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-slate-900 border border-slate-700 text-cyan-300">
                  {pillar.badge}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                {pillar.title}
              </h3>
              <p className="text-xs font-semibold text-slate-400 mb-4">
                {pillar.subtitle}
              </p>

              <ul className="space-y-2 text-xs text-slate-300">
                {pillar.points.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold mt-0.5">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 6. PERFORMANCE BENCHMARKS VISUALIZER */}
      <section className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="bg-[#070c18] rounded-3xl border border-slate-800 p-6 sm:p-10 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Activity className="w-3.5 h-3.5" />
                <span>Verified Independent Benchmarks</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                ShaktiDB on IBM LinuxONE vs Industry Standard Engines
              </h3>
            </div>
            <button
              onClick={() => setIsDocsModalOpen(true)}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors shrink-0"
            >
              View Full Benchmark Whitepaper →
            </button>
          </div>

          <div className="space-y-6">
            {BENCHMARK_COMPARISONS.map((bench, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-white">{bench.metric}</h4>
                    <p className="text-[11px] text-slate-400">{bench.description}</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono font-bold shrink-0">
                    <span className="text-cyan-400">ShaktiDB: {bench.shakti}</span>
                    <span className="text-slate-400">Pg 16: {bench.vanillaPg}</span>
                    <span className="text-amber-400">Oracle: {bench.oracle}</span>
                  </div>
                </div>

                {/* Comparison Bar */}
                <div className="space-y-1.5">
                  {/* ShaktiDB Bar */}
                  <div className="flex items-center gap-3">
                    <span className="w-20 text-[11px] font-bold text-cyan-300">ShaktiDB</span>
                    <div className="flex-1 bg-slate-950 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-800">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-teal-400 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${bench.shaktiVal}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Vanilla PostgreSQL Bar */}
                  <div className="flex items-center gap-3">
                    <span className="w-20 text-[11px] font-medium text-slate-400">PostgreSQL</span>
                    <div className="flex-1 bg-slate-950 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-800/60">
                      <div
                        className="bg-slate-600 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${bench.vanillaVal}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Oracle Bar */}
                  <div className="flex items-center gap-3">
                    <span className="w-20 text-[11px] font-medium text-amber-400">Oracle 19c</span>
                    <div className="flex-1 bg-slate-950 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-800/60">
                      <div
                        className="bg-amber-600/70 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${bench.oracleVal}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. INSTITUTIONAL ECOSYSTEM & PARTNERS STRIP */}
      <section className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 text-center">
        <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-md">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">
            Institutional R&D & Strategic Collaborators
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center justify-items-center">
            {INSTITUTIONAL_PARTNERS.map(partner => (
              <div key={partner.id} className="text-center p-3 rounded-2xl hover:bg-slate-800/50 transition-all">
                <div className="font-extrabold text-white text-base">{partner.name}</div>
                <div className="text-[11px] font-semibold text-cyan-400">{partner.subtitle}</div>
                <div className="text-[9px] text-slate-400 mt-0.5">{partner.tagline}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-8 border-t border-slate-800/80 text-slate-400 text-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-orange-500 flex items-center justify-center text-slate-950 font-bold text-[11px]">S</div>
          <span className="text-white font-bold">ShaktiDB Ecosystem</span>
          <span>• Powered by Digital India & MeitY</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <button onClick={() => setIsDocsModalOpen(true)} className="hover:text-cyan-400">Documentation</button>
          <button onClick={() => setIsDownloadModalOpen(true)} className="hover:text-cyan-400">Downloads</button>
          <button onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }} className="hover:text-cyan-400">Enterprise Portal</button>
          <span>© 2026 ShaktiDB Project</span>
        </div>
      </footer>

      {/* ================= MODALS ================= */}

      {/* DOWNLOADS MODAL */}
      {isDownloadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0b101e] border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Download className="w-6 h-6 text-cyan-400" />
                <div>
                  <h3 className="text-lg font-bold text-white">Download ShaktiDB Packages</h3>
                  <p className="text-xs text-slate-400">Pre-built enterprise binaries, RPMs, DEBs, and Docker images</p>
                </div>
              </div>
              <button
                onClick={() => setIsDownloadModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {RELEASE_PACKAGES.map((pkg, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div>
                      <span className="text-sm font-bold text-white">{pkg.os}</span>
                      <span className="text-xs font-mono text-cyan-400 ml-2">({pkg.arch})</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      {pkg.version}
                    </span>
                  </div>

                  <div className="bg-slate-900 p-2.5 rounded-xl text-xs font-mono text-slate-300 flex items-center justify-between gap-2 overflow-x-auto mb-2">
                    <code>{pkg.command}</code>
                    <button
                      onClick={() => handleCopyText(pkg.command, `pkg_${i}`)}
                      className="p-1 text-slate-400 hover:text-white shrink-0"
                    >
                      {copiedCodeId === `pkg_${i}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Package: {pkg.packageType} • Size: {pkg.size}</span>
                    <span className="font-mono">{pkg.checksum}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsDownloadModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENTATION MODAL */}
      {isDocsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0b101e] border border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-6 h-6 text-cyan-400" />
                <div>
                  <h3 className="text-lg font-bold text-white">ShaktiDB Documentation & Quickstart</h3>
                  <p className="text-xs text-slate-400">PostgreSQL wire-compatible configuration & driver settings</p>
                </div>
              </div>
              <button
                onClick={() => setIsDocsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 space-y-5 text-xs text-slate-300">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                <h4 className="font-bold text-sm text-white mb-2">1. Connection URI & Standard Port</h4>
                <p className="text-slate-400 mb-2">
                  Connect using standard PostgreSQL client libraries (JDBC, ODBC, Python `psycopg3`, Node.js `pg`, Go `pgx`):
                </p>
                <pre className="p-3 rounded-xl bg-slate-900 font-mono text-cyan-300 overflow-x-auto">
                  <code>postgresql://shakti_admin:pqc_secret@localhost:5432/sovereign_db?sslmode=verify-full</code>
                </pre>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                <h4 className="font-bold text-sm text-white mb-2">2. Zero-Downtime Migration from PostgreSQL</h4>
                <p className="text-slate-400 mb-2">
                  Migrate your existing database without changing a single line of SQL:
                </p>
                <pre className="p-3 rounded-xl bg-slate-900 font-mono text-emerald-300 overflow-x-auto">
                  <code>pg_dump -h legacy-postgres-host -U user dbname | psql -h shaktidb-host -U shakti_admin sovereign_db</code>
                </pre>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                <h4 className="font-bold text-sm text-white mb-2">3. Enabling Hardware Enclaves on IBM LinuxONE</h4>
                <p className="text-slate-400 mb-2">
                  Configure hardware-assisted cryptographic acceleration in `shaktidb.conf`:
                </p>
                <pre className="p-3 rounded-xl bg-slate-900 font-mono text-amber-300 overflow-x-auto">
                  <code>shared_preload_libraries = 'pg_shakti_crypto, pg_shaktivector'
shakti.pqc_mode = 'ml_kem_768_dilithium'
shakti.ibm_linuxone_telum_accel = on</code>
                </pre>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsDocsModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AUTH MODAL (Sign In / Register) */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0b101e] border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center text-slate-950 font-black font-mono">
                  S
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {authMode === 'login' ? 'Sign In to ShaktiDB Cloud' : 'Create Sovereign Account'}
                  </h3>
                  <p className="text-[11px] text-slate-400">Enterprise Cloud Console & Cluster Management</p>
                </div>
              </div>
              <button
                onClick={() => setIsAuthModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              setIsAuthModalOpen(false);
              if (onShowToast) onShowToast(`✓ Welcome to ShaktiDB Enterprise Console!`, 'success');
            }} className="mt-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Corporate or Institutional Email</label>
                <input
                  type="email"
                  required
                  placeholder="engineer@gov.in or user@enterprise.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {authMode === 'register' && (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Organization / Department</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. National Informatics Centre / Banking Unit"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-500 hover:from-cyan-300 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 active:scale-95 transition-all mt-2"
              >
                {authMode === 'login' ? 'SIGN IN' : 'CREATE FREE ENTERPRISE ACCOUNT'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                  className="text-cyan-400 hover:underline text-[11px]"
                >
                  {authMode === 'login' ? "Don't have an account? Sign up" : 'Already registered? Sign in'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
