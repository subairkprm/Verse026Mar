import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb, boolean, serial, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
export { conversations, messages } from "./models/chat.js";

// AUTH & TENANCY
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  email: text("email").unique(),
  createdAt: timestamp("created_at").defaultNow(),
});
export const insertUserSchema = createInsertSchema(users).pick({ username: true, password: true, name: true, email: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export const workspaces = pgTable("workspaces", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ownerUserId: varchar("owner_user_id").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
export const insertWorkspaceSchema = createInsertSchema(workspaces).omit({ id: true, createdAt: true });
export type InsertWorkspace = z.infer<typeof insertWorkspaceSchema>;
export type Workspace = typeof workspaces.$inferSelect;

export const WORKSPACE_ROLES = ["owner", "admin", "viewer"] as const;
export type WorkspaceRole = typeof WORKSPACE_ROLES[number];

export const workspaceMembers = pgTable("workspace_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: varchar("workspace_id").notNull(),
  userId: varchar("user_id").notNull(),
  role: text("role").default("viewer").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
export const insertWorkspaceMemberSchema = createInsertSchema(workspaceMembers).omit({ id: true, createdAt: true });
export type InsertWorkspaceMember = z.infer<typeof insertWorkspaceMemberSchema>;
export type WorkspaceMember = typeof workspaceMembers.$inferSelect;
export type User = typeof users.$inferSelect;

// LEADS
export const LEAD_STATUSES = ["New","Interested","Docs Collected","Submitted","Approved","Callback","Not Interested","No Answer","Wrong Number","Referral Sent"] as const;
export type LeadStatus = typeof LEAD_STATUSES[number];
export const AECB_SCORES = ["VHS","HS","MS","LS","VLS"] as const;
export const PRODUCTS = ["Credit Card - Premium","Credit Card - Standard","Personal Loan","Home Finance","Auto Loan"] as const;
export const LEAD_SOURCES = ["Import","Manual","Referral","Website","Campaign","Walk-in"] as const;

export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: varchar("workspace_id"),
  createdByUserId: varchar("created_by_user_id"),
  fullName: text("full_name").notNull(),
  mobile: text("mobile").notNull(),
  email: text("email"),
  companyName: text("company_name"),
  salary: integer("salary"),
  nationality: text("nationality"),
  score: text("score"),
  aecbScoreCode: text("aecb_score_code"),
  status: text("status").default("New"),
  notes: text("notes"),
  product: text("product"),
  source: text("source").default("Manual"),
  reason: text("reason"),
  referralProduct: text("referral_product"),
  pipelineValue: integer("pipeline_value"),
  callDuration: integer("call_duration"),
  totalCalls: integer("total_calls").default(0),
  successfulCalls: integer("successful_calls").default(0),
  lastCallDate: timestamp("last_call_date"),
  hidden: boolean("hidden").default(false),
  financeAmount: integer("finance_amount"),
  dbr: text("dbr"),
  listName: text("list_name"),
  secondEmployer: text("second_employer"),
  dateOfJoin: timestamp("date_of_join"),
  segmentId: varchar("segment_id"),
  subSegmentId: varchar("sub_segment_id"),
  createdAt: timestamp("created_at").defaultNow(),
});
export const insertLeadSchema = createInsertSchema(leads).omit({ id: true, createdAt: true });
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;

// SEGMENTS
export const segments = pgTable("segments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: varchar("workspace_id"),
  name: text("name").notNull(),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});
export const insertSegmentSchema = createInsertSchema(segments).omit({ id: true, createdAt: true });
export type InsertSegment = z.infer<typeof insertSegmentSchema>;
export type Segment = typeof segments.$inferSelect;

export const subSegments = pgTable("sub_segments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: varchar("workspace_id"),
  segmentId: varchar("segment_id").notNull(),
  name: text("name").notNull(),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});
export const insertSubSegmentSchema = createInsertSchema(subSegments).omit({ id: true, createdAt: true });
export type InsertSubSegment = z.infer<typeof insertSubSegmentSchema>;
export type SubSegment = typeof subSegments.$inferSelect;

// LIABILITIES
export const LIABILITY_TYPES = ["PERSONAL_LOAN","AUTO_LOAN","MORTGAGE","CREDIT_CARD","OTHER"] as const;
export const liabilities = pgTable("liabilities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: varchar("workspace_id"),
  leadId: varchar("lead_id").notNull(),
  liabilityType: text("liability_type").default("OTHER"),
  bankName: text("bank_name"),
  originalAmount: integer("original_amount"),
  interestRate: text("interest_rate"),
  tenureMonths: integer("tenure_months"),
  remainingBalance: integer("remaining_balance"),
  emiMonthly: integer("emi_monthly"),
  creditLimit: integer("credit_limit"),
  outstandingBalance: integer("outstanding_balance"),
  status: text("status").default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});
export const insertLiabilitySchema = createInsertSchema(liabilities).omit({ id: true, createdAt: true });
export type InsertLiability = z.infer<typeof insertLiabilitySchema>;
export type Liability = typeof liabilities.$inferSelect;

// IMPORTS & DATA MANAGER
export const imports = pgTable("imports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: varchar("workspace_id"),
  createdByUserId: varchar("created_by_user_id"),
  listId: integer("list_id"),
  fileName: text("file_name").notNull(),
  fileType: text("file_type"),
  rowCount: integer("row_count").default(0),
  status: text("status").default("uploaded"),
  createdAt: timestamp("created_at").defaultNow(),
});
export const insertImportSchema = createInsertSchema(imports).omit({ id: true, createdAt: true });
export type InsertImport = z.infer<typeof insertImportSchema>;
export type Import = typeof imports.$inferSelect;

export const importColumns = pgTable("import_columns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  importId: varchar("import_id").notNull(),
  originalColumnName: text("original_column_name").notNull(),
  detectedType: text("detected_type"),
  sampleValuesJson: jsonb("sample_values_json"),
});
export const insertImportColumnSchema = createInsertSchema(importColumns).omit({ id: true });
export type InsertImportColumn = z.infer<typeof insertImportColumnSchema>;
export type ImportColumn = typeof importColumns.$inferSelect;

export const importRows = pgTable("import_rows", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  importId: varchar("import_id").notNull(),
  rowNumber: integer("row_number").notNull(),
  rawJson: jsonb("raw_json"),
});
export const insertImportRowSchema = createInsertSchema(importRows).omit({ id: true });
export type InsertImportRow = z.infer<typeof insertImportRowSchema>;
export type ImportRow = typeof importRows.$inferSelect;

export const MAPPING_GROUPS = ["personal","segment","financial_existing","proposed","other"] as const;
export const fieldMappings = pgTable("field_mappings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  importId: varchar("import_id").notNull(),
  mappingGroup: text("mapping_group").notNull(),
  targetFieldKey: text("target_field_key").notNull(),
  sourceColumnName: text("source_column_name").notNull(),
  transformRule: jsonb("transform_rule"),
});
export const insertFieldMappingSchema = createInsertSchema(fieldMappings).omit({ id: true });
export type InsertFieldMapping = z.infer<typeof insertFieldMappingSchema>;
export type FieldMapping = typeof fieldMappings.$inferSelect;

// PROPOSALS
export const proposals = pgTable("proposals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: varchar("workspace_id"),
  leadId: varchar("lead_id").notNull(),
  createdByUserId: varchar("created_by_user_id"),
  name: text("name").notNull(),
  status: text("status").default("Draft"),
  createdAt: timestamp("created_at").defaultNow(),
});
export const insertProposalSchema = createInsertSchema(proposals).omit({ id: true, createdAt: true });
export type InsertProposal = z.infer<typeof insertProposalSchema>;
export type Proposal = typeof proposals.$inferSelect;

export const proposalIncome = pgTable("proposal_income", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  proposalId: varchar("proposal_id").notNull(),
  employerName: text("employer_name"),
  monthlySalary: integer("monthly_salary"),
  otherIncome: integer("other_income"),
});
export const insertProposalIncomeSchema = createInsertSchema(proposalIncome).omit({ id: true });
export type InsertProposalIncome = z.infer<typeof insertProposalIncomeSchema>;
export type ProposalIncome = typeof proposalIncome.$inferSelect;

export const proposalLiabilities = pgTable("proposal_liabilities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  proposalId: varchar("proposal_id").notNull(),
  liabilityId: varchar("liability_id"),
  liabilityType: text("liability_type"),
  bankName: text("bank_name"),
  emiMonthly: integer("emi_monthly"),
  outstandingBalance: integer("outstanding_balance"),
  creditLimit: integer("credit_limit"),
  isIncluded: boolean("is_included").default(true),
});
export const insertProposalLiabilitySchema = createInsertSchema(proposalLiabilities).omit({ id: true });
export type InsertProposalLiability = z.infer<typeof insertProposalLiabilitySchema>;
export type ProposalLiability = typeof proposalLiabilities.$inferSelect;

export const proposalOffer = pgTable("proposal_offer", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  proposalId: varchar("proposal_id").notNull(),
  productType: text("product_type"),
  bankName: text("bank_name"),
  amount: integer("amount"),
  rate: text("rate"),
  tenure: integer("tenure"),
  emi: integer("emi"),
  feesJson: jsonb("fees_json"),
});
export const insertProposalOfferSchema = createInsertSchema(proposalOffer).omit({ id: true });
export type InsertProposalOffer = z.infer<typeof insertProposalOfferSchema>;
export type ProposalOffer = typeof proposalOffer.$inferSelect;

export const proposalMetrics = pgTable("proposal_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  proposalId: varchar("proposal_id").notNull(),
  currentDbr: text("current_dbr"),
  proposedDbr: text("proposed_dbr"),
  monthlySaving: integer("monthly_saving"),
  totalSaving: integer("total_saving"),
});
export const insertProposalMetricsSchema = createInsertSchema(proposalMetrics).omit({ id: true });
export type InsertProposalMetrics = z.infer<typeof insertProposalMetricsSchema>;
export type ProposalMetrics = typeof proposalMetrics.$inferSelect;

// LISTS
export const leadLists = pgTable("lead_lists", {
  id: serial("id").primaryKey(),
  workspaceId: varchar("workspace_id"),
  name: text("name").notNull(),
  description: text("description"),
  color: text("color").default("#3B82F6"),
  createdAt: timestamp("created_at").defaultNow(),
});
export const insertLeadListSchema = createInsertSchema(leadLists).omit({ id: true, createdAt: true });
export type InsertLeadList = z.infer<typeof insertLeadListSchema>;
export type LeadList = typeof leadLists.$inferSelect;

export const listMemberships = pgTable("list_memberships", {
  id: serial("id").primaryKey(),
  listId: integer("list_id").notNull(),
  leadId: varchar("lead_id").notNull(),
  addedAt: timestamp("added_at").defaultNow(),
});
export const insertListMembershipSchema = createInsertSchema(listMemberships).omit({ id: true, addedAt: true });
export type InsertListMembership = z.infer<typeof insertListMembershipSchema>;
export type ListMembership = typeof listMemberships.$inferSelect;

// SETTINGS
export const CALL_PREFERENCES = ["teams","normal"] as const;
export const settings = pgTable("settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: varchar("workspace_id"),
  geminiApiKey: text("gemini_api_key"),
  bankName: text("bank_name"),
  agentName: text("agent_name"),
  callPreference: text("call_preference").default("normal"),
  defaultCountryCode: text("default_country_code").default("+971"),
  teamsPrefix: text("teams_prefix").default(""),
  useCountryCodePrefix: boolean("use_country_code_prefix").default(true),
  deviceCallFormat: text("device_call_format").default("tel:"),
  defaultLeadStatus: text("default_lead_status").default("New"),
  defaultProduct: text("default_product"),
  defaultSource: text("default_source").default("Manual"),
  notifyOnNewLead: boolean("notify_on_new_lead").default(true),
  notifyOnCallback: boolean("notify_on_callback").default(true),
  notifyOnTaskDue: boolean("notify_on_task_due").default(true),
  autoAssignLeads: boolean("auto_assign_leads").default(false),
  viewerCanCall: boolean("viewer_can_call").default(true),
  viewerCanExport: boolean("viewer_can_export").default(false),
  viewerCanViewProposals: boolean("viewer_can_view_proposals").default(true),
  viewerCanViewAnalytics: boolean("viewer_can_view_analytics").default(true),
  adminCanDeleteLeads: boolean("admin_can_delete_leads").default(true),
  adminCanManageCampaigns: boolean("admin_can_manage_campaigns").default(true),
  adminCanImportData: boolean("admin_can_import_data").default(true),
  adminCanManageSettings: boolean("admin_can_manage_settings").default(false),
});
export const insertSettingsSchema = createInsertSchema(settings).omit({ id: true });
export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Settings = typeof settings.$inferSelect;

// TASKS
export const TASK_STATUSES = ["Pending","In Progress","Done"] as const;
export const TASK_PRIORITIES = ["Low","Medium","High"] as const;
export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: varchar("workspace_id"),
  createdByUserId: varchar("created_by_user_id"),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").default("Pending"),
  priority: text("priority").default("Medium"),
  dueDate: timestamp("due_date"),
  leadId: varchar("lead_id"),
  createdAt: timestamp("created_at").defaultNow(),
});
export const insertTaskSchema = createInsertSchema(tasks).omit({ id: true, createdAt: true });
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

// CAMPAIGNS
export const campaigns = pgTable("campaigns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: varchar("workspace_id"),
  createdByUserId: varchar("created_by_user_id"),
  name: text("name").notNull(),
  templateId: varchar("template_id"),
  message: text("message").notNull(),
  status: text("status").default("Draft"),
  targetCount: integer("target_count").default(0),
  sentCount: integer("sent_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});
export const insertCampaignSchema = createInsertSchema(campaigns).omit({ id: true, createdAt: true });
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type Campaign = typeof campaigns.$inferSelect;

// CALL HISTORY
export const callHistory = pgTable("call_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: varchar("workspace_id"),
  leadId: varchar("lead_id").notNull(),
  callType: text("call_type").default("normal"),
  duration: integer("duration").default(0),
  outcome: text("outcome"),
  notes: text("notes"),
  calledAt: timestamp("called_at").defaultNow(),
});
export const insertCallHistorySchema = createInsertSchema(callHistory).omit({ id: true, calledAt: true });
export type InsertCallHistory = z.infer<typeof insertCallHistorySchema>;
export type CallHistory = typeof callHistory.$inferSelect;

// LEAD SCORING CONFIG
export const leadScoringConfig = pgTable("lead_scoring_config", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: varchar("workspace_id"),
  aecbWeight: integer("aecb_weight").default(30),
  salaryWeight: integer("salary_weight").default(20),
  dbrWeight: integer("dbr_weight").default(15),
  contactInfoWeight: integer("contact_info_weight").default(10),
  callCountWeight: integer("call_count_weight").default(10),
  callSuccessWeight: integer("call_success_weight").default(8),
  emailResponseWeight: integer("email_response_weight").default(5),
  campaignEngagementWeight: integer("campaign_engagement_weight").default(5),
  productSalaryWeight: integer("product_salary_weight").default(8),
  productDbrWeight: integer("product_dbr_weight").default(7),
  companyTierWeight: integer("company_tier_weight").default(7),
  interactionEnabled: boolean("interaction_enabled").default(true),
  productAlignmentEnabled: boolean("product_alignment_enabled").default(true),
  companyTierEnabled: boolean("company_tier_enabled").default(true),
  tierACompanies: text("tier_a_companies").default("Emirates NBD,ADCB,FAB,Mashreq,RAKBANK"),
  tierBCompanies: text("tier_b_companies").default("DIB,ADIB,ENBD,Commercial Bank,Sharjah Islamic Bank"),
  hotThreshold: integer("hot_threshold").default(80),
  warmThreshold: integer("warm_threshold").default(50),
});
export const insertLeadScoringConfigSchema = createInsertSchema(leadScoringConfig).omit({ id: true });
export type InsertLeadScoringConfig = z.infer<typeof insertLeadScoringConfigSchema>;
export type LeadScoringConfig = typeof leadScoringConfig.$inferSelect;

// PRODUCT RULES
export const productRules = pgTable("product_rules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: varchar("workspace_id"),
  name: text("name").notNull(),
  minSalary: integer("min_salary").default(0),
  maxSalary: integer("max_salary").default(999999),
  minAecb: text("min_aecb").default("MS"),
  maxDbr: integer("max_dbr").default(50),
  minAge: integer("min_age").default(21),
  maxAge: integer("max_age").default(65),
  scoreBonus: integer("score_bonus").default(10),
  createdAt: timestamp("created_at").defaultNow(),
});
export const insertProductRuleSchema = createInsertSchema(productRules).omit({ id: true, createdAt: true });
export type InsertProductRule = z.infer<typeof insertProductRuleSchema>;
export type ProductRule = typeof productRules.$inferSelect;

// CONSTANTS
export const LEAD_QUALITIES = ["Hot","Warm","Cold"] as const;
export type LeadQuality = typeof LEAD_QUALITIES[number];
export const DEFAULT_SEGMENTS = ["Retail Banking","Business Banking","Wealth Management","Insurance","Multi-Segment"] as const;

export interface DashboardStats {
  total: number; newLeads: number; interested: number; approved: number;
  callback: number; notInterested: number; hotLeads: number;
  wonDeals: number; pipelineValue: number;
}
