import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import type { Express } from "express";
import session from "express-session";
import { storage } from "./storage";
import type { User } from "../shared/schema";

declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      name: string;
      googleId: string;
      avatarUrl: string | null;
      role: string;
    }
  }
}

export function setupAuth(app: Express): void {
  app.use(
    session({
      store: storage.sessionStore,
      secret: process.env.SESSION_SECRET || "spreadverse-crm-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback",
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          let user = await storage.getUserByGoogleId(profile.id);
          if (!user) {
            user = await storage.createUser({
              email: profile.emails?.[0]?.value || "",
              name: profile.displayName || "User",
              googleId: profile.id,
              avatarUrl: profile.photos?.[0]?.value || null,
              role: "user",
            });
          }
          done(null, user as any);
        } catch (err) {
          done(err as Error);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user as any);
    } catch (err) {
      done(err);
    }
  });

  // Google OAuth routes
  app.get("/api/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
  app.get(
    "/api/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (_req, res) => res.redirect("/")
  );
}