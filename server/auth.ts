import type { Request, Response, NextFunction } from "express";
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.userId) return res.status(401).json({ error: "Not authenticated" });
  next();
}
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session?.userId) return res.status(401).json({ error: "Not authenticated" });
    if (roles.length > 0 && req.session.userRole && !roles.includes(req.session.userRole))
      return res.status(403).json({ error: "Forbidden" });
    next();
  };
}
