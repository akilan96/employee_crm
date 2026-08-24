# Neekan Consulting LLP - Employee CRM Suite (React + Tailwind CSS)

A modern, production-grade Employee CRM web application built with **React**, **Vite**, **Tailwind CSS**, and **Lucide Icons**.

---

## 🌟 Architecture & Features

### 🏢 Header & Enterprise Branding
- **Company Branding**: **Neekan Consulting LLP** header with glowing gradient logo badge.
- **Theme Switcher**: Dark Mode and Light Mode with instant toggle and `localStorage` persistence.
- **Header Actions**: Quick "+ Add Employee" button, active employee counter, and 3-module navigation.

### 👥 Module 1: Employee Directory & CRUD Operations
- **4 Department Sections**:
  1. 💻 **Software Engineer** (Frontend, Backend, Cloud & Full Stack)
  2. 🎨 **UI/UX** (Product Design, UX Research, Interaction Design)
  3. 🗄️ **DBA** (Database Administrators, Architects, Performance Engineers)
  4. 👔 **Management** (Delivery Managers, Operations Directors, Leadership)
  - Plus an **All Staff** view with real-time employee counts and percentage breakdowns.
- **All Required Employee Attributes**:
  - 🖼️ **Profile Picture**: Live image preview, custom URL input, file upload, or preset avatar picker.
  - 👤 **Full Name**
  - ✉️ **Email Address**
  - 🏢 **Company Name** (default: `Neekan Consulting LLP`)
  - 📱 **Mobile Number**
  - 🩸 **Blood Group** (`A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`) with custom badges.
  - 📍 **Residential Address** (Street, City, State, Postal Code)
  - 💼 **Department & Designation**
  - 🟢 **Status** (`Active`, `Remote`, `On Leave`) & Skill tags.
- **Full CRUD Capabilities**:
  - **Create**: Add new employee modal with field validation and immediate state & `localStorage` persistence.
  - **Read**: Interactive **Grid Cards View** and **Enterprise Table View**, plus a comprehensive **Profile Details Modal** with 1-click email/call actions.
  - **Update**: Edit profile modal pre-populated with existing employee data.
  - **Delete**: Confirmation modal with instant **Undo** notification toast.
- **Search & Multi-Filter**: Real-time search across Name, Email, Mobile, Address, Company, and Skills; filters for Section, Blood Group, and Status; sort by Name, Date, or Department.

### 📊 Module 2: Department Insights & Analytics Dashboard
- Headcount breakdown and allocation across all 4 departments with progress bars.
- **Blood Group Donor Registry**: Visual count of active donors for each blood group with 1-click filtering.
- High-level KPIs: Total Headcount, Active On-Site, Remote Specialists, and Blood Diversity index.

### 🛡️ Module 3: Emergency Operations & Export Hub
- **Instant Emergency Contact Grid**: 1-click calling and blood group badge for critical medical emergencies.
- **Export Capabilities**: Export entire staff database to **CSV**, structured **JSON**, or formatted print-ready **PDF**.
- **Audit & Activity Log**: Automatic timestamped audit logging for every create, update, delete, and restore action.
- **Demo Data Reset**: Reset button to quickly restore demo employee profiles anytime.

---

## 📁 Project Directory Structure

```
c:\ak\emp\
├── index.html                  # HTML entry point (Vite & Tailwind)
├── package.json                # Project dependencies & scripts
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS theme configuration (dark mode 'class')
├── postcss.config.js           # PostCSS configuration
├── src/
│   ├── main.jsx                # React root mount
│   ├── App.jsx                 # Main application state & module container
│   ├── index.css               # Tailwind directives, animations & glassmorphism
│   ├── data/
│   │   └── employeesData.js    # Initial employee seed dataset & constants
│   └── components/
│       ├── Navbar.jsx          # Header with branding, dark mode & navigation
│       ├── EmployeeCard.jsx    # Card component with all required employee attributes
│       ├── EmployeeTable.jsx   # Data table view component
│       ├── EmployeeFormModal.jsx # Add / Edit employee modal with validation
│       ├── EmployeeDetailModal.jsx # Full profile drawer/modal with contact actions
│       ├── DeleteModal.jsx     # Delete confirmation dialog
│       ├── ExportModal.jsx     # Export to CSV / JSON / PDF modal
│       ├── AnalyticsDashboard.jsx # Module 2: Analytics & Department stats
│       ├── OperationsHub.jsx   # Module 3: Emergency contacts & audit logs
│       ├── Badges.jsx          # Blood group, department, and status badges
│       └── Toast.jsx           # Notification toast with Undo capability
```

---

## 🚀 How to Run the Project

### Option 1: Standard React Development (Node / Vite)
```bash
# Install dependencies
npm install

# Start the local development server
npm run dev

# Build for production
npm run build
```

### Option 2: Direct Browser View
You can also preview the app directly in your browser.
