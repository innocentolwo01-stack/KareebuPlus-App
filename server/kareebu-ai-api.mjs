import http from 'node:http';
import { randomUUID } from 'node:crypto';

const PORT = Number(process.env.PORT || 8790);
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-5-mini';
const ALLOWED_ORIGIN = process.env.KAREEBU_AI_ALLOWED_ORIGIN || '*';
const MAX_BODY_BYTES = 80_000;
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = Number(process.env.KAREEBU_AI_RATE_LIMIT || 30);
const buckets = new Map();

const SCREEN_ENUM = ['home','search','assistant','services','place','whereTo','chooseRide','confirmBooking','driver','onTrip','tripComplete','rateTrip','food','restaurant','cart','orderTracking','shops','shop','parcel','wallet','account','activity','orders','locationPicker'];

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Headers': 'Content-Type, X-Client-Request-Id',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  };
}

function send(res, status, body, extra = {}) {
  const text = JSON.stringify(body);
  res.writeHead(status, { 'Content-Type':'application/json; charset=utf-8', 'Content-Length':Buffer.byteLength(text), ...corsHeaders(), ...extra });
  res.end(text);
}

function rateAllowed(ip) {
  const now = Date.now();
  const current = buckets.get(ip);
  if (!current || now - current.startedAt > RATE_WINDOW_MS) {
    buckets.set(ip, { startedAt: now, count: 1 });
    return true;
  }
  current.count += 1;
  return current.count <= RATE_LIMIT;
}

async function readJson(req) {
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw new Error('BODY_TOO_LARGE');
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

function extractOutputText(response) {
  const texts = [];
  for (const item of response?.output ?? []) {
    if (item?.type !== 'message') continue;
    for (const part of item.content ?? []) {
      if (part?.type === 'output_text' && typeof part.text === 'string') texts.push(part.text);
    }
  }
  return texts.join('\n').trim();
}

const OUTPUT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['reply','actions','recommendations'],
  properties: {
    reply: { type:'string' },
    actions: {
      type:'array', maxItems:3,
      items: {
        type:'object', additionalProperties:false,
        required:['label','screen','rideMode','shopCategory','entityId'],
        properties: {
          label:{type:'string'},
          screen:{type:'string',enum:SCREEN_ENUM},
          rideMode:{type:['string','null'],enum:['RIDE','BODA',null]},
          shopCategory:{type:['string','null']},
          entityId:{type:['string','null']},
        },
      },
    },
    recommendations: {
      type:'array', maxItems:4,
      items: {
        type:'object', additionalProperties:false,
        required:['id','title','subtitle','reason','badge','action'],
        properties: {
          id:{type:'string'},
          title:{type:'string'},
          subtitle:{type:'string'},
          reason:{type:'string'},
          badge:{type:['string','null']},
          action:{
            type:'object', additionalProperties:false,
            required:['label','screen','rideMode','shopCategory','entityId'],
            properties: {
              label:{type:'string'},
              screen:{type:'string',enum:SCREEN_ENUM},
              rideMode:{type:['string','null'],enum:['RIDE','BODA',null]},
              shopCategory:{type:['string','null']},
              entityId:{type:['string','null']},
            },
          },
        },
      },
    },
  },
};

function developerPrompt(context) {
  const catalog = JSON.stringify(context?.catalog ?? {stores:[],restaurants:[]});
  return `You are Kareebu AI, the in-app concierge for Kareebu+, an East African super app.\n\nCustomer context:\n- Country: ${context?.country || 'Unknown'}\n- City: ${context?.city || 'Unknown'}\n- Guest: ${Boolean(context?.guest)}\n\nAvailable marketplace catalogue (recommend ONLY merchants/items present here; some entries are reference-only):\n${catalog}\n\nYour job:\n1. Answer the user's request naturally and concisely.\n2. Make useful, ranked recommendations when the catalogue supports them. Use rating, ETA, delivery fee or offers ONLY when contentTrust.liveAvailability is true and that field is non-null. Reference-only entries may be recommended by identity/category/cuisine only; never invent or infer live commercial metrics.\n3. Respect the selected country/city. Never recommend a store from another market.\n4. If the user asks for rides/Boda, recommend a mode but do not claim a live driver, exact price or guaranteed ETA unless supplied by the app. Route them to whereTo.\n5. If the user asks for medicine or health products, do not diagnose or prescribe. Recommend browsing a pharmacy and tell them to confirm suitability with a pharmacist/clinician.\n6. Never place an order, charge money, dispatch a driver or claim a transaction happened. The customer must confirm in Kareebu+.\n7. For a recommendation that opens a restaurant/shop, use its exact catalogue id as entityId.\n8. Keep the reply under about 120 words. Prefer 1-4 recommendations.\n9. If the request cannot be fulfilled from the supplied catalogue, say that clearly and provide the nearest useful Kareebu+ action instead.`;
}

function conversationText(history, message) {
  const turns = Array.isArray(history) ? history.slice(-8) : [];
  const transcript = turns
    .filter((turn) => turn && (turn.role === 'user' || turn.role === 'assistant') && typeof turn.text === 'string')
    .map((turn) => `${turn.role === 'assistant' ? 'Kareebu AI' : 'Customer'}: ${turn.text.slice(0, 800)}`)
    .join('\n');
  return transcript ? `Recent conversation:\n${transcript}\n\nCustomer: ${message}` : message;
}

async function callOpenAI(message, context, clientRequestId) {
  if (!OPENAI_API_KEY) throw new Error('OPENAI_API_KEY_MISSING');
  const response = await fetch('https://api.openai.com/v1/responses', {
    method:'POST',
    headers:{
      'Authorization':`Bearer ${OPENAI_API_KEY}`,
      'Content-Type':'application/json',
      'X-Client-Request-Id':clientRequestId,
    },
    body:JSON.stringify({
      model: OPENAI_MODEL,
      store: false,
      reasoning: { effort: 'low' },
      instructions: developerPrompt(context),
      input: conversationText(context?.history, message),
      text: {
        format: {
          type:'json_schema',
          name:'kareebu_assistant_reply',
          strict:true,
          schema:OUTPUT_SCHEMA,
        },
      },
    }),
  });
  const raw = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = raw?.error?.message || `OpenAI request failed (${response.status})`;
    const error = new Error(message);
    error.status = response.status;
    error.openaiRequestId = response.headers.get('x-request-id') || undefined;
    throw error;
  }
  const text = extractOutputText(raw);
  if (!text) throw new Error('EMPTY_OPENAI_RESPONSE');
  return { payload: JSON.parse(text), openaiRequestId: response.headers.get('x-request-id') || null };
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, 204, {});
  if (req.method === 'GET' && req.url === '/health') {
    return send(res, 200, { ok:true, service:'kareebu-ai', model:OPENAI_MODEL, configured:Boolean(OPENAI_API_KEY) });
  }
  if (req.method !== 'POST' || req.url !== '/assistant') return send(res, 404, { error:'Not found' });

  const ip = req.socket.remoteAddress || 'unknown';
  if (!rateAllowed(ip)) return send(res, 429, { error:'Too many requests. Try again shortly.' });

  const clientRequestId = String(req.headers['x-client-request-id'] || randomUUID());
  try {
    const body = await readJson(req);
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    if (!message) return send(res, 400, { error:'message is required' });
    if (message.length > 1200) return send(res, 400, { error:'message is too long' });

    const { payload, openaiRequestId } = await callOpenAI(message, body.context ?? {}, clientRequestId);
    return send(res, 200, payload, {
      'X-Client-Request-Id': clientRequestId,
      ...(openaiRequestId ? {'X-OpenAI-Request-Id':openaiRequestId} : {}),
    });
  } catch (error) {
    if (error?.message === 'BODY_TOO_LARGE') return send(res, 413, { error:'Request body too large' });
    if (error?.message === 'OPENAI_API_KEY_MISSING') return send(res, 503, { error:'Kareebu AI server is not configured with OPENAI_API_KEY' });
    console.error('[kareebu-ai]', clientRequestId, error);
    return send(res, Number(error?.status) || 502, { error:'Kareebu AI could not answer right now.', requestId:clientRequestId });
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Kareebu AI API listening on http://0.0.0.0:${PORT}`);
  console.log(`Android emulator URL: http://10.0.2.2:${PORT}`);
  console.log(`Model: ${OPENAI_MODEL}`);
  if (!OPENAI_API_KEY) console.log('OPENAI_API_KEY is not set; /assistant will return 503 until it is configured.');
});
