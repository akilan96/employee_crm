import React from 'react';
import { Users, CheckCircle2, Laptop, HeartPulse, ArrowRight, Droplets } from 'lucide-react';
import { DepartmentBadge } from './Badges';
import { DEPARTMENTS, BLOOD_GROUPS } from '../data/employeesData';

export default function AnalyticsDashboard({
  employees,
  departmentCounts,
  bloodGroupCounts,
  onNavigateToSection,
  onNavigateToBloodGroup
}) {
  return (
    <div className="space-y-6">
      {/* Top KPI Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{employees.length}</div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Headcount</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {employees.filter(e => e.status === 'Active').length}
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active On-Site</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Laptop className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {employees.filter(e => e.status === 'Remote').length}
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Remote Specialists</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {Object.values(bloodGroupCounts).filter(c => c > 0).length} / 8
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Blood Group Diversity</div>
          </div>
        </div>
      </div>

      {/* Department Breakdown Cards */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Department Headcount & Allocation</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Distribution across 4 core organizational divisions</p>
          </div>
          <button
            onClick={() => onNavigateToSection('ALL')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>View All in Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {DEPARTMENTS.map(dept => {
            const count = departmentCounts[dept.key] || 0;
            const percentage = employees.length ? Math.round((count / employees.length) * 100) : 0;
            return (
              <div
                key={dept.key}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <DepartmentBadge department={dept.name} size="sm" />
                    <span className="text-xs font-bold font-mono text-slate-600 dark:text-slate-300">{percentage}%</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 mb-3">
                    {dept.description}
                  </p>
                </div>

                <div>
                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%`, backgroundColor: dept.accentColor }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">{count} Members</span>
                    <button
                      onClick={() => onNavigateToSection(dept.key)}
                      className="text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Explore →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Blood Group Donor Matrix */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Droplets className="w-5 h-5 text-rose-500" />
              <span>Blood Group Emergency Donor Registry</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Click any blood group to instantly inspect donors</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {BLOOD_GROUPS.map(bg => {
            const count = bloodGroupCounts[bg] || 0;
            return (
              <button
                key={bg}
                onClick={() => onNavigateToBloodGroup(bg)}
                className="p-3 rounded-xl border border-rose-100 dark:border-rose-950/60 bg-rose-50/40 dark:bg-rose-950/20 hover:bg-rose-100/70 dark:hover:bg-rose-900/40 text-center transition-all group"
              >
                <div className="text-lg font-mono font-black text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform">
                  {bg}
                </div>
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">
                  {count} {count === 1 ? 'Donor' : 'Donors'}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
