import "dotenv/config";
import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { setupAuth } from "./auth";
import { registerRoutes } from "./routes";
import { storage } from "./storage";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const app = express();
  const port = parseInt(process.env.PORT || "3000", 10);

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));

  // Setup Google OAuth
  setupAuth(app);

  // Register API routes
  registerRoutes(app);

  // Serve static client build in production
  const clientDist = path.join(__dirname, "..", "client", "dist");
  app.use(express.static(clientDist));

  // SPA fallback
  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });

  const server = createServer(app);
  server.listen(port, "0.0.0.0", () => {
    console.log(`SpreadVerse CRM server running on port ${port}`);
  });
}

main().catch(console.error);