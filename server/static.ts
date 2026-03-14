import express, { type Express } from "express";
import fs from "fs";
import path from "path";
export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) throw new Error("Build dir not found: " + distPath);
  app.use(express.static(distPath));
  app.use((_, res) => { res.sendFile(path.resolve(distPath, "index.html")); });
}
