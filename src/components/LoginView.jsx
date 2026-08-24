import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, ShieldCheck, ShieldAlert, ArrowRight, Sparkles, Moon, Sun } from 'lucide-react';

export const USERS = [
  {
    username: 'user',
    password: 'user123',
    role: 'user',
    displayName: 'Staff User',
    description: 'View Directory, Details & Analytics (Read/Edit)',
    canDelete: false
  },
  {
    username: 'editor',
    password: 'editor123',
    altPassword: 'editor 123',
    role: 'editor',
    displayName: 'Editor',
    description: 'Full Access including Delete Profiles & Database Operations',
    canDelete: true
  }
];

export default function LoginView({ onLogin, theme, toggleTheme }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setError('');

    const trimmedUser = username.trim().toLowerCase();
    const trimmedPass = password.trim();

    const matched = USERS.find(u => 
      u.username.toLowerCase() === trimmedUser && 
      (u.password === trimmedPass || (u.altPassword && u.altPassword === trimmedPass))
    );

    if (matched) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        onLogin(matched);
      }, 300);
    } else {
      setError('Invalid username or password. Please use user / user123 or editor / editor123.');
    }
  };

  const handleQuickLogin = (userItem) => {
    setUsername(userItem.username);
    setPassword(userItem.password);
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(userItem);
    }, 250);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between relative overflow-hidden font-sans text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header Bar */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center">
            <img src="/neekan-logo.png" alt="Neekan Consulting LLP" className="h-5 w-auto object-contain" />
          </div>
          <div className="bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center">
            <img src="/udu_labs.png" alt="UDU Labs" className="h-5 w-auto object-contain" />
          </div>
          <span className="font-extrabold text-sm sm:text-base tracking-tight text-white hidden sm:inline">
            Neekan Consulting LLP
          </span>
        </div>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl border border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
        </button>
      </header>

      {/* Main Login Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80">
          {/* Card Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-500/30 ring-4 ring-indigo-500/15">
              <Lock className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              Enterprise Access
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Sign in to manage Neekan & UDU Labs Directory
            </p>
          </div>

          {/* Quick Login Chips */}
          <div className="mb-6 space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
              Quick One-Click Sign In
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {/* User Chip */}
              <button
                type="button"
                onClick={() => handleQuickLogin(USERS[0])}
                className="p-2.5 rounded-2xl border border-slate-800 bg-slate-800/50 hover:bg-slate-800 hover:border-indigo-500/50 transition-all text-left group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-white group-hover:text-indigo-300 transition-colors">
                    user
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    User
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">user123</span>
              </button>

              {/* Editor Chip */}
              <button
                type="button"
                onClick={() => handleQuickLogin(USERS[1])}
                className="p-2.5 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-950/40 hover:border-emerald-500/60 transition-all text-left group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-emerald-300 group-hover:text-emerald-200 transition-colors">
                    editor
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Editor
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400/80 font-mono">editor123</span>
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center mb-5">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-3 text-[11px] text-slate-500 uppercase font-semibold">Or enter credentials</span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="user or editor"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-700 bg-slate-800/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-700 bg-slate-800/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  <span>Sign In to CRM</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Access Rules Info Box */}
          <div className="mt-5 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Role Permissions:</span>
            </div>
            <p className="text-[10px] text-slate-400">
              • <strong className="text-slate-300">user</strong>: Directory, Details, Filter & Search
            </p>
            <p className="text-[10px] text-emerald-400">
              • <strong className="text-emerald-300">editor</strong>: Full Management & Administrative Access
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center text-xs text-slate-500">
        Neekan Consulting LLP & UDU Labs Enterprise Systems
      </footer>
    </div>
  );
}
