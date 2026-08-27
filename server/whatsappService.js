import express from 'express';
import cors from 'cors';
import qrcode from 'qrcode';
import os from 'os';
import path from 'path';
import pkg from 'whatsapp-web.js';
const { Client, LocalAuth, MessageMedia } = pkg;

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));

// Root health check for Render.com
app.get('/', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'ShaktiDB Admissions WhatsApp Gateway',
    timestamp: new Date().toISOString()
  });
});

let isClientReady = false;
let currentQrCodeDataUrl = null;
let lastStatus = 'INITIALIZING';
let client = null;
let lastError = null;

function createWhatsAppClient() {
  try {
    lastStatus = 'LAUNCHING_BROWSER';
    client = new Client({
      authStrategy: new LocalAuth({
        dataPath: path.join(os.tmpdir(), 'shaktidb_wwebjs_auth')
      }),
      webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-js/main/dist/wppconnect-wa.js'
      },
      puppeteer: {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu',
          '--disable-extensions'
        ]
      }
    });

    client.on('qr', async (qr) => {
      lastStatus = 'QR_REQUIRED';
      lastError = null;
      console.log('📱 WhatsApp Web QR Code generated for +91 96779 65133.');
      try {
        currentQrCodeDataUrl = await qrcode.toDataURL(qr);
      } catch (err) {
        console.error('Failed to generate QR data URL', err);
      }
    });

    client.on('ready', () => {
      isClientReady = true;
      lastStatus = 'READY';
      lastError = null;
      currentQrCodeDataUrl = null;
      console.log('🚀 WhatsApp Web Client is READY! Linked to Admissions Desk (+91 96779 65133)');
    });

    client.on('authenticated', () => {
      lastStatus = 'AUTHENTICATED';
      console.log('🔒 WhatsApp Client Authenticated.');
    });

    client.on('auth_failure', (msg) => {
      isClientReady = false;
      lastStatus = 'AUTH_FAILURE';
      lastError = String(msg);
      console.error('❌ WhatsApp Auth failure:', msg);
    });

    client.on('disconnected', (reason) => {
      isClientReady = false;
      lastStatus = 'DISCONNECTED';
      lastError = String(reason);
      console.warn('⚠️ WhatsApp client disconnected:', reason);
    });

    client.initialize().catch((err) => {
      lastStatus = 'INIT_ERROR';
      lastError = err.message;
      console.error('⚠️ WhatsApp Web client background init error:', err);
    });
  } catch (err) {
    lastStatus = 'FATAL_ERROR';
    lastError = err.message;
    console.error('WhatsApp client creation error:', err);
  }
}

// Start Client Safely
createWhatsAppClient();

// Status Endpoint
app.get('/api/whatsapp-status', (req, res) => {
  res.json({
    ready: isClientReady,
    status: lastStatus,
    error: lastError,
    qrCode: currentQrCodeDataUrl,
    organizerNumber: '919677965133',
    timestamp: new Date().toISOString()
  });
});

// Direct Automated Dispatch Endpoint
app.post('/api/send-whatsapp-pass', async (req, res) => {
  const { studentPhone, studentName, ticketId, message, passImageBase64 } = req.body;

  if (!studentPhone) {
    return res.status(400).json({ success: false, error: 'Student phone number is required' });
  }

  let cleanPhone = String(studentPhone).replace(/\D/g, '');
  if (cleanPhone.length === 10) cleanPhone = `91${cleanPhone}`;
  if (cleanPhone.startsWith('0') && cleanPhone.length === 11) cleanPhone = `91${cleanPhone.substring(1)}`;

  console.log(`\n📤 [DIRECT DISPATCH] Sending pass directly to Student: ${studentName} (${cleanPhone}) from +91 96779 65133...`);

  if (isClientReady && client) {
    try {
      // 1. Resolve registered WhatsApp JID
      let recipientJid = `${cleanPhone}@c.us`;
      try {
        const numberId = await client.getNumberId(cleanPhone);
        if (numberId && numberId._serialized) {
          recipientJid = numberId._serialized;
        }
      } catch (numErr) {
        console.warn('Number lookup notice:', numErr.message);
      }

      console.log(`🎯 Routing to WhatsApp JID: ${recipientJid}`);

      // Send ONLY 1 Single Message (Directly attach pass image with full message caption)
      if (passImageBase64) {
        try {
          const base64Data = passImageBase64.replace(/^data:image\/\w+;base64,/, '');
          const media = new MessageMedia('image/png', base64Data, `ShaktiDB_Student_Pass_${ticketId}.png`);
          await client.sendMessage(recipientJid, media, {
            caption: message
          });
          console.log(`🖼️ Pass image with caption delivered as 1 single message to ${cleanPhone}!`);
        } catch (imgErr) {
          console.warn('Image send error, falling back to text:', imgErr.message);
          await client.sendMessage(recipientJid, message);
        }
      } else {
        const sendResult = await client.sendMessage(recipientJid, message);
        console.log(`✅ Text message delivered to ${cleanPhone}! (ID: ${sendResult?.id?._serialized || 'OK'})`);
      }

      console.log(`🎉 [DISPATCH SUCCESS] Pass sent directly to ${cleanPhone}!`);
      return res.json({
        success: true,
        mode: 'DIRECT_WHATSAPP_WEB',
        recipient: cleanPhone,
        message: 'Pass delivered directly to student WhatsApp without any user prompt!'
      });
    } catch (err) {
      console.error('❌ WhatsApp direct send error:', err.message);
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
      message: 'WhatsApp Gateway is not linked yet. Please scan the QR code to link +91 96779 65133.'
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
