import React from 'react';
import { BloodBadge, DepartmentBadge, StatusBadge } from './Badges';
import { Building2, Mail, Phone, MapPin, Eye, Edit3, Trash2, Linkedin, ExternalLink } from 'lucide-react';
import EmployeeAvatar from './EmployeeAvatar';
import { calculateNeekanExperience } from '../utils/dateUtils';

export default function EmployeeCard({
  employee,
  onView,
  onEdit,
  onDelete,
  onSelectBloodGroup,
  canDelete = false
}) {
  const neekanTenure = calculateNeekanExperience(employee.joiningDate || (employee.neekanExp ? `${new Date().getFullYear() - employee.neekanExp}-01-01` : null));

  return (
    <div className="card-hover-effect bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 shadow-sm hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700/80 p-4 flex flex-col justify-between relative group overflow-hidden">
      <div>
        {/* Big Format Employee Photo / Initials */}
        <div className="relative w-full h-56 rounded-2xl overflow-hidden mb-4 bg-slate-100 dark:bg-slate-800 shadow-inner group/photo">
          <EmployeeAvatar
            src={employee.pic}
            name={employee.name}
            size="card"
            rounded="rounded-2xl"
            onClick={() => onView(employee)}
            className="w-full h-full cursor-pointer group-hover:scale-105 transition-transform duration-300"
          />
          {/* Gradient Overlay for Crisp Text Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3">
            <StatusBadge status={employee.status} />
          </div>

          <div className="absolute top-3 right-3">
            <BloodBadge
              bloodGroup={employee.bloodGroup}
              size="sm"
              clickable
              onClick={(e) => {
                e.stopPropagation();
                onSelectBloodGroup && onSelectBloodGroup(employee.bloodGroup);
              }}
            />
          </div>

          {/* Bottom of Photo Name & ID */}
          <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none">
            <div className="flex items-center justify-between gap-1">
              <h3
                onClick={() => onView(employee)}
                className="text-base font-bold text-white hover:text-indigo-300 transition-colors pointer-events-auto cursor-pointer truncate"
              >
                {employee.name}
              </h3>
              <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded-md backdrop-blur-md shrink-0 font-bold ${
                employee.id === 'Not Provided' || !employee.id
                  ? 'bg-amber-500/25 text-amber-200 border border-amber-400/40'
                  : 'bg-black/60 border border-white/15 text-slate-200'
              }`}>
                {employee.id === 'Not Provided' || !employee.id ? 'Not Provided' : employee.id}
              </span>
            </div>
            <p className="text-xs text-slate-300 truncate font-medium mt-0.5">
              {employee.role || employee.department}
            </p>
          </div>
        </div>

        {/* Department Badge & Experience Metrics */}
        <div className="space-y-2.5 mb-3">
          <DepartmentBadge department={employee.department} size="sm" />

          {/* Experience Metrics */}
          <div className="grid grid-cols-2 gap-1.5">
            <div className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Overall Exp</span>
              <span className="text-xs font-black text-slate-900 dark:text-white font-mono">
                {employee.overallExp ? `${employee.overallExp} Yrs` : (employee.experience || '—')}
              </span>
            </div>
            <div className="px-2.5 py-1.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/50 flex items-center justify-between">
              <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Neekan Exp</span>
              <span className={`text-xs font-black font-mono ${neekanTenure.isLessThanYear ? 'text-amber-600 dark:text-amber-400' : 'text-indigo-700 dark:text-indigo-300'}`} title={`Joined: ${employee.joiningDate || 'N/A'}`}>
                {neekanTenure.badge}
              </span>
            </div>
          </div>
        </div>

        {/* Contact details */}
        <div className="space-y-2 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
          {/* Company Name */}
          <div className="flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span className="truncate font-medium">{employee.companyName || "Neekan Consulting LLP"}</span>
          </div>

          {/* Email */}
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <a
              href={`mailto:${employee.email}`}
              className="truncate hover:text-indigo-600 dark:hover:text-indigo-400"
              title={employee.email}
            >
              {employee.email}
            </a>
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <a
              href={`tel:${employee.mobile}`}
              className="truncate font-mono hover:text-emerald-600"
              title={employee.mobile}
            >
              {employee.mobile}
            </a>
          </div>

          {/* LinkedIn Profile */}
          {employee.linkedin && (
            <div className="flex items-center gap-2">
              <Linkedin className="w-3.5 h-3.5 text-[#0a66c2] shrink-0" />
              <a
                href={employee.linkedin.startsWith('http') ? employee.linkedin : `https://${employee.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate text-[#0a66c2] dark:text-[#388bfd] hover:underline font-semibold flex items-center gap-1"
                title={`Open ${employee.name}'s LinkedIn`}
              >
                <span>LinkedIn Profile</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-70" />
              </a>
            </div>
          )}

          {/* Address */}
          <div className="flex items-start gap-2">
            <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
            <span className="line-clamp-2 text-[11px] text-slate-500 dark:text-slate-400">
              {employee.address}
            </span>
          </div>
        </div>
      </div>

      {/* Card Bottom Actions */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1">
        <button
          onClick={() => onView(employee)}
          className="flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 py-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(employee)}
            title="Edit Employee"
            className="p-1.5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>

          {canDelete && (
            <button
              onClick={() => onDelete(employee)}
              title="Delete Employee (Editor Permission)"
              className="p-1.5 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
