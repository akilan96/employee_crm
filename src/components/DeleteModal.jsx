import React from 'react';
import { Trash2 } from 'lucide-react';

export default function DeleteModal({
  employee,
  onConfirm,
  onCancel
}) {
  if (!employee) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm modal-animate">
      <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Delete Employee Record?</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 mb-6">
          Are you sure you want to delete <strong className="text-slate-800 dark:text-slate-200">{employee.name}</strong> ({employee.id}) from the {employee.department} section? You can undo this immediately from the notification.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20"
          >
            Yes, Delete Record
          </button>
        </div>
      </div>
    </div>
  );
}
