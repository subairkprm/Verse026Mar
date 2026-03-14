import type { Express, Request, Response } from "express";
import { storage } from "./storage";

export function registerRoutes(app: Express): void {
  // Auth check middleware
  const requireAuth = (req: Request, res: Response, next: Function) => {
    if (!req.isAuthenticated?.() || !req.user) return res.status(401).json({ error: "Unauthorized" });
    next();
  };

  // Auth routes
  app.get("/api/auth/user", (req, res) => {
    if (req.isAuthenticated?.() && req.user) return res.json(req.user);
    res.status(401).json({ error: "Not authenticated" });
  });
  app.post("/api/auth/logout", (req, res) => {
    req.logout?.((err: any) => { if (err) return res.status(500).json({ error: "Logout failed" }); res.json({ ok: true }); });
  });

  // Dashboard
  app.get("/api/dashboard/stats", requireAuth, async (req, res) => {
    const stats = await storage.getDashboardStats((req.user as any).id);
    res.json(stats);
  });

  // Leads CRUD
  app.get("/api/leads", requireAuth, async (req, res) => {
    const leads = await storage.getLeads((req.user as any).id);
    res.json(leads);
  });
  app.get("/api/leads/:id", requireAuth, async (req, res) => {
    const lead = await storage.getLead(+req.params.id);
    if (!lead) return res.status(404).json({ error: "Not found" });
    res.json(lead);
  });
  app.post("/api/leads", requireAuth, async (req, res) => {
    const lead = await storage.createLead({ ...req.body, userId: (req.user as any).id });
    res.status(201).json(lead);
  });
  app.patch("/api/leads/:id", requireAuth, async (req, res) => {
    const lead = await storage.updateLead(+req.params.id, req.body);
    res.json(lead);
  });
  app.delete("/api/leads/:id", requireAuth, async (req, res) => {
    await storage.deleteLead(+req.params.id);
    res.json({ ok: true });
  });

  // Contacts CRUD
  app.get("/api/contacts", requireAuth, async (req, res) => {
    res.json(await storage.getContacts((req.user as any).id));
  });
  app.get("/api/contacts/:id", requireAuth, async (req, res) => {
    const c = await storage.getContact(+req.params.id);
    if (!c) return res.status(404).json({ error: "Not found" });
    res.json(c);
  });
  app.post("/api/contacts", requireAuth, async (req, res) => {
    res.status(201).json(await storage.createContact({ ...req.body, userId: (req.user as any).id }));
  });
  app.patch("/api/contacts/:id", requireAuth, async (req, res) => {
    res.json(await storage.updateContact(+req.params.id, req.body));
  });
  app.delete("/api/contacts/:id", requireAuth, async (req, res) => {
    await storage.deleteContact(+req.params.id); res.json({ ok: true });
  });

  // Accounts CRUD
  app.get("/api/accounts", requireAuth, async (req, res) => {
    res.json(await storage.getAccounts((req.user as any).id));
  });
  app.get("/api/accounts/:id", requireAuth, async (req, res) => {
    const a = await storage.getAccount(+req.params.id);
    if (!a) return res.status(404).json({ error: "Not found" });
    res.json(a);
  });
  app.post("/api/accounts", requireAuth, async (req, res) => {
    res.status(201).json(await storage.createAccount({ ...req.body, userId: (req.user as any).id }));
  });
  app.patch("/api/accounts/:id", requireAuth, async (req, res) => {
    res.json(await storage.updateAccount(+req.params.id, req.body));
  });
  app.delete("/api/accounts/:id", requireAuth, async (req, res) => {
    await storage.deleteAccount(+req.params.id); res.json({ ok: true });
  });

  // Deals CRUD
  app.get("/api/deals", requireAuth, async (req, res) => {
    res.json(await storage.getDeals((req.user as any).id));
  });
  app.get("/api/deals/:id", requireAuth, async (req, res) => {
    const d = await storage.getDeal(+req.params.id);
    if (!d) return res.status(404).json({ error: "Not found" });
    res.json(d);
  });
  app.post("/api/deals", requireAuth, async (req, res) => {
    res.status(201).json(await storage.createDeal({ ...req.body, userId: (req.user as any).id }));
  });
  app.patch("/api/deals/:id", requireAuth, async (req, res) => {
    res.json(await storage.updateDeal(+req.params.id, req.body));
  });
  app.delete("/api/deals/:id", requireAuth, async (req, res) => {
    await storage.deleteDeal(+req.params.id); res.json({ ok: true });
  });

  // Activities
  app.get("/api/activities", requireAuth, async (req, res) => {
    res.json(await storage.getActivities((req.user as any).id));
  });
  app.post("/api/activities", requireAuth, async (req, res) => {
    res.status(201).json(await storage.createActivity({ ...req.body, userId: (req.user as any).id }));
  });

  // Tasks CRUD
  app.get("/api/tasks", requireAuth, async (req, res) => {
    res.json(await storage.getTasks((req.user as any).id));
  });
  app.post("/api/tasks", requireAuth, async (req, res) => {
    res.status(201).json(await storage.createTask({ ...req.body, userId: (req.user as any).id }));
  });
  app.patch("/api/tasks/:id", requireAuth, async (req, res) => {
    res.json(await storage.updateTask(+req.params.id, req.body));
  });
  app.delete("/api/tasks/:id", requireAuth, async (req, res) => {
    await storage.deleteTask(+req.params.id); res.json({ ok: true });
  });

  // Pipelines
  app.get("/api/pipelines", requireAuth, async (req, res) => {
    res.json(await storage.getPipelines((req.user as any).id));
  });
  app.post("/api/pipelines", requireAuth, async (req, res) => {
    res.status(201).json(await storage.createPipeline({ ...req.body, userId: (req.user as any).id }));
  });
  app.get("/api/pipelines/:id/stages", requireAuth, async (req, res) => {
    res.json(await storage.getPipelineStages(+req.params.id));
  });
  app.post("/api/pipelines/:id/stages", requireAuth, async (req, res) => {
    res.status(201).json(await storage.createPipelineStage({ ...req.body, pipelineId: +req.params.id }));
  });

  // Products
  app.get("/api/products", requireAuth, async (req, res) => {
    res.json(await storage.getProducts((req.user as any).id));
  });
  app.post("/api/products", requireAuth, async (req, res) => {
    res.status(201).json(await storage.createProduct({ ...req.body, userId: (req.user as any).id }));
  });

  // Quotes
  app.get("/api/quotes", requireAuth, async (req, res) => {
    res.json(await storage.getQuotes((req.user as any).id));
  });
  app.post("/api/quotes", requireAuth, async (req, res) => {
    res.status(201).json(await storage.createQuote({ ...req.body, userId: (req.user as any).id }));
  });
  app.patch("/api/quotes/:id", requireAuth, async (req, res) => {
    res.json(await storage.updateQuote(+req.params.id, req.body));
  });

  // Email Templates
  app.get("/api/email-templates", requireAuth, async (req, res) => {
    res.json(await storage.getEmailTemplates((req.user as any).id));
  });
  app.post("/api/email-templates", requireAuth, async (req, res) => {
    res.status(201).json(await storage.createEmailTemplate({ ...req.body, userId: (req.user as any).id }));
  });

  // Campaigns
  app.get("/api/campaigns", requireAuth, async (req, res) => {
    res.json(await storage.getCampaigns((req.user as any).id));
  });
  app.post("/api/campaigns", requireAuth, async (req, res) => {
    res.status(201).json(await storage.createCampaign({ ...req.body, userId: (req.user as any).id }));
  });

  // Documents
  app.get("/api/documents", requireAuth, async (req, res) => {
    res.json(await storage.getDocuments((req.user as any).id));
  });
  app.post("/api/documents", requireAuth, async (req, res) => {
    res.status(201).json(await storage.createDocument({ ...req.body, userId: (req.user as any).id }));
  });

  // Notes
  app.get("/api/notes/:entityType/:entityId", requireAuth, async (req, res) => {
    res.json(await storage.getNotes(req.params.entityType, +req.params.entityId));
  });
  app.post("/api/notes", requireAuth, async (req, res) => {
    res.status(201).json(await storage.createNote({ ...req.body, userId: (req.user as any).id }));
  });

  // Notifications
  app.get("/api/notifications", requireAuth, async (req, res) => {
    res.json(await storage.getNotifications((req.user as any).id));
  });
  app.patch("/api/notifications/:id/read", requireAuth, async (req, res) => {
    await storage.markNotificationRead(+req.params.id); res.json({ ok: true });
  });

  // Audit Logs
  app.get("/api/audit-logs", requireAuth, async (req, res) => {
    res.json(await storage.getAuditLogs((req.user as any).id));
  });

  // Tags
  app.get("/api/tags", requireAuth, async (req, res) => {
    res.json(await storage.getTags((req.user as any).id));
  });
  app.post("/api/tags", requireAuth, async (req, res) => {
    res.status(201).json(await storage.createTag({ ...req.body, userId: (req.user as any).id }));
  });

  // Reports
  app.get("/api/reports", requireAuth, async (req, res) => {
    res.json(await storage.getReports((req.user as any).id));
  });
  app.post("/api/reports", requireAuth, async (req, res) => {
    res.status(201).json(await storage.createReport({ ...req.body, userId: (req.user as any).id }));
  });

  // Custom Fields
  app.get("/api/custom-fields", requireAuth, async (req, res) => {
    res.json(await storage.getCustomFields((req.user as any).id));
  });
  app.post("/api/custom-fields", requireAuth, async (req, res) => {
    res.status(201).json(await storage.createCustomField({ ...req.body, userId: (req.user as any).id }));
  });
}