import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../utils/apiConfig';
import {
  Smartphone,
  CheckCircle2,
  AlertCircle,
  RotateCw,
  Send,
  Ticket,
  Zap,
  ArrowLeft,
  Moon,
  Sun,
  ShieldCheck,
  Server,
  Activity,
  MessageSquare,
  Users,
  Copy,
  ExternalLink,
  QrCode as QrCodeIcon,
  Heart
} from 'lucide-react';

export default function WhatsAppConsoleView({ theme, toggleTheme, onNavigate, onShowToast }) {
  const [gatewayStatus, setGatewayStatus] = useState('CHECKING');
  const [qrCodeData, setQrCodeData] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastChecked, setLastChecked] = useState(new Date());

  // Test Message State
  const [testPhone, setTestPhone] = useState('9677965133');
  const [testName, setTestName] = useState('Akilan K');
  const [testCustomMsg, setTestCustomMsg] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResponse, setTestResponse] = useState(null);

  // Local registrations
  const [registrations, setRegistrations] = useState([]);
  const [resendingId, setResendingId] = useState(null);

  const fetchStatus = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch(API_ENDPOINTS.status);
      if (res.ok) {
        const data = await res.json();
        setGatewayStatus(data.status);
        setQrCodeData(data.qr || null);
        setLastChecked(new Date());
      } else {
        setGatewayStatus('SERVER_OFFLINE');
      }
    } catch (err) {
      setGatewayStatus('SERVER_OFFLINE');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('shaktidb_event_registrations') || '[]');
      setRegistrations(saved);
    } catch (e) {}
  }, []);

  const handleSendTestMessage = async (e) => {
    e.preventDefault();
    if (!testPhone.trim()) {
      if (onShowToast) onShowToast('Please enter a phone number', 'warning');
      return;
    }

    setIsSendingTest(true);
    setTestResponse(null);

    const formattedPhone = testPhone.replace(/\D/g, '');
    const fullPhone = formattedPhone.startsWith('91') && formattedPhone.length === 12
      ? formattedPhone
      : `91${formattedPhone.slice(-10)}`;

    const payload = {
      studentPhone: fullPhone,
      studentName: testName || 'Test Student',
      ticketId: `TEST-${Math.floor(100000 + Math.random() * 900000)}`,
      customMessage: testCustomMsg.trim() || undefined
    };

    try {
      const res = await fetch(API_ENDPOINTS.sendPass, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      setTestResponse({
        status: res.status,
        ok: res.ok,
        data,
        timestamp: new Date().toLocaleTimeString()
      });

      if (res.ok && data.success) {
        if (onShowToast) onShowToast(`✅ WhatsApp message delivered to +${fullPhone}!`, 'success');
      } else {
        if (onShowToast) onShowToast(`⚠️ ${data.error || 'Failed to dispatch'}`, 'error');
      }
    } catch (err) {
      setTestResponse({
        status: 500,
        ok: false,
        data: { error: err.message },
        timestamp: new Date().toLocaleTimeString()
      });
      if (onShowToast) onShowToast(`Server error: ${err.message}`, 'error');
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleResendPass = async (reg) => {
    setResendingId(reg.ticketId);
    const targetPhone = (reg.phoneNumber || reg.contactNo || '').replace(/\D/g, '');
    const fullPhone = targetPhone.startsWith('91') && targetPhone.length === 12
      ? targetPhone
      : `91${targetPhone.slice(-10)}`;

    try {
      const res = await fetch(API_ENDPOINTS.sendPass, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentPhone: fullPhone,
          studentName: reg.name,
          ticketId: reg.ticketId
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (onShowToast) onShowToast(`Pass re-sent to ${reg.name} (+${fullPhone})!`, 'success');
      } else {
        if (onShowToast) onShowToast(`Error: ${data.error || 'Failed to re-send'}`, 'error');
      }
    } catch (err) {
      if (onShowToast) onShowToast(`Error: ${err.message}`, 'error');
    } finally {
      setResendingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate && onNavigate('/event')}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Workshop (/event)</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h1 className="text-sm font-black text-slate-900 dark:text-white">
                WhatsApp Automation Gateway Hub
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchStatus}
              disabled={isRefreshing}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              title="Refresh status"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">Refresh</span>
            </button>

            <button
              onClick={() => onNavigate && onNavigate('/shaktidb')}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all hidden sm:block cursor-pointer"
            >
              ⚡ ShaktiDB
            </button>

            <button
              onClick={() => onNavigate && onNavigate('/')}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
            >
              💼 CRM
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>
          </div>

        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Status Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-6 sm:p-8 shadow-xl overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-white/20 backdrop-blur-md">
                <Smartphone className="w-3.5 h-3.5" />
                <span>ADMISSIONS GATEWAY ROUTE: /whatsapp</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                WhatsApp Connection & Dispatch Console
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
                Background daemon automatically connects to Organizer Admissions WhatsApp (<strong>+91 96779 65133</strong>) and dispatches 1-click single-attachment passes to registered students.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shrink-0 text-center md:text-right space-y-1">
              <div className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider">
                Connection Status
              </div>
              <div className="text-xl font-black flex items-center justify-center md:justify-end gap-2">
                <span className={`w-3 h-3 rounded-full ${
                  gatewayStatus === 'READY'
                    ? 'bg-emerald-300 animate-ping'
                    : gatewayStatus === 'AUTHENTICATED' || gatewayStatus === 'QR_READY'
                    ? 'bg-amber-300 animate-pulse'
                    : 'bg-red-300'
                }`} />
                <span>{gatewayStatus}</span>
              </div>
              <div className="text-[10px] text-emerald-100 font-mono">
                Last checked: {lastChecked.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Grid: Left Connection Card, Right Live Test Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Connection Diagnostic Card */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Status Details Card */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-md space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Server className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Gateway Link Diagnostics</span>
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                  gatewayStatus === 'READY'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {gatewayStatus === 'READY' ? 'Online' : 'Pending'}
                </span>
              </div>

              {gatewayStatus === 'READY' ? (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-black text-sm text-emerald-950 dark:text-emerald-200">
                        WhatsApp Linked & Ready
                      </h4>
                      <p className="text-xs text-emerald-800 dark:text-emerald-300">
                        Organized admissions device (<strong>+91 96779 65133</strong>) is active. Single pass attachment messages are routed automatically.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-mono border-t border-emerald-200/60 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-300">
                    <div>Port: 3001</div>
                    <div>Mode: Single-Attachment</div>
                    <div>Auth: Local Storage Multi-Device</div>
                    <div>Engine: Chromium Headless</div>
                  </div>
                </div>
              ) : gatewayStatus === 'QR_READY' && qrCodeData ? (
                <div className="text-center space-y-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Scan this QR code using WhatsApp on +91 96779 65133 to link the Admissions Gateway:
                  </p>
                  <div className="flex justify-center p-3 bg-white rounded-2xl shadow-inner inline-block mx-auto border border-slate-200">
                    <img src={qrCodeData} alt="WhatsApp QR Code" className="w-56 h-56 object-contain" />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Open WhatsApp ➔ Settings ➔ Linked Devices ➔ Link a Device
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 space-y-2 text-xs text-amber-900 dark:text-amber-300">
                  <div className="flex items-center gap-2 font-bold">
                    <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Server Status: {gatewayStatus}</span>
                  </div>
                  <p>
                    The WhatsApp automation daemon is syncing. If it does not become READY within 10 seconds, run:
                  </p>
                  <code className="block p-2 rounded-lg bg-black/80 text-emerald-400 font-mono text-xs">
                    npm run server
                  </code>
                </div>
              )}

              {/* Endpoint Information */}
              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono">
                  <span>POST /api/send-whatsapp-pass</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Active</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono">
                  <span>GET /api/whatsapp-status</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Active</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Live Message Dispatch Test Console */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-md space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Send Test WhatsApp Message</span>
                </h3>
                <span className="text-[10px] font-bold text-slate-400">Instant Test</span>
              </div>

              <form onSubmit={handleSendTestMessage} className="space-y-4">
                
                {/* Target Phone */}
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Recipient Phone Number (with +91)
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs font-bold text-slate-500 pointer-events-none">
                      🇮🇳 +91
                    </span>
                    <input
                      type="tel"
                      required
                      value={testPhone}
                      onChange={(e) => setTestPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="9677965133"
                      className="w-full pl-16 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-mono outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Student Name */}
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Student Name
                  </label>
                  <input
                    type="text"
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                    placeholder="Akilan K"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Custom Test Message */}
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Custom Message Note (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={testCustomMsg}
                    onChange={(e) => setTestCustomMsg(e.target.value)}
                    placeholder="Leave blank to use default Student Pass confirmation text..."
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSendingTest || gatewayStatus !== 'READY'}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isSendingTest ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending via WhatsApp...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Dispatch WhatsApp Test Message</span>
                    </>
                  )}
                </button>
              </form>

              {/* Test Response Output */}
              {testResponse && (
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Response Status: {testResponse.status} ({testResponse.ok ? 'SUCCESS' : 'ERROR'})</span>
                    <span>{testResponse.timestamp}</span>
                  </div>
                  <pre className="text-emerald-400 overflow-x-auto text-[11px]">
                    {JSON.stringify(testResponse.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Recent Registrations Table with Re-Send Pass Action */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Registered Students & WhatsApp Dispatches ({registrations.length})</span>
            </h3>
            <span className="text-xs text-slate-500">Live Registration Log</span>
          </div>

          {registrations.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No workshop registrations recorded yet. Submit the registration form at <button onClick={() => onNavigate && onNavigate('/event')} className="text-emerald-600 dark:text-emerald-400 underline font-bold cursor-pointer">/event</button> to test.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase text-[10px]">
                    <th className="pb-2">Student Name</th>
                    <th className="pb-2">Ticket ID</th>
                    <th className="pb-2">WhatsApp Number</th>
                    <th className="pb-2">College</th>
                    <th className="pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {registrations.map((reg) => (
                    <tr key={reg.ticketId} className="hover:bg-slate-50 dark:hover:bg-slate-950/50">
                      <td className="py-2.5 font-bold text-slate-900 dark:text-white">
                        {reg.name}
                      </td>
                      <td className="py-2.5 font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                        {reg.ticketId}
                      </td>
                      <td className="py-2.5 font-mono text-slate-600 dark:text-slate-400">
                        {reg.phoneNumber || reg.contactNo}
                      </td>
                      <td className="py-2.5 text-slate-500">
                        {reg.college || 'Engineering College'}
                      </td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => handleResendPass(reg)}
                          disabled={resendingId === reg.ticketId || gatewayStatus !== 'READY'}
                          className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-all disabled:opacity-50 cursor-pointer"
                        >
                          {resendingId === reg.ticketId ? 'Sending...' : 'Re-send Pass'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

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

    </div>
  );
}
