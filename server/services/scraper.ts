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
    console.log(`Attempting to fetch URL: ${url}`);
    
    // Check cache first
    const cachedContent = await storage.getCachedContent(url);
    if (cachedContent) {
      console.log(`Retrieved cached content for URL: ${url}`);
      return { html: cachedContent.content, status: 200 };
    }
    
    // Enforce rate limiting
    await rateLimit();
    
    // Normalize URL
    const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;
    console.log(`Normalized URL: ${normalizedUrl}`);
    
    // Make the request
    console.log(`Sending fetch request to: ${normalizedUrl}`);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds timeout
    
    const response = await fetch(normalizedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    console.log(`Received response from ${normalizedUrl}: status ${response.status}`);
    const html = await response.text();
    console.log(`Received content length: ${html.length} characters`);
    
    // Cache the content if request was successful
    if (response.ok) {
      console.log(`Caching content for URL: ${url}`);
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
    console.log(`Starting content scraping for query: "${query}"`);
    console.log(`Classification: ${JSON.stringify(classification)}`);
    
    // Generate URLs to scrape
    const urlsToScrape = generateSearchUrls(query, classification);
    console.log(`Generated URLs to scrape: ${JSON.stringify(urlsToScrape)}`);
    
    // Fetch and process content from each URL
    console.log(`Fetching content from ${urlsToScrape.length} URLs...`);
    
    const results = await Promise.all(
      urlsToScrape.map(async (url) => {
        try {
          console.log(`Processing URL: ${url}`);
          const { html, status, error } = await fetchUrl(url);
          
          if (error) {
            console.log(`Error fetching ${url}: ${error}`);
          }
          
          if (status !== 200 || !html) {
            console.log(`Failed to get content from ${url}: status ${status}`);
            return {
              url,
              content: "",
              status: "error" as const,
              statusCode: status
            };
          }
          
          console.log(`Successfully fetched content from ${url}, extracting main content...`);
          const extractedContent = extractMainContent(html);
          console.log(`Extracted content length: ${extractedContent.length} characters`);
          
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
    const successfulResults = results.filter(result => result.status === "success");
    console.log(`Successfully scraped ${successfulResults.length} out of ${urlsToScrape.length} URLs`);
    
    const allContent = successfulResults
      .map(result => result.content)
      .join("\n\n");
    
    // Calculate raw size
    const rawSize = Buffer.from(allContent).length;
    console.log(`Total content size: ${rawSize} bytes`);
    
    // Get URLs info for debugging
    const urlsInfo = results.map(result => ({
      url: result.url,
      status: result.status,
      statusCode: result.statusCode
    }));
    
    // Get a preview of the raw content (first 500 chars)
    const preview = allContent.substring(0, 500) + (allContent.length > 500 ? "..." : "");
    
    // Add a fallback content for testing if we didn't get any valid content
    if (allContent.length === 0) {
      console.log("WARNING: No content was successfully scraped!");
    }
    
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
