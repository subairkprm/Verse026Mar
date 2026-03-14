import { createServer as createViteServer } from "vite";
import type { Express } from "express";
export async function setupVite(app: Express) {
  const vite = await createViteServer({ server: { middlewareMode: true, hmr: { server: undefined } }, appType: "spa" });
  app.use(vite.middlewares);
  return vite;
}
