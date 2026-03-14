import { eq, desc, and, sql, ilike, gte, lte, count, sum, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../shared/schema";
import type {
  User, InsertUser, Lead, InsertLead, Contact, InsertContact,
  Account, InsertAccount, Deal, InsertDeal, Activity, InsertActivity,
  Task, InsertTask, EmailTemplate, InsertEmailTemplate,
  Pipeline, InsertPipeline, PipelineStage, InsertPipelineStage,
  Product, InsertProduct, Quote, InsertQuote, QuoteItem, InsertQuoteItem,
  Campaign, InsertCampaign, CampaignMember, InsertCampaignMember,
  Document, InsertDocument, Note, InsertNote,
  Notification, InsertNotification, AuditLog, InsertAuditLog,
  Tag, InsertTag, EntityTag, InsertEntityTag,
  Report, InsertReport, CustomField, InsertCustomField,
  DashboardStats
} from "../shared/schema";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";

const PgSession = connectPgSimple(session);

export interface IStorage {
  sessionStore: session.Store;
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<InsertUser>): Promise<User>;
  // Leads
  getLeads(userId: number): Promise<Lead[]>;
  getLead(id: number): Promise<Lead | undefined>;
  createLead(lead: InsertLead): Promise<Lead>;
  updateLead(id: number, data: Partial<InsertLead>): Promise<Lead>;
  deleteLead(id: number): Promise<void>;
  // Contacts
  getContacts(userId: number): Promise<Contact[]>;
  getContact(id: number): Promise<Contact | undefined>;
  createContact(contact: InsertContact): Promise<Contact>;
  updateContact(id: number, data: Partial<InsertContact>): Promise<Contact>;
  deleteContact(id: number): Promise<void>;
  // Accounts
  getAccounts(userId: number): Promise<Account[]>;
  getAccount(id: number): Promise<Account | undefined>;
  createAccount(account: InsertAccount): Promise<Account>;
  updateAccount(id: number, data: Partial<InsertAccount>): Promise<Account>;
  deleteAccount(id: number): Promise<void>;
  // Deals
  getDeals(userId: number): Promise<Deal[]>;
  getDeal(id: number): Promise<Deal | undefined>;
  createDeal(deal: InsertDeal): Promise<Deal>;
  updateDeal(id: number, data: Partial<InsertDeal>): Promise<Deal>;
  deleteDeal(id: number): Promise<void>;
  // Activities
  getActivities(userId: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  // Tasks
  getTasks(userId: number): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, data: Partial<InsertTask>): Promise<Task>;
  deleteTask(id: number): Promise<void>;
  // Pipelines
  getPipelines(userId: number): Promise<Pipeline[]>;
  getPipeline(id: number): Promise<Pipeline | undefined>;
  createPipeline(pipeline: InsertPipeline): Promise<Pipeline>;
  getPipelineStages(pipelineId: number): Promise<PipelineStage[]>;
  createPipelineStage(stage: InsertPipelineStage): Promise<PipelineStage>;
  // Products
  getProducts(userId: number): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  // Quotes
  getQuotes(userId: number): Promise<Quote[]>;
  getQuote(id: number): Promise<Quote | undefined>;
  createQuote(quote: InsertQuote): Promise<Quote>;
  updateQuote(id: number, data: Partial<InsertQuote>): Promise<Quote>;
  // Email Templates
  getEmailTemplates(userId: number): Promise<EmailTemplate[]>;
  createEmailTemplate(template: InsertEmailTemplate): Promise<EmailTemplate>;
  // Campaigns
  getCampaigns(userId: number): Promise<Campaign[]>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  // Documents
  getDocuments(userId: number): Promise<Document[]>;
  createDocument(doc: InsertDocument): Promise<Document>;
  // Notes
  getNotes(entityType: string, entityId: number): Promise<Note[]>;
  createNote(note: InsertNote): Promise<Note>;
  // Notifications
  getNotifications(userId: number): Promise<Notification[]>;
  markNotificationRead(id: number): Promise<void>;
  createNotification(notif: InsertNotification): Promise<Notification>;
  // Audit
  getAuditLogs(userId: number): Promise<AuditLog[]>;
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
  // Tags
  getTags(userId: number): Promise<Tag[]>;
  createTag(tag: InsertTag): Promise<Tag>;
  // Reports
  getReports(userId: number): Promise<Report[]>;
  createReport(report: InsertReport): Promise<Report>;
  // Custom Fields
  getCustomFields(userId: number): Promise<CustomField[]>;
  createCustomField(field: InsertCustomField): Promise<CustomField>;
  // Dashboard
  getDashboardStats(userId: number): Promise<DashboardStats>;
}

export class DatabaseStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;
  public sessionStore: session.Store;

  constructor() {
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    this.db = drizzle(pool, { schema });
    this.sessionStore = new PgSession({ pool, createTableIfMissing: true });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await this.db.select().from(schema.users).where(eq(schema.users.id, id));
    return user;
  }
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await this.db.select().from(schema.users).where(eq(schema.users.email, email));
    return user;
  }
  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const [user] = await this.db.select().from(schema.users).where(eq(schema.users.googleId, googleId));
    return user;
  }
  async createUser(user: InsertUser): Promise<User> {
    const [created] = await this.db.insert(schema.users).values(user).returning();
    return created;
  }
  async updateUser(id: number, data: Partial<InsertUser>): Promise<User> {
    const [updated] = await this.db.update(schema.users).set(data).where(eq(schema.users.id, id)).returning();
    return updated;
  }

  // Leads
  async getLeads(userId: number): Promise<Lead[]> {
    return this.db.select().from(schema.leads).where(eq(schema.leads.userId, userId)).orderBy(desc(schema.leads.createdAt));
  }
  async getLead(id: number): Promise<Lead | undefined> {
    const [lead] = await this.db.select().from(schema.leads).where(eq(schema.leads.id, id));
    return lead;
  }
  async createLead(lead: InsertLead): Promise<Lead> {
    const [created] = await this.db.insert(schema.leads).values(lead).returning();
    return created;
  }
  async updateLead(id: number, data: Partial<InsertLead>): Promise<Lead> {
    const [updated] = await this.db.update(schema.leads).set(data).where(eq(schema.leads.id, id)).returning();
    return updated;
  }
  async deleteLead(id: number): Promise<void> {
    await this.db.delete(schema.leads).where(eq(schema.leads.id, id));
  }

  // Contacts
  async getContacts(userId: number): Promise<Contact[]> {
    return this.db.select().from(schema.contacts).where(eq(schema.contacts.userId, userId)).orderBy(desc(schema.contacts.createdAt));
  }
  async getContact(id: number): Promise<Contact | undefined> {
    const [contact] = await this.db.select().from(schema.contacts).where(eq(schema.contacts.id, id));
    return contact;
  }
  async createContact(contact: InsertContact): Promise<Contact> {
    const [created] = await this.db.insert(schema.contacts).values(contact).returning();
    return created;
  }
  async updateContact(id: number, data: Partial<InsertContact>): Promise<Contact> {
    const [updated] = await this.db.update(schema.contacts).set(data).where(eq(schema.contacts.id, id)).returning();
    return updated;
  }
  async deleteContact(id: number): Promise<void> {
    await this.db.delete(schema.contacts).where(eq(schema.contacts.id, id));
  }

  // Accounts
  async getAccounts(userId: number): Promise<Account[]> {
    return this.db.select().from(schema.accounts).where(eq(schema.accounts.userId, userId)).orderBy(desc(schema.accounts.createdAt));
  }
  async getAccount(id: number): Promise<Account | undefined> {
    const [account] = await this.db.select().from(schema.accounts).where(eq(schema.accounts.id, id));
    return account;
  }
  async createAccount(account: InsertAccount): Promise<Account> {
    const [created] = await this.db.insert(schema.accounts).values(account).returning();
    return created;
  }
  async updateAccount(id: number, data: Partial<InsertAccount>): Promise<Account> {
    const [updated] = await this.db.update(schema.accounts).set(data).where(eq(schema.accounts.id, id)).returning();
    return updated;
  }
  async deleteAccount(id: number): Promise<void> {
    await this.db.delete(schema.accounts).where(eq(schema.accounts.id, id));
  }

  // Deals
  async getDeals(userId: number): Promise<Deal[]> {
    return this.db.select().from(schema.deals).where(eq(schema.deals.userId, userId)).orderBy(desc(schema.deals.createdAt));
  }
  async getDeal(id: number): Promise<Deal | undefined> {
    const [deal] = await this.db.select().from(schema.deals).where(eq(schema.deals.id, id));
    return deal;
  }
  async createDeal(deal: InsertDeal): Promise<Deal> {
    const [created] = await this.db.insert(schema.deals).values(deal).returning();
    return created;
  }
  async updateDeal(id: number, data: Partial<InsertDeal>): Promise<Deal> {
    const [updated] = await this.db.update(schema.deals).set(data).where(eq(schema.deals.id, id)).returning();
    return updated;
  }
  async deleteDeal(id: number): Promise<void> {
    await this.db.delete(schema.deals).where(eq(schema.deals.id, id));
  }

  // Activities
  async getActivities(userId: number): Promise<Activity[]> {
    return this.db.select().from(schema.activities).where(eq(schema.activities.userId, userId)).orderBy(desc(schema.activities.createdAt));
  }
  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [created] = await this.db.insert(schema.activities).values(activity).returning();
    return created;
  }

  // Tasks
  async getTasks(userId: number): Promise<Task[]> {
    return this.db.select().from(schema.tasks).where(eq(schema.tasks.userId, userId)).orderBy(desc(schema.tasks.createdAt));
  }
  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await this.db.select().from(schema.tasks).where(eq(schema.tasks.id, id));
    return task;
  }
  async createTask(task: InsertTask): Promise<Task> {
    const [created] = await this.db.insert(schema.tasks).values(task).returning();
    return created;
  }
  async updateTask(id: number, data: Partial<InsertTask>): Promise<Task> {
    const [updated] = await this.db.update(schema.tasks).set(data).where(eq(schema.tasks.id, id)).returning();
    return updated;
  }
  async deleteTask(id: number): Promise<void> {
    await this.db.delete(schema.tasks).where(eq(schema.tasks.id, id));
  }

    // Pipelines
  async getPipelines(userId: number): Promise<Pipeline[]> {
    return this.db.select().from(schema.pipelines).where(eq(schema.pipelines.userId, userId));
  }
  async getPipeline(id: number): Promise<Pipeline | undefined> {
    const [p] = await this.db.select().from(schema.pipelines).where(eq(schema.pipelines.id, id));
    return p;
  }
  async createPipeline(pipeline: InsertPipeline): Promise<Pipeline> {
    const [created] = await this.db.insert(schema.pipelines).values(pipeline).returning();
    return created;
  }
  async getPipelineStages(pipelineId: number): Promise<PipelineStage[]> {
    return this.db.select().from(schema.pipelineStages).where(eq(schema.pipelineStages.pipelineId, pipelineId)).orderBy(schema.pipelineStages.order);
  }
  async createPipelineStage(stage: InsertPipelineStage): Promise<PipelineStage> {
    const [created] = await this.db.insert(schema.pipelineStages).values(stage).returning();
    return created;
  }

  // Products
  async getProducts(userId: number): Promise<Product[]> {
    return this.db.select().from(schema.products).where(eq(schema.products.userId, userId));
  }
  async createProduct(product: InsertProduct): Promise<Product> {
    const [created] = await this.db.insert(schema.products).values(product).returning();
    return created;
  }

  // Quotes
  async getQuotes(userId: number): Promise<Quote[]> {
    return this.db.select().from(schema.quotes).where(eq(schema.quotes.userId, userId)).orderBy(desc(schema.quotes.createdAt));
  }
  async getQuote(id: number): Promise<Quote | undefined> {
    const [q] = await this.db.select().from(schema.quotes).where(eq(schema.quotes.id, id));
    return q;
  }
  async createQuote(quote: InsertQuote): Promise<Quote> {
    const [created] = await this.db.insert(schema.quotes).values(quote).returning();
    return created;
  }
  async updateQuote(id: number, data: Partial<InsertQuote>): Promise<Quote> {
    const [updated] = await this.db.update(schema.quotes).set(data).where(eq(schema.quotes.id, id)).returning();
    return updated;
  }

  // Email Templates
  async getEmailTemplates(userId: number): Promise<EmailTemplate[]> {
    return this.db.select().from(schema.emailTemplates).where(eq(schema.emailTemplates.userId, userId));
  }
  async createEmailTemplate(template: InsertEmailTemplate): Promise<EmailTemplate> {
    const [created] = await this.db.insert(schema.emailTemplates).values(template).returning();
    return created;
  }

  // Campaigns
  async getCampaigns(userId: number): Promise<Campaign[]> {
    return this.db.select().from(schema.campaigns).where(eq(schema.campaigns.userId, userId));
  }
  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    const [created] = await this.db.insert(schema.campaigns).values(campaign).returning();
    return created;
  }

  // Documents
  async getDocuments(userId: number): Promise<Document[]> {
    return this.db.select().from(schema.documents).where(eq(schema.documents.userId, userId));
  }
  async createDocument(doc: InsertDocument): Promise<Document> {
    const [created] = await this.db.insert(schema.documents).values(doc).returning();
    return created;
  }

  // Notes
  async getNotes(entityType: string, entityId: number): Promise<Note[]> {
    return this.db.select().from(schema.notes).where(and(eq(schema.notes.entityType, entityType), eq(schema.notes.entityId, entityId))).orderBy(desc(schema.notes.createdAt));
  }
  async createNote(note: InsertNote): Promise<Note> {
    const [created] = await this.db.insert(schema.notes).values(note).returning();
    return created;
  }

  // Notifications
  async getNotifications(userId: number): Promise<Notification[]> {
    return this.db.select().from(schema.notifications).where(eq(schema.notifications.userId, userId)).orderBy(desc(schema.notifications.createdAt));
  }
  async markNotificationRead(id: number): Promise<void> {
    await this.db.update(schema.notifications).set({ isRead: true }).where(eq(schema.notifications.id, id));
  }
  async createNotification(notif: InsertNotification): Promise<Notification> {
    const [created] = await this.db.insert(schema.notifications).values(notif).returning();
    return created;
  }

  // Audit Logs
  async getAuditLogs(userId: number): Promise<AuditLog[]> {
    return this.db.select().from(schema.auditLogs).where(eq(schema.auditLogs.userId, userId)).orderBy(desc(schema.auditLogs.createdAt));
  }
  async createAuditLog(log: InsertAuditLog): Promise<AuditLog> {
    const [created] = await this.db.insert(schema.auditLogs).values(log).returning();
    return created;
  }

  // Tags
  async getTags(userId: number): Promise<Tag[]> {
    return this.db.select().from(schema.tags).where(eq(schema.tags.userId, userId));
  }
  async createTag(tag: InsertTag): Promise<Tag> {
    const [created] = await this.db.insert(schema.tags).values(tag).returning();
    return created;
  }

  // Reports
  async getReports(userId: number): Promise<Report[]> {
    return this.db.select().from(schema.reports).where(eq(schema.reports.userId, userId));
  }
  async createReport(report: InsertReport): Promise<Report> {
    const [created] = await this.db.insert(schema.reports).values(report).returning();
    return created;
  }

  // Custom Fields
  async getCustomFields(userId: number): Promise<CustomField[]> {
    return this.db.select().from(schema.customFields).where(eq(schema.customFields.userId, userId));
  }
  async createCustomField(field: InsertCustomField): Promise<CustomField> {
    const [created] = await this.db.insert(schema.customFields).values(field).returning();
    return created;
  }

  // Dashboard Stats
  async getDashboardStats(userId: number): Promise<DashboardStats> {
    const [leadCount] = await this.db.select({ count: count() }).from(schema.leads).where(eq(schema.leads.userId, userId));
    const [contactCount] = await this.db.select({ count: count() }).from(schema.contacts).where(eq(schema.contacts.userId, userId));
    const [dealCount] = await this.db.select({ count: count() }).from(schema.deals).where(eq(schema.deals.userId, userId));
    const [taskCount] = await this.db.select({ count: count() }).from(schema.tasks).where(and(eq(schema.tasks.userId, userId), eq(schema.tasks.status, "pending")));
    const [revenue] = await this.db.select({ total: sum(schema.deals.value) }).from(schema.deals).where(and(eq(schema.deals.userId, userId), eq(schema.deals.stage, "closed_won")));
    const [newLeadCount] = await this.db.select({ count: count() }).from(schema.leads).where(and(eq(schema.leads.userId, userId), eq(schema.leads.status, "new")));
    const [callbackCount] = await this.db.select({ count: count() }).from(schema.leads).where(and(eq(schema.leads.userId, userId), eq(schema.leads.status, "callback")));
    const [notInterestedCount] = await this.db.select({ count: count() }).from(schema.leads).where(and(eq(schema.leads.userId, userId), eq(schema.leads.status, "not_interested")));
    const [wonDealCount] = await this.db.select({ count: count() }).from(schema.deals).where(and(eq(schema.deals.userId, userId), eq(schema.deals.stage, "closed_won")));
    return {
      totalLeads: leadCount?.count ?? 0,
      totalContacts: contactCount?.count ?? 0,
      totalDeals: dealCount?.count ?? 0,
      openTasks: taskCount?.count ?? 0,
      revenue: Number(revenue?.total ?? 0),
      newLeads: newLeadCount?.count ?? 0,
      callback: callbackCount?.count ?? 0,
      notInterested: notInterestedCount?.count ?? 0,
      wonDeals: wonDealCount?.count ?? 0,
      pipelineValue: Number(revenue?.total ?? 0),
    };
  }
}

export const storage = new DatabaseStorage();