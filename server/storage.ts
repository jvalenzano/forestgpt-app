import { 
  users, 
  messages, 
  cachedContent, 
  debugLogs, 
  type User, 
  type InsertUser,
  type Message,
  type InsertMessage,
  type CachedContent,
  type InsertCachedContent,
  type DebugLog,
  type InsertDebugLog
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import * as session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

// Storage interface for the application
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesBySessionId(sessionId: string): Promise<Message[]>;
  getMessageById(id: number): Promise<Message | undefined>;
  
  // Cache operations
  getCachedContent(url: string): Promise<CachedContent | undefined>;
  createCachedContent(content: InsertCachedContent): Promise<CachedContent>;
  updateCachedContent(id: number, content: Partial<InsertCachedContent>): Promise<CachedContent>;
  
  // Debug operations
  createDebugLog(log: InsertDebugLog): Promise<DebugLog>;
  getDebugLogByMessageId(messageId: number): Promise<DebugLog | undefined>;
  
  // Session store
  sessionStore: any;
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  sessionStore: any;
  
  constructor() {
    const PostgresSessionStore = connectPg(session);
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // Message operations
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values(insertMessage)
      .returning();
    return message;
  }
  
  async getMessagesBySessionId(sessionId: string): Promise<Message[]> {
    const messagesList = await db
      .select()
      .from(messages)
      .where(eq(messages.sessionId, sessionId))
      .orderBy(messages.timestamp);
    
    // Ensure all required fields are present
    return messagesList.map(msg => ({
      ...msg,
      sources: msg.sources || [],
      images: msg.images || [],
    }));
  }
  
  async getMessageById(id: number): Promise<Message | undefined> {
    const [message] = await db
      .select()
      .from(messages)
      .where(eq(messages.id, id));
    return message;
  }
  
  // Cache operations
  async getCachedContent(url: string): Promise<CachedContent | undefined> {
    const [content] = await db
      .select()
      .from(cachedContent)
      .where(eq(cachedContent.url, url));
    
    // Check if content is expired
    if (content && content.expiresAt && new Date() > content.expiresAt) {
      // Content is expired, delete it
      await db
        .delete(cachedContent)
        .where(eq(cachedContent.id, content.id));
      return undefined;
    }
    
    return content;
  }
  
  async createCachedContent(insertContent: InsertCachedContent): Promise<CachedContent> {
    const [content] = await db
      .insert(cachedContent)
      .values(insertContent)
      .returning();
    return content;
  }
  
  async updateCachedContent(id: number, partialContent: Partial<InsertCachedContent>): Promise<CachedContent> {
    const [updatedContent] = await db
      .update(cachedContent)
      .set(partialContent)
      .where(eq(cachedContent.id, id))
      .returning();
    
    if (!updatedContent) {
      throw new Error(`Cached content with id ${id} not found`);
    }
    
    return updatedContent;
  }
  
  // Debug operations
  async createDebugLog(insertLog: InsertDebugLog): Promise<DebugLog> {
    const [log] = await db
      .insert(debugLogs)
      .values(insertLog)
      .returning();
    return log;
  }
  
  async getDebugLogByMessageId(messageId: number): Promise<DebugLog | undefined> {
    const [log] = await db
      .select()
      .from(debugLogs)
      .where(eq(debugLogs.messageId, messageId));
    return log;
  }
}

export const storage = new DatabaseStorage();
