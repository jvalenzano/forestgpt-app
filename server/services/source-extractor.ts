import { Source } from "./llm";

/**
 * Extract the most relevant URLs from scraped content as sources
 * 
 * This module provides enhanced source extraction capabilities to ensure
 * that the most relevant and specific sources are selected for each response.
 */

/**
 * Source relevance scoring structure
 */
interface ScoredSource {
  url: string;
  score: number;
  title?: string;
}

/**
 * Source extraction configuration
 */
interface SourceExtractionConfig {
  maxSources: number;
  prioritizeSpecificUrls: boolean;
  excludeGenericUrls: boolean;
}

// Default source URLs to exclude as they're too generic
const GENERIC_URLS = [
  "https://www.fs.usda.gov",
  "https://fs.usda.gov",
  "https://www.fs.usda.gov/",
  "https://fs.usda.gov/"
];

// URL patterns that indicate search pages (lower relevance)
const SEARCH_PATTERNS = [
  "/search?",
  "?q=",
  "?search=",
  "/results"
];

/**
 * Extract the most relevant sources from a set of URLs based on the query and content
 */
export function extractRelevantSources(
  query: string,
  sourceUrls: string[],
  responseContent: string,
  config: Partial<SourceExtractionConfig> = {}
): Source[] {
  console.log(`Extracting relevant sources from ${sourceUrls.length} URLs`);
  
  // Apply defaults
  const fullConfig: SourceExtractionConfig = {
    maxSources: 3,
    prioritizeSpecificUrls: true,
    excludeGenericUrls: true,
    ...config
  };
  
  // Filter out generic URLs if specified
  let filteredUrls = sourceUrls;
  if (fullConfig.excludeGenericUrls) {
    filteredUrls = sourceUrls.filter(url => !GENERIC_URLS.includes(url));
    console.log(`Filtered out generic URLs, ${filteredUrls.length} remaining`);
  }
  
  // Ensure we have at least some URLs
  if (filteredUrls.length === 0 && sourceUrls.length > 0) {
    filteredUrls = [sourceUrls[0]]; // Get at least one URL
    console.log(`Using at least one source URL: ${filteredUrls[0]}`);
  }
  
  // Score each URL for relevance
  const scoredSources: ScoredSource[] = filteredUrls.map(url => {
    let score = 0;
    
    // Base score calculations
    
    // 1. Longer URLs are usually more specific pages, which is good
    score += url.length * 0.01;
    
    // 2. URLs with more path segments are usually more specific
    const pathSegments = new URL(url).pathname.split('/').filter(Boolean).length;
    score += pathSegments * 2;
    
    // 3. Penalize search URLs
    if (SEARCH_PATTERNS.some(pattern => url.includes(pattern))) {
      score -= 5;
    }
    
    // 4. Boost URLs that contain query terms in the path
    const queryTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 3);
    queryTerms.forEach(term => {
      if (url.toLowerCase().includes(term)) {
        score += 3;
      }
    });
    
    // 5. Boost URLs that match key terms from the response
    // Extract important terms from the response (nouns, names, concepts)
    const responseTerms = responseContent
      .toLowerCase()
      .split(/\s+/)
      .filter(term => term.length > 4) // Longer terms are more likely to be meaningful
      .slice(0, 20); // Only look at a subset to avoid performance issues
    
    responseTerms.forEach(term => {
      if (url.toLowerCase().includes(term)) {
        score += 2;
      }
    });
    
    // 6. Boost for category-specific URLs
    const categories = [
      "visit", "recreation", "hiking", "camping", "fishing", "hunting", 
      "managing-land", "fire", "natural-resources", "wildlife", "water-resources",
      "about-agency", "mission", "history", "leadership", "biographies",
      "working-with-us", "jobs", "volunteer", "partnerships", "research"
    ];
    
    categories.forEach(category => {
      // Direct category matches in URL are good
      if (url.includes(`/${category}/`) || url.includes(`/${category}`)) {
        score += 2;
        
        // Especially if they match the query
        if (query.toLowerCase().includes(category)) {
          score += 5;
        }
      }
    });
    
    return { url, score };
  });
  
  // Sort by score descending
  scoredSources.sort((a, b) => b.score - a.score);
  
  // Log top sources for debugging
  console.log("Top scored sources:");
  scoredSources.slice(0, 3).forEach(({ url, score }) => {
    console.log(`- ${url} (score: ${score.toFixed(1)})`);
  });
  
  // Return top N sources
  return scoredSources
    .slice(0, fullConfig.maxSources)
    .map(({ url }) => ({ url }));
}

/**
 * Extract page title from HTML content
 */
export function extractPageTitle(html: string, url: string): string | undefined {
  try {
    // Simple regex to extract title
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      let title = titleMatch[1].trim();
      
      // Clean up common title patterns
      title = title
        .replace(" | US Forest Service", "")
        .replace(" | USDA Forest Service", "")
        .replace(" | Forest Service", "")
        .replace(" | USDA", "");
      
      // If title is still too long, truncate
      if (title.length > 60) {
        title = title.substring(0, 57) + "...";
      }
      
      return title;
    }
  } catch (error) {
    console.error("Error extracting page title:", error);
  }
  
  // Fallback: Use the URL path
  try {
    const path = new URL(url).pathname;
    // Convert paths like /about-agency/leadership to "About Agency Leadership"
    return path
      .split('/')
      .filter(Boolean)
      .map(segment => 
        segment
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      )
      .join(' - ');
  } catch (error) {
    return undefined;
  }
}

/**
 * Enhance sources with titles if available
 */
export async function enhanceSources(sources: Source[], fetchHtmlFn?: (url: string) => Promise<string>): Promise<Source[]> {
  if (!fetchHtmlFn) {
    return sources; // No fetch function provided, return as is
  }
  
  // Process each source asynchronously
  const enhancedSources = await Promise.all(
    sources.map(async (source) => {
      try {
        const html = await fetchHtmlFn(source.url);
        const title = extractPageTitle(html, source.url);
        return { ...source, title };
      } catch (error) {
        console.error(`Error enhancing source ${source.url}:`, error);
        return source;
      }
    })
  );
  
  return enhancedSources;
}