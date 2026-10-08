// Short-link store for Unwall story links.
// The browser encrypts the answer before upload and keeps the key in the link's #fragment, so this only ever
// stores and returns opaque base64url text under an id it cannot reverse. No reads by listing, no overwrites.
//
// Production: connect an Upstash Redis (or Vercel KV) store to the Vercel project; its REST env vars are picked up.
// Without them on Vercel, POST answers 501 and the app falls back to long self-contained links.
// Locally (`npm run dev`), links live in memory until the dev server stops.

const MAX = 96 * 1024; // ~150 KB of Markdown after compression; bigger answers keep the long link
const ID = /^[\w-]{12}$/, BODY = /^[\w-]+$/;
const mem = new Map();

const store = () => {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? {url, token} : null;
};
async function redis(cmd) {
  const {url, token} = store();
  const r = await fetch(url, {method: 'POST', headers: {authorization: `Bearer ${token}`}, body: JSON.stringify(cmd)});
  if (!r.ok) throw new Error(`link store answered ${r.status}`);
  return (await r.json()).result;
}
const say = (status, text, headers = {}) => new Response(text, {status, headers: {'content-type': 'text/plain; charset=utf-8', ...headers}});

export async function GET(request) {
  const id = new URL(request.url).searchParams.get('id') || '';
  if (!ID.test(id)) return say(400, 'bad id');
  const body = store() ? await redis(['GET', `s:${id}`]) : mem.get(id);
  return body ? say(200, body, {'cache-control': 'public, max-age=31536000, immutable'}) : say(404, 'not found');
}

export async function POST(request) {
  const id = new URL(request.url).searchParams.get('id') || '', body = await request.text();
  if (!ID.test(id) || !BODY.test(body) || body.length > MAX) return say(400, 'bad request');
  if (!store()) {
    if (process.env.VERCEL) return say(501, 'link store not configured');
    if (mem.has(id)) return say(409, 'exists');
    mem.set(id, body);
    return say(201, 'ok');
  }
  return (await redis(['SET', `s:${id}`, body, 'NX'])) === 'OK' ? say(201, 'ok') : say(409, 'exists');
}
