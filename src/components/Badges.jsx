import React from 'react';
import { DEPARTMENTS } from '../data/employeesData';

export const BloodBadge = ({ bloodGroup, size = "md", clickable = false, onClick }) => {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs font-semibold rounded-md",
    md: "px-2.5 py-1 text-xs font-bold rounded-lg",
    lg: "px-3.5 py-1.5 text-sm font-extrabold rounded-xl"
  };

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 border font-mono shadow-sm transition-all ${sizeClasses[size]} ${
        clickable ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
      } bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60 dark:hover:bg-rose-900/40`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
      <span>{bloodGroup || "N/A"}</span>
    </span>
  );
};

export const DepartmentBadge = ({ department, size = "md" }) => {
  const deptConfig = DEPARTMENTS.find(d => d.key === department) || {
    badgeColor: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700",
    name: department
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs font-medium rounded-md",
    md: "px-2.5 py-1 text-xs font-semibold rounded-lg",
    lg: "px-3 py-1.5 text-sm font-semibold rounded-xl"
  };

  return (
    <span className={`inline-flex items-center gap-1.5 border ${deptConfig.badgeColor} ${sizeClasses[size]}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>
      {department}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const isInactive = status === 'Inactive' || status === 'In Active';

  if (isInactive) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full border bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
        <span>In Active</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/80">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
      <span>Active</span>
    </span>
  );
};
