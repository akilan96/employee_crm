import React from 'react';
import { Download, X, ArrowRight, Printer } from 'lucide-react';

export default function ExportModal({
  employees,
  onClose,
  onExportSuccess
}) {
  const handleExportCSV = () => {
    const headers = ["ID", "Name", "Department", "Role", "Email", "Mobile", "LinkedIn", "Blood Group", "Company", "Address", "Status"];
    const rows = employees.map(e => [
      `"${e.id}"`,
      `"${e.name}"`,
      `"${e.department}"`,
      `"${e.role || ''}"`,
      `"${e.email}"`,
      `"${e.mobile}"`,
      `"${e.linkedin || ''}"`,
      `"${e.bloodGroup}"`,
      `"${e.companyName || 'Neekan Consulting LLP'}"`,
      `"${(e.address || '').replace(/"/g, '""')}"`,
      `"${e.status || 'Active'}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `neekan_employees_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClose();
    if (onExportSuccess) onExportSuccess("Exported employees to CSV file");
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(employees, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `neekan_employees_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClose();
    if (onExportSuccess) onExportSuccess("Exported employees to JSON file");
  };

  const handlePrint = () => {
    onClose();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm modal-animate">
      <div className="bg-white dark:bg-slate-900 max-w-lg w-full rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Download className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Export CRM Dataset</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Download complete records of all {employees.length} employees of Neekan Consulting LLP.
        </p>

        <div className="space-y-3">
          {/* CSV */}
          <button
            onClick={handleExportCSV}
            className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50/50 dark:bg-slate-800/40 text-left flex items-center justify-between transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center font-bold">
                CSV
              </div>
              <div>
                <div className="font-bold text-sm text-slate-800 dark:text-slate-200">Comma Separated Values (.csv)</div>
                <div className="text-xs text-slate-500">Spreadsheet ready for Excel, Google Sheets</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* JSON */}
          <button
            onClick={handleExportJSON}
            className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50/50 dark:bg-slate-800/40 text-left flex items-center justify-between transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 flex items-center justify-center font-bold">
                JSON
              </div>
              <div>
                <div className="font-bold text-sm text-slate-800 dark:text-slate-200">Raw JSON Format (.json)</div>
                <div className="text-xs text-slate-500">Developer friendly structured data</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Print PDF */}
          <button
            onClick={handlePrint}
            className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50/50 dark:bg-slate-800/40 text-left flex items-center justify-between transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 flex items-center justify-center font-bold">
                PDF
              </div>
              <div>
                <div className="font-bold text-sm text-slate-800 dark:text-slate-200">Print / Save as PDF</div>
                <div className="text-xs text-slate-500">Formatted enterprise report printout</div>
              </div>
            </div>
            <Printer className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
