const { useState, useEffect, useMemo, useRef } = React;

// Lucide Icon Component Helper
const Icon = ({ name, className = "w-5 h-5", size, strokeWidth = 2 }) => {
  const iconRef = useRef(null);

  useEffect(() => {
    if (window.lucide && iconRef.current) {
      // Create icon element using Lucide
      iconRef.current.innerHTML = `<i data-lucide="${name}"></i>`;
      window.lucide.createIcons({
        attrs: {
          class: className,
          ...(size ? { width: size, height: size } : {}),
          'stroke-width': strokeWidth
        },
        nameAttr: 'data-lucide'
      });
    }
  }, [name, className, size, strokeWidth]);

  return <span ref={iconRef} className="inline-flex items-center justify-center flex-shrink-0" />;
};

// Blood Group Badge Component
const BloodBadge = ({ bloodGroup, size = "md", clickable = false, onClick }) => {
  const isRhPositive = bloodGroup?.includes('+');
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

// Department Badge Component
const DepartmentBadge = ({ department, size = "md" }) => {
  const deptConfig = window.DEPARTMENTS.find(d => d.key === department) || {
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

// Status Badge Component
const StatusBadge = ({ status }) => {
  const styles = {
    Active: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800",
    Remote: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800",
    "On Leave": "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800"
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${styles[status] || styles.Active}`}>
      {status || 'Active'}
    </span>
  );
};

// Main CRM App Component
function App() {
  // Theme state: dark / light
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('neekan_crm_theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Apply dark mode class to html document
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
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved employees", e);
      }
    }
    return window.INITIAL_EMPLOYEES;
  });

  useEffect(() => {
    localStorage.setItem('neekan_crm_employees', JSON.stringify(employees));
  }, [employees]);

  // Active Module: 'employees' | 'analytics' | 'operations'
  const [activeModule, setActiveModule] = useState('employees');

  // Active Section Filter in Employee Module: 'ALL' | 'Software Engineer' | 'UI/UX' | 'DBA' | 'Management'
  const [selectedSection, setSelectedSection] = useState('ALL');

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('name-asc');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [viewingEmployee, setViewingEmployee] = useState(null);
  const [deletingEmployee, setDeletingEmployee] = useState(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [lastDeletedEmployee, setLastDeletedEmployee] = useState(null);

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

  // Filtered & Sorted Employees
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      // Section filter
      if (selectedSection !== 'ALL' && emp.department !== selectedSection) {
        return false;
      }
      // Blood group filter
      if (selectedBloodGroup !== 'ALL' && emp.bloodGroup !== selectedBloodGroup) {
        return false;
      }
      // Status filter
      if (selectedStatus !== 'ALL' && emp.status !== selectedStatus) {
        return false;
      }
      // Search query across name, email, mobile, address, company, skills, blood group
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = emp.name?.toLowerCase().includes(q);
        const matchesEmail = emp.email?.toLowerCase().includes(q);
        const matchesMobile = emp.mobile?.toLowerCase().includes(q);
        const matchesCompany = emp.companyName?.toLowerCase().includes(q);
        const matchesAddress = emp.address?.toLowerCase().includes(q);
        const matchesRole = emp.role?.toLowerCase().includes(q);
        const matchesBlood = emp.bloodGroup?.toLowerCase().includes(q);
        const matchesSkills = emp.skills?.some(s => s.toLowerCase().includes(q));
        if (!matchesName && !matchesEmail && !matchesMobile && !matchesCompany && !matchesAddress && !matchesRole && !matchesBlood && !matchesSkills) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'name-asc') return (a.name || '').localeCompare(b.name || '');
      if (sortBy === 'name-desc') return (b.name || '').localeCompare(a.name || '');
      if (sortBy === 'date-newest') return new Date(b.joiningDate || 0) - new Date(a.joiningDate || 0);
      if (sortBy === 'date-oldest') return new Date(a.joiningDate || 0) - new Date(b.joiningDate || 0);
      if (sortBy === 'dept') return (a.department || '').localeCompare(b.department || '');
      return 0;
    });
  }, [employees, selectedSection, selectedBloodGroup, selectedStatus, searchQuery, sortBy]);

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
      if (counts[emp.department] !== undefined) {
        counts[emp.department] += 1;
      }
    });
    return counts;
  }, [employees]);

  // Blood group breakdown
  const bloodGroupCounts = useMemo(() => {
    const counts = {};
    window.BLOOD_GROUPS.forEach(bg => { counts[bg] = 0; });
    employees.forEach(emp => {
      if (counts[emp.bloodGroup] !== undefined) {
        counts[emp.bloodGroup] += 1;
      }
    });
    return counts;
  }, [employees]);

  // Handle Create Employee
  const handleSaveNewEmployee = (newEmpData) => {
    const newEmp = {
      ...newEmpData,
      id: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
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

  // Handle Update Employee
  const handleUpdateEmployee = (updatedEmpData) => {
    const processedEmp = {
      ...updatedEmpData,
      skills: Array.isArray(updatedEmpData.skills) ? updatedEmpData.skills : (updatedEmpData.skills ? updatedEmpData.skills.split(',').map(s => s.trim()) : [])
    };
    setEmployees(prev => prev.map(emp => emp.id === processedEmp.id ? processedEmp : emp));
    if (viewingEmployee?.id === processedEmp.id) {
      setViewingEmployee(processedEmp);
    }
    setEditingEmployee(null);
    showToast(`Updated details for ${processedEmp.name}`, 'success');
    addActivityLog("Employee Updated", `Updated ${processedEmp.name}'s profile`, "info");
  };

  // Handle Delete Employee
  const handleDeleteConfirm = () => {
    if (!deletingEmployee) return;
    const deleted = deletingEmployee;
    setEmployees(prev => prev.filter(emp => emp.id !== deleted.id));
    setLastDeletedEmployee(deleted);
    setDeletingEmployee(null);
    if (viewingEmployee?.id === deleted.id) {
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

  // Quick reset to sample data
  const handleResetData = () => {
    if (confirm("Reset CRM database to Neekan Consulting LLP default demo records?")) {
      setEmployees(window.INITIAL_EMPLOYEES);
      showToast("Reset database to initial demo employees", "info");
      addActivityLog("Database Reset", "Restored initial demo dataset", "warning");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Enterprise Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo & Company Name */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 ring-2 ring-white dark:ring-slate-800">
                <span className="font-extrabold text-xl tracking-wider">N</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 dark:from-white dark:via-slate-100 dark:to-indigo-200 bg-clip-text text-transparent">
                    Neekan Consulting LLP
                  </h1>
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                    CRM Suite
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Enterprise Talent & Resource Management
                </p>
              </div>
            </div>

            {/* Modules Navigation Bar (Center/Right) */}
            <div className="hidden md:flex items-center p-1.5 bg-slate-100/90 dark:bg-slate-800/90 rounded-2xl border border-slate-200/70 dark:border-slate-700/60">
              <button
                onClick={() => setActiveModule('employees')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
                  activeModule === 'employees'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon name="users" className="w-4 h-4" />
                <span>Employee Directory</span>
                <span className={`px-1.5 py-0.2 text-xs rounded-full ${activeModule === 'employees' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-200' : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}>
                  {employees.length}
                </span>
              </button>

              <button
                onClick={() => setActiveModule('analytics')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
                  activeModule === 'analytics'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon name="bar-chart-3" className="w-4 h-4" />
                <span>Department Analytics</span>
              </button>

              <button
                onClick={() => setActiveModule('operations')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
                  activeModule === 'operations'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon name="shield-alert" className="w-4 h-4 text-rose-500" />
                <span>Emergency & Operations</span>
              </button>
            </div>

            {/* Right Action Controls */}
            <div className="flex items-center gap-2.5">
              {/* Add Employee CTA */}
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-md shadow-indigo-500/25 active:scale-95 transition-all"
              >
                <Icon name="user-plus" className="w-4 h-4" />
                <span className="hidden sm:inline">Add Employee</span>
                <span className="sm:hidden">Add</span>
              </button>

              {/* Theme Switcher Toggle */}
              <button
                onClick={toggleTheme}
                title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                aria-label="Toggle dark mode"
              >
                {theme === 'dark' ? (
                  <Icon name="sun" className="w-5 h-5 text-amber-400" />
                ) : (
                  <Icon name="moon" className="w-5 h-5 text-indigo-600" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Module Navigation Tab Bar */}
          <div className="md:hidden flex items-center justify-between border-t border-slate-200/80 dark:border-slate-800 py-2.5 overflow-x-auto gap-2">
            <button
              onClick={() => setActiveModule('employees')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg ${
                activeModule === 'employees'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Icon name="users" className="w-3.5 h-3.5" />
              <span>Employees ({employees.length})</span>
            </button>
            <button
              onClick={() => setActiveModule('analytics')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg ${
                activeModule === 'analytics'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Icon name="bar-chart-3" className="w-3.5 h-3.5" />
              <span>Analytics</span>
            </button>
            <button
              onClick={() => setActiveModule('operations')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg ${
                activeModule === 'operations'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Icon name="shield-alert" className="w-3.5 h-3.5 text-rose-500" />
              <span>Operations</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ======================================================== */}
        {/* MODULE 1: EMPLOYEE DIRECTORY & MANAGEMENT                */}
        {/* ======================================================== */}
        {activeModule === 'employees' && (
          <div className="space-y-6">
            {/* 4 Section / Department Filter Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <button
                onClick={() => setSelectedSection('ALL')}
                className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                  selectedSection === 'ALL'
                    ? 'bg-gradient-to-br from-indigo-600 to-blue-700 text-white border-transparent shadow-md shadow-indigo-500/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-semibold opacity-80 uppercase tracking-wider">All Staff</span>
                  <Icon name="layers" className="w-4 h-4" />
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl font-black">{departmentCounts.ALL}</span>
                  <span className="text-xs font-medium opacity-80">Total</span>
                </div>
              </button>

              {window.DEPARTMENTS.map(dept => {
                const isSelected = selectedSection === dept.key;
                const count = departmentCounts[dept.key] || 0;
                return (
                  <button
                    key={dept.key}
                    onClick={() => setSelectedSection(dept.key)}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? `${dept.bgLight} ring-2 ring-indigo-500 dark:ring-indigo-400 shadow-md`
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-semibold truncate">{dept.name}</span>
                      <Icon name={dept.icon} className="w-4 h-4 opacity-75" />
                    </div>
                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="text-2xl font-black">{count}</span>
                      <span className="text-xs font-medium opacity-70">
                        {employees.length ? `${Math.round((count / employees.length) * 100)}%` : '0%'}
                      </span>
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
                  <Icon name="search" className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, email, mobile, blood group, address, or skills..."
                  className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <Icon name="x" className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Filters & Actions */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Blood Group Filter */}
                <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <Icon name="droplet" className="w-3.5 h-3.5 text-rose-500" />
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Blood:</span>
                  <select
                    value={selectedBloodGroup}
                    onChange={(e) => setSelectedBloodGroup(e.target.value)}
                    className="bg-transparent text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
                  >
                    <option value="ALL">All Groups</option>
                    {window.BLOOD_GROUPS.map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <Icon name="activity" className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Status:</span>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="bg-transparent text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
                  >
                    <option value="ALL">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Remote">Remote</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>

                {/* Sort Filter */}
                <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <Icon name="arrow-up-down" className="w-3.5 h-3.5 text-slate-500" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
                  >
                    <option value="name-asc">Name (A - Z)</option>
                    <option value="name-desc">Name (Z - A)</option>
                    <option value="date-newest">Joining (Newest)</option>
                    <option value="date-oldest">Joining (Oldest)</option>
                    <option value="dept">Department</option>
                  </select>
                </div>

                {/* Grid / Table View Switcher */}
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
                    <Icon name="grid" className="w-4 h-4" />
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
                    <Icon name="table" className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results Count and Active Filter Indicators */}
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
              <div>
                Showing <strong className="text-slate-800 dark:text-slate-200 font-semibold">{filteredEmployees.length}</strong> of {employees.length} employees
                {selectedSection !== 'ALL' && <span> in <span className="text-indigo-600 dark:text-indigo-400 font-medium">{selectedSection}</span></span>}
                {selectedBloodGroup !== 'ALL' && <span> with blood group <span className="text-rose-600 dark:text-rose-400 font-bold">{selectedBloodGroup}</span></span>}
              </div>
              {(selectedSection !== 'ALL' || selectedBloodGroup !== 'ALL' || selectedStatus !== 'ALL' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedSection('ALL');
                    setSelectedBloodGroup('ALL');
                    setSelectedStatus('ALL');
                    setSearchQuery('');
                  }}
                  className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold underline"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* Employee Cards Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredEmployees.length === 0 ? (
                  <div className="col-span-full py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-8">
                    <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 flex items-center justify-center mx-auto mb-4">
                      <Icon name="users" className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Employees Found</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 mb-6">
                      We couldn't find any employees matching your current search and filter criteria.
                    </p>
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md"
                    >
                      <Icon name="user-plus" className="w-4 h-4" />
                      Add New Employee
                    </button>
                  </div>
                ) : (
                  filteredEmployees.map(emp => (
                    <div
                      key={emp.id}
                      className="card-hover-effect bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 shadow-sm hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-800/80 p-5 flex flex-col justify-between relative group"
                    >
                      {/* Top Header with Avatar, Blood Group & Actions */}
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="relative">
                            <img
                              src={emp.pic || window.SAMPLE_AVATARS[0]}
                              alt={emp.name}
                              onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80";
                              }}
                              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800 shadow-md group-hover:scale-105 transition-transform"
                            />
                            <span className="absolute -bottom-1 -right-1">
                              <StatusBadge status={emp.status} />
                            </span>
                          </div>

                          <div className="flex flex-col items-end gap-1.5">
                            <BloodBadge
                              bloodGroup={emp.bloodGroup}
                              size="sm"
                              clickable
                              onClick={() => setSelectedBloodGroup(emp.bloodGroup)}
                            />
                            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                              {emp.id}
                            </span>
                          </div>
                        </div>

                        {/* Name & Title */}
                        <div className="mb-3">
                          <h3
                            onClick={() => setViewingEmployee(emp)}
                            className="text-base font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer line-clamp-1 transition-colors"
                          >
                            {emp.name}
                          </h3>
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 line-clamp-1">
                            {emp.role || emp.department}
                          </p>
                          <div className="mt-1.5">
                            <DepartmentBadge department={emp.department} size="sm" />
                          </div>
                        </div>

                        {/* Contact details */}
                        <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-300">
                          {/* Company Name */}
                          <div className="flex items-center gap-2">
                            <Icon name="building-2" className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                            <span className="truncate font-medium">{emp.companyName || "Neekan Consulting LLP"}</span>
                          </div>

                          {/* Email */}
                          <div className="flex items-center gap-2">
                            <Icon name="mail" className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            <a
                              href={`mailto:${emp.email}`}
                              className="truncate hover:text-indigo-600 dark:hover:text-indigo-400"
                              title={emp.email}
                            >
                              {emp.email}
                            </a>
                          </div>

                          {/* Mobile */}
                          <div className="flex items-center gap-2">
                            <Icon name="phone" className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <a
                              href={`tel:${emp.mobile}`}
                              className="truncate font-mono hover:text-emerald-600"
                              title={emp.mobile}
                            >
                              {emp.mobile}
                            </a>
                          </div>

                          {/* Address */}
                          <div className="flex items-start gap-2">
                            <Icon name="map-pin" className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                            <span className="line-clamp-2 text-[11px] text-slate-500 dark:text-slate-400">
                              {emp.address}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Card Bottom Actions */}
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1">
                        <button
                          onClick={() => setViewingEmployee(emp)}
                          className="flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 py-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Icon name="eye" className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditingEmployee(emp)}
                            title="Edit Employee"
                            className="p-1.5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-colors"
                          >
                            <Icon name="edit-3" className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setDeletingEmployee(emp)}
                            title="Delete Employee"
                            className="p-1.5 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors"
                          >
                            <Icon name="trash-2" className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Employee Enterprise Table View */}
            {viewMode === 'table' && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100/75 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold uppercase tracking-wider text-[11px]">
                        <th className="py-3.5 px-4">Employee</th>
                        <th className="py-3.5 px-4">Department / Role</th>
                        <th className="py-3.5 px-4">Company</th>
                        <th className="py-3.5 px-4">Contact Details</th>
                        <th className="py-3.5 px-4 text-center">Blood Group</th>
                        <th className="py-3.5 px-4">Address</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredEmployees.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="text-center py-10 text-slate-500 dark:text-slate-400">
                            No employees match your filter.
                          </td>
                        </tr>
                      ) : (
                        filteredEmployees.map(emp => (
                          <tr
                            key={emp.id}
                            className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group"
                          >
                            {/* Pic & Name */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={emp.pic || window.SAMPLE_AVATARS[0]}
                                  alt={emp.name}
                                  className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                                />
                                <div>
                                  <div
                                    onClick={() => setViewingEmployee(emp)}
                                    className="font-bold text-slate-900 dark:text-white hover:text-indigo-600 cursor-pointer"
                                  >
                                    {emp.name}
                                  </div>
                                  <span className="font-mono text-[10px] text-slate-400">{emp.id}</span>
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

                            {/* Company */}
                            <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                              {emp.companyName || "Neekan Consulting LLP"}
                            </td>

                            {/* Contact */}
                            <td className="py-3.5 px-4 space-y-0.5">
                              <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                                <Icon name="mail" className="w-3 h-3 text-slate-400" />
                                <span className="truncate max-w-[160px]">{emp.email}</span>
                              </div>
                              <div className="flex items-center gap-1.5 font-mono text-slate-600 dark:text-slate-400">
                                <Icon name="phone" className="w-3 h-3 text-slate-400" />
                                <span>{emp.mobile}</span>
                              </div>
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
                                  onClick={() => setViewingEmployee(emp)}
                                  className="p-1.5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                                  title="View Profile"
                                >
                                  <Icon name="eye" className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setEditingEmployee(emp)}
                                  className="p-1.5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                                  title="Edit Record"
                                >
                                  <Icon name="edit-3" className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setDeletingEmployee(emp)}
                                  className="p-1.5 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50"
                                  title="Delete Record"
                                >
                                  <Icon name="trash-2" className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* MODULE 2: DEPARTMENT INSIGHTS & ANALYTICS DASHBOARD       */}
        {/* ======================================================== */}
        {activeModule === 'analytics' && (
          <div className="space-y-6">
            {/* Top KPI Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Icon name="users" className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">{employees.length}</div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Headcount</div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Icon name="check-circle-2" className="w-6 h-6" />
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
                  <Icon name="laptop" className="w-6 h-6" />
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
                  <Icon name="heart-pulse" className="w-6 h-6" />
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
                  onClick={() => { setActiveModule('employees'); setSelectedSection('ALL'); }}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <span>View All in Directory</span>
                  <Icon name="arrow-right" className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {window.DEPARTMENTS.map(dept => {
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
                            onClick={() => {
                              setSelectedSection(dept.key);
                              setActiveModule('employees');
                            }}
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
                    <Icon name="droplets" className="w-5 h-5 text-rose-500" />
                    Blood Group Emergency Donor Registry
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Click any blood group to instantly inspect donors</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {window.BLOOD_GROUPS.map(bg => {
                  const count = bloodGroupCounts[bg] || 0;
                  return (
                    <button
                      key={bg}
                      onClick={() => {
                        setSelectedBloodGroup(bg);
                        setActiveModule('employees');
                      }}
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
        )}

        {/* ======================================================== */}
        {/* MODULE 3: EMERGENCY OPERATIONS & EXPORT HUB               */}
        {/* ======================================================== */}
        {activeModule === 'operations' && (
          <div className="space-y-6">
            {/* Quick Action Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 mb-3">
                  <Icon name="heart-pulse" className="w-3.5 h-3.5" />
                  Medical Readiness & Emergency Support
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Neekan Emergency Response Directory</h2>
                <p className="text-sm text-slate-300 max-w-2xl mt-1">
                  Instantly locate emergency contacts, verified blood donors, and export complete organizational rosters.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setIsExportModalOpen(true)}
                  className="px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-sm font-bold shadow-md flex items-center gap-2"
                >
                  <Icon name="download" className="w-4 h-4 text-indigo-600" />
                  Export Rosters
                </button>
                <button
                  onClick={handleResetData}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-semibold border border-slate-700"
                >
                  Reset Sample Data
                </button>
              </div>
            </div>

            {/* Emergency Blood Donor Quick Call Directory */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Icon name="phone-call" className="w-5 h-5 text-rose-500" />
                  Instant Emergency Contact Grid
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
                        src={emp.pic || window.SAMPLE_AVATARS[0]}
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
                      <Icon name="phone" className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit & Activity Log */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Icon name="history" className="w-5 h-5 text-indigo-500" />
                  CRM Activity & Audit Trail
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
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">Neekan Consulting LLP</span>
            <span>• Employee CRM System v2.4</span>
          </div>
          <div>
            Built with React & Tailwind CSS • 4 Department Specializations (Software Engineer, UI/UX, DBA, Management)
          </div>
        </div>
      </footer>

      {/* ======================================================== */}
      {/* MODAL: ADD NEW EMPLOYEE                                   */}
      {/* ======================================================== */}
      {isAddModalOpen && (
        <EmployeeFormModal
          title="Add New Employee"
          subtitle="Create a new employee profile with full contact, department & medical details"
          initialData={{
            name: '',
            email: '',
            companyName: 'Neekan Consulting LLP',
            mobile: '',
            bloodGroup: 'O+',
            address: '',
            department: selectedSection !== 'ALL' ? selectedSection : 'Software Engineer',
            role: '',
            pic: window.SAMPLE_AVATARS[0],
            status: 'Active',
            skills: ''
          }}
          onSave={handleSaveNewEmployee}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

      {/* ======================================================== */}
      {/* MODAL: EDIT EMPLOYEE                                      */}
      {/* ======================================================== */}
      {editingEmployee && (
        <EmployeeFormModal
          title="Edit Employee Profile"
          subtitle={`Update profile information for ${editingEmployee.name}`}
          initialData={editingEmployee}
          onSave={handleUpdateEmployee}
          onClose={() => setEditingEmployee(null)}
        />
      )}

      {/* ======================================================== */}
      {/* MODAL: VIEW EMPLOYEE DETAIL                               */}
      {/* ======================================================== */}
      {viewingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm modal-animate">
          <div className="bg-white dark:bg-slate-900 max-w-xl w-full rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            {/* Modal Header Banner */}
            <div className="relative bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-800 p-6 text-white">
              <button
                onClick={() => setViewingEmployee(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
              >
                <Icon name="x" className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-4">
                <img
                  src={viewingEmployee.pic || window.SAMPLE_AVATARS[0]}
                  alt={viewingEmployee.name}
                  className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white/30 shadow-lg"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold">{viewingEmployee.name}</h2>
                    <StatusBadge status={viewingEmployee.status} />
                  </div>
                  <p className="text-indigo-100 text-sm">{viewingEmployee.role || viewingEmployee.department}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="font-mono text-xs bg-white/20 px-2 py-0.5 rounded-md">{viewingEmployee.id}</span>
                    <BloodBadge bloodGroup={viewingEmployee.bloodGroup} size="sm" />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body Details */}
            <div className="p-6 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Department Section</span>
                  <div className="mt-1">
                    <DepartmentBadge department={viewingEmployee.department} size="md" />
                  </div>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Company</span>
                  <div className="font-bold text-slate-800 dark:text-slate-200 mt-1">
                    {viewingEmployee.companyName || "Neekan Consulting LLP"}
                  </div>
                </div>
              </div>

              <div className="space-y-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                    <Icon name="mail" className="w-4 h-4 text-blue-500" />
                    <span>{viewingEmployee.email}</span>
                  </div>
                  <a
                    href={`mailto:${viewingEmployee.email}`}
                    className="text-xs font-bold text-indigo-600 hover:underline"
                  >
                    Send Email
                  </a>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300 font-mono">
                    <Icon name="phone" className="w-4 h-4 text-emerald-500" />
                    <span>{viewingEmployee.mobile}</span>
                  </div>
                  <a
                    href={`tel:${viewingEmployee.mobile}`}
                    className="text-xs font-bold text-emerald-600 hover:underline"
                  >
                    Call Now
                  </a>
                </div>

                <div className="flex items-start gap-2.5 text-slate-600 dark:text-slate-300">
                  <Icon name="map-pin" className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-semibold text-slate-400 block">Residential Address</span>
                    <span className="text-slate-700 dark:text-slate-300 text-xs">{viewingEmployee.address}</span>
                  </div>
                </div>
              </div>

              {/* Skills */}
              {viewingEmployee.skills && viewingEmployee.skills.length > 0 && (
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Expertise & Skills
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(Array.isArray(viewingEmployee.skills) ? viewingEmployee.skills : viewingEmployee.skills.split(',')).map((skill, i) => (
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
              <button
                onClick={() => {
                  const emp = viewingEmployee;
                  setViewingEmployee(null);
                  setDeletingEmployee(emp);
                }}
                className="text-rose-600 hover:text-rose-700 text-xs font-bold px-3 py-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40"
              >
                Delete Profile
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const emp = viewingEmployee;
                    setViewingEmployee(null);
                    setEditingEmployee(emp);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Icon name="edit-3" className="w-3.5 h-3.5" />
                  Edit Employee
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: DELETE CONFIRMATION                                */}
      {/* ======================================================== */}
      {deletingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm modal-animate">
          <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4">
              <Icon name="trash-2" className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Delete Employee Record?</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 mb-6">
              Are you sure you want to delete <strong className="text-slate-800 dark:text-slate-200">{deletingEmployee.name}</strong> ({deletingEmployee.id}) from the {deletingEmployee.department} section? You can undo this immediately from the notification.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeletingEmployee(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20"
              >
                Yes, Delete Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: EXPORT DATA                                        */}
      {/* ======================================================== */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm modal-animate">
          <div className="bg-white dark:bg-slate-900 max-w-lg w-full rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Icon name="download" className="w-5 h-5 text-indigo-600" />
                Export CRM Dataset
              </h3>
              <button onClick={() => setIsExportModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <Icon name="x" className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Download complete records of all {employees.length} employees of Neekan Consulting LLP.
            </p>

            <div className="space-y-3">
              {/* CSV Export */}
              <button
                onClick={() => {
                  const headers = ["ID", "Name", "Department", "Role", "Email", "Mobile", "Blood Group", "Company", "Address", "Status"];
                  const rows = employees.map(e => [
                    `"${e.id}"`,
                    `"${e.name}"`,
                    `"${e.department}"`,
                    `"${e.role || ''}"`,
                    `"${e.email}"`,
                    `"${e.mobile}"`,
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
                  setIsExportModalOpen(false);
                  showToast("Exported employees to CSV file", "success");
                }}
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
                <Icon name="arrow-right" className="w-4 h-4 text-slate-400" />
              </button>

              {/* JSON Export */}
              <button
                onClick={() => {
                  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(employees, null, 2));
                  const link = document.createElement("a");
                  link.setAttribute("href", dataStr);
                  link.setAttribute("download", `neekan_employees_${new Date().toISOString().split('T')[0]}.json`);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  setIsExportModalOpen(false);
                  showToast("Exported employees to JSON file", "success");
                }}
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
                <Icon name="arrow-right" className="w-4 h-4 text-slate-400" />
              </button>

              {/* Print Roster */}
              <button
                onClick={() => {
                  setIsExportModalOpen(false);
                  window.print();
                }}
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
                <Icon name="printer" className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 space-y-2 max-w-sm w-full pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className="toast-animate pointer-events-auto bg-slate-900 text-white dark:bg-white dark:text-slate-900 p-4 rounded-2xl shadow-xl border border-slate-800 dark:border-slate-200 flex items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-center gap-2">
              <Icon
                name={
                  toast.type === 'success' ? 'check-circle-2' :
                  toast.type === 'warning' ? 'alert-triangle' : 'info'
                }
                className={`w-4 h-4 ${
                  toast.type === 'success' ? 'text-emerald-400 dark:text-emerald-600' :
                  toast.type === 'warning' ? 'text-amber-400 dark:text-amber-600' : 'text-indigo-400 dark:text-indigo-600'
                }`}
              />
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
    </div>
  );
}

// Reusable Employee Form Modal (Handles Create and Edit)
function EmployeeFormModal({ title, subtitle, initialData, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    email: initialData.email || '',
    companyName: initialData.companyName || 'Neekan Consulting LLP',
    mobile: initialData.mobile || '',
    bloodGroup: initialData.bloodGroup || 'O+',
    address: initialData.address || '',
    department: initialData.department || 'Software Engineer',
    role: initialData.role || '',
    pic: initialData.pic || window.SAMPLE_AVATARS[0],
    status: initialData.status || 'Active',
    skills: Array.isArray(initialData.skills) ? initialData.skills.join(', ') : (initialData.skills || '')
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Image Upload File Handler
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleInputChange('pic', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Full name is required";
    if (!formData.email.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Invalid email format";
    }
    if (!formData.mobile.trim()) errs.mobile = "Mobile number is required";
    if (!formData.companyName.trim()) errs.companyName = "Company name is required";
    if (!formData.address.trim()) errs.address = "Address is required";
    if (!formData.bloodGroup) errs.bloodGroup = "Blood group is required";
    if (!formData.department) errs.department = "Department is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        ...initialData,
        ...formData
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm modal-animate overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 max-w-2xl w-full rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Icon name="x" className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Avatar Section */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
              Profile Picture
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <img
                src={formData.pic || window.SAMPLE_AVATARS[0]}
                alt="Avatar preview"
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500 shadow-sm"
              />
              <div className="flex-1 w-full space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.pic}
                    onChange={(e) => handleInputChange('pic', e.target.value)}
                    placeholder="Enter image URL..."
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                  <label className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 hover:bg-indigo-100 cursor-pointer border border-indigo-200 dark:border-indigo-800 shrink-0">
                    Upload
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>

                {/* Preset Avatars */}
                <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                  <span className="text-[11px] text-slate-400 shrink-0">Presets:</span>
                  {window.SAMPLE_AVATARS.slice(0, 6).map((avatar, idx) => (
                    <img
                      key={idx}
                      src={avatar}
                      alt={`preset ${idx}`}
                      onClick={() => handleInputChange('pic', avatar)}
                      className={`w-7 h-7 rounded-lg object-cover cursor-pointer transition-all ${
                        formData.pic === avatar ? 'ring-2 ring-indigo-600 scale-110' : 'opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Department (4 Sections Required) & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Department Section <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                className={`w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border ${
                  errors.department ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500`}
              >
                <option value="Software Engineer">💻 Software Engineer</option>
                <option value="UI/UX">🎨 UI/UX Designer</option>
                <option value="DBA">🗄️ DBA (Database Administrator)</option>
                <option value="Management">👔 Management & Leadership</option>
              </select>
              {errors.department && <p className="text-[11px] text-rose-500 mt-1">{errors.department}</p>}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Designation / Job Title
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                placeholder="e.g. Senior Frontend Architect"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Full Name & Company Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g. Aarav Sharma"
                className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${
                  errors.name ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500`}
              />
              {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Company Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                placeholder="Neekan Consulting LLP"
                className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${
                  errors.companyName ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500`}
              />
              {errors.companyName && <p className="text-[11px] text-rose-500 mt-1">{errors.companyName}</p>}
            </div>
          </div>

          {/* Email, Mobile & Blood Group */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="name@neekanconsulting.com"
                className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${
                  errors.email ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500`}
              />
              {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.mobile}
                onChange={(e) => handleInputChange('mobile', e.target.value)}
                placeholder="+91 98765 43210"
                className={`w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border ${
                  errors.mobile ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500`}
              />
              {errors.mobile && <p className="text-[11px] text-rose-500 mt-1">{errors.mobile}</p>}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Blood Group <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 focus:ring-2 focus:ring-indigo-500 font-mono"
              >
                {window.BLOOD_GROUPS.map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Residential Address <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows="2"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Flat / House No, Street, City, State, Postal Code"
              className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${
                errors.address ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
              } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500`}
            ></textarea>
            {errors.address && <p className="text-[11px] text-rose-500 mt-1">{errors.address}</p>}
          </div>

          {/* Status & Skills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Employment Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Active">Active (On-site)</option>
                <option value="Remote">Remote</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Skills / Tags (comma separated)
              </label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => handleInputChange('skills', e.target.value)}
                placeholder="React, Figma, PostgreSQL, Management"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20"
            >
              Save Employee Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Render React App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
