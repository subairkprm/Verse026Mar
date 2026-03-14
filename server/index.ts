import "dotenv/config";
import express from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { createServer } from "http";
import { registerRoutes } from "./routes.js";
const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
const PgStore = connectPgSimple(session);
app.use(session({
  store: new PgStore({ conString: process.env.DATABASE_URL, createTableIfMissing: true }),
  secret: process.env.SESSION_SECRET || "spreadverse-dev-secret-change-me",
  resave: false, saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === "production", maxAge: 7 * 24 * 60 * 60 * 1000 }
}));
const httpServer = createServer(app);
await registerRoutes(httpServer, app);
if (process.env.NODE_ENV === "production") {
  const { serveStatic } = await import("./static.js");
  serveStatic(app);
} else {
  const { setupVite } = await import("./vite.js");
  await setupVite(app);
}
const PORT = parseInt(process.env.PORT || "5000");
httpServer.listen(PORT, "0.0.0.0", () => console.log(`SpreadVerse running on port ${PORT}`));
