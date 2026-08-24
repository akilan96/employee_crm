import React from 'react';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export default function ToastContainer({ toasts }) {
  return (
    <div className="fixed bottom-5 right-5 z-50 space-y-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="toast-animate pointer-events-auto bg-slate-900 text-white dark:bg-white dark:text-slate-900 p-4 rounded-2xl shadow-xl border border-slate-800 dark:border-slate-200 flex items-center justify-between gap-3 text-xs"
        >
          <div className="flex items-center gap-2">
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />}
            {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 dark:text-amber-600 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-indigo-400 dark:text-indigo-600 shrink-0" />}
            <span className="font-medium">{toast.message}</span>
          </div>

          {toast.actionLabel && toast.onAction && (
            <button
              onClick={toast.onAction}
              className="font-bold underline text-indigo-300 dark:text-indigo-600 hover:opacity-80 shrink-0"
            >
              {toast.actionLabel}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
