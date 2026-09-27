import http from 'node:http';

const port = Number(process.env.PORT || 8787);

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }

  if (req.url === '/health') {
    res.writeHead(200);
    return res.end(JSON.stringify({ ok: true, service: 'ai-3d-agent-backend' }));
  }

  if (req.url === '/api/agent/message' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      res.writeHead(200);
      res.end(JSON.stringify({
        ok: true,
        reply: 'Backend conectado. O adaptador de IA está pronto para receber o provedor escolhido.',
        actions: [{ type: 'idle', intensity: 1 }]
      }));
    });
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'not_found' }));
});

server.listen(port, () => console.log(`AI agent backend listening on ${port}`));
