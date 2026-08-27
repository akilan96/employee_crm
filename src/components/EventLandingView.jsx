import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { API_ENDPOINTS } from '../utils/apiConfig';
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
  Laptop,
  Heart
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
  const [passQrUrl, setPassQrUrl] = useState(null);

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
        const res = await fetch(API_ENDPOINTS.status);
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

  // Generate High-Definition Compact Mobile Pass Canvas (1120x1680 HD 2x DPI)
  const generateTicketCanvasImage = (passData) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      const logicalWidth = 560;
      const logicalHeight = 840;
      const scale = 2; // 2x Ultra-HD Retina Pixel Density (1120 x 1680)

      canvas.width = logicalWidth * scale;
      canvas.height = logicalHeight * scale;

      ctx.scale(scale, scale);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      const width = logicalWidth;
      const height = logicalHeight;

      // 1. Crisp White Card Background with Subtle Border
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(0, 0, width, height, 28);
      ctx.fill();

      // Outer Border
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 2. Left & Right Vertical Watermark Tracks: "• STUDENT PASS •"
      ctx.fillStyle = '#cbd5e1';
      ctx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
      
      // Left vertical track
      ctx.save();
      ctx.translate(16, height - 120);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('•  STUDENT PASS  •  STUDENT PASS  •  STUDENT PASS  •  STUDENT PASS  •  STUDENT PASS  •', 0, 0);
      ctx.restore();

      // Right vertical track
      ctx.save();
      ctx.translate(width - 10, height - 120);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('•  STUDENT PASS  •  STUDENT PASS  •  STUDENT PASS  •  STUDENT PASS  •  STUDENT PASS  •', 0, 0);
      ctx.restore();

      // Side Dotted Lines
      ctx.strokeStyle = '#e2e8f0';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(28, 20);
      ctx.lineTo(28, height - 20);
      ctx.moveTo(width - 28, 20);
      ctx.lineTo(width - 28, height - 20);
      ctx.stroke();
      ctx.setLineDash([]); // Reset line dash

      // 3. Top Left Close Button (✕)
      ctx.fillStyle = '#f1f5f9';
      ctx.beginPath();
      ctx.arc(52, 46, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#475569';
      ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✕', 52, 50);

      // 4. IIT Madras Seal & Brand Header
      const sealX = 105;
      const sealY = 46;
      // Red seal circle
      ctx.fillStyle = '#991b1b';
      ctx.beginPath();
      ctx.arc(sealX, sealY, 18, 0, Math.PI * 2);
      ctx.fill();
      // Inner gold ring
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(sealX, sealY, 15, 0, Math.PI * 2);
      ctx.stroke();
      // Center lamp flame
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('🪔', sealX, sealY + 4);

      // IIT Madras Text
      ctx.textAlign = 'left';
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('IIT Madras', sealX + 26, sealY - 1);
      ctx.fillStyle = '#64748b';
      ctx.font = '9px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Pravartak Technologies Foundation', sealX + 26, sealY + 12);

      // 5. Top Right Holographic Official Student Pass Seal
      const holoX = width - 68;
      const holoY = 46;
      const holoGrad = ctx.createLinearGradient(holoX - 22, holoY - 22, holoX + 22, holoY + 22);
      holoGrad.addColorStop(0, '#bae6fd');
      holoGrad.addColorStop(0.35, '#a7f3d0');
      holoGrad.addColorStop(0.7, '#fbcfe8');
      holoGrad.addColorStop(1, '#fde68a');

      ctx.fillStyle = holoGrad;
      ctx.beginPath();
      ctx.arc(holoX, holoY, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Center Graduation Cap Icon
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🎓', holoX, holoY + 5);

      // 6. Main Title: ShaktiDB Workshop
      ctx.textAlign = 'center';
      ctx.fillStyle = '#064e3b';
      ctx.font = '900 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('ShaktiDB Workshop', width / 2, 108);

      ctx.fillStyle = '#475569';
      ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Powered by IIT Madras & ', width / 2 - 28, 128);
      ctx.fillStyle = '#15803d';
      ctx.fillText('ShaktiDB', width / 2 + 54, 128);

      // 7. Student Metadata Row
      const metaY = 154;
      ctx.fillStyle = '#334155';
      ctx.font = 'bold 10.5px "Plus Jakarta Sans", sans-serif';
      const studentNameDisplay = (passData.name || 'Student').length > 14 ? `${passData.name.slice(0, 14)}...` : passData.name;
      ctx.fillText(`📅 28/08/2026   |   👤 ${studentNameDisplay}   |   🆔 ${passData.ticketId.slice(0, 10)} 📋`, width / 2, metaY);

      // 8. Mint-Green Countdown Box: "This pass is valid for 05 : 45 : 03"
      const mintBoxY = 176;
      const mintBoxW = width - 96;
      const mintBoxH = 72;
      const mintBoxX = 48;

      const mintGrad = ctx.createLinearGradient(mintBoxX, mintBoxY, mintBoxX + mintBoxW, mintBoxY + mintBoxH);
      mintGrad.addColorStop(0, '#ecfdf5');
      mintGrad.addColorStop(1, '#e6f4ea');
      ctx.fillStyle = mintGrad;
      ctx.strokeStyle = '#a7f3d0';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(mintBoxX, mintBoxY, mintBoxW, mintBoxH, 16);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#166534';
      ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('This pass is valid for', width / 2, mintBoxY + 22);

      // Digital 7-Segment Monospace Clock Font
      ctx.fillStyle = '#064e3b';
      ctx.font = '900 32px "JetBrains Mono", monospace';
      ctx.fillText('05 : 45 : 03', width / 2, mintBoxY + 56);

      // 9. Real High-Density Scannable QR Code Frame
      const qrSize = 210;
      const qrX = (width - qrSize) / 2;
      const qrY = 264;

      const qrPayload = `https://shaktidb.iitm.ac.in/verify?ticket=${passData.ticketId}&student=${encodeURIComponent(passData.name)}&seat=WS13`;

      try {
        const qrMatrix = QRCode.create(qrPayload, { errorCorrectionLevel: 'M' });
        const moduleCount = qrMatrix.modules.size;
        const cellSize = qrSize / moduleCount;

        // Draw Matrix Modules
        for (let r = 0; r < moduleCount; r++) {
          for (let c = 0; c < moduleCount; c++) {
            const isFinder = (r < 8 && c < 8) || (r < 8 && c >= moduleCount - 8) || (r >= moduleCount - 8 && c < 8);
            const isCenterArea = r >= Math.floor(moduleCount / 2) - 3 && r <= Math.floor(moduleCount / 2) + 3 && c >= Math.floor(moduleCount / 2) - 3 && c <= Math.floor(moduleCount / 2) + 3;

            if (!isFinder && !isCenterArea && qrMatrix.modules.get(r, c)) {
              ctx.fillStyle = '#064e3b';
              ctx.beginPath();
              ctx.roundRect(qrX + c * cellSize + 0.5, qrY + r * cellSize + 0.5, cellSize - 1, cellSize - 1, 1.5);
              ctx.fill();
            }
          }
        }

        // Custom High-Tech Stylized Finder Eyes in 3 Corners
        const drawCyberEye = (fx, fy) => {
          const eyeSize = 7 * cellSize;
          ctx.fillStyle = '#064e3b';
          ctx.beginPath();
          ctx.roundRect(fx, fy, eyeSize, eyeSize, 8);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.roundRect(fx + cellSize, fy + cellSize, eyeSize - 2 * cellSize, eyeSize - 2 * cellSize, 5);
          ctx.fill();
          ctx.fillStyle = '#047857';
          ctx.beginPath();
          ctx.roundRect(fx + 2 * cellSize, fy + 2 * cellSize, eyeSize - 4 * cellSize, eyeSize - 4 * cellSize, 3);
          ctx.fill();
        };

        drawCyberEye(qrX, qrY);
        drawCyberEye(qrX + (moduleCount - 7) * cellSize, qrY);
        drawCyberEye(qrX, qrY + (moduleCount - 7) * cellSize);

      } catch (qrErr) {
        console.warn('Canvas QR render notice:', qrErr);
      }

      // Center Rainbow Hologram Emblem inside QR
      const qrCenterX = qrX + qrSize / 2;
      const qrCenterY = qrY + qrSize / 2;
      
      const badgeGrad = ctx.createLinearGradient(qrCenterX - 20, qrCenterY - 20, qrCenterX + 20, qrCenterY + 20);
      badgeGrad.addColorStop(0, '#38bdf8');
      badgeGrad.addColorStop(0.5, '#4ade80');
      badgeGrad.addColorStop(1, '#f43f5e');

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(qrCenterX, qrCenterY, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = badgeGrad;
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = '#064e3b';
      ctx.font = '900 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⚡', qrCenterX, qrCenterY + 5);
      ctx.textAlign = 'left';

      // 10. Bottom Workshop Card Container (WS- 13 & Illustration + Dark Green Banner)
      const cardX = 48;
      const cardY = 490;
      const cardW = width - 96;
      const cardH = 150;

      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, 20);
      ctx.fill();
      ctx.stroke();

      // Top-Left Pill Badge: 🎓 Student Pass
      ctx.fillStyle = '#064e3b';
      ctx.beginPath();
      ctx.roundRect(cardX + 14, cardY + 12, 105, 24, 8);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🎓 Student Pass', cardX + 66, cardY + 28);

      // Large WS- 13 Text
      ctx.textAlign = 'left';
      ctx.fillStyle = '#475569';
      ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('WS-', cardX + 14, cardY + 66);
      ctx.fillStyle = '#0f172a';
      ctx.font = '900 30px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('13', cardX + 40, cardY + 70);

      // Right Classroom Illustration Drawing
      const illusX = cardX + cardW - 155;
      const illusY = cardY + 10;

      // Whiteboard with ShaktiDB Logo
      ctx.fillStyle = '#f8fafc';
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.strokeRect(illusX + 50, illusY + 4, 70, 42);
      ctx.fillStyle = '#064e3b';
      ctx.font = 'bold 8.5px sans-serif';
      ctx.fillText('⚡ ShaktiDB', illusX + 56, illusY + 28);

      // Instructor Figure
      ctx.fillStyle = '#064e3b';
      ctx.beginPath();
      ctx.arc(illusX + 38, illusY + 16, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(illusX + 33, illusY + 23, 10, 22);
      ctx.strokeStyle = '#064e3b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(illusX + 43, illusY + 26);
      ctx.lineTo(illusX + 54, illusY + 20);
      ctx.stroke();

      // 4 Seated Students
      const studentColors = ['#0f766e', '#15803d', '#047857', '#065f46'];
      for (let s = 0; s < 4; s++) {
        const sx = illusX + s * 22 + 10;
        const sy = illusY + 50;
        ctx.fillStyle = studentColors[s];
        ctx.beginPath();
        ctx.arc(sx, sy, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(sx - 3.5, sy + 5.5, 7, 11);
      }

      // Bottom Dark Emerald Banner inside Card: ✔ Official Student Pass & SDB2504
      const bannerY = cardY + cardH - 60;
      const bannerH = 60;
      ctx.fillStyle = '#064e3b';
      ctx.beginPath();
      ctx.roundRect(cardX, bannerY, cardW, bannerH, [0, 0, 20, 20]);
      ctx.fill();

      // Top Text in banner
      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 10.5px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('✔  Official Student Pass', cardX + 16, bannerY + 20);

      // Large White ID: SDB2504
      const passCode = `SDB${passData.ticketId.replace(/\D/g, '').slice(-4) || '2504'}`;
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 26px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(passCode, cardX + 16, bannerY + 47);

      // Right ShaktiDB Logo & Text in Banner
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 17px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('⚡ ShaktiDB', cardX + cardW - 16, bannerY + 40);
      ctx.textAlign = 'left';

      // 11. Organized by & Powered by Footer
      const footY = 665;
      ctx.textAlign = 'center';
      
      // Organized by IIT Madras
      ctx.fillStyle = '#64748b';
      ctx.font = '9.5px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Organized by', width / 2 - 80, footY);
      ctx.fillStyle = '#991b1b';
      ctx.fillText('🪔', width / 2 - 110, footY + 18);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('IIT Madras', width / 2 - 70, footY + 18);

      // Vertical Divider
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(width / 2, footY - 4);
      ctx.lineTo(width / 2, footY + 22);
      ctx.stroke();

      // Powered by ShaktiDB
      ctx.fillStyle = '#64748b';
      ctx.font = '9.5px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Powered by', width / 2 + 80, footY);
      ctx.fillStyle = '#15803d';
      ctx.fillText('⚡', width / 2 + 48, footY + 18);
      ctx.fillStyle = '#064e3b';
      ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('ShaktiDB', width / 2 + 84, footY + 18);

      // 12. Bottom Disclaimer
      ctx.fillStyle = '#64748b';
      ctx.font = '9.5px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('ⓘ  Pass valid only for registered student on above ID', width / 2, 712);

      const dataUrl = canvas.toDataURL('image/png');
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          resolve({ blob, url, dataUrl });
        }
      }, 'image/png');
    });
  };

  // Submit Handler
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    const studentPhoneInput = (formData.phoneNumber || formData.contactNo || '').trim();
    if (!formData.name.trim() || !formData.email.trim() || !studentPhoneInput) {
      if (onShowToast) {
        onShowToast('Please fill in Name, Email and WhatsApp Number', 'warning');
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

      let generatedDataUrl = null;
      // Generate Image & QR
      try {
        const { blob, url, dataUrl } = await generateTicketCanvasImage(passData);
        setGeneratedImageUrl(url);
        generatedDataUrl = dataUrl;

        const qrData = await QRCode.toDataURL(`https://shaktidb.iitm.ac.in/verify?ticket=${ticketId}&student=${encodeURIComponent(passData.name)}`, {
          errorCorrectionLevel: 'H',
          margin: 1,
          color: {
            dark: '#064e3b',
            light: '#ffffff'
          }
        });
        setPassQrUrl(qrData);
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
          fetch(API_ENDPOINTS.sendPass, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              studentPhone: targetStudentPhone,
              studentName: passData.name,
              ticketId: passData.ticketId,
              message: studentMessage,
              passImageBase64: generatedDataUrl
            })
          })
            .then(res => res.json())
            .then(data => {
              console.log('⚡ Direct WhatsApp Dispatch result:', data);
              if (data.success) {
                if (onShowToast) {
                  onShowToast(`✅ Pass image & confirmation delivered directly to student (+${targetStudentPhone})!`, 'success');
                }
              } else {
                console.warn('Dispatch note:', data.message);
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
        const response = await fetch(API_ENDPOINTS.sendPass, {
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
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm sm:text-base shadow-xl shadow-emerald-600/25 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <Ticket className="w-5 h-5" />
                  <span>Register Free Pass</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center lg:justify-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Pass auto-dispatched directly to Student's WhatsApp</span>
              </p>
            </div>

            {/* Right Col: Ultra-Premium Redesigned Countdown & Quick Perks Card */}
            <div className="lg:col-span-5">
              <div className="relative group">
                
                {/* Ambient dynamic back glow */}
                <div className="absolute -inset-1 rounded-[32px] bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-300" />

                <div className="relative rounded-[28px] bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-2xl space-y-5 backdrop-blur-2xl">
                  
                  {/* Countdown Header */}
                  <div className="text-center space-y-3 pb-2 border-b border-slate-100 dark:border-slate-800/80">
                    
                    {/* Live Event Starts In Pill */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-sky-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <span>EVENT STARTS IN</span>
                    </div>

                    {/* High-Tech 4-Grid Digital Clock */}
                    <div className="grid grid-cols-4 gap-2.5">
                      <div className="p-3 rounded-2xl bg-slate-50/90 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800/80 text-center shadow-inner hover:border-emerald-500/40 transition-colors">
                        <span className="block text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono tracking-tight">
                          {String(timeLeft.days).padStart(2, '0')}
                        </span>
                        <span className="text-[9px] uppercase font-black tracking-wider text-slate-400 dark:text-slate-500">Days</span>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-50/90 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800/80 text-center shadow-inner hover:border-teal-500/40 transition-colors">
                        <span className="block text-2xl sm:text-3xl font-black text-teal-600 dark:text-teal-400 font-mono tracking-tight">
                          {String(timeLeft.hours).padStart(2, '0')}
                        </span>
                        <span className="text-[9px] uppercase font-black tracking-wider text-slate-400 dark:text-slate-500">Hours</span>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-50/90 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800/80 text-center shadow-inner hover:border-sky-500/40 transition-colors">
                        <span className="block text-2xl sm:text-3xl font-black text-sky-600 dark:text-sky-400 font-mono tracking-tight">
                          {String(timeLeft.minutes).padStart(2, '0')}
                        </span>
                        <span className="text-[9px] uppercase font-black tracking-wider text-slate-400 dark:text-slate-500">Mins</span>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-50/90 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800/80 text-center shadow-inner hover:border-indigo-500/40 transition-colors">
                        <span className="block text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 font-mono tracking-tight">
                          {String(timeLeft.seconds).padStart(2, '0')}
                        </span>
                        <span className="text-[9px] uppercase font-black tracking-wider text-slate-400 dark:text-slate-500">Secs</span>
                      </div>
                    </div>
                  </div>

                  {/* Redesigned Premium Bento Perks List */}
                  <div className="space-y-2.5">
                    
                    {/* Perk 1: Certificate */}
                    <div className="group/item flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800/70 hover:border-emerald-500/50 dark:hover:border-emerald-500/40 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-all duration-200 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-sm group-hover/item:scale-105 transition-transform">
                          <Award className="w-5 h-5" />
                        </div>
                        <div className="space-y-0.5">
                          <h5 className="font-extrabold text-xs sm:text-[13px] text-slate-900 dark:text-white tracking-tight leading-snug">
                            Official IIT Madras Pravartak Certificate
                          </h5>
                          <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                            Verified Signed Digital Credential
                          </p>
                        </div>
                      </div>
                      <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-[10px] font-black text-emerald-800 dark:text-emerald-300 uppercase">
                        Verified
                      </span>
                    </div>

                    {/* Perk 2: Cloud Sandbox */}
                    <div className="group/item flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800/70 hover:border-sky-500/50 dark:hover:border-sky-500/40 hover:bg-sky-50/40 dark:hover:bg-sky-950/20 transition-all duration-200 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-sky-500/10 dark:bg-sky-500/20 border border-sky-500/30 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 shadow-sm group-hover/item:scale-105 transition-transform">
                          <Cpu className="w-5 h-5" />
                        </div>
                        <div className="space-y-0.5">
                          <h5 className="font-extrabold text-xs sm:text-[13px] text-slate-900 dark:text-white tracking-tight leading-snug">
                            30-Day Free Cloud Sandbox Lab Credits
                          </h5>
                          <p className="text-[10px] font-bold text-sky-700 dark:text-sky-400">
                            Hands-on PostgreSQL RISC-V Cluster
                          </p>
                        </div>
                      </div>
                      <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md bg-sky-100 dark:bg-sky-950 text-[10px] font-black text-sky-800 dark:text-sky-300 uppercase">
                        30-Days
                      </span>
                    </div>

                    {/* Perk 3: WhatsApp Pass */}
                    <div className="group/item flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800/70 hover:border-purple-500/50 dark:hover:border-purple-500/40 hover:bg-purple-50/40 dark:hover:bg-purple-950/20 transition-all duration-200 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 border border-purple-500/30 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 shadow-sm group-hover/item:scale-105 transition-transform">
                          <Smartphone className="w-5 h-5" />
                        </div>
                        <div className="space-y-0.5">
                          <h5 className="font-extrabold text-xs sm:text-[13px] text-slate-900 dark:text-white tracking-tight leading-snug">
                            Instant Image Pass sent to Student WhatsApp
                          </h5>
                          <p className="text-[10px] font-bold text-purple-700 dark:text-purple-400">
                            High-Res e-Pass Dispatched Directly
                          </p>
                        </div>
                      </div>
                      <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-[10px] font-black text-purple-800 dark:text-purple-300 uppercase">
                        Instant
                      </span>
                    </div>

                  </div>

                  {/* Primary CTA Button */}
                  <div className="pt-2">
                    <button
                      onClick={() => scrollToSection('register-form')}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm sm:text-base shadow-xl shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Claim Free Student Pass</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <p className="text-[10px] text-center text-slate-400 dark:text-slate-500 mt-2 font-medium">
                      100% Free Sponsored • Direct WhatsApp Pass Attachment
                    </p>
                  </div>

                </div>
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

      {/* STUDENT REGISTRATION FORM (REDESIGNED ULTRA-MODERN CONSOLE) */}
      <section id="register-form" className="py-16 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Form Left Bento Details */}
            <div className="lg:col-span-5 space-y-5 text-center lg:text-left">
              
              {/* Active Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>ADMISSIONS 2026 ACTIVE • IIT MADRAS</span>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white leading-tight">
                  Join 2,500+ Students in Database Research
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Master PostgreSQL kernel internals, RISC-V hardware security enclaves, and native vector AI search in a 1-day immersive hands-on lab.
                </p>
              </div>

              {/* 3-Step Journey Timeline Card */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Your 3-Step Journey</span>
                </h4>

                <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-black flex items-center justify-center shrink-0 text-xs">
                      1
                    </div>
                    <div>
                      <strong className="text-slate-900 dark:text-white block font-bold">1-Click Registration</strong>
                      <span className="text-[11px] text-slate-500">Instant verification & track allocation</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-400 font-black flex items-center justify-center shrink-0 text-xs">
                      2
                    </div>
                    <div>
                      <strong className="text-slate-900 dark:text-white block font-bold">Direct WhatsApp e-Pass</strong>
                      <span className="text-[11px] text-slate-500">Official pass with QR code delivered to student number</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 font-black flex items-center justify-center shrink-0 text-xs">
                      3
                    </div>
                    <div>
                      <strong className="text-slate-900 dark:text-white block font-bold">IIT Madras Certification</strong>
                      <span className="text-[11px] text-slate-500">Live hands-on lab sandbox + verified certificate</span>
                    </div>
                  </div>
                </div>
              </div>



              {/* Seats Pill */}
              <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>Only <strong className="text-slate-900 dark:text-white">{seatsLeft} Free Seats</strong> remaining in this batch</span>
              </div>

            </div>

            {/* Form Right Card (Upgraded Ultra-Modern Form UI) */}
            <div className="lg:col-span-7">
              <div className="relative group">
                {/* Ambient glow */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 opacity-25 blur-2xl group-hover:opacity-35 transition-opacity" />

                <div className="relative rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-6">
                  
                  {/* Form Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
                          Student Admission Console
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">Sponsored by IIT Madras</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                        Student Masterclass Registration
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Official Pass & QR Code will be dispatched directly to your WhatsApp
                      </p>
                    </div>

                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 shadow-sm">
                      <Ticket className="w-6 h-6" />
                    </div>
                  </div>

                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    
                    {/* Section 1: Name & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Full Name */}
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
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
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                          College / Personal Email <span className="text-emerald-600 dark:text-emerald-400">*</span>
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

                    {/* Section 2: Student WhatsApp Phone Number */}
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                        <span>Student WhatsApp Number <span className="text-emerald-600 dark:text-emerald-400">*</span></span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold lowercase">Direct Pass Destination</span>
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
                          value={formData.phoneNumber || formData.contactNo}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setFormData(prev => ({ ...prev, phoneNumber: val, contactNo: val }));
                          }}
                          placeholder="98765 43210"
                          className="w-full pl-16 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm font-mono outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Section 3: College Name */}
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        College / Institute Name
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          name="college"
                          value={formData.college}
                          onChange={handleInputChange}
                          placeholder="e.g. Anna University / IIT Madras / NIT / PSG Tech"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm font-medium outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Section 4: Year / Professional Status (Interactive Pill Radio Selector) */}
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Year of Study / Status
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                        {['1st Year', '2nd Year', '3rd Year', 'Final Year', 'PG / MCA', 'Working Professional'].map((yr) => (
                          <button
                            type="button"
                            key={yr}
                            onClick={() => setFormData(prev => ({ ...prev, year: yr }))}
                            className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                              formData.year === yr
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                                : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-emerald-500/50'
                            }`}
                          >
                            {yr}
                          </button>
                        ))}
                      </div>
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
                            <Zap className="w-5 h-5" />
                            <span>Confirm Registration & Get WhatsApp Pass</span>
                            <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-[11px] text-center text-slate-500 dark:text-slate-400">
                      ⚡ 1-Click Direct Delivery: High-Res digital student pass and Zoom credentials dispatched directly to your WhatsApp.
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
                <Sparkles className="w-3.5 h-3.5" /> Pass Generated & Dispatched to Student
              </span>
              <h2 className="text-2xl font-black text-white">
                Official Student Workshop Pass
              </h2>
              <p className="text-xs text-slate-300">
                Dispatched directly to Student WhatsApp (<strong>{registeredPass.phoneNumber || registeredPass.contactNo}</strong>)
              </p>
            </div>

            {/* Mobile Phone Card Pass (Exact replica of new uploaded template) */}
            <div className="relative mx-auto max-w-[400px] bg-white text-slate-900 rounded-[36px] p-6 shadow-2xl border border-slate-200 overflow-hidden font-sans space-y-4">
              
              {/* Left and Right Watermark Vertical Borders */}
              <div className="absolute left-1.5 top-12 bottom-12 flex flex-col items-center justify-around pointer-events-none opacity-40 select-none">
                <span className="text-[8px] font-black text-slate-400 -rotate-90 tracking-widest uppercase">STUDENT PASS</span>
                <span className="text-[8px] font-black text-slate-400 -rotate-90 tracking-widest uppercase">STUDENT PASS</span>
                <span className="text-[8px] font-black text-slate-400 -rotate-90 tracking-widest uppercase">STUDENT PASS</span>
              </div>
              <div className="absolute right-1.5 top-12 bottom-12 flex flex-col items-center justify-around pointer-events-none opacity-40 select-none">
                <span className="text-[8px] font-black text-slate-400 rotate-90 tracking-widest uppercase">STUDENT PASS</span>
                <span className="text-[8px] font-black text-slate-400 rotate-90 tracking-widest uppercase">STUDENT PASS</span>
                <span className="text-[8px] font-black text-slate-400 rotate-90 tracking-widest uppercase">STUDENT PASS</span>
              </div>

              {/* Side dashed border lines */}
              <div className="absolute left-6 top-6 bottom-6 border-l border-dashed border-slate-200 pointer-events-none" />
              <div className="absolute right-6 top-6 bottom-6 border-r border-dashed border-slate-200 pointer-events-none" />

              {/* Top Header: Close Button + IIT Madras + Hologram Seal */}
              <div className="relative px-3 flex items-center justify-between">
                {/* Close ✕ */}
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-xs font-black shadow-inner">
                  ✕
                </div>

                {/* IIT Madras Emblem & Text */}
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-red-800 border border-amber-300 p-1 flex items-center justify-center text-amber-200 shadow-sm text-sm">
                    🪔
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 leading-tight">IIT Madras</h4>
                    <p className="text-[8px] text-slate-500 font-medium">Indian Institute of Technology</p>
                  </div>
                </div>

                {/* Hologram Official Pass Seal */}
                <div className="relative w-11 h-11 rounded-full bg-gradient-to-tr from-sky-200 via-emerald-200 via-pink-200 to-amber-200 p-0.5 shadow-sm flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-white/40 backdrop-blur-sm flex flex-col items-center justify-center text-emerald-800 font-black">
                    <span className="text-[6px] tracking-tighter uppercase font-bold text-emerald-700">OFFICIAL</span>
                    <span className="text-xs">🎓</span>
                  </div>
                </div>
              </div>

              {/* Main Heading: ShaktiDB Workshop */}
              <div className="text-center px-3 pt-1 space-y-0.5">
                <h3 className="text-xl font-black text-emerald-950 tracking-tight">
                  ShaktiDB Workshop
                </h3>
                <p className="text-[11px] text-slate-600 font-bold">
                  Powered by IIT Madras & <span className="text-emerald-700 font-extrabold">ShaktiDB</span>
                </p>
              </div>

              {/* Metadata Pill */}
              <div className="mx-3 py-1.5 px-3 rounded-full bg-slate-50 border border-slate-200 text-center text-[10px] font-bold text-slate-600 flex items-center justify-between">
                <span>📅 28/08/2026</span>
                <span className="text-slate-300">|</span>
                <span className="truncate max-w-[110px]">👤 {registeredPass.name}</span>
                <span className="text-slate-300">|</span>
                <span className="font-mono text-emerald-800">🆔 {registeredPass.ticketId.slice(0, 10)}</span>
              </div>

              {/* Mint Green Countdown Box */}
              <div className="mx-3 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 text-center space-y-0.5 shadow-sm">
                <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">
                  This pass is valid for
                </p>
                <div className="text-2xl sm:text-3xl font-mono font-black text-emerald-950 tracking-widest">
                  05 : 45 : 03
                </div>
              </div>

              {/* Centered High-Tech Scannable QR Code Frame */}
              <div className="mx-3 p-4 rounded-2xl bg-slate-50/90 border border-slate-200/90 shadow-sm flex flex-col items-center justify-center relative">
                
                {/* Cyber Corner HUD Brackets */}
                <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-emerald-600" />
                <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-emerald-600" />
                <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-emerald-600" />
                <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-emerald-600" />

                <div className="relative p-2 bg-white rounded-xl shadow-inner border border-slate-100 flex items-center justify-center">
                  {passQrUrl ? (
                    <img
                      src={passQrUrl}
                      alt="Student Pass QR Code"
                      className="w-44 h-44 object-contain rounded-lg"
                    />
                  ) : (
                    <QrCode className="w-44 h-44 text-slate-950" strokeWidth={1.4} />
                  )}
                  
                  {/* Center Badge with Rainbow Border and 1 / ⚡ */}
                  <div className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-white border-2 border-emerald-500 shadow-md flex items-center justify-center text-slate-900 font-black text-xs">
                    <span className="bg-gradient-to-r from-sky-500 via-emerald-500 to-pink-500 bg-clip-text text-transparent font-black">⚡</span>
                  </div>
                </div>

                <p className="text-[9px] font-mono font-bold text-slate-500 mt-2 tracking-wider">
                  256-BIT ENCRYPTED SOVEREIGN PASS
                </p>
              </div>

              {/* Workshop Card Container with WS- 13 & Classroom Graphic */}
              <div className="mx-3 rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
                {/* Upper row: WS- 13 & Classroom Graphic */}
                <div className="p-3 flex items-center justify-between">
                  <div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950 text-white text-[9px] font-bold">
                      🎓 Student Pass
                    </span>
                    <div className="mt-1.5 flex items-baseline gap-1">
                      <span className="text-xs font-bold text-slate-500">WS-</span>
                      <span className="text-2xl font-black text-slate-900">13</span>
                    </div>
                  </div>

                  {/* Classroom graphic simulation */}
                  <div className="w-32 h-12 bg-slate-50 rounded-xl border border-slate-200 p-1 flex items-center justify-between text-[8px] text-slate-500">
                    <div className="text-center font-bold text-emerald-900">
                      <span>⚡ ShaktiDB</span>
                      <div className="text-[7px] text-slate-400">Classroom Lab</div>
                    </div>
                    <div className="flex gap-0.5 text-emerald-800 text-xs">
                      👥
                    </div>
                  </div>
                </div>

                {/* Dark Emerald Bottom Banner with SDB2504 */}
                <div className="bg-[#064e3b] p-3 text-white flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-bold text-emerald-300 flex items-center gap-1">
                      ✔ Official Student Pass
                    </p>
                    <p className="text-lg font-black tracking-tight font-mono text-white">
                      SDB{registeredPass.ticketId.replace(/\D/g, '').slice(-4) || '2504'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black tracking-tight flex items-center gap-1">
                      ⚡ ShaktiDB
                    </span>
                  </div>
                </div>
              </div>

              {/* Partners Footer */}
              <div className="mx-3 pt-1 border-t border-slate-100 flex items-center justify-around text-[10px] text-slate-500">
                <div className="text-center">
                  <span className="text-[8px] text-slate-400 block">Organized by</span>
                  <strong className="text-slate-800">🪔 IIT Madras</strong>
                </div>
                <div className="h-6 w-px bg-slate-200" />
                <div className="text-center">
                  <span className="text-[8px] text-slate-400 block">Powered by</span>
                  <strong className="text-emerald-800">⚡ ShaktiDB</strong>
                </div>
              </div>

              {/* Disclaimer */}
              <p className="text-[9px] text-center text-slate-400 font-medium">
                ⓘ Pass valid only for registered student on above ID
              </p>

            </div>

            {/* Pass Actions: Image Download */}
            <div className="flex items-center justify-center pt-2">
              <button
                onClick={handleDownloadPassImage}
                disabled={isGeneratingImage}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-600/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-300" />
                <span>Download Pass (PNG Image)</span>
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
