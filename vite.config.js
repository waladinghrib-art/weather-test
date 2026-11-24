import { defineConfig, loadEnv } from 'vite';

// On Vercel, every file in /api becomes a serverless function automatically.
// On your laptop, `npm run dev` only runs Vite, which doesn't know about /api.
// This small plugin fills the gap: it runs api/<name>.js when the browser asks for /api/<name>,
// so you don't need the Vercel CLI to test locally. You don't need to change this file.
function apiDevServer() {
  return {
    name: 'api-dev-server',
    configureServer(server) {
      // Load .env (all variables, not only VITE_ ones) for the server-side code.
      // Vite restarts itself when .env changes. Before reloading, put process.env back the way
      // it was at startup, so the NEW .env values win over the ones loaded last time.
      const original = (globalThis.__apiDevOriginalEnv ??= { ...process.env });
      for (const key of Object.keys(process.env)) {
        if (!(key in original)) delete process.env[key];
      }
      Object.assign(process.env, original, loadEnv(server.config.mode, process.cwd(), ''));

      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url, 'http://localhost');
        if (!url.pathname.startsWith('/api/')) return next();

        const name = url.pathname.slice('/api/'.length).replace(/\/$/, '');
        let mod;
        try {
          mod = await server.ssrLoadModule(`/api/${name}.js`);
        } catch {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ error: `No function at api/${name}.js` }));
        }

        // Give req/res the same helpers Vercel provides.
        req.query = Object.fromEntries(url.searchParams);
        res.status = (code) => {
          res.statusCode = code;
          return res;
        };
        res.json = (body) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(body));
          return res;
        };

        try {
          await mod.default(req, res);
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: 'The function crashed. Look at the terminal for details.' });
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [apiDevServer()],
});
