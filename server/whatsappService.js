import express from 'express';
import cors from 'cors';
import qrcode from 'qrcode';
import os from 'os';
import path from 'path';
import pino from 'pino';
import makeWASocketPkg, {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion
} from '@whiskeysockets/baileys';

const makeWASocket = makeWASocketPkg.default || makeWASocketPkg;

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));

// Health Check
app.get('/', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'ShaktiDB Admissions WhatsApp Gateway (Pure WebSocket Engine - 35MB RAM)',
    engine: 'Baileys Multi-Device',
    timestamp: new Date().toISOString()
  });
});

let sock = null;
let isClientReady = false;
let currentQrCodeDataUrl = null;
let lastStatus = 'INITIALIZING';
let lastError = null;

const AUTH_DIR = path.join(os.tmpdir(), 'shaktidb_baileys_auth');

async function startWhatsApp() {
  try {
    lastStatus = 'CONNECTING';
    lastError = null;

    const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
    const { version, isLatest } = await fetchLatestBaileysVersion().catch(() => ({ version: [2, 3000, 1015901307], isLatest: true }));

    console.log(`🚀 Starting Pure WebSocket WhatsApp Engine (v${version.join('.')}, isLatest: ${isLatest})...`);

    sock = makeWASocket({
      version,
      auth: state,
      logger: pino({ level: 'silent' }),
      printQRInTerminal: true,
      browser: ['ShaktiDB Admissions', 'Desktop', '1.0.0'],
      syncFullHistory: false,
      markOnlineOnConnect: true,
      generateHighQualityLinkPreview: false
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        lastStatus = 'QR_REQUIRED';
        lastError = null;
        console.log('📱 WhatsApp Web QR Code generated for Admissions (+91 96779 65133).');
        try {
          currentQrCodeDataUrl = await qrcode.toDataURL(qr);
        } catch (qrErr) {
          console.error('QR toDataURL error:', qrErr);
        }
      }

      if (connection === 'close') {
        isClientReady = false;
        const statusCode = (lastDisconnect?.error)?.output?.statusCode;
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

        console.log(`⚠️ Connection closed (Status: ${statusCode}). Reconnect: ${shouldReconnect}`);
        lastStatus = shouldReconnect ? 'RECONNECTING' : 'LOGGED_OUT';
        lastError = lastDisconnect?.error?.message || null;

        if (shouldReconnect) {
          setTimeout(startWhatsApp, 3000);
        }
      } else if (connection === 'open') {
        isClientReady = true;
        lastStatus = 'READY';
        lastError = null;
        currentQrCodeDataUrl = null;
        console.log('🎉 WhatsApp Client is READY! Linked to Admissions Desk (+91 96779 65133)');
      }
    });

  } catch (err) {
    lastStatus = 'INIT_ERROR';
    lastError = err.message;
    console.error('❌ WhatsApp WebSocket init error:', err);
  }
}

// Start Client
startWhatsApp();

// Status Endpoint
app.get('/api/whatsapp-status', (req, res) => {
  res.json({
    ready: isClientReady,
    status: lastStatus,
    error: lastError,
    qrCode: currentQrCodeDataUrl,
    organizerNumber: '919677965133',
    engine: 'Baileys Pure Socket (Ultra-Low 35MB Memory)',
    timestamp: new Date().toISOString()
  });
});

// Restart Endpoint
app.post('/api/restart-whatsapp', async (req, res) => {
  try {
    if (sock) {
      try {
        sock.end(undefined);
      } catch (e) {}
    }
    isClientReady = false;
    currentQrCodeDataUrl = null;
    startWhatsApp();
    res.json({ success: true, message: 'WhatsApp WebSocket daemon restarting for fresh QR' });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Direct Automated Dispatch Endpoint (1 Single Message with Pass Attachment & Text Caption)
app.post('/api/send-whatsapp-pass', async (req, res) => {
  const { studentPhone, studentName, ticketId, message, passImageBase64 } = req.body;

  if (!studentPhone) {
    return res.status(400).json({ success: false, error: 'Student phone number is required' });
  }

  let cleanPhone = String(studentPhone).replace(/\D/g, '');
  if (cleanPhone.length === 10) cleanPhone = `91${cleanPhone}`;
  if (cleanPhone.startsWith('0') && cleanPhone.length === 11) cleanPhone = `91${cleanPhone.substring(1)}`;

  const recipientJid = `${cleanPhone}@s.whatsapp.net`;
  console.log(`\n📤 [DIRECT DISPATCH] Sending pass to ${studentName} (${cleanPhone}) via pure WebSocket...`);

  if (isClientReady && sock) {
    try {
      if (passImageBase64) {
        // Strip data prefix if present
        const base64Data = passImageBase64.replace(/^data:image\/\w+;base64,/, '');
        const imageBuffer = Buffer.from(base64Data, 'base64');

        // Send 1 single message: Image + Text Caption
        await sock.sendMessage(recipientJid, {
          image: imageBuffer,
          caption: message || `🎓 *ShaktiDB Student Workshop Pass*\nTicket ID: ${ticketId}`
        });

        console.log(`🖼️ Pass image with caption delivered as 1 single message to ${cleanPhone}!`);
      } else {
        await sock.sendMessage(recipientJid, {
          text: message || `🎓 Your ShaktiDB Student Workshop Pass: ${ticketId}`
        });
        console.log(`✅ Text message delivered to ${cleanPhone}!`);
      }

      console.log(`🎉 [DISPATCH SUCCESS] Pass sent directly to ${cleanPhone}!`);
      return res.json({
        success: true,
        mode: 'DIRECT_BAILEYS_SOCKET',
        recipient: cleanPhone,
        message: 'Pass delivered directly to student WhatsApp in 1 single message!'
      });
    } catch (err) {
      console.error('❌ WhatsApp send error:', err.message);
      return res.status(500).json({
        success: false,
        mode: 'ERROR',
        error: err.message,
        recipient: cleanPhone
      });
    }
  } else {
    console.warn(`⚠️ WhatsApp Client not ready (Status: ${lastStatus}).`);
    return res.json({
      success: false,
      mode: 'NOT_LINKED',
      status: lastStatus,
      recipient: cleanPhone,
      message: 'WhatsApp Gateway is not linked yet. Please scan the QR code at /whatsapp.'
    });
  }
});

// Process crash prevention
process.on('uncaughtException', (err) => {
  console.warn('Uncaught exception handled gracefully in WhatsApp service:', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.warn('Unhandled rejection handled gracefully in WhatsApp service:', reason);
});

app.listen(PORT, () => {
  console.log(`⚡ ShaktiDB WhatsApp Automation Server running on http://localhost:${PORT}`);
});
