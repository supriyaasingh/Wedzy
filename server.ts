import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// ==========================================
// WHATSAPP BUSINESS CLOUD API INTEGRATION
// ==========================================

const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || process.env.META_WHATSAPP_ACCESS_TOKEN || '';
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
const WHATSAPP_BUSINESS_ACCOUNT_ID = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '';
const WHATSAPP_WEBHOOK_VERIFY_TOKEN = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || 'weddingguest_meta_webhook_token';

// In-memory log of webhook delivery updates for quick status queries
const webhookDeliveryLogs: Record<string, { status: string; timestamp: string; recipientId: string }> = {};

/**
 * Check whether Meta WhatsApp Cloud API credentials are fully configured.
 * Never exposes the actual secret token.
 */
app.get('/api/whatsapp/config', (_req: Request, res: Response) => {
  const missingKeys: string[] = [];
  if (!WHATSAPP_ACCESS_TOKEN) missingKeys.push('WHATSAPP_ACCESS_TOKEN');
  if (!WHATSAPP_PHONE_NUMBER_ID) missingKeys.push('WHATSAPP_PHONE_NUMBER_ID');
  if (!WHATSAPP_BUSINESS_ACCOUNT_ID) missingKeys.push('WHATSAPP_BUSINESS_ACCOUNT_ID');

  res.json({
    configured: missingKeys.length === 0,
    missingKeys,
    phoneNumberId: WHATSAPP_PHONE_NUMBER_ID ? `${WHATSAPP_PHONE_NUMBER_ID.slice(0, 4)}...${WHATSAPP_PHONE_NUMBER_ID.slice(-4)}` : null,
    businessAccountId: WHATSAPP_BUSINESS_ACCOUNT_ID ? `${WHATSAPP_BUSINESS_ACCOUNT_ID.slice(0, 4)}...` : null,
    provider: 'Meta WhatsApp Cloud API v19.0',
    clickToChatFallbackAvailable: true,
  });
});

/**
 * Automated message sender using Meta WhatsApp Business Cloud API.
 * Accepts: { recipientPhone, templateName, templateLanguage, components, guestId, invitationId, weddingId }
 */
app.post('/api/whatsapp/send', async (req: Request, res: Response) => {
  try {
    const {
      recipientPhone,
      messageType = 'template',
      templateName,
      templateLanguage = 'en',
      bodyText,
      parameters,
      guestName,
      invitationUrl,
    } = req.body;

    // 1. Check if Meta API credentials exist
    if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
      return res.status(400).json({
        success: false,
        error: 'Meta WhatsApp Cloud API is not configured on this server. Please use Click-to-Chat or configure WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID.',
        configured: false,
      });
    }

    // 2. Clean phone number
    const cleanPhone = String(recipientPhone || '').replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10 || cleanPhone.length > 15) {
      return res.status(400).json({
        success: false,
        error: 'Invalid recipient phone number. Must be valid international format (digits only, e.g. 919876543210).',
      });
    }

    // 3. Construct Meta Cloud API payload
    let metaPayload: any;

    if (messageType === 'template' && templateName) {
      // Official Template Message
      metaPayload = {
        messaging_product: 'whatsapp',
        to: cleanPhone,
        type: 'template',
        template: {
          name: templateName,
          language: { code: templateLanguage },
          components: parameters
            ? [
                {
                  type: 'body',
                  parameters: parameters.map((val: string) => ({ type: 'text', text: val })),
                },
              ]
            : [],
        },
      };
    } else {
      // Freeform text message (for customer service windows / approved sandbox sessions)
      metaPayload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: cleanPhone,
        type: 'text',
        text: {
          preview_url: true,
          body: bodyText || `Hello ${guestName}! You are warmly invited to our wedding celebration. RSVP here: ${invitationUrl}`,
        },
      };
    }

    // 4. Send request to Meta Graph API
    const metaUrl = `https://graph.facebook.com/v19.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`;
    const response = await fetch(metaUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(metaPayload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[Meta WhatsApp API Error]:', data);
      return res.status(response.status).json({
        success: false,
        error: data.error?.message || 'Failed to dispatch WhatsApp message via Meta Cloud API.',
        metaError: data.error,
      });
    }

    const messageId = data.messages?.[0]?.id || `wamid_${Date.now()}`;

    // 5. Return success and initial accepted status
    return res.json({
      success: true,
      messageId,
      status: 'api_accepted',
      recipientPhone: cleanPhone,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[Meta WhatsApp API Exception]:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Server error while dispatching WhatsApp message.',
    });
  }
});

/**
 * Meta WhatsApp Webhook: Verification Handshake (GET)
 * Meta calls this endpoint with hub.mode, hub.verify_token, hub.challenge
 */
app.get('/api/whatsapp/webhook', (req: Request, res: Response) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
    console.log('[Meta Webhook Verified]');
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

/**
 * Meta WhatsApp Webhook: Inbound Delivery Notifications (POST)
 * Receives real delivery receipts: sent, delivered, read, failed
 */
app.post('/api/whatsapp/webhook', (req: Request, res: Response) => {
  try {
    const body = req.body;
    if (body.object === 'whatsapp_business_account') {
      const entries = body.entry || [];
      for (const entry of entries) {
        const changes = entry.changes || [];
        for (const change of changes) {
          const value = change.value;
          if (value?.statuses) {
            for (const statusObj of value.statuses) {
              const msgId = statusObj.id;
              const status = statusObj.status; // 'sent' | 'delivered' | 'read' | 'failed'
              const recipientId = statusObj.recipient_id;
              const timestamp = statusObj.timestamp;

              webhookDeliveryLogs[msgId] = {
                status,
                timestamp: new Date(Number(timestamp) * 1000).toISOString(),
                recipientId,
              };

              console.log(`[WhatsApp Delivery Receipt]: Message ${msgId} -> ${status} for ${recipientId}`);
            }
          }
        }
      }
    }
    return res.status(200).send('EVENT_RECEIVED');
  } catch (err) {
    console.error('[Webhook Processing Error]:', err);
    return res.status(500).send('ERROR');
  }
});

/**
 * Query recent delivery status for a messageId
 */
app.get('/api/whatsapp/status/:messageId', (req: Request, res: Response) => {
  const { messageId } = req.params;
  const entry = webhookDeliveryLogs[messageId];
  if (entry) {
    return res.json({ found: true, ...entry });
  }
  return res.json({ found: false, status: 'api_accepted' });
});

// ==========================================
// VITE DEV SERVER OR STATIC ASSET SERVING
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));

    // SPA fallback: Route all HTML navigation requests to index.html
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    // Development mode: Mount Vite middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`WeddingGuest server running on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start WeddingGuest server:', err);
  process.exit(1);
});
