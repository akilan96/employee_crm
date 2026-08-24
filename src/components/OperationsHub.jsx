import React from 'react';
import { HeartPulse, Download, PhoneCall, History, Phone } from 'lucide-react';
import { BloodBadge } from './Badges';
import { SAMPLE_AVATARS } from '../data/employeesData';

export default function OperationsHub({
  employees,
  activityLogs,
  onOpenExport,
  onResetData,
  canDelete = false
}) {
  return (
    <div className="space-y-6">
      {/* Quick Action Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 mb-3">
            <HeartPulse className="w-3.5 h-3.5" />
            <span>Medical Readiness & Emergency Support</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Neekan Emergency Response Directory</h2>
          <p className="text-sm text-slate-300 max-w-2xl mt-1">
            Instantly locate emergency contacts, verified blood donors, and export complete organizational rosters.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={onOpenExport}
            className="px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-sm font-bold shadow-md flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-indigo-600" />
            <span>Export Rosters</span>
          </button>
          {canDelete && (
            <button
              onClick={onResetData}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-semibold border border-slate-700"
            >
              Reset Sample Data
            </button>
          )}
        </div>
      </div>

      {/* Emergency Blood Donor Quick Call Directory */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-rose-500" />
            <span>Instant Emergency Contact Grid</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {employees.map(emp => (
            <div
              key={emp.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <img
                  src={emp.pic || SAMPLE_AVATARS[0]}
                  alt={emp.name}
                  className="w-11 h-11 rounded-xl object-cover"
                />
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>{emp.name}</span>
                    <BloodBadge bloodGroup={emp.bloodGroup} size="sm" />
                  </div>
                  <div className="text-xs text-slate-500 font-mono">{emp.mobile}</div>
                </div>
              </div>

              <a
                href={`tel:${emp.mobile}`}
                className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white dark:bg-emerald-950/60 dark:text-emerald-400 dark:hover:bg-emerald-600 dark:hover:text-white transition-colors"
                title={`Call ${emp.name}`}
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Audit & Activity Log */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-500" />
            <span>CRM Activity & Audit Trail</span>
          </h3>
          <span className="text-xs text-slate-400">{activityLogs.length} events logged</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-80 overflow-y-auto pr-2">
          {activityLogs.map(log => (
            <div key={log.id} className="py-3 flex items-start justify-between gap-4 text-xs">
              <div className="flex items-start gap-2.5">
                <span className={`w-2 h-2 rounded-full mt-1.5 ${
                  log.type === 'success' ? 'bg-emerald-500' :
                  log.type === 'danger' ? 'bg-rose-500' :
                  log.type === 'warning' ? 'bg-amber-500' : 'bg-indigo-500'
                }`} />
                <div>
                  <strong className="text-slate-800 dark:text-slate-200 font-semibold">{log.action}</strong>
                  <p className="text-slate-500 dark:text-slate-400">{log.detail}</p>
                </div>
              </div>
              <span className="text-slate-400 dark:text-slate-500 font-mono text-[11px] whitespace-nowrap">
                {log.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
