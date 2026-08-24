import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import EmployeeCard from './components/EmployeeCard';
import EmployeeTable from './components/EmployeeTable';
import EmployeeFormModal from './components/EmployeeFormModal';
import EmployeeDetailModal from './components/EmployeeDetailModal';
import DeleteModal from './components/DeleteModal';
import ExportModal from './components/ExportModal';
import CloudinaryConfigModal from './components/CloudinaryConfigModal';
import PhotoUrlGenerator from './components/PhotoUrlGenerator';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import OperationsHub from './components/OperationsHub';
import ToastContainer from './components/Toast';
import EmployeeAvatar from './components/EmployeeAvatar';
import Pagination from './components/Pagination';
import LoginView from './components/LoginView';

import { INITIAL_EMPLOYEES, DEPARTMENTS, BLOOD_GROUPS } from './data/employeesData';
import { Layers, Search, X, Droplet, Activity, ArrowUpDown, Grid, Table as TableIcon, Users, UserPlus, Code, Palette, Database, Briefcase, Heart, Building2 } from 'lucide-react';

export default function App() {
  // Theme state: dark / light
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('neekan_crm_theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('neekan_crm_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Employees State with localStorage persistence
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('neekan_crm_employees');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Purge legacy sample dummy profiles so only Akilan K & user additions remain
          const filtered = parsed.filter(emp => {
            const isSample = [
              "Aarav Sharma", "Priya Sundaram", "Vikramaditya Rao",
              "Ananya Deshmukh", "Rohan Kulkarni", "Sneha Patel",
              "Karthik Subramanian", "Devika Nambiar"
            ].includes(emp.name);
            return !isSample;
          });

          if (filtered.length > 0) {
            return filtered.map(emp => ({
              ...emp,
              department: emp.department === 'UI/UX & Digital Marketing' ? 'UI/UX' : (emp.department || 'UI/UX'),
              overallExp: emp.overallExp !== undefined ? emp.overallExp : (emp.experience ? parseFloat(emp.experience) || 4.0 : 4.0),
              neekanExp: emp.neekanExp !== undefined ? emp.neekanExp : 2.5
            }));
          }
        }
      } catch (e) {
        console.error("Failed to parse saved employees", e);
      }
    }
    return INITIAL_EMPLOYEES;
  });

  useEffect(() => {
    localStorage.setItem('neekan_crm_employees', JSON.stringify(employees));
  }, [employees]);

  // Active Module: 'employees' | 'analytics' | 'operations'
  const [activeModule, setActiveModule] = useState('employees');

  // Active Section Filter: 'ALL' | 'Software Engineer' | 'UI/UX' | 'DBA' | 'Management'
  const [selectedSection, setSelectedSection] = useState('ALL');

  // Filters & Views
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('ALL');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('exp-desc');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('neekan_crm_auth');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      username: 'editor',
      role: 'editor',
      displayName: 'Editor',
      canDelete: true
    };
  });

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('neekan_crm_auth', JSON.stringify(user));
    showToast(`Welcome, ${user.displayName || user.username}!`, 'success');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('neekan_crm_auth');
    showToast('Signed out successfully', 'info');
  };

  const canDelete = currentUser?.role === 'editor';

  // Pagination State (Limit 8 per page)
  const ITEMS_PER_PAGE = 8;
  const [currentPage, setCurrentPage] = useState(1);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSection, selectedCompany, selectedBloodGroup, selectedStatus, searchQuery, sortBy]);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [viewingEmployee, setViewingEmployee] = useState(null);
  const [deletingEmployee, setDeletingEmployee] = useState(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isCloudinaryModalOpen, setIsCloudinaryModalOpen] = useState(false);

  // Toast notification state
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info', actionLabel = null, onAction = null) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type, actionLabel, onAction };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  // Audit Activity Log State
  const [activityLogs, setActivityLogs] = useState(() => {
    const saved = localStorage.getItem('neekan_crm_activity_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 1, action: "System Initialized", detail: "Loaded Neekan Consulting LLP Employee Records", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), type: "info" }
    ];
  });

  const addActivityLog = (action, detail, type = "info") => {
    const newLog = {
      id: Date.now(),
      action,
      detail,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type
    };
    setActivityLogs(prev => [newLog, ...prev.slice(0, 49)]);
  };

  useEffect(() => {
    localStorage.setItem('neekan_crm_activity_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  // Filtered & Sorted Employees (Default: Highest Experience to Lower Experience)
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      if (selectedSection !== 'ALL' && emp.department !== selectedSection) return false;
      if (selectedCompany !== 'ALL') {
        const empComp = (emp.companyName || '').toLowerCase();
        const selComp = selectedCompany.toLowerCase();
        if (selComp.includes('neekan') && !empComp.includes('neekan')) return false;
        if (selComp.includes('udu') && !empComp.includes('udu')) return false;
        if (!selComp.includes('neekan') && !selComp.includes('udu') && emp.companyName !== selectedCompany) return false;
      }
      if (selectedBloodGroup !== 'ALL' && emp.bloodGroup !== selectedBloodGroup) return false;
      if (selectedStatus !== 'ALL') {
        const isEmpActive = emp.status === 'Active';
        if (selectedStatus === 'Active' && !isEmpActive) return false;
        if (selectedStatus === 'Inactive' && isEmpActive) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = emp.name?.toLowerCase().includes(q);
        const matchesEmail = emp.email?.toLowerCase().includes(q);
        const matchesMobile = emp.mobile?.toLowerCase().includes(q);
        const matchesLinkedin = emp.linkedin?.toLowerCase().includes(q);
        const matchesCompany = emp.companyName?.toLowerCase().includes(q);
        const matchesAddress = emp.address?.toLowerCase().includes(q);
        const matchesRole = emp.role?.toLowerCase().includes(q);
        const matchesBlood = emp.bloodGroup?.toLowerCase().includes(q);
        const matchesSkills = emp.skills?.some(s => s.toLowerCase().includes(q));
        if (!matchesName && !matchesEmail && !matchesMobile && !matchesLinkedin && !matchesCompany && !matchesAddress && !matchesRole && !matchesBlood && !matchesSkills) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'exp-desc') return (Number(b.overallExp) || 0) - (Number(a.overallExp) || 0);
      if (sortBy === 'exp-asc') return (Number(a.overallExp) || 0) - (Number(b.overallExp) || 0);
      if (sortBy === 'neekan-exp-desc') return new Date(a.joiningDate || 0) - new Date(b.joiningDate || 0);
      if (sortBy === 'name-asc') return (a.name || '').localeCompare(b.name || '');
      if (sortBy === 'name-desc') return (b.name || '').localeCompare(a.name || '');
      if (sortBy === 'date-newest') return new Date(b.joiningDate || 0) - new Date(a.joiningDate || 0);
      if (sortBy === 'date-oldest') return new Date(a.joiningDate || 0) - new Date(b.joiningDate || 0);
      if (sortBy === 'dept') return (a.department || '').localeCompare(b.department || '');
    });
  }, [employees, selectedSection, selectedCompany, selectedBloodGroup, selectedStatus, searchQuery, sortBy]);

  // Paginated Employees (Limit: 6 per page)
  const totalPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE) || 1;
  const validCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);

  const paginatedEmployees = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredEmployees.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredEmployees, validCurrentPage]);

  // Section Counts
  const departmentCounts = useMemo(() => {
    const counts = {
      ALL: employees.length,
      "Software Engineer": 0,
      "UI/UX": 0,
      "DBA": 0,
      "Management": 0
    };
    employees.forEach(emp => {
      const deptKey = emp.department === 'UI/UX & Digital Marketing' ? 'UI/UX' : emp.department;
      if (counts[deptKey] !== undefined) {
        counts[deptKey] += 1;
      }
    });
    return counts;
  }, [employees]);

  // Blood group breakdown
  const bloodGroupCounts = useMemo(() => {
    const counts = {};
    BLOOD_GROUPS.forEach(bg => { counts[bg] = 0; });
    employees.forEach(emp => {
      if (counts[emp.bloodGroup] !== undefined) {
        counts[emp.bloodGroup] += 1;
      }
    });
    return counts;
  }, [employees]);

  // Handlers for CRUD
  const handleSaveNewEmployee = (newEmpData) => {
    const internalId = `uid_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    let employeeId = newEmpData.id;
    if (newEmpData.isIdNotProvided || employeeId === 'Not Provided') {
      employeeId = 'Not Provided';
    } else if (!employeeId || employeeId.trim() === '') {
      employeeId = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const newEmp = {
      ...newEmpData,
      _id: internalId,
      id: employeeId,
      isIdNotProvided: employeeId === 'Not Provided',
      joiningDate: newEmpData.joiningDate || new Date().toISOString().split('T')[0],
      companyName: newEmpData.companyName || "Neekan Consulting LLP",
      status: newEmpData.status || "Active",
      skills: Array.isArray(newEmpData.skills) ? newEmpData.skills : (newEmpData.skills ? newEmpData.skills.split(',').map(s => s.trim()) : [])
    };
    setEmployees(prev => [newEmp, ...prev]);
    setIsAddModalOpen(false);
    showToast(`Created profile for ${newEmp.name}`, 'success');
    addActivityLog("Employee Created", `Added ${newEmp.name} (${newEmp.department})`, "success");
  };

  const handleUpdateEmployee = (updatedEmpData) => {
    const processedEmp = {
      ...updatedEmpData,
      skills: Array.isArray(updatedEmpData.skills) ? updatedEmpData.skills : (updatedEmpData.skills ? updatedEmpData.skills.split(',').map(s => s.trim()) : [])
    };
    setEmployees(prev => prev.map(emp => {
      const isMatch = (emp._id && processedEmp._id && emp._id === processedEmp._id) || (emp === editingEmployee) || (emp.id !== 'Not Provided' && emp.id === processedEmp.id);
      return isMatch ? { ...emp, ...processedEmp } : emp;
    }));
    if (viewingEmployee?.id === processedEmp.id || viewingEmployee?._id === processedEmp._id) {
      setViewingEmployee(processedEmp);
    }
    setEditingEmployee(null);
    showToast(`Updated details for ${processedEmp.name}`, 'success');
    addActivityLog("Employee Updated", `Updated ${processedEmp.name}'s profile`, "info");
  };

  const handleUpdateEmployeePhoto = (employeeId, newPhotoUrl) => {
    setEmployees(prev => prev.map(emp => {
      if (emp.id === employeeId || emp._id === employeeId) {
        return { ...emp, pic: newPhotoUrl };
      }
      return emp;
    }));
    const targetEmp = employees.find(e => e.id === employeeId || e._id === employeeId);
    if (targetEmp) {
      addActivityLog("Photo Updated", `Updated ${targetEmp.name}'s photo with Cloudinary CDN URL`, "info");
    }
  };

  const handleDeleteConfirm = () => {
    if (!deletingEmployee) return;
    const deleted = deletingEmployee;
    setEmployees(prev => prev.filter(emp => emp !== deleted && (deleted._id ? emp._id !== deleted._id : emp.id !== deleted.id)));
    setDeletingEmployee(null);
    if (viewingEmployee?.id === deleted.id || viewingEmployee?._id === deleted._id) {
      setViewingEmployee(null);
    }
    showToast(
      `Deleted ${deleted.name}`,
      'warning',
      'Undo',
      () => {
        setEmployees(prev => [deleted, ...prev]);
        addActivityLog("Undo Delete", `Restored ${deleted.name}`, "info");
        showToast(`Restored ${deleted.name}`, 'info');
      }
    );
    addActivityLog("Employee Deleted", `Removed ${deleted.name} (${deleted.id})`, "danger");
  };

  const handleResetData = () => {
    if (window.confirm("Reset CRM database to Neekan Consulting LLP default demo records?")) {
      setEmployees(INITIAL_EMPLOYEES);
      showToast("Reset database to initial demo employees", "info");
      addActivityLog("Database Reset", "Restored initial demo dataset", "warning");
    }
  };

  // Helper to get employees for avatar stack in department card
  const getDepartmentMembers = (deptKey) => {
    if (deptKey === 'ALL') {
      return employees.slice(0, 4);
    }
    return employees.filter(e => e.department === deptKey || (deptKey === 'UI/UX' && e.department === 'UI/UX & Digital Marketing')).slice(0, 4);
  };

  // If not logged in, show Login Screen
  if (!currentUser) {
    return (
      <>
        <LoginView onLogin={handleLogin} theme={theme} toggleTheme={toggleTheme} />
        <ToastContainer toasts={toasts} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        totalEmployees={employees.length}
        onAddEmployee={() => setIsAddModalOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Module 1: Employee Directory */}
        {activeModule === 'employees' && (
          <div className="space-y-6">
            {/* Upgraded 5 Department Section KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* All Staff Card */}
              <button
                onClick={() => setSelectedSection('ALL')}
                className={`group p-5 rounded-3xl border text-left transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                  selectedSection === 'ALL'
                    ? 'bg-gradient-to-br from-indigo-500/10 via-white to-blue-500/10 dark:from-indigo-950/70 dark:via-slate-900 dark:to-blue-950/50 border-indigo-500 ring-2 ring-indigo-500 shadow-xl shadow-indigo-500/15'
                    : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 hover:shadow-lg hover:-translate-y-0.5'
                }`}
              >
                {/* Top Row: 3D Gradient Icon + Live Headcount Pill */}
                <div className="flex items-center justify-between w-full mb-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/25 ring-4 ring-indigo-50 dark:ring-indigo-950/60 group-hover:scale-105 transition-transform">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/60 dark:border-indigo-800/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" />
                    <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300">
                      {departmentCounts.ALL} Staff
                    </span>
                  </div>
                </div>

                {/* Middle: Department Title & Tagline */}
                <div className="space-y-1 my-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      ALL DIVISIONS
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">100%</span>
                  </div>
                  <h4 className="text-base font-black text-slate-900 dark:text-white truncate">
                    All Staff
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                    Complete Active Workforce
                  </p>
                </div>

                {/* Bottom: Mini Avatar Stack & Progress Meter */}
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    {/* Avatars */}
                    <div className="flex items-center -space-x-2">
                      {getDepartmentMembers('ALL').map((emp, i) => (
                        <EmployeeAvatar
                          key={emp.id || i}
                          src={emp.pic}
                          name={emp.name}
                          size="xs"
                          rounded="rounded-full"
                          className="w-6 h-6 border-2 border-white dark:border-slate-900 object-cover shadow-xs"
                        />
                      ))}
                      {employees.length > 4 && (
                        <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[9px] font-bold text-slate-600 dark:text-slate-300">
                          +{employees.length - 4}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">
                      {departmentCounts.ALL} Total
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full w-full" />
                  </div>
                </div>
              </button>

              {/* 4 Department Cards */}
              {DEPARTMENTS.map(dept => {
                const isSelected = selectedSection === dept.key;
                const count = departmentCounts[dept.key] || 0;
                const percent = employees.length ? Math.round((count / employees.length) * 100) : 0;
                const members = getDepartmentMembers(dept.key);

                const getIconConfig = (key) => {
                  switch(key) {
                    case 'Software Engineer':
                      return {
                        gradient: 'from-emerald-500 to-teal-600 shadow-emerald-500/25 ring-emerald-50 dark:ring-emerald-950/60',
                        barGradient: 'from-emerald-500 to-teal-500',
                        textColor: 'text-emerald-600 dark:text-emerald-400',
                        bgColor: 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-200/60 dark:border-emerald-800/60',
                        dotColor: 'bg-emerald-500',
                        tagline: 'Engineering & Cloud Core',
                        icon: <Code className="w-6 h-6" />
                      };
                    case 'UI/UX':
                      return {
                        gradient: 'from-purple-500 to-pink-600 shadow-purple-500/25 ring-purple-50 dark:ring-purple-950/60',
                        barGradient: 'from-purple-500 to-pink-500',
                        textColor: 'text-purple-600 dark:text-purple-400',
                        bgColor: 'bg-purple-50 dark:bg-purple-950/70 border-purple-200/60 dark:border-purple-800/60',
                        dotColor: 'bg-purple-500',
                        tagline: 'Design System & UX',
                        icon: <Palette className="w-6 h-6" />
                      };
                    case 'DBA':
                      return {
                        gradient: 'from-amber-500 to-orange-600 shadow-amber-500/25 ring-amber-50 dark:ring-amber-950/60',
                        barGradient: 'from-amber-500 to-orange-500',
                        textColor: 'text-amber-600 dark:text-amber-400',
                        bgColor: 'bg-amber-50 dark:bg-amber-950/70 border-amber-200/60 dark:border-amber-800/60',
                        dotColor: 'bg-amber-500',
                        tagline: 'Database & Systems',
                        icon: <Database className="w-6 h-6" />
                      };
                    default:
                      return {
                        gradient: 'from-blue-500 to-cyan-600 shadow-blue-500/25 ring-blue-50 dark:ring-blue-950/60',
                        barGradient: 'from-blue-500 to-cyan-500',
                        textColor: 'text-blue-600 dark:text-blue-400',
                        bgColor: 'bg-blue-50 dark:bg-blue-950/70 border-blue-200/60 dark:border-blue-800/60',
                        dotColor: 'bg-blue-500',
                        tagline: 'Strategy & Leadership',
                        icon: <Briefcase className="w-6 h-6" />
                      };
                  }
                };

                const cfg = getIconConfig(dept.key);

                return (
                  <button
                    key={dept.key}
                    onClick={() => setSelectedSection(dept.key)}
                    className={`group p-5 rounded-3xl border text-left transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? 'bg-gradient-to-br from-indigo-500/10 via-white to-slate-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-900 border-indigo-500 ring-2 ring-indigo-500 shadow-xl shadow-indigo-500/15'
                        : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 hover:shadow-lg hover:-translate-y-0.5'
                    }`}
                  >
                    {/* Top Row: 3D Gradient Icon + Live Headcount Pill */}
                    <div className="flex items-center justify-between w-full mb-3.5">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cfg.gradient} text-white flex items-center justify-center shadow-md ring-4 group-hover:scale-105 transition-transform`}>
                        {cfg.icon}
                      </div>
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${cfg.bgColor} border`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotColor}`} />
                        <span className={`text-[11px] font-bold ${cfg.textColor}`}>
                          {count} Staff
                        </span>
                      </div>
                    </div>

                    {/* Middle: Department Title & Tagline */}
                    <div className="space-y-1 my-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-extrabold uppercase tracking-wider ${cfg.textColor}`}>
                          {dept.shortName}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400">{percent}%</span>
                      </div>
                      <h4 className="text-base font-black text-slate-900 dark:text-white truncate">
                        {dept.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                        {cfg.tagline}
                      </p>
                    </div>

                    {/* Bottom: Mini Avatar Stack & Progress Meter */}
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        {/* Avatars */}
                        <div className="flex items-center -space-x-2 min-h-[24px]">
                          {members.length > 0 ? (
                            members.map((emp, i) => (
                              <EmployeeAvatar
                                key={emp.id || i}
                                src={emp.pic}
                                name={emp.name}
                                size="xs"
                                rounded="rounded-full"
                                className="w-6 h-6 border-2 border-white dark:border-slate-900 object-cover shadow-xs"
                              />
                            ))
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">No staff</span>
                          )}
                        </div>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">
                          {percent}% Share
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${cfg.barGradient} rounded-full transition-all duration-500`}
                          style={{ width: `${Math.max(percent, 5)}%` }}
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              {/* Search Box */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, email, mobile, blood group, address, or skills..."
                  className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Filters & Actions */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Blood Group Filter */}
                <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <Droplet className="w-3.5 h-3.5 text-rose-500" />
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Blood:</span>
                  <select
                    value={selectedBloodGroup}
                    onChange={(e) => setSelectedBloodGroup(e.target.value)}
                    className="bg-transparent text-xs font-semibold text-slate-800 dark:text-slate-200 dark:bg-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value="ALL" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">All Groups</option>
                    {BLOOD_GROUPS.map(bg => (
                      <option key={bg} value={bg} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">{bg}</option>
                    ))}
                  </select>
                </div>

                {/* Company Filter (Neekan / UDU Labs) */}
                <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Company:</span>
                  <select
                    value={selectedCompany}
                    onChange={(e) => setSelectedCompany(e.target.value)}
                    className="bg-transparent text-xs font-semibold text-slate-800 dark:text-slate-200 dark:bg-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value="ALL" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">All Companies</option>
                    <option value="Neekan Consulting LLP" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Neekan Consulting LLP</option>
                    <option value="UDU Labs" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">UDU Labs</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <Activity className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Status:</span>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="bg-transparent text-xs font-semibold text-slate-800 dark:text-slate-200 dark:bg-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value="ALL" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">All Status</option>
                    <option value="Active" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Active</option>
                    <option value="Inactive" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">In Active</option>
                  </select>
                </div>

                {/* Sort Filter */}
                <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-xs font-semibold text-slate-800 dark:text-slate-200 dark:bg-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value="exp-desc" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Overall Exp (High to Low)</option>
                    <option value="neekan-exp-desc" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Neekan Exp (High to Low)</option>
                    <option value="exp-asc" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Overall Exp (Low to High)</option>
                    <option value="name-asc" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Name (A - Z)</option>
                    <option value="name-desc" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Name (Z - A)</option>
                    <option value="date-newest" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Joining (Newest)</option>
                    <option value="date-oldest" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Joining (Oldest)</option>
                    <option value="dept" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Department</option>
                  </select>
                </div>

                {/* Grid / Table Switcher */}
                <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => setViewMode('grid')}
                    title="Grid Card View"
                    className={`p-1.5 rounded-lg transition-all ${
                      viewMode === 'grid'
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    title="Table Data View"
                    className={`p-1.5 rounded-lg transition-all ${
                      viewMode === 'table'
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                    }`}
                  >
                    <TableIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results count info */}
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
              <div>
                Showing <strong className="text-slate-800 dark:text-slate-200 font-semibold">{filteredEmployees.length}</strong> of {employees.length} employees
                {selectedSection !== 'ALL' && <span> in <span className="text-indigo-600 dark:text-indigo-400 font-medium">{selectedSection}</span></span>}
                {selectedCompany !== 'ALL' && <span> at <span className="text-indigo-600 dark:text-indigo-400 font-bold">{selectedCompany}</span></span>}
                {selectedBloodGroup !== 'ALL' && <span> with blood group <span className="text-rose-600 dark:text-rose-400 font-bold">{selectedBloodGroup}</span></span>}
              </div>
              {(selectedSection !== 'ALL' || selectedCompany !== 'ALL' || selectedBloodGroup !== 'ALL' || selectedStatus !== 'ALL' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedSection('ALL');
                    setSelectedCompany('ALL');
                    setSelectedBloodGroup('ALL');
                    setSelectedStatus('ALL');
                    setSearchQuery('');
                  }}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* Cards Grid */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredEmployees.length === 0 ? (
                  <div className="col-span-full py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-8">
                    <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Employees Found</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 mb-6">
                      We couldn't find any employees matching your current search and filter criteria.
                    </p>
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Add New Employee</span>
                    </button>
                  </div>
                ) : (
                  paginatedEmployees.map(emp => (
                    <EmployeeCard
                      key={emp._id || emp.id}
                      employee={emp}
                      onView={setViewingEmployee}
                      onEdit={setEditingEmployee}
                      onDelete={setDeletingEmployee}
                      onSelectBloodGroup={setSelectedBloodGroup}
                      canDelete={canDelete}
                    />
                  ))
                )}
              </div>
            )}

            {/* Table View */}
            {viewMode === 'table' && (
              <EmployeeTable
                employees={paginatedEmployees}
                onView={setViewingEmployee}
                onEdit={setEditingEmployee}
                onDelete={setDeletingEmployee}
                canDelete={canDelete}
              />
            )}

            {/* Pagination Controls */}
            {filteredEmployees.length > 0 && (
              <Pagination
                currentPage={validCurrentPage}
                totalPages={totalPages}
                totalItems={filteredEmployees.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        )}

        {/* Module: Photo URL Generator */}
        {activeModule === 'photo-generator' && (
          <PhotoUrlGenerator
            employees={employees}
            onUpdateEmployeePhoto={handleUpdateEmployeePhoto}
            onOpenCloudinaryConfig={() => setIsCloudinaryModalOpen(true)}
            onShowToast={(msg, type) => showToast(msg, type)}
          />
        )}

        {/* Module 2: Analytics */}
        {activeModule === 'analytics' && (
          <AnalyticsDashboard
            employees={employees}
            departmentCounts={departmentCounts}
            bloodGroupCounts={bloodGroupCounts}
            onNavigateToSection={(deptKey) => {
              setSelectedSection(deptKey);
              setActiveModule('employees');
            }}
            onNavigateToBloodGroup={(bg) => {
              setSelectedBloodGroup(bg);
              setActiveModule('employees');
            }}
          />
        )}

        {/* Module 3: Emergency & Operations */}
        {activeModule === 'operations' && (
          <OperationsHub
            employees={employees}
            activityLogs={activityLogs}
            onOpenExport={() => setIsExportModalOpen(true)}
            onResetData={handleResetData}
            canDelete={canDelete}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-5 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            {/* Left: Dual Brand Units */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              {/* Neekan Consulting LLP */}
              <div className="flex items-center gap-2.5">
                <div className="bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-center shrink-0">
                  <img
                    src="/neekan-logo.png"
                    alt="Neekan Consulting LLP"
                    className="h-5 w-auto object-contain"
                  />
                </div>
                <div className="text-left">
                  <span className="font-bold text-slate-900 dark:text-white text-xs block leading-tight">
                    Neekan Consulting LLP
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Enterprise Consulting & IT
                  </span>
                </div>
              </div>

              {/* Vertical Divider */}
              <div className="hidden sm:block h-6 w-px bg-slate-200 dark:bg-slate-800" />

              {/* UDU Labs */}
              <div className="flex items-center gap-2.5">
                <div className="bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-center shrink-0">
                  <img
                    src="/udu_labs.png"
                    alt="UDU Labs"
                    className="h-5 w-auto object-contain"
                  />
                </div>
                <div className="text-left">
                  <span className="font-bold text-slate-900 dark:text-white text-xs block leading-tight">
                    UDU Labs
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Innovation & Tech Studio
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Crafted with heart by AKILAN */}
            <div className="md:text-right flex items-center justify-center md:justify-end gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
              <span>Crafted with</span>
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse shrink-0" />
              <span>by</span>
              <span className="font-extrabold text-slate-900 dark:text-white tracking-wider">
                AKILAN
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {isAddModalOpen && (
        <EmployeeFormModal
          title="Add New Employee"
          subtitle="Create a new employee profile with full contact, department & medical details"
          initialData={{
            department: selectedSection !== 'ALL' ? selectedSection : 'Software Engineer',
            companyName: 'Neekan Consulting LLP',
            bloodGroup: 'O+',
            status: 'Active'
          }}
          onSave={handleSaveNewEmployee}
          onClose={() => setIsAddModalOpen(false)}
          onOpenCloudinaryConfig={() => setIsCloudinaryModalOpen(true)}
        />
      )}

      {editingEmployee && (
        <EmployeeFormModal
          title="Edit Employee Profile"
          subtitle={`Update profile information for ${editingEmployee.name}`}
          initialData={editingEmployee}
          onSave={handleUpdateEmployee}
          onClose={() => setEditingEmployee(null)}
          onOpenCloudinaryConfig={() => setIsCloudinaryModalOpen(true)}
        />
      )}

      <EmployeeDetailModal
        employee={viewingEmployee}
        onClose={() => setViewingEmployee(null)}
        onEdit={(emp) => setEditingEmployee(emp)}
        onDelete={(emp) => setDeletingEmployee(emp)}
        canDelete={canDelete}
      />

      <DeleteModal
        employee={deletingEmployee}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingEmployee(null)}
      />

      {isExportModalOpen && (
        <ExportModal
          employees={employees}
          onClose={() => setIsExportModalOpen(false)}
          onExportSuccess={(msg) => showToast(msg, 'success')}
        />
      )}

      {/* Cloudinary Configuration Modal */}
      <CloudinaryConfigModal
        isOpen={isCloudinaryModalOpen}
        onClose={() => setIsCloudinaryModalOpen(false)}
        onConfigSaved={(msg) => showToast(msg, 'success')}
      />

      {/* Toasts */}
      <ToastContainer toasts={toasts} />
    </div>
  );
}
