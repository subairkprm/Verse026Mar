import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
export const conversations = pgTable("conversations", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  title: text("title"),
  createdAt: timestamp("created_at").defaultNow()
});
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey(),
  conversationId: varchar("conversation_id").notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
