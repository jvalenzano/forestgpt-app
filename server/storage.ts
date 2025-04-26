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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private messages: Map<number, Message>;
  private cachedContents: Map<number, CachedContent>;
  private debugLogs: Map<number, DebugLog>;
  
  private userIdCounter: number;
  private messageIdCounter: number;
  private cachedContentIdCounter: number;
  private debugLogIdCounter: number;
  
  private userByUsername: Map<string, User>;
  private messagesBySessionId: Map<string, Message[]>;
  private cachedContentByUrl: Map<string, CachedContent>;
  private debugLogByMessageId: Map<number, DebugLog>;

  constructor() {
    this.users = new Map();
    this.messages = new Map();
    this.cachedContents = new Map();
    this.debugLogs = new Map();
    
    this.userIdCounter = 1;
    this.messageIdCounter = 1;
    this.cachedContentIdCounter = 1;
    this.debugLogIdCounter = 1;
    
    this.userByUsername = new Map();
    this.messagesBySessionId = new Map();
    this.cachedContentByUrl = new Map();
    this.debugLogByMessageId = new Map();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.userByUsername.get(username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    this.userByUsername.set(user.username, user);
    return user;
  }
  
  // Message operations
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.messageIdCounter++;
    const now = new Date();
    const message: Message = { ...insertMessage, id, timestamp: now };
    this.messages.set(id, message);
    
    // Update session messages
    const sessionMessages = this.messagesBySessionId.get(message.sessionId) || [];
    sessionMessages.push(message);
    this.messagesBySessionId.set(message.sessionId, sessionMessages);
    
    return message;
  }
  
  async getMessagesBySessionId(sessionId: string): Promise<Message[]> {
    return this.messagesBySessionId.get(sessionId) || [];
  }
  
  async getMessageById(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }
  
  // Cache operations
  async getCachedContent(url: string): Promise<CachedContent | undefined> {
    const content = this.cachedContentByUrl.get(url);
    
    // Check if content is expired
    if (content && content.expiresAt && new Date() > content.expiresAt) {
      // Content is expired, remove it
      this.cachedContents.delete(content.id);
      this.cachedContentByUrl.delete(url);
      return undefined;
    }
    
    return content;
  }
  
  async createCachedContent(insertContent: InsertCachedContent): Promise<CachedContent> {
    const id = this.cachedContentIdCounter++;
    const now = new Date();
    const content: CachedContent = { ...insertContent, id, timestamp: now };
    this.cachedContents.set(id, content);
    this.cachedContentByUrl.set(content.url, content);
    return content;
  }
  
  async updateCachedContent(id: number, partialContent: Partial<InsertCachedContent>): Promise<CachedContent> {
    const existingContent = this.cachedContents.get(id);
    if (!existingContent) {
      throw new Error(`Cached content with id ${id} not found`);
    }
    
    const updatedContent: CachedContent = { ...existingContent, ...partialContent };
    this.cachedContents.set(id, updatedContent);
    
    // Update URL index if URL changed
    if (partialContent.url && partialContent.url !== existingContent.url) {
      this.cachedContentByUrl.delete(existingContent.url);
      this.cachedContentByUrl.set(partialContent.url, updatedContent);
    }
    
    return updatedContent;
  }
  
  // Debug operations
  async createDebugLog(insertLog: InsertDebugLog): Promise<DebugLog> {
    const id = this.debugLogIdCounter++;
    const now = new Date();
    const log: DebugLog = { ...insertLog, id, timestamp: now };
    this.debugLogs.set(id, log);
    this.debugLogByMessageId.set(log.messageId, log);
    return log;
  }
  
  async getDebugLogByMessageId(messageId: number): Promise<DebugLog | undefined> {
    return this.debugLogByMessageId.get(messageId);
  }
}

export const storage = new MemStorage();
