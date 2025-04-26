import fetch from "node-fetch";
import * as cheerio from "cheerio";
import { storage } from "../storage";
import { sleep } from "./utils";

// Cache expiration time (24 hours)
const CACHE_EXPIRATION = 1000 * 60 * 60 * 24;

// Rate limiting settings
const MIN_REQUEST_INTERVAL = 1000; // Minimum 1 second between requests
let lastRequestTime = 0;

/**
 * Make a rate-limited request to a URL
 */
async function rateLimit(): Promise<void> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const delay = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
    await sleep(delay);
  }
  
  lastRequestTime = Date.now();
}

/**
 * Fetch and parse HTML content from a URL
 */
async function fetchUrl(url: string): Promise<{ 
  html: string; 
  status: number;
  error?: string;
}> {
  try {
    // Check cache first
    const cachedContent = await storage.getCachedContent(url);
    if (cachedContent) {
      return { html: cachedContent.content, status: 200 };
    }
    
    // Enforce rate limiting
    await rateLimit();
    
    // Normalize URL
    const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;
    
    // Make the request
    const response = await fetch(normalizedUrl, {
      headers: {
        "User-Agent": "ForestGPT/1.0 - Educational Project - Rate Limited Bot"
      },
      timeout: 10000 // 10 seconds timeout
    });
    
    const html = await response.text();
    
    // Cache the content if request was successful
    if (response.ok) {
      const expiresAt = new Date(Date.now() + CACHE_EXPIRATION);
      await storage.createCachedContent({
        url,
        content: html,
        expiresAt,
        metadata: {}
      });
    }
    
    return { 
      html, 
      status: response.status
    };
  } catch (error) {
    console.error(`Error fetching URL ${url}:`, error);
    return { 
      html: "", 
      status: 500,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Generate search URLs based on query and classification
 */
function generateSearchUrls(query: string, classification: { category: string; baseUrl: string }): string[] {
  const { baseUrl } = classification;
  
  // Base domain
  const domain = "www.fs.usda.gov";
  
  // Clean and process the query
  const searchTerms = query
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(term => term.length > 2);
  
  // Generate URLs based on classification and search terms
  const urls: string[] = [];
  
  // Add category base URL
  urls.push(baseUrl);
  
  // Add specific search paths based on category
  switch (classification.category) {
    case "Visit":
      urls.push(`${domain}/recreation`);
      if (query.includes("trail") || query.includes("hik")) {
        urls.push(`${domain}/recreation/hiking`);
      }
      if (query.includes("camp")) {
        urls.push(`${domain}/recreation/camping`);
      }
      break;
      
    case "Managing Land":
      urls.push(`${domain}/managing-land/forest-management`);
      if (query.includes("fire") || query.includes("wildfire")) {
        urls.push(`${domain}/managing-land/fire`);
      }
      if (query.includes("conserv") || query.includes("protect")) {
        urls.push(`${domain}/managing-land/natural-resources`);
      }
      break;
      
    case "About Agency":
      urls.push(`${domain}/about-agency/what-we-believe`);
      if (query.includes("mission") || query.includes("purpose")) {
        urls.push(`${domain}/about-agency/what-we-believe/mission-motto`);
      }
      if (query.includes("history")) {
        urls.push(`${domain}/about-agency/history`);
      }
      break;
      
    case "Working with Us":
      urls.push(`${domain}/working-with-us/jobs`);
      if (query.includes("partner") || query.includes("volunteer")) {
        urls.push(`${domain}/working-with-us/partnerships`);
      }
      if (query.includes("career") || query.includes("job")) {
        urls.push(`${domain}/working-with-us/jobs/career-paths`);
      }
      break;
  }
  
  // Add site-wide search query as a last resort
  const searchQuery = searchTerms.join("+");
  urls.push(`${domain}/search?q=${searchQuery}`);
  
  return urls;
}

/**
 * Extract main content from HTML
 */
function extractMainContent(html: string): string {
  try {
    const $ = cheerio.load(html);
    
    // Remove navigation, headers, footers, scripts, ads
    $('nav, header, footer, script, style, iframe, .advertisement, .banner, .sidebar').remove();
    
    // Try to find main content area
    let mainContent = $('main, #main, .main, #content, .content, article, .article, [role="main"]').html() || '';
    
    // If no specific content area found, use body content
    if (!mainContent.trim()) {
      mainContent = $('body').html() || '';
    }
    
    return mainContent;
  } catch (error) {
    console.error("Error extracting content:", error);
    return "";
  }
}

/**
 * Scrape relevant content from fs.usda.gov based on query classification
 */
export async function scrapRelevantContent(
  query: string, 
  classification: { category: string; confidence: number; baseUrl: string }
): Promise<{
  content: string;
  urls: Array<{ url: string; status: "success" | "error"; statusCode?: number }>;
  rawSize: number;
  preview: string;
}> {
  try {
    // Generate URLs to scrape
    const urlsToScrape = generateSearchUrls(query, classification);
    
    // Fetch and process content from each URL
    const results = await Promise.all(
      urlsToScrape.map(async (url) => {
        try {
          const { html, status, error } = await fetchUrl(url);
          
          if (status !== 200 || !html) {
            return {
              url,
              content: "",
              status: "error" as const,
              statusCode: status
            };
          }
          
          const extractedContent = extractMainContent(html);
          
          return {
            url,
            content: extractedContent,
            status: "success" as const
          };
        } catch (error) {
          console.error(`Error processing URL ${url}:`, error);
          return {
            url,
            content: "",
            status: "error" as const
          };
        }
      })
    );
    
    // Combine all content
    const allContent = results
      .filter(result => result.status === "success")
      .map(result => result.content)
      .join("\n\n");
    
    // Calculate raw size
    const rawSize = Buffer.from(allContent).length;
    
    // Get URLs info for debugging
    const urlsInfo = results.map(result => ({
      url: result.url,
      status: result.status,
      statusCode: result.statusCode
    }));
    
    // Get a preview of the raw content (first 500 chars)
    const preview = allContent.substring(0, 500) + (allContent.length > 500 ? "..." : "");
    
    return {
      content: allContent,
      urls: urlsInfo,
      rawSize,
      preview
    };
  } catch (error) {
    console.error("Error scraping content:", error);
    return {
      content: "",
      urls: [],
      rawSize: 0,
      preview: ""
    };
  }
}
