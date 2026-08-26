import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Users,
  Award,
  BookOpen,
  CheckCircle2,
  Terminal,
  Zap,
  ShieldCheck,
  Cpu,
  Database,
  ArrowRight,
  Download,
  Share2,
  Copy,
  ExternalLink,
  ChevronDown,
  Moon,
  Sun,
  Flame,
  Check,
  X,
  Building2,
  Mail,
  Phone,
  GraduationCap,
  Sparkle,
  Code2,
  Star,
  Tv,
  Globe,
  Radio,
  Layers,
  HelpCircle,
  QrCode,
  Send,
  Ticket,
  MessageSquare,
  Smartphone,
  Shield,
  RotateCw,
  Info,
  Laptop
} from 'lucide-react';

export default function EventLandingView({
  theme,
  toggleTheme,
  onOpenDirectory,
  onShowToast
}) {
  // Organizer / Sender WhatsApp Number
  const ORGANIZER_WHATSAPP = '919677965133';

  // Live Countdown Timer
  const [timeLeft, setTimeLeft] = useState({
    days: 4,
    hours: 18,
    minutes: 32,
    seconds: 45
  });

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 5);
    targetDate.setHours(10, 0, 0, 0);

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNo: '',
    phoneNumber: '',
    college: '',
    year: '3rd Year B.Tech / B.E',
    interest: 'PostgreSQL Internals & Query Engine',
    autoWhatsappNotify: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredPass, setRegisteredPass] = useState(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);

  // Active FAQ Accordion State
  const [activeFaq, setActiveFaq] = useState(0);

  // Interactive Live SQL Terminal Demo
  const [selectedDemoQuery, setSelectedDemoQuery] = useState('wal');
  const [isRunningQuery, setIsRunningQuery] = useState(false);
  const [queryOutput, setQueryOutput] = useState(null);

  // Live Seats Counter
  const [seatsLeft, setSeatsLeft] = useState(42);

  // Live Pass Clock for ticket
  const [passLiveTime, setPassLiveTime] = useState('10:00:00');

  useEffect(() => {
    const clockInterval = setInterval(() => {
      const now = new Date();
      setPassLiveTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // WhatsApp Automation Gateway State
  const [whatsappGatewayStatus, setWhatsappGatewayStatus] = useState('CHECKING');
  const [whatsappQrCode, setWhatsappQrCode] = useState(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Poll WhatsApp Gateway Status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/whatsapp-status');
        if (res.ok) {
          const data = await res.json();
          setWhatsappGatewayStatus(data.ready ? 'READY' : (data.status || 'QR_REQUIRED'));
          if (data.qrCode) {
            setWhatsappQrCode(data.qrCode);
          }
        } else {
          setWhatsappGatewayStatus('OFFLINE');
        }
      } catch (e) {
        setWhatsappGatewayStatus('OFFLINE');
      }
    };

    fetchStatus();
    const pollTimer = setInterval(fetchStatus, 3500);
    return () => clearInterval(pollTimer);
  }, []);

  useEffect(() => {
    const seatInterval = setInterval(() => {
      setSeatsLeft(prev => (prev > 9 ? prev - 1 : 9));
    }, 50000);
    return () => clearInterval(seatInterval);
  }, []);

  // Utility to format phone number for WhatsApp with international code
  const formatPhoneForWhatsApp = (phone) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) return `91${cleaned}`;
    if (cleaned.startsWith('0') && cleaned.length === 11) return `91${cleaned.substring(1)}`;
    if (cleaned.startsWith('91') && cleaned.length === 12) return cleaned;
    return cleaned;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleContactChange = (e) => {
    const val = e.target.value;
    setFormData(prev => ({
      ...prev,
      contactNo: val,
      phoneNumber: (!prev.phoneNumber || prev.phoneNumber === prev.contactNo) ? val : prev.phoneNumber
    }));
  };

  // Build formatted WhatsApp message sent directly TO the student from the organizer
  const buildStudentWhatsAppMessage = (passData) => {
    return `🎓 *SHAKTIDB™ STUDENT MASTERCLASS 2026*
━━━━━━━━━━━━━━━━━━━━
Dear *${passData.name}*,
Your registration for the *ShaktiDB™ National Database Workshop* is *CONFIRMED*! 🎟️

📋 *YOUR OFFICIAL PASS DETAILS:*
• *Ticket ID:* ${passData.ticketId}
• *Attendee Name:* ${passData.name}
• *College:* ${passData.college || 'Engineering College'} (${passData.year})
• *Selected Track:* ${passData.interest}
• *Date & Time:* Saturday, March 14, 2026 (10:00 AM IST)
• *Format:* Live Virtual Lab & Cloud Sandbox
• *Fee:* ₹0 (100% Free Sponsored Student Pass)

💻 *Workshop Curriculum Highlights:*
1. PostgreSQL Engine Internals (Query Planners & Buffer Caching)
2. ShaktiDB RISC-V Hardware Enclaves & Cryptography
3. Native AI Vector Search with pg_shaktivector
4. Verified IIT Madras Certificate & ₹50,000 Hackathon

━━━━━━━━━━━━━━━━━━━━
_Dispatched from ShaktiDB Admissions Desk (+91 96779 65133)_
_Department of CSE, IIT Madras & Pravartak Foundation_`;
  };

  // Generate Canvas PNG Image matching the exact Mobile Ticket layout in user photo
  const generateTicketCanvasImage = (passData) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const width = 640;
      const height = 1100;
      canvas.width = width;
      canvas.height = height;

      // 1. Background (Clean Card with soft shadow border)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // Top Notch background
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, width, 50);

      // 2. Phone Notch simulation
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(width / 2 - 60, 0, 120, 24, [0, 0, 14, 14]);
      ctx.fill();

      // Speaker & Camera dot
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.arc(width / 2 + 30, 12, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // 3. LIVE Green Pill Badge (Top Left)
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.roundRect(36, 60, 84, 28, 14);
      ctx.fill();

      // Live Dot
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(50, 74, 4, 0, Math.PI * 2);
      ctx.fill();

      // Live text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('LIVE', 62, 78);

      // 4. Header Titles
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('COMBO WORKSHOP PASS', 36, 112);

      ctx.fillStyle = '#334155';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText('மாணவர் அனுமதி சீட்டு', 36, 134);

      // 5. Official IIT Madras Pravartak Stamp / Seal (Top Right)
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(width - 70, 95, 38, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(width - 70, 95, 33, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 7px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('IIT MADRAS', width - 70, 78);
      ctx.fillText('PRAVARTAK', width - 70, 90);
      ctx.fillText('SHAKTIDB', width - 70, 102);
      ctx.fillText('VERIFIED 2026', width - 70, 114);
      ctx.textAlign = 'left';

      // 6. Time Validity Box (Soft Mint/Emerald Gradient Box)
      const grad = ctx.createLinearGradient(36, 160, width - 72, 250);
      grad.addColorStop(0, '#dcfce7');
      grad.addColorStop(0.5, '#bbf7d0');
      grad.addColorStop(1, '#d1fae5');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(36, 160, width - 72, 105, 20);
      ctx.fill();

      // Top label in time box
      ctx.fillStyle = '#166534';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Ticket is valid for workshop on Sat, Mar 14', width / 2, 185);

      // Monospace Digital LED Clock Time
      ctx.fillStyle = '#064e3b';
      ctx.font = 'bold 44px monospace';
      ctx.fillText('10 : 00', width / 2, 235);
      ctx.textAlign = 'left';

      // 7. QR Code Frame & Box
      const qrSize = 250;
      const qrX = (width - qrSize) / 2;
      const qrY = 285;

      ctx.fillStyle = '#f8fafc';
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20, 18);
      ctx.fill();
      ctx.stroke();

      // Draw QR Pattern simulation
      ctx.fillStyle = '#0f172a';
      const drawFinder = (fx, fy) => {
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.roundRect(fx, fy, 48, 48, 8);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(fx + 6, fy + 6, 36, 36, 6);
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.roundRect(fx + 14, fy + 14, 20, 20, 4);
        ctx.fill();
      };

      drawFinder(qrX, qrY);
      drawFinder(qrX + qrSize - 48, qrY);
      drawFinder(qrX, qrY + qrSize - 48);

      // Matrix Data Dots Simulation
      for (let r = 0; r < 17; r++) {
        for (let c = 0; c < 17; c++) {
          const isFinderArea = (r < 4 && c < 4) || (r < 4 && c > 12) || (r > 12 && c < 4);
          const isCenter = r >= 6 && r <= 10 && c >= 6 && c <= 10;
          if (!isFinderArea && !isCenter) {
            if ((r * 7 + c * 13 + (passData.ticketId.charCodeAt(c % passData.ticketId.length) || 0)) % 2 === 0) {
              ctx.fillStyle = '#0f172a';
              ctx.fillRect(qrX + c * 14 + 7, qrY + r * 14 + 7, 9, 9);
            }
          }
        }
      }

      // Center Refresh/Database Emblem inside QR
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(qrX + qrSize / 2, qrY + qrSize / 2, 28, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#15803d';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⚡', qrX + qrSize / 2, qrY + qrSize / 2 + 6);
      ctx.textAlign = 'left';

      // 8. Pass ID & Pricing Bar
      ctx.fillStyle = '#f1f5f9';
      ctx.beginPath();
      ctx.roundRect(36, 565, width - 72, 42, 12);
      ctx.fill();

      ctx.fillStyle = '#334155';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`💻 ${passData.ticketId} | Student Pass`, 48, 591);

      ctx.fillStyle = '#15803d';
      ctx.font = 'bold 15px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('₹ 0 (Free)', width - 48, 591);
      ctx.textAlign = 'left';

      // 9. Route & Location Details
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(`👤 ${passData.name}`, 48, 638);

      ctx.fillStyle = '#475569';
      ctx.font = '12px sans-serif';
      ctx.fillText(`🏛️ ${passData.college || 'Engineering Institute'} (${passData.year})`, 48, 660);
      ctx.fillText(`📞 ${passData.contactNo} • 📧 ${passData.email}`, 48, 680);

      // Route Arrow
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(48, 705);
      ctx.lineTo(width - 48, 705);
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('📍 Virtual Sandbox Lab  ➔  IIT Madras Central Node', 48, 728);

      // 10. Bottom Banner
      ctx.fillStyle = '#f8fafc';
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(36, 755, width - 72, 85, 14);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('This ticket is also valid in', width / 2, 780);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'black 16px sans-serif';
      ctx.fillText('ONE OR ALL WORKSHOP SESSIONS & LABS', width / 2, 805);

      ctx.fillStyle = '#15803d';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('INSTITUTE OF NATIONAL IMPORTANCE • IIT MADRAS', width / 2, 825);
      ctx.textAlign = 'left';

      // 11. Footer note
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ShaktiDB™ Sovereign Database Initiative • Powered by IIT Madras & MeitY', width / 2, 870);
      ctx.fillText(`Dispatched from Admissions Desk: +91 96779 65133 to Student: ${passData.phoneNumber || passData.contactNo}`, width / 2, 888);

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          resolve({ blob, url });
        }
      }, 'image/png');
    });
  };

  // Submit Handler
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.contactNo.trim()) {
      if (onShowToast) {
        onShowToast('Please fill in Name, Email and Contact Number', 'warning');
      }
      return;
    }

    setIsSubmitting(true);

    setTimeout(async () => {
      const ticketId = `SHAKTI-${Math.floor(100000 + Math.random() * 900000)}`;
      const studentPhone = formData.phoneNumber || formData.contactNo;
      const passData = {
        ticketId,
        ...formData,
        phoneNumber: studentPhone,
        registeredAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })
      };

      // Save to localStorage
      try {
        const existing = JSON.parse(localStorage.getItem('shaktidb_event_registrations') || '[]');
        localStorage.setItem('shaktidb_event_registrations', JSON.stringify([passData, ...existing]));
      } catch (err) {
        console.error('Failed to save event registration', err);
      }

      setRegisteredPass(passData);
      setSeatsLeft(prev => Math.max(1, prev - 1));

      // Generate Image
      try {
        const { blob, url } = await generateTicketCanvasImage(passData);
        setGeneratedImageUrl(url);
      } catch (err) {
        console.error('Image generation error:', err);
      }

      setIsSubmitting(false);

      if (onShowToast) {
        onShowToast(`🎉 Congratulations ${formData.name}! Your Ticket Pass has been generated.`, 'success');
      }

      // Automatically dispatch directly to student's WhatsApp in background without opening popup prompt
      if (formData.autoWhatsappNotify) {
        const targetStudentPhone = formatPhoneForWhatsApp(studentPhone);
        const studentMessage = buildStudentWhatsAppMessage(passData);

        // Silent background dispatch via WhatsApp automation server
        try {
          fetch('/api/send-whatsapp-pass', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              studentPhone: targetStudentPhone,
              studentName: passData.name,
              ticketId: passData.ticketId,
              message: studentMessage,
              passImageBase64: url
            })
          })
            .then(res => res.json())
            .then(data => {
              console.log('⚡ Direct WhatsApp Dispatch result:', data);
              if (onShowToast) {
                onShowToast(`✅ Pass image & confirmation dispatched directly to student (+${targetStudentPhone})!`, 'success');
              }
            })
            .catch(err => {
              console.warn('Backend gateway dispatch note:', err);
            });
        } catch (e) {
          console.error('Silent dispatch error:', e);
        }
      }

      // Smooth scroll to pass
      setTimeout(() => {
        const passElem = document.getElementById('digital-pass-view');
        if (passElem) {
          passElem.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    }, 700);
  };

  // Download Pass PNG
  const handleDownloadPassImage = async () => {
    if (!registeredPass) return;
    setIsGeneratingImage(true);
    try {
      const { blob, url } = await generateTicketCanvasImage(registeredPass);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ShaktiDB_Student_Pass_${registeredPass.ticketId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      if (onShowToast) onShowToast('Pass image downloaded successfully (PNG)!', 'success');
    } catch (err) {
      console.error('Download error', err);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Send Pass Directly TO Student's WhatsApp Number with Image Attachment
  const handleSendToStudentWhatsApp = async () => {
    if (!registeredPass) return;

    setIsGeneratingImage(true);
    try {
      const studentPhone = formatPhoneForWhatsApp(registeredPass.phoneNumber || registeredPass.contactNo);
      const { blob, url } = await generateTicketCanvasImage(registeredPass);
      const file = new File([blob], `ShaktiDB_Pass_${registeredPass.ticketId}.png`, { type: 'image/png' });
      const messageText = buildStudentWhatsAppMessage(registeredPass);

      // Web Share API (Android / iOS / Chrome) allows attaching the image file directly into WhatsApp
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: `ShaktiDB Student Workshop Pass - ${registeredPass.name}`,
            text: messageText,
            files: [file]
          });
          if (onShowToast) onShowToast(`Pass sent to student WhatsApp (${registeredPass.phoneNumber || registeredPass.contactNo})!`, 'success');
          setIsGeneratingImage(false);
          return;
        } catch (shareErr) {
          if (shareErr.name !== 'AbortError') {
            console.warn('Native share failed, falling back to download + WhatsApp link', shareErr);
          }
        }
      }

      // 1. First attempt silent backend API dispatch
      try {
        const response = await fetch('/api/send-whatsapp-pass', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentPhone: studentPhone,
            studentName: registeredPass.name,
            ticketId: registeredPass.ticketId,
            message: messageText,
            passImageBase64: url
          })
        });
        const resData = await response.json();
        if (resData.success && resData.mode === 'DIRECT_WHATSAPP_WEB') {
          if (onShowToast) onShowToast(`✅ Pass delivered directly to student WhatsApp (+${studentPhone})!`, 'success');
          setIsGeneratingImage(false);
          return;
        }
      } catch (err) {
        console.warn('Direct backend dispatch notice:', err);
      }

      // 2. Direct Web.WhatsApp jump without intermediate prompt
      const whatsappDirectUrl = `https://web.whatsapp.com/send?phone=${studentPhone}&text=${encodeURIComponent(messageText)}`;
      window.open(whatsappDirectUrl, '_blank', 'noopener,noreferrer');

      // Auto download pass image so user can attach
      const link = document.createElement('a');
      link.href = url;
      link.download = `ShaktiDB_Student_Pass_${registeredPass.ticketId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (onShowToast) {
        onShowToast(`📥 Pass image downloaded! Dispatched to Student WhatsApp (+${studentPhone})`, 'info');
      }
    } catch (err) {
      console.error('WhatsApp share error', err);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Send a copy to Organizer (+91 96779 65133)
  const handleSendToOrganizerWhatsApp = async () => {
    if (!registeredPass) return;
    const messageText = `📋 *NEW REGISTRATION COPY (FOR ORGANIZER)*
👤 Student: ${registeredPass.name}
🎟️ Pass ID: ${registeredPass.ticketId}
📞 Student Mobile: ${registeredPass.phoneNumber || registeredPass.contactNo}
📧 Email: ${registeredPass.email}
🏛️ College: ${registeredPass.college}
🎯 Track: ${registeredPass.interest}`;
    const whatsappUrl = `https://wa.me/${ORGANIZER_WHATSAPP}?text=${encodeURIComponent(messageText)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  // SQL Demo queries
  const demoQueries = {
    wal: {
      title: "1. Hardware Enclave & WAL Speed",
      sql: `-- ShaktiDB Sovereign Cryptographic Engine Query
EXPLAIN ANALYZE 
SELECT txn_id, shard_id, pg_shakti_hardware_attest(enclave_hash)
FROM sovereign_nodes 
WHERE cluster_mode = 'IITM_RISCV_SOVEREIGN'
ORDER BY execution_latency_ns ASC LIMIT 5;`,
      result: `QUERY PLAN:
Limit (cost=0.00..0.42 rows=5) (actual time=0.021..0.076 rows=5 loops=1)
  -> Index Scan on sovereign_nodes
     Hardware Enclave: Level-4 RISC-V Attestation [PASSED]
     Dilithium Post-Quantum Key: VALID
Execution Time: 0.128 ms (10.4x faster than vanilla Postgres)`
    },
    vector: {
      title: "2. Native Vector AI Search",
      sql: `-- Querying 1.5M Research Embeddings inside PostgreSQL Kernel
SELECT paper_id, title, 1 - (embedding <=> shakti_embed('IIT Madras Database')) AS score
FROM iitm_research_papers
ORDER BY embedding <=> shakti_embed('IIT Madras Database') LIMIT 3;`,
      result: ` paper_id |                   title                   | score 
----------+-------------------------------------------+-------
   7801   | High-Throughput RISC-V Database Engine   | 0.984
   9412   | Post-Quantum Cryptography in PostgreSQL  | 0.961
   4420   | Hardware-Accelerated Vector Storage       | 0.938
Execution Time: 0.84 ms`
    }
  };

  const handleRunDemoQuery = (key) => {
    setSelectedDemoQuery(key);
    setIsRunningQuery(true);
    setTimeout(() => {
      setQueryOutput(demoQueries[key].result);
      setIsRunningQuery(false);
    }, 350);
  };

  useEffect(() => {
    setQueryOutput(demoQueries.wal.result);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const faqs = [
    {
      q: "Who can attend this workshop?",
      a: "Open to all college students, developers, and researchers. Zero prior database internals experience is needed!"
    },
    {
      q: "Is registration free?",
      a: "Yes! 100% Free and fully sponsored by IIT Madras Pravartak & ShaktiDB."
    },
    {
      q: "Will I get a verified Certificate?",
      a: "Yes! Every participant receives an official verified Certificate of Excellence signed by IIT Madras Pravartak."
    },
    {
      q: "How will the student receive the ticket pass?",
      a: "Upon registration, the official digital ticket pass is generated with live QR code and dispatched directly to the student's WhatsApp number from our Admissions Desk (+91 96779 65133)."
    }
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#030712] text-slate-100' : 'bg-slate-50 text-slate-900'} selection:bg-emerald-500 selection:text-black font-sans relative overflow-x-hidden transition-colors duration-200`}>
      
      {/* Background Subtle Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className={`absolute -top-40 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl ${theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-500/5'}`} />
        <div className={`absolute top-1/3 -right-40 w-[450px] h-[450px] rounded-full blur-3xl ${theme === 'dark' ? 'bg-indigo-500/10' : 'bg-indigo-500/5'}`} />
      </div>

      {/* Top Banner */}
      <aside aria-label="Announcement" className="relative z-50 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 dark:from-emerald-950 dark:via-slate-950 dark:to-indigo-950 text-white dark:text-emerald-300 text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2 shadow-sm">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white dark:bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white dark:bg-emerald-500"></span>
        </span>
        <span>
          <strong>SHAKTIDB™ STUDENT MASTERCLASS 2026:</strong> Free Virtual Workshop by IIT Madras Pravartak
        </span>
        <span className="inline-flex items-center gap-1 bg-white/20 dark:bg-emerald-500/20 text-white dark:text-emerald-300 px-2 py-0.5 rounded-full text-[11px] font-bold">
          <Flame className="w-3.5 h-3.5 text-amber-300 dark:text-amber-400" /> {seatsLeft} Free Seats Left
        </span>
      </aside>

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/90 dark:bg-[#030712]/90 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                  Shakti<span className="text-emerald-600 dark:text-emerald-400">DB</span>
                </h1>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                  Student Edition
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                IIT Madras • Forked from PostgreSQL
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <button onClick={() => scrollToSection('features')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Highlights
            </button>
            <button onClick={() => scrollToSection('curriculum')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Schedule
            </button>
            <button onClick={() => scrollToSection('terminal')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              SQL Engine
            </button>
            <button onClick={() => scrollToSection('faq')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              FAQ
            </button>
          </nav>

          {/* Action & Theme Toggle */}
          <div className="flex items-center gap-2.5">
            {/* WhatsApp Gateway Status / Link Button */}
            <button
              onClick={() => setIsQrModalOpen(true)}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border ${
                whatsappGatewayStatus === 'READY'
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
              }`}
              title="WhatsApp Automation Gateway Status"
            >
              <span className={`w-2 h-2 rounded-full ${whatsappGatewayStatus === 'READY' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
              <span className="hidden sm:inline">
                {whatsappGatewayStatus === 'READY' ? 'WhatsApp Gateway Active' : 'Link WhatsApp (+91 96779 65133)'}
              </span>
              <Smartphone className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            <button
              onClick={() => scrollToSection('register-form')}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <Ticket className="w-4 h-4" />
              <span>Free Pass</span>
            </button>
          </div>

        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-10 pb-16 md:pt-16 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Col */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                  <Sparkles className="w-3.5 h-3.5" /> 1-Day Student Masterclass
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30">
                  <Building2 className="w-3.5 h-3.5" /> IIT Madras Pravartak
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-slate-900 dark:text-white">
                Master Database Engine Internals with{' '}
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent">
                  ShaktiDB & PostgreSQL
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                A hands-on workshop to explore PostgreSQL query planners, storage engines, post-quantum crypto enclaves, and native vector AI search — designed for students.
              </p>

              {/* Event Metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mb-1" />
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Date</p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Sat, Mar 14</p>
                </div>
                <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mb-1" />
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Time</p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">10:00 AM IST</p>
                </div>
                <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <Tv className="w-4 h-4 text-purple-600 dark:text-purple-400 mb-1" />
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Mode</p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Live Virtual Lab</p>
                </div>
                <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <Award className="w-4 h-4 text-amber-600 dark:text-amber-400 mb-1" />
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Fee</p>
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">100% Free</p>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={() => scrollToSection('register-form')}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold text-sm shadow-lg shadow-emerald-600/25 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Register Free Pass</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={`https://wa.me/${ORGANIZER_WHATSAPP}?text=${encodeURIComponent('Hi ShaktiDB Team! I have questions regarding the upcoming student database workshop.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Admissions Desk WhatsApp</span>
                </a>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center lg:justify-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Pass auto-dispatched from Admissions (+91 96779 65133) to Student's WhatsApp</span>
              </p>
            </div>

            {/* Right Col: Simple Clean Countdown Card */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-xl space-y-5">
                
                <div className="text-center space-y-1 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-500/30">
                    <Clock className="w-3.5 h-3.5" /> Event Starts In
                  </span>

                  <div className="grid grid-cols-4 gap-2 pt-3">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                      <span className="block text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                        {String(timeLeft.days).padStart(2, '0')}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Days</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                      <span className="block text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                        {String(timeLeft.hours).padStart(2, '0')}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Hours</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                      <span className="block text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                        {String(timeLeft.minutes).padStart(2, '0')}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Mins</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                      <span className="block text-xl sm:text-2xl font-black text-cyan-600 dark:text-cyan-400 font-mono">
                        {String(timeLeft.seconds).padStart(2, '0')}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Secs</span>
                    </div>
                  </div>
                </div>

                {/* Quick Perks */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80">
                    <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Official IIT Madras Pravartak Certificate</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80">
                    <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">30-Day Free Cloud Sandbox Lab Credits</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80">
                    <Smartphone className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Instant Image Pass sent to Student WhatsApp</span>
                  </div>
                </div>

                <button
                  onClick={() => scrollToSection('register-form')}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20"
                >
                  <span>Claim Free Student Pass</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4 SIMPLIFIED PILLAR CARDS */}
      <section id="features" className="py-14 bg-slate-100/80 dark:bg-slate-950/60 border-y border-slate-200 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center space-y-1.5 max-w-xl mx-auto">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Workshop Highlights
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              What You Will Learn
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1 */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 shadow-sm hover:shadow-md transition-all">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                PostgreSQL Internals
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Query planners, cost models, buffer pools, and ACID Write-Ahead Logging (WAL).
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-500 shadow-sm hover:shadow-md transition-all">
              <div className="w-11 h-11 rounded-xl bg-sky-100 dark:bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-3">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                RISC-V Shakti Hardware
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                How IIT Madras customized storage kernels for indigenous Shakti microprocessors.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 shadow-sm hover:shadow-md transition-all">
              <div className="w-11 h-11 rounded-xl bg-purple-100 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                Native AI Vector Search
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Run fast LLM embeddings and similarity search inside SQL using <code className="text-purple-600 dark:text-purple-300 font-mono">pg_shaktivector</code>.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 shadow-sm hover:shadow-md transition-all">
              <div className="w-11 h-11 rounded-xl bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                Post-Quantum Security
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Hardware cryptographic enclaves with ML-KEM and Dilithium PQC key validation.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* SCHEDULE */}
      <section id="curriculum" className="py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Agenda
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Workshop Schedule
            </h2>
          </div>

          <div className="space-y-3">
            
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-400 text-xs font-bold shrink-0">
                  10:00 AM
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Session 1: PostgreSQL Engine Architecture</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Query lifecycle, cost-based optimizer, and buffer caching.</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">75 Mins</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-lg bg-sky-100 dark:bg-sky-500/15 text-sky-800 dark:text-sky-400 text-xs font-bold shrink-0">
                  11:30 AM
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Session 2: Why IIT Madras Forked Postgres</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Sovereign database tech, RISC-V hardware acceleration & security.</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">90 Mins</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-500/15 text-purple-800 dark:text-purple-400 text-xs font-bold shrink-0">
                  01:45 PM
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Session 3: Live Lab — Vector AI Search & Tuning</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Hands-on SQL indexing, pg_shaktivector embeddings, and EXPLAIN ANALYZE.</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">90 Mins</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-500/15 text-amber-800 dark:text-amber-400 text-xs font-bold shrink-0">
                  03:30 PM
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Session 4: Mini SQL Hackathon & Certificate Claim</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Live optimization contest, cash prizes & IIT Madras verified certificates.</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">60 Mins</span>
            </div>

          </div>
        </div>
      </section>

      {/* INTERACTIVE SQL TERMINAL */}
      <section id="terminal" className="py-14 bg-slate-100/80 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800/80 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
              Live Preview
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Try ShaktiDB Engine Queries
            </h2>
          </div>

          <div className="rounded-2xl bg-slate-950 border border-slate-800 shadow-xl overflow-hidden text-white">
            <div className="bg-slate-900 px-5 py-3 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-mono text-slate-400 ml-2">shaktidb-sandbox (v17.4)</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleRunDemoQuery('wal')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedDemoQuery === 'wal' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  WAL Cryptography
                </button>
                <button
                  onClick={() => handleRunDemoQuery('vector')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedDemoQuery === 'vector' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  Native AI Vector
                </button>
              </div>
            </div>

            <div className="p-5 font-mono text-xs space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-900/80 text-emerald-300 whitespace-pre-wrap leading-relaxed">
                {demoQueries[selectedDemoQuery].sql}
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => handleRunDemoQuery(selectedDemoQuery)}
                  disabled={isRunningQuery}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{isRunningQuery ? 'Running...' : 'Execute Query'}</span>
                </button>
                <span className="text-[11px] text-slate-400">⚡ 0.128 ms hardware latency</span>
              </div>

              {queryOutput && (
                <pre className="p-3.5 rounded-xl bg-black/90 border border-emerald-500/20 text-emerald-400 text-xs overflow-x-auto">
                  {queryOutput}
                </pre>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* STUDENT REGISTRATION FORM */}
      <section id="register-form" className="py-16 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Form Left Details */}
            <div className="lg:col-span-5 space-y-4 text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                <Ticket className="w-3.5 h-3.5" /> Student Registration
              </span>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                Get Your Live Digital Workshop Pass
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Fill in your details below to generate your personalized mobile e-pass with live QR code, verified IIT Madras stamp, and automatic pass delivery to your WhatsApp.
              </p>

              {/* Notification Details Badge */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-300 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300">
                  <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Sender ➔ Receiver Routing</span>
                </div>
                <p className="text-[11px] text-slate-700 dark:text-slate-300">
                  <strong>From:</strong> Admissions Desk (<strong>+91 96779 65133</strong>)<br/>
                  <strong>To:</strong> Student's WhatsApp Number (Provided in form)
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Direct WhatsApp pass delivery to student</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Downloadable PNG image pass with live QR code</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Official Certificate of Completion</span>
                </div>
              </div>
            </div>

            {/* Form Right Card (Upgraded Ultra-Modern Form UI) */}
            <div className="lg:col-span-7">
              <div className="relative group">
                {/* Glow ring */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 opacity-20 blur-xl group-hover:opacity-30 transition-opacity" />

                <div className="relative rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-6">
                  
                  {/* Form Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
                          Direct Student Admission
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">100% Free Sponsored</span>
                      </div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">
                        Student Masterclass Registration
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Official Pass & QR Code will be dispatched directly to your WhatsApp
                      </p>
                    </div>

                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                      <Ticket className="w-6 h-6" />
                    </div>
                  </div>

                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    
                    {/* Section 1: Name & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Full Name */}
                      <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                          Student Full Name <span className="text-emerald-600 dark:text-emerald-400">*</span>
                        </label>
                        <div className="relative">
                          <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="e.g. Akilan K"
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm font-medium outline-none transition-all"
                          />
                        </div>
                      </div>

                      {/* Email Address */}
                      <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                          Email Address <span className="text-emerald-600 dark:text-emerald-400">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="student@college.edu"
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm font-medium outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Contact & WhatsApp Phone Number */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Contact No */}
                      <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                          Mobile / Contact No <span className="text-emerald-600 dark:text-emerald-400">*</span>
                        </label>
                        <div className="relative flex items-center">
                          <span className="absolute left-3 text-xs font-bold text-slate-500 dark:text-slate-400 pointer-events-none">
                            🇮🇳 +91
                          </span>
                          <input
                            type="tel"
                            name="contactNo"
                            required
                            maxLength={10}
                            value={formData.contactNo}
                            onChange={handleContactChange}
                            placeholder="98765 43210"
                            className="w-full pl-16 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm font-mono outline-none transition-all"
                          />
                        </div>
                      </div>

                      {/* WhatsApp Phone Number */}
                      <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                          <span>Student WhatsApp Number <span className="text-emerald-600 dark:text-emerald-400">*</span></span>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold lowercase">pass destination</span>
                        </label>
                        <div className="relative flex items-center">
                          <span className="absolute left-3 text-xs font-bold text-slate-500 dark:text-slate-400 pointer-events-none">
                            🇮🇳 +91
                          </span>
                          <input
                            type="tel"
                            name="phoneNumber"
                            required
                            maxLength={10}
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            placeholder="98765 43210"
                            className="w-full pl-16 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm font-mono outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 3: College & Year of Study */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* College Name */}
                      <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                          College / University Name
                        </label>
                        <div className="relative">
                          <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="text"
                            name="college"
                            value={formData.college}
                            onChange={handleInputChange}
                            placeholder="e.g. Anna University / IIT / NIT"
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm font-medium outline-none transition-all"
                          />
                        </div>
                      </div>

                      {/* Year of Study */}
                      <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                          Year of Study
                        </label>
                        <div className="relative">
                          <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <select
                            name="year"
                            value={formData.year}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 text-slate-900 dark:text-white text-xs sm:text-sm font-medium outline-none transition-all cursor-pointer"
                          >
                            <option value="1st Year B.Tech / B.E">1st Year B.Tech / B.E</option>
                            <option value="2nd Year B.Tech / B.E">2nd Year B.Tech / B.E</option>
                            <option value="3rd Year B.Tech / B.E">3rd Year B.Tech / B.E</option>
                            <option value="4th Year (Final Year)">4th Year (Final Year)</option>
                            <option value="Postgraduate / MCA / M.Tech">Postgraduate / MCA / M.Tech</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Section 4: Workshop Track */}
                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Selected Masterclass Track
                      </label>
                      <select
                        name="interest"
                        value={formData.interest}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 text-slate-900 dark:text-white text-xs sm:text-sm font-medium outline-none transition-all cursor-pointer"
                      >
                        <option value="PostgreSQL Internals & Query Engine">1. PostgreSQL Engine Internals (Query Planners & Buffer Caching)</option>
                        <option value="ShaktiDB RISC-V Hardware Acceleration">2. ShaktiDB RISC-V Hardware Enclaves & Cryptography</option>
                        <option value="AI Vector Databases (pg_shaktivector)">3. AI Vector Databases & RAG Pipelines (pg_shaktivector)</option>
                        <option value="Complete All-Access Masterclass Pass">4. All Tracks (Complete Full-Day Masterclass Pass)</option>
                      </select>
                    </div>

                    {/* Single-Click Submit Action (Direct Register & Send) */}
                    <div className="pt-3">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm sm:text-base shadow-xl shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Dispatching Pass to WhatsApp...</span>
                          </>
                        ) : (
                          <>
                            <MessageSquare className="w-5 h-5" />
                            <span>Register & Send Pass to WhatsApp</span>
                            <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-[11px] text-center text-slate-500 dark:text-slate-400">
                      ⚡ 1-Click Direct Registration: Your official ticket pass image and Zoom lab link are dispatched directly to your WhatsApp number.
                    </p>

                  </form>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* GENERATED DIGITAL STUDENT PASS — EXACT MOBILE TICKET FORMAT */}
      {registeredPass && (
        <section id="digital-pass-view" className="py-14 bg-slate-900/50 dark:bg-black/80 border-t border-emerald-500/40">
          <div className="max-w-xl mx-auto px-4 space-y-6">
            
            <div className="text-center space-y-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <Sparkles className="w-3.5 h-3.5" /> Pass Generated & Ready for Student Dispatch
              </span>
              <h2 className="text-2xl font-black text-white">
                Official Student Workshop Pass
              </h2>
              <p className="text-xs text-slate-300">
                Dispatched from Admissions Desk (<strong>+91 96779 65133</strong>) to Student WhatsApp (<strong>{registeredPass.phoneNumber || registeredPass.contactNo}</strong>)
              </p>
            </div>

            {/* Mobile Phone Mockup Pass (Exact design matching user image) */}
            <div className="relative mx-auto max-w-[380px] bg-white text-slate-900 rounded-[38px] p-5 shadow-2xl border-4 border-slate-800 overflow-hidden font-sans">
              
              {/* Phone Camera Notch */}
              <div className="w-28 h-4 bg-slate-900 rounded-b-xl mx-auto mb-3 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-700 ml-8" />
              </div>

              {/* Pass Header */}
              <div className="flex items-start justify-between">
                <div>
                  {/* LIVE pill badge */}
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-600 text-white mb-2 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    <span>LIVE</span>
                  </span>
                  
                  <h4 className="text-xs font-black tracking-tight text-slate-900 uppercase">
                    COMBO WORKSHOP PASS
                  </h4>
                  <p className="text-[11px] font-bold text-slate-600">
                    மாணவர் அனுமதி சீட்டு
                  </p>
                </div>

                {/* Round Official Stamp / Seal (Top Right) */}
                <div className="w-16 h-16 rounded-full border-2 border-slate-300 p-0.5 flex flex-col items-center justify-center text-[7px] font-black text-slate-500 text-center leading-tight shadow-inner">
                  <div className="w-full h-full rounded-full border border-dashed border-slate-300 flex flex-col items-center justify-center">
                    <span className="text-[8px] text-slate-700">IIT MADRAS</span>
                    <span className="text-emerald-700 text-[6px]">PRAVARTAK</span>
                    <span className="text-[6px]">SHAKTIDB</span>
                  </div>
                </div>
              </div>

              {/* Mint Green Gradient Validity Time Box */}
              <div className="mt-3 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-100 via-emerald-200/80 to-teal-100 border border-emerald-300/60 text-center space-y-1 shadow-sm">
                <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-emerald-900">
                  <span>Ticket is valid for workshop on</span>
                  <Info className="w-3 h-3 text-emerald-700" />
                </div>
                {/* Large Monospace Time Display */}
                <div className="text-3xl font-mono font-black text-emerald-950 tracking-wider">
                  10 : 00
                </div>
                <div className="text-[10px] text-emerald-800 font-semibold">
                  Sat, Mar 14, 2026 • Live Sync: {passLiveTime}
                </div>
              </div>

              {/* Big Scannable Center QR Code with live refresh icon */}
              <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center relative flex flex-col items-center justify-center">
                <div className="relative p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                  <QrCode className="w-48 h-48 text-slate-900" strokeWidth={1.4} />
                  
                  {/* Center Refresh Symbol inside QR */}
                  <div className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-white border-2 border-slate-900 shadow flex items-center justify-center text-emerald-600">
                    <RotateCw className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
                  </div>
                </div>
                <p className="text-[10px] font-mono text-slate-500 mt-2">
                  SCAN FOR INSTANT LAB VERIFICATION
                </p>
              </div>

              {/* Pass Route Bar */}
              <div className="mt-3.5 p-2.5 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Laptop className="w-4 h-4 text-amber-600" />
                  <span className="font-mono">{registeredPass.ticketId}</span>
                  <span className="text-slate-400">|</span>
                  <span className="text-[11px] text-slate-600">Student Pass</span>
                </div>
                <div className="font-black text-emerald-700 text-sm">
                  ₹ 0 Free
                </div>
              </div>

              {/* Route & Student info */}
              <div className="mt-3 space-y-1 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <span>👤 {registeredPass.name}</span>
                </div>
                <div className="text-[11px] text-slate-600 truncate">
                  🏛️ {registeredPass.college || 'Engineering College'} ({registeredPass.year})
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  📞 {registeredPass.phoneNumber || registeredPass.contactNo} • {registeredPass.email}
                </div>
                <div className="pt-1 text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                  <span>📍 Online Sandbox</span>
                  <span className="text-slate-400">➔</span>
                  <span>IIT Madras Cloud Cluster</span>
                </div>
              </div>

              {/* Bottom Validity Banner */}
              <div className="mt-4 pt-3 border-t border-dashed border-slate-300 text-center space-y-1">
                <p className="text-[10px] text-slate-500 uppercase font-semibold">
                  This ticket is also valid in
                </p>
                <p className="text-xs font-black text-slate-900 tracking-tight">
                  ONE OR ALL WORKSHOP SESSIONS & LABS
                </p>
                <p className="text-[9px] font-bold text-emerald-700">
                  INSTITUTE OF NATIONAL IMPORTANCE • IIT MADRAS
                </p>
              </div>

            </div>

            {/* Pass Actions: Send TO Student's WhatsApp & Image Download */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={handleSendToStudentWhatsApp}
                disabled={isGeneratingImage}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>
                  {isGeneratingImage
                    ? 'Preparing Pass...'
                    : `Send Pass to Student WhatsApp (${registeredPass.phoneNumber || registeredPass.contactNo})`}
                </span>
              </button>

              <button
                onClick={handleDownloadPassImage}
                disabled={isGeneratingImage}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Download Pass (PNG Image)</span>
              </button>
            </div>

            {/* Quick Organizer Copy button */}
            <div className="text-center pt-1">
              <button
                onClick={handleSendToOrganizerWhatsApp}
                className="text-xs text-slate-400 hover:text-emerald-400 underline transition-colors"
              >
                Send a registration log copy to Admissions (+91 96779 65133)
              </button>
            </div>

          </div>
        </section>
      )}

      {/* FAQ SECTION */}
      <section id="faq" className="py-14 bg-slate-100/80 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800/80 transition-colors">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              FAQ
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? -1 : index)}
                  className="w-full px-5 py-3.5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      activeFaq === index ? 'rotate-180 text-emerald-600 dark:text-emerald-400' : ''
                    }`}
                  />
                </button>

                {activeFaq === index && (
                  <div className="px-5 pb-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-2.5">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 ShaktiDB™ Initiative. Powered by IIT Madras Pravartak & PostgreSQL.</p>
          <p className="flex items-center gap-2">
            <span>Admissions Desk: <strong>+91 96779 65133</strong></span>
          </p>
        </div>
      </footer>

      {/* WHATSAPP AUTOMATION GATEWAY QR PAIRING MODAL */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white space-y-5">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black">WhatsApp Gateway Setup</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Admissions Number: +91 96779 65133</p>
                </div>
              </div>
              <button
                onClick={() => setIsQrModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Gateway Status Pill */}
            <div className={`p-3 rounded-2xl border flex items-center justify-between text-xs font-bold ${
              whatsappGatewayStatus === 'READY'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                : 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
            }`}>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${whatsappGatewayStatus === 'READY' ? 'bg-emerald-500' : 'bg-amber-500 animate-ping'}`} />
                <span>
                  {whatsappGatewayStatus === 'READY'
                    ? 'Gateway Status: Active & Linked'
                    : 'Gateway Status: QR Scan Required'}
                </span>
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/60 dark:bg-black/40">
                {whatsappGatewayStatus}
              </span>
            </div>

            {/* QR Code Container */}
            {whatsappGatewayStatus === 'READY' ? (
              <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="text-sm font-black text-emerald-900 dark:text-emerald-300">
                  WhatsApp Automation Ready!
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  All student workshop registrations will be dispatched automatically with Pass Images directly to student WhatsApp numbers from <strong>+91 96779 65133</strong>.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center">
                  {whatsappQrCode ? (
                    <img
                      src={whatsappQrCode}
                      alt="WhatsApp Web QR Code"
                      className="w-52 h-52 rounded-xl shadow border-4 border-white dark:border-slate-800"
                    />
                  ) : (
                    <div className="w-52 h-52 flex flex-col items-center justify-center gap-2 text-xs text-slate-400">
                      <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                      <span>Loading QR Code...</span>
                    </div>
                  )}
                  <p className="text-[10px] text-slate-400 font-mono mt-2">
                    SCAN WITH WHATSAPP ON +91 96779 65133
                  </p>
                </div>

                {/* 3 Step Instructions */}
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
                    <span>Open <strong>WhatsApp</strong> on your phone (<strong>+91 96779 65133</strong>).</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
                    <span>Tap <strong>Menu (3 dots)</strong> or <strong>Settings</strong> ➔ <strong>Linked Devices</strong> ➔ <strong>Link a Device</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
                    <span>Point your camera at this QR code to link. Once linked, direct background delivery is active!</span>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-2">
              <button
                onClick={() => setIsQrModalOpen(false)}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs transition-all"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
