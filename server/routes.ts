import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { classifyQuery } from "./services/query-router";
import { scrapRelevantContent } from "./services/scraper";
import { processContent } from "./services/processor";
import { generateResponse } from "./services/llm";
import { testScrapeForestService } from "./services/test";
import { setupAuth } from "./auth";

// Session management - in memory for simplicity
const sessions = new Map<string, { debugMode: boolean }>();

// Simple middleware to ensure a session exists
function ensureSession(req: Request, res: Response, next: Function) {
  let sessionId = req.headers['x-session-id'] as string;
  
  if (!sessionId || !sessions.has(sessionId)) {
    sessionId = uuidv4();
    sessions.set(sessionId, { debugMode: false });
    res.setHeader('X-Session-Id', sessionId);
  }
  
  req.headers['x-session-id'] = sessionId;
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);
  
  // Apply session middleware for the chat functionality
  app.use(ensureSession);
  
  // Chat endpoint
  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      const sessionId = req.headers['x-session-id'] as string;
      const session = sessions.get(sessionId)!;
      
      // Validate request body
      const schema = z.object({
        message: z.string().min(1).max(500),
      });
      
      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid request", errors: result.error.errors });
      }
      
      const { message } = result.data;
      
      // Store user message
      const userMessage = await storage.createMessage({
        sessionId,
        content: message,
        role: "user",
        sources: [],
      });
      
      // Process the chat
      // 1. Classify the query
      const classification = await classifyQuery(message);
      
      // 2. Scrape relevant content based on classification
      const scrapedContent = await scrapRelevantContent(message, classification);
      
      // 3. Process content
      const processedContent = await processContent(scrapedContent);
      
      // 4. Generate response with LLM
      const { response, sources, images } = await generateResponse(message, processedContent);
      
      // Store bot message
      const botMessage = await storage.createMessage({
        sessionId,
        content: response,
        role: "bot",
        sources,
        images,
      });
      
      // Store debug information if debug mode is enabled
      let debugInfo = null;
      if (session.debugMode) {
        debugInfo = {
          queryClassification: classification,
          scrapedUrls: scrapedContent.urls,
          contentProcessing: {
            rawContentSize: scrapedContent.rawSize / 1024, // Convert to KB
            processedSize: processedContent.processedSize / 1024, // Convert to KB
            chunks: processedContent.chunks.length,
          },
          llmDetails: processedContent.llmDetails,
          rawContentPreview: scrapedContent.preview,
        };
        
        await storage.createDebugLog({
          sessionId,
          messageId: botMessage.id,
          queryClassification: classification,
          scrapedUrls: scrapedContent.urls,
          contentProcessing: {
            rawContentSize: scrapedContent.rawSize,
            processedSize: processedContent.processedSize,
            chunks: processedContent.chunks.length,
          },
          llmDetails: processedContent.llmDetails,
          rawContentPreview: scrapedContent.preview,
        });
      }
      
      // Return formatted response
      return res.json({
        message: {
          id: botMessage.id.toString(),
          role: botMessage.role,
          content: botMessage.content,
          timestamp: botMessage.timestamp,
          sources: botMessage.sources,
          images: botMessage.images || [],
        },
        debugInfo,
      });
    } catch (error) {
      console.error("Error processing chat:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Debug toggle endpoint
  app.post("/api/debug/toggle", async (req: Request, res: Response) => {
    try {
      const sessionId = req.headers['x-session-id'] as string;
      const session = sessions.get(sessionId)!;
      
      // Validate request body
      const schema = z.object({
        isEnabled: z.boolean(),
      });
      
      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid request", errors: result.error.errors });
      }
      
      const { isEnabled } = result.data;
      session.debugMode = isEnabled;
      
      return res.json({ success: true });
    } catch (error) {
      console.error("Error toggling debug mode:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Debug info endpoint
  app.get("/api/debug", async (req: Request, res: Response) => {
    try {
      const sessionId = req.headers['x-session-id'] as string;
      const session = sessions.get(sessionId)!;
      
      if (!session.debugMode) {
        return res.status(403).json({ message: "Debug mode is not enabled" });
      }
      
      // Get the latest message for the session
      const messages = await storage.getMessagesBySessionId(sessionId);
      if (messages.length === 0) {
        return res.status(404).json({ message: "No messages found for this session" });
      }
      
      // Get the latest bot message
      const botMessages = messages.filter(m => m.role === "bot");
      if (botMessages.length === 0) {
        return res.status(404).json({ message: "No bot messages found for this session" });
      }
      
      const latestBotMessage = botMessages[botMessages.length - 1];
      
      // Get the debug log for this message
      const debugLog = await storage.getDebugLogByMessageId(latestBotMessage.id);
      if (!debugLog) {
        return res.status(404).json({ message: "No debug log found for the latest message" });
      }
      
      // Format and return debug info
      return res.json({
        queryClassification: debugLog.queryClassification,
        scrapedUrls: debugLog.scrapedUrls,
        contentProcessing: {
          rawContentSize: (debugLog.contentProcessing as any).rawContentSize / 1024, // Convert to KB
          processedSize: (debugLog.contentProcessing as any).processedSize / 1024, // Convert to KB
          chunks: (debugLog.contentProcessing as any).chunks,
        },
        llmDetails: debugLog.llmDetails,
        rawContentPreview: debugLog.rawContentPreview,
      });
    } catch (error) {
      console.error("Error getting debug info:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Test endpoint to check scraping functionality
  app.get("/api/test/scrape", async (req: Request, res: Response) => {
    try {
      console.log("Running test scrape");
      const startTime = Date.now();
      
      // Run the test scrape
      await testScrapeForestService();
      
      const duration = (Date.now() - startTime) / 1000;
      return res.json({ 
        success: true, 
        message: "Test scrape completed, check server logs for details",
        duration: `${duration.toFixed(2)} seconds` 
      });
    } catch (error) {
      console.error("Error running test scrape:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Test scrape failed, check server logs for details",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
