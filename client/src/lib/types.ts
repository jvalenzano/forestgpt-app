// Chat Message Types
export type MessageRole = "user" | "bot" | "system";

export interface Source {
  url: string;
  title?: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  sources?: Source[];
}

export interface ChatResponse {
  message: ChatMessage;
  debugInfo?: DebugInformation;
}

// Debug Information Types
export interface QueryClassification {
  category: string;
  confidence: number;
}

export interface ScrapedUrl {
  url: string;
  status: "success" | "error";
  statusCode?: number;
}

export interface ContentProcessingStats {
  rawContentSize: number;
  processedSize: number;
  chunks: number;
}

export interface LLMDetails {
  model: string;
  tokens: {
    input: number;
    output: number;
  };
  processingTime: number;
}

export interface DebugInformation {
  queryClassification: QueryClassification;
  scrapedUrls: ScrapedUrl[];
  contentProcessing: ContentProcessingStats;
  llmDetails: LLMDetails;
  rawContentPreview: string;
}
