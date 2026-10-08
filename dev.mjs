// Local dev server: serves the app and runs api/s.js the way Vercel would. `npm run dev`
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {extname, join, normalize} from 'node:path';
import * as links from './api/s.js';

const root = import.meta.dirname, port = +process.env.PORT || 4173;
const TYPES = {'.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.md': 'text/markdown; charset=utf-8'};

createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  try {
    if (url.pathname === '/api/s') {
      const handler = links[req.method];
      if (!handler) return res.writeHead(405).end();
      const chunks = []; for await (const c of req) chunks.push(c);
      const r = await handler(new Request(url, {method: req.method, body: req.method === 'POST' ? Buffer.concat(chunks) : undefined}));
      res.writeHead(r.status, Object.fromEntries(r.headers));
      return res.end(Buffer.from(await r.arrayBuffer()));
    }
    const path = normalize(decodeURIComponent(url.pathname)).replace(/^[/\\]+/, '') || 'index.html';
    if (path.split(/[/\\]/).some(p => p.startsWith('.') || p === 'node_modules')) return res.writeHead(404).end('not found');
    const file = await readFile(join(root, path));
    res.writeHead(200, {'content-type': TYPES[extname(path)] || 'application/octet-stream', 'cache-control': 'no-store'}).end(file);
  } catch (e) {
    res.writeHead(e.code === 'ENOENT' || e.code === 'EISDIR' ? 404 : 500).end(e.code === 'ENOENT' ? 'not found' : String(e.message));
  }
}).listen(port, '127.0.0.1', () => console.log(`Unwall dev server: http://127.0.0.1:${port}`));
