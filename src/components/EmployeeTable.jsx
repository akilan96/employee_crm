import React from 'react';
import { BloodBadge, DepartmentBadge, StatusBadge } from './Badges';
import { Mail, Phone, Eye, Edit3, Trash2, Linkedin } from 'lucide-react';
import EmployeeAvatar from './EmployeeAvatar';
import { calculateNeekanExperience } from '../utils/dateUtils';

export default function EmployeeTable({
  employees,
  onView,
  onEdit,
  onDelete,
  canDelete = false
}) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100/75 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-4">Employee</th>
              <th className="py-3.5 px-4">Department / Role</th>
              <th className="py-3.5 px-4 text-center">Overall Exp</th>
              <th className="py-3.5 px-4 text-center">Neekan Exp</th>
              <th className="py-3.5 px-4">Company</th>
              <th className="py-3.5 px-4">Contact Details</th>
              <th className="py-3.5 px-4 text-center">Blood Group</th>
              <th className="py-3.5 px-4">Location</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {employees.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center py-10 text-slate-500 dark:text-slate-400">
                  No employees match your filter.
                </td>
              </tr>
            ) : (
              employees.map(emp => (
                <tr
                  key={emp.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group"
                >
                  {/* Pic & Name */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3.5">
                      <EmployeeAvatar
                        src={emp.pic}
                        name={emp.name}
                        size="lg"
                        rounded="rounded-2xl"
                        className="w-14 h-14 ring-2 ring-slate-200 dark:ring-slate-700 shadow-sm shrink-0"
                      />
                      <div>
                        <div
                          onClick={() => onView(emp)}
                          className="font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer text-sm"
                        >
                          {emp.name}
                        </div>
                        <span className={`font-mono text-[11px] ${
                          emp.id === 'Not Provided' || !emp.id
                            ? 'px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800 font-semibold text-[10px]'
                            : 'text-slate-400'
                        }`}>
                          {emp.id === 'Not Provided' || !emp.id ? 'Not Provided' : emp.id}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Department */}
                  <td className="py-3.5 px-4">
                    <DepartmentBadge department={emp.department} size="sm" />
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
                      {emp.role}
                    </div>
                  </td>

                  {/* Overall Exp */}
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono font-bold text-slate-800 dark:text-slate-200 text-xs">
                      {emp.overallExp ? `${emp.overallExp} Yrs` : (emp.experience || '—')}
                    </span>
                  </td>

                  {/* Neekan Exp */}
                  <td className="py-3.5 px-4 text-center">
                    {(() => {
                      const tenure = calculateNeekanExperience(emp.joiningDate || (emp.neekanExp ? `${new Date().getFullYear() - emp.neekanExp}-01-01` : null));
                      return (
                        <span
                          title={`Joined: ${emp.joiningDate || 'N/A'} • ${tenure.formatted}`}
                          className={`px-2 py-1 rounded-lg border font-mono font-bold text-xs ${
                            tenure.isLessThanYear
                              ? 'bg-amber-50 dark:bg-amber-950/70 border-amber-200/60 dark:border-amber-800/60 text-amber-700 dark:text-amber-300'
                              : 'bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300'
                          }`}
                        >
                          {tenure.badge}
                        </span>
                      );
                    })()}
                  </td>

                  {/* Company */}
                  <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                    {emp.companyName || "Neekan Consulting LLP"}
                  </td>

                  {/* Contact */}
                  <td className="py-3.5 px-4 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span className="truncate max-w-[160px]">{emp.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-slate-600 dark:text-slate-400">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{emp.mobile}</span>
                    </div>
                    {emp.linkedin && (
                      <div className="flex items-center gap-1.5">
                        <Linkedin className="w-3 h-3 text-[#0a66c2] shrink-0" />
                        <a
                          href={emp.linkedin.startsWith('http') ? emp.linkedin : `https://${emp.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="truncate max-w-[150px] text-[#0a66c2] dark:text-[#388bfd] hover:underline font-medium"
                          title="LinkedIn Profile"
                        >
                          {emp.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//i, '@')}
                        </a>
                      </div>
                    )}
                  </td>

                  {/* Blood Group */}
                  <td className="py-3.5 px-4 text-center">
                    <BloodBadge bloodGroup={emp.bloodGroup} size="sm" />
                  </td>

                  {/* Address */}
                  <td className="py-3.5 px-4 max-w-[200px]">
                    <p className="line-clamp-2 text-slate-600 dark:text-slate-400 text-[11px]">
                      {emp.address}
                    </p>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <StatusBadge status={emp.status} />
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onView(emp)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="View Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(emp)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Edit Record"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      {canDelete && (
                        <button
                          onClick={() => onDelete(emp)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50"
                          title="Delete Record (Editor Permission)"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
