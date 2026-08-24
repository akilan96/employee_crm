import React, { useState } from 'react';
import { X, Mail, Phone, MapPin, Edit3, Linkedin, ExternalLink, Copy, Check } from 'lucide-react';
import { BloodBadge, DepartmentBadge, StatusBadge } from './Badges';
import EmployeeAvatar from './EmployeeAvatar';
import { calculateNeekanExperience } from '../utils/dateUtils';

export default function EmployeeDetailModal({
  employee,
  onClose,
  onEdit,
  onDelete,
  canDelete = false
}) {
  const [copiedField, setCopiedField] = useState(null); // 'email' | 'mobile' | 'linkedin'

  if (!employee) return null;
  const neekanTenure = calculateNeekanExperience(employee.joiningDate || (employee.neekanExp ? `${new Date().getFullYear() - employee.neekanExp}-01-01` : null));

  const handleCopy = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm modal-animate">
      <div className="bg-white dark:bg-slate-900 max-w-xl w-full rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Modal Header Banner */}
        <div className="relative bg-gradient-to-r from-indigo-700 via-blue-700 to-indigo-900 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <EmployeeAvatar
              src={employee.pic}
              name={employee.name}
              size="2xl"
              rounded="rounded-3xl"
              className="w-28 h-28 sm:w-32 sm:h-32 ring-4 ring-white/40 shadow-2xl shrink-0"
            />
            <div className="text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl font-black">{employee.name}</h2>
                <StatusBadge status={employee.status} />
              </div>
              <p className="text-indigo-100 text-sm font-medium mt-0.5">{employee.role || employee.department}</p>
              <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className={`font-mono text-xs px-2.5 py-1 rounded-lg backdrop-blur-sm font-bold ${
                  employee.id === 'Not Provided' || !employee.id
                    ? 'bg-amber-500/30 text-amber-200 border border-amber-400/40'
                    : 'bg-white/20 text-white border border-white/10'
                }`}>
                  {employee.id === 'Not Provided' || !employee.id ? 'ID: Not Provided' : employee.id}
                </span>
                <BloodBadge bloodGroup={employee.bloodGroup} size="sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body Details */}
        <div className="p-6 space-y-4 text-sm">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Department</span>
              <div className="mt-1">
                <DepartmentBadge department={employee.department} size="sm" />
              </div>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Company</span>
              <div className="font-bold text-slate-800 dark:text-slate-200 mt-1 text-xs truncate">
                {employee.companyName || "Neekan Consulting LLP"}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Overall Exp</span>
              <div className="font-black text-slate-900 dark:text-white mt-0.5 font-mono text-sm">
                {employee.overallExp ? `${employee.overallExp} Years` : (employee.experience || '—')}
              </div>
            </div>
            <div className={`p-2.5 rounded-xl border ${neekanTenure.isLessThanYear ? 'bg-amber-50 dark:bg-amber-950/70 border-amber-200 dark:border-amber-800/70' : 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-200 dark:border-indigo-800/70'}`}>
              <span className={`text-[10px] font-bold uppercase tracking-wider block ${neekanTenure.isLessThanYear ? 'text-amber-700 dark:text-amber-400' : 'text-indigo-600 dark:text-indigo-400'}`}>Neekan Exp</span>
              <div className={`font-black mt-0.5 font-mono text-sm ${neekanTenure.isLessThanYear ? 'text-amber-800 dark:text-amber-300' : 'text-indigo-700 dark:text-indigo-300'}`}>
                {neekanTenure.badge}
              </div>
              <span className="text-[10px] text-slate-400 block truncate mt-0.5">
                {neekanTenure.formatted}
              </span>
            </div>
          </div>

          <div className="space-y-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="text-xs sm:text-sm font-medium">{employee.email}</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(employee.email, 'email')}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-all active:scale-95 shrink-0"
                title="Copy email address"
              >
                {copiedField === 'email' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300 font-mono">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-xs sm:text-sm font-medium">{employee.mobile}</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(employee.mobile, 'mobile')}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-all active:scale-95 shrink-0"
                title="Copy phone number"
              >
                {copiedField === 'mobile' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* LinkedIn */}
            {employee.linkedin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                  <Linkedin className="w-4 h-4 text-[#0a66c2] shrink-0" />
                  <span className="truncate max-w-[220px] text-xs font-medium text-slate-700 dark:text-slate-300">
                    {employee.linkedin}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopy(employee.linkedin, 'linkedin')}
                    className="p-1 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
                    title="Copy LinkedIn URL"
                  >
                    {copiedField === 'linkedin' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <a
                    href={employee.linkedin.startsWith('http') ? employee.linkedin : `https://${employee.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-1 text-xs font-bold rounded-lg text-[#0a66c2] dark:text-[#388bfd] hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-transparent hover:border-blue-200 flex items-center gap-1 transition-colors"
                  >
                    <span>Open</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}

            <div className="flex items-start gap-2.5 text-slate-600 dark:text-slate-300">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-semibold text-slate-400 block">Residential Address</span>
                <span className="text-slate-700 dark:text-slate-300 text-xs">{employee.address}</span>
              </div>
            </div>
          </div>

          {/* Skills */}
          {employee.skills && employee.skills.length > 0 && (
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Expertise & Skills
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(Array.isArray(employee.skills) ? employee.skills : employee.skills.split(',')).map((skill, i) => (
                  <span key={i} className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          {canDelete ? (
            <button
              onClick={() => {
                onClose();
                onDelete(employee);
              }}
              className="text-rose-600 hover:text-rose-700 text-xs font-bold px-3 py-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40"
            >
              Delete Profile
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(employee);
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Employee</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
