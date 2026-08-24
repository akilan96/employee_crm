import React from 'react';
import { Users, UserPlus, Moon, Sun, Image as ImageIcon, LogOut, ShieldCheck, User } from 'lucide-react';

export default function Navbar({
  theme,
  toggleTheme,
  activeModule,
  setActiveModule,
  totalEmployees,
  onAddEmployee,
  currentUser,
  onLogout,
  onOpenSupabaseModal,
  isSupabaseConnected
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Partner Logos */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Logos Container */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Neekan Logo Card */}
              <div
                className="bg-white px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-center shrink-0 hover:shadow-sm transition-all"
                title="Neekan Consulting LLP"
              >
                <img
                  src="/neekan-logo.png"
                  alt="Neekan Consulting LLP"
                  className="h-4 sm:h-5 w-auto object-contain"
                />
              </div>

              {/* Minimal Divider / Plus */}
              <span className="text-slate-300 dark:text-slate-600 font-bold text-xs select-none">
                +
              </span>

              {/* UDU Labs Logo Card */}
              <div
                className="bg-white px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-center shrink-0 hover:shadow-sm transition-all"
                title="UDU Labs"
              >
                <img
                  src="/udu_labs.png"
                  alt="UDU Labs"
                  className="h-4 sm:h-5 w-auto object-contain"
                />
              </div>
            </div>

            {/* Brand Title */}
            <div className="flex items-center select-none">
              <h1 className="text-xs sm:text-sm md:text-base font-black tracking-tight text-slate-900 dark:text-white">
                Neekan Consulting LLP &amp; UDU Labs
              </h1>
            </div>
          </div>

          {/* Module Navigation Bar (Desktop) */}
          <div className="hidden sm:flex items-center p-1 bg-slate-100/90 dark:bg-slate-800/90 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
            <button
              onClick={() => setActiveModule('employees')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeModule === 'employees'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Employee Directory</span>
              <span className={`px-1.5 py-0.2 text-[11px] font-bold rounded-full ${activeModule === 'employees'
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-200'
                  : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                }`}>
                {totalEmployees}
              </span>
            </button>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Supabase Cloud Live Sync Indicator / Button */}
            <button
              onClick={onOpenSupabaseModal}
              title={isSupabaseConnected ? "Supabase Live Realtime Cloud DB Connected" : "Connect Supabase Live Cloud Database"}
              className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                isSupabaseConnected
                  ? 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                  : 'bg-slate-100/80 hover:bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              <span className="relative flex h-2 w-2">
                {isSupabaseConnected && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isSupabaseConnected ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
              </span>
              <span className="hidden md:inline">
                {isSupabaseConnected ? 'Cloud DB Live' : 'Connect Cloud DB'}
              </span>
            </button>
            {/* Add Employee CTA */}
            <button
              onClick={onAddEmployee}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-sm shadow-indigo-500/20 active:scale-95 transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Employee</span>
              <span className="sm:hidden">Add</span>
            </button>

            {/* User Profile Pill & Logout */}
            {currentUser && (
              <div className="flex items-center gap-1.5 pl-1.5 pr-1 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-1.5">
                  <div className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-bold ${currentUser.role === 'editor'
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : 'bg-indigo-500 text-white shadow-xs'
                    }`}>
                    {currentUser.username[0].toUpperCase()}
                  </div>
                  <div className="hidden lg:block text-left leading-none pr-1">
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block">
                      {currentUser.username}
                    </span>
                    <span className={`text-[9px] font-bold uppercase ${currentUser.role === 'editor'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-indigo-600 dark:text-indigo-400'
                      }`}>
                      {currentUser.role === 'editor' ? 'Editor' : 'User'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
