import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Chat messages
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  content: text("content").notNull(),
  role: text("role").notNull(), // 'user', 'bot', 'system'
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  sources: jsonb("sources").default([]),
  images: jsonb("images").default([]),
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  sessionId: true,
  content: true,
  role: true,
  sources: true,
  images: true,
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

// Cached content from fs.usda.gov
export const cachedContent = pgTable("cached_content", {
  id: serial("id").primaryKey(),
  url: text("url").notNull().unique(),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
  metadata: jsonb("metadata").default({}),
});

export const insertCachedContentSchema = createInsertSchema(cachedContent).pick({
  url: true,
  content: true,
  expiresAt: true,
  metadata: true,
});

export type InsertCachedContent = z.infer<typeof insertCachedContentSchema>;
export type CachedContent = typeof cachedContent.$inferSelect;

// Debug logs
export const debugLogs = pgTable("debug_logs", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  messageId: integer("message_id").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  queryClassification: jsonb("query_classification").default({}),
  scrapedUrls: jsonb("scraped_urls").default([]),
  contentProcessing: jsonb("content_processing").default({}),
  llmDetails: jsonb("llm_details").default({}),
  rawContentPreview: text("raw_content_preview"),
});

export const insertDebugLogSchema = createInsertSchema(debugLogs).pick({
  sessionId: true,
  messageId: true,
  queryClassification: true,
  scrapedUrls: true,
  contentProcessing: true,
  llmDetails: true,
  rawContentPreview: true,
});

export type InsertDebugLog = z.infer<typeof insertDebugLogSchema>;
export type DebugLog = typeof debugLogs.$inferSelect;
