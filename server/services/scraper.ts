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
  console.log(`Generating URLs for category: ${classification.category}, baseUrl: ${baseUrl}`);
  
  // Base domain
  const domain = "www.fs.usda.gov";
  
  // Clean and process the query
  const searchTerms = query
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(term => term.length > 2);
  
  console.log(`Extracted search terms: ${JSON.stringify(searchTerms)}`);
  
  // Generate URLs based on classification and search terms
  const urls: string[] = [];
  
  // Always add the forest service home page
  urls.push(`https://${domain}`);
  
  // Add category base URL (make sure it's a full URL)
  if (baseUrl.startsWith("http")) {
    urls.push(baseUrl);
  } else if (baseUrl.startsWith("www.")) {
    urls.push(`https://${baseUrl}`);
  } else {
    urls.push(`https://www.${baseUrl}`);
  }
  
  // Add specific search paths based on category
  switch (classification.category) {
    case "Visit":
      urls.push(`https://${domain}/visit`);
      urls.push(`https://${domain}/recreation`);
      if (query.toLowerCase().includes("trail") || query.toLowerCase().includes("hik")) {
        urls.push(`https://${domain}/recreation/hiking`);
        urls.push(`https://${domain}/visit/hiking`);
      }
      if (query.toLowerCase().includes("camp")) {
        urls.push(`https://${domain}/recreation/camping`);
        urls.push(`https://${domain}/visit/camping`);
      }
      if (query.toLowerCase().includes("fish") || query.toLowerCase().includes("hunting")) {
        urls.push(`https://${domain}/recreation/fishing`);
        urls.push(`https://${domain}/visit/fishing`);
      }
      if (query.toLowerCase().includes("permit") || query.toLowerCase().includes("pass")) {
        urls.push(`https://${domain}/passes-permits`);
      }
      break;
      
    case "Managing Land":
      urls.push(`https://${domain}/managing-land`);
      urls.push(`https://${domain}/managing-land/forest-management`);
      if (query.toLowerCase().includes("fire") || query.toLowerCase().includes("wildfire")) {
        urls.push(`https://${domain}/managing-land/fire`);
        urls.push(`https://${domain}/fire`);
      }
      if (query.toLowerCase().includes("conserv") || query.toLowerCase().includes("protect") || 
          query.toLowerCase().includes("environment") || query.toLowerCase().includes("wildlife")) {
        urls.push(`https://${domain}/managing-land/natural-resources`);
        urls.push(`https://${domain}/managing-land/natural-resources/wildlife`);
      }
      if (query.toLowerCase().includes("water") || query.toLowerCase().includes("river") || 
          query.toLowerCase().includes("stream") || query.toLowerCase().includes("lake")) {
        urls.push(`https://${domain}/managing-land/natural-resources/water-resources`);
      }
      break;
      
    case "About Agency":
      urls.push(`https://${domain}/about-agency`);
      urls.push(`https://${domain}/about-agency/who-we-are`);
      if (query.toLowerCase().includes("mission") || query.toLowerCase().includes("purpose") ||
          query.toLowerCase().includes("value") || query.toLowerCase().includes("goal")) {
        urls.push(`https://${domain}/about-agency/what-we-believe/mission-motto`);
        urls.push(`https://${domain}/about-agency/what-we-believe`);
      }
      if (query.toLowerCase().includes("history") || query.toLowerCase().includes("founded") ||
          query.toLowerCase().includes("origin")) {
        urls.push(`https://${domain}/about-agency/history`);
      }
      if (query.toLowerCase().includes("leader") || query.toLowerCase().includes("director") ||
          query.toLowerCase().includes("secretary") || query.toLowerCase().includes("chief")) {
        urls.push(`https://${domain}/about-agency/organization`);
      }
      break;
      
    case "Working with Us":
      urls.push(`https://${domain}/working-with-us`);
      urls.push(`https://${domain}/working-with-us/jobs`);
      if (query.toLowerCase().includes("partner") || query.toLowerCase().includes("volunteer") ||
          query.toLowerCase().includes("collaborate")) {
        urls.push(`https://${domain}/working-with-us/partnerships`);
        urls.push(`https://${domain}/volunteers`);
      }
      if (query.toLowerCase().includes("career") || query.toLowerCase().includes("job") ||
          query.toLowerCase().includes("employ") || query.toLowerCase().includes("position")) {
        urls.push(`https://${domain}/working-with-us/jobs/career-paths`);
        urls.push(`https://${domain}/about-agency/jobs`);
      }
      if (query.toLowerCase().includes("contract") || query.toLowerCase().includes("business") ||
          query.toLowerCase().includes("vendor")) {
        urls.push(`https://${domain}/working-with-us/business`);
      }
      break;
  }
  
  // Add site-wide search query URL
  if (searchTerms.length > 0) {
    const searchQuery = searchTerms.join("+");
    urls.push(`https://${domain}/search?q=${searchQuery}`);
  }
  
  // Remove duplicates
  const uniqueUrls = Array.from(new Set(urls));
  console.log(`Generated ${uniqueUrls.length} unique URLs for scraping`);
  
  return uniqueUrls;
}

/**
 * Image information extracted from HTML
 */
interface ImageInfo {
  src: string;
  alt: string;
  fullUrl: string;
}

/**
 * Extract images from HTML
 */
function extractImages(html: string, baseUrl: string): ImageInfo[] {
  try {
    const $ = cheerio.load(html);
    const images: ImageInfo[] = [];
    const seenUrls = new Set<string>();
    
    // Find all images in the content area
    const mainContentSelectors = [
      'main img', 
      '#main img', 
      '.main img', 
      '#content img', 
      '.content img', 
      'article img', 
      '.article img', 
      '[role="main"] img',
      '.field--name-body img',
      '.usa-prose img',
      '.page-content img',
      '.main-content img',
      '.align-center',  // Common class for Forest Service images
      'img[width][height]', // Images with dimensions are usually content images
      'img[class*="align"]' // Images with alignment classes
    ];
    
    // Process each image within these selectors
    mainContentSelectors.forEach(selector => {
      $(selector).each((_, img) => {
        const $img = $(img);
        const src = $img.attr('src');
        const alt = $img.attr('alt') || '';
        
        // Skip if no source or if it's a small icon (common class patterns for icons)
        if (!src || 
            $img.hasClass('icon') || 
            $img.hasClass('logo') ||
            src.includes('icon') || 
            src.includes('logo') || 
            alt.toLowerCase().includes('icon') || 
            alt.toLowerCase().includes('logo')) {
          return;
        }
        
        // Create full URL
        let fullUrl = src;
        if (src.startsWith('/')) {
          // Convert relative URL to absolute
          const urlObj = new URL(baseUrl);
          fullUrl = `${urlObj.origin}${src}`;
        } else if (!src.startsWith('http')) {
          // Handle other relative paths
          fullUrl = new URL(src, baseUrl).toString();
        }
        
        // Skip duplicate images
        if (seenUrls.has(fullUrl)) {
          return;
        }
        
        // Prioritize images with descriptive alt text and skip tiny images
        const $parent = $img.parent();
        if (alt.length > 10 && 
            !$parent.hasClass('icon') && 
            !$parent.hasClass('logo')) {
          images.push({ src, alt, fullUrl });
          seenUrls.add(fullUrl);
        }
      });
    });
    
    // Sort images by relevance (prefer images with more descriptive alt text)
    return images
      .sort((a, b) => b.alt.length - a.alt.length)
      .slice(0, 5); // Limit to 5 most relevant images
  } catch (error) {
    console.error("Error extracting images:", error);
    return [];
  }
}

/**
 * Extract main content from HTML
 */
function extractMainContent(html: string, baseUrl: string = ""): {
  content: string;
  images: ImageInfo[];
} {
  try {
    const $ = cheerio.load(html);
    console.log("Loaded HTML with cheerio");
    
    // Remove navigation, headers, footers, scripts, ads
    $('nav, header, footer, script, style, iframe, .advertisement, .banner, .sidebar').remove();
    console.log("Removed non-content elements");
    
    // Extract images before modifying the DOM further
    const images = extractImages(html, baseUrl);
    console.log(`Extracted ${images.length} images from page`);
    
    // First approach: Try to find main content area using common selectors
    let mainContent = '';
    const mainContentSelectors = [
      'main', 
      '#main', 
      '.main', 
      '#content', 
      '.content', 
      'article', 
      '.article', 
      '[role="main"]',
      '.field--name-body',
      '.usa-prose',
      '.page-content',
      '.main-content'
    ];
    
    // Try each selector
    for (const selector of mainContentSelectors) {
      const content = $(selector).text();
      if (content && content.trim().length > 100) {  // Only consider substantial content
        console.log(`Found content using selector: ${selector}`);
        mainContent += content + '\n\n';
      }
    }
    
    // Second approach: Extract all paragraphs if main content area wasn't found
    if (!mainContent.trim()) {
      console.log("Main content area not found, extracting paragraphs");
      
      $('p').each((_, el) => {
        const text = $(el).text().trim();
        if (text.length > 30) {  // Only include substantial paragraphs
          mainContent += text + '\n\n';
        }
      });
      
      // Also get headings
      $('h1, h2, h3, h4, h5, h6').each((_, el) => {
        const text = $(el).text().trim();
        if (text.length > 0) {
          mainContent += '# ' + text + '\n\n';
        }
      });
      
      // Get list items
      $('ul li, ol li').each((_, el) => {
        const text = $(el).text().trim();
        if (text.length > 0) {
          mainContent += '- ' + text + '\n';
        }
      });
    }
    
    // Third approach: If still no content, use the entire body text
    if (!mainContent.trim()) {
      console.log("No structured content found, using entire body text");
      mainContent = $('body').text().replace(/\s+/g, ' ').trim();
    }
    
    console.log(`Extracted content length: ${mainContent.length} characters`);
    return { content: mainContent, images };
  } catch (error) {
    console.error("Error extracting content:", error);
    return { content: "", images: [] };
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
  images: ImageInfo[];
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
              images: [],
              status: "error" as const,
              statusCode: status
            };
          }
          
          console.log(`Successfully fetched content from ${url}, extracting main content...`);
          const { content: extractedContent, images } = extractMainContent(html, url);
          console.log(`Extracted content length: ${extractedContent.length} characters`);
          console.log(`Extracted ${images.length} images from ${url}`);
          
          return {
            url,
            content: extractedContent,
            images,
            status: "success" as const
          };
        } catch (error) {
          console.error(`Error processing URL ${url}:`, error);
          return {
            url,
            content: "",
            images: [],
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
    
    // Collect all images from successful results
    let allImages: ImageInfo[] = [];
    successfulResults.forEach(result => {
      if (result.images && result.images.length > 0) {
        allImages = [...allImages, ...result.images];
      }
    });
    
    // Deduplicate images by URL and limit to only the most relevant one
    const uniqueImageUrls = new Set<string>();
    const dedupedImages = allImages
      .filter(img => {
        // Skip if no alt text or very short alt text (likely not informative)
        if (!img.alt || img.alt.length < 10) {
          return false;
        }
        
        // Skip if duplicate URL
        if (uniqueImageUrls.has(img.fullUrl)) {
          return false;
        }
        
        // Skip images with generic terms that might not be relevant
        const genericTerms = ['icon', 'logo', 'banner', 'button', 'thumbnail'];
        if (genericTerms.some(term => img.alt.toLowerCase().includes(term))) {
          return false;
        }
        
        uniqueImageUrls.add(img.fullUrl);
        return true;
      })
      // Calculate relevance score based on query match and context
      .map(img => {
        // Count how many query words appear in the alt text
        const queryWords = query.toLowerCase().split(' ').filter(w => w.length > 3);
        const matchScore = queryWords.filter(word => 
          img.alt.toLowerCase().includes(word)
        ).length;
        
        // Bonus for longer, more descriptive alt text
        const descriptionScore = Math.min(img.alt.length / 20, 3);
        
        // Calculate final score
        const relevanceScore = matchScore * 2 + descriptionScore;
        
        return { ...img, relevanceScore };
      })
      // Sort by relevance score
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      // Take only the most relevant image
      .slice(0, 1)
      // Remove the temporary score property
      .map(({ relevanceScore, ...img }) => img);
    
    console.log(`Found ${dedupedImages.length} unique relevant images`);
    
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
      preview,
      images: dedupedImages
    };
  } catch (error) {
    console.error("Error scraping content:", error);
    return {
      content: "",
      urls: [],
      rawSize: 0,
      preview: "",
      images: []
    };
  }
}
