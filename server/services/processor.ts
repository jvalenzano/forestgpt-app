import * as cheerio from "cheerio";
import { LLMDetails } from "./llm";

/**
 * Clean HTML and extract meaningful text
 */
function cleanHtml(html: string): string {
  // If the input is already plaintext (not HTML), return it directly
  if (!html.includes('<') || !html.includes('>')) {
    console.log("Input appears to be plain text, skipping HTML cleaning");
    return html.trim();
  }

  console.log("Cleaning HTML content");
  const $ = cheerio.load(html);
  
  // Remove unnecessary elements
  $('script, style, noscript, iframe, img').remove();
  
  // Replace certain elements with meaningful text
  $('a').each((_, el) => {
    const $el = $(el);
    const href = $el.attr('href');
    const text = $el.text().trim();
    
    if (href && text && !href.startsWith('#')) {
      // Make sure to handle relative URLs
      let fullHref = href;
      if (href.startsWith('/')) {
        fullHref = 'https://www.fs.usda.gov' + href;
      }
      $el.replaceWith(`${text} (${fullHref})`);
    }
  });
  
  // Get the text, preserving some structure
  let text = '';
  
  // Process headings
  $('h1, h2, h3, h4, h5, h6').each((_, el) => {
    const $el = $(el);
    const headingText = $el.text().trim();
    if (headingText) {
      text += '\n## ' + headingText + '\n\n';
    }
  });
  
  // Process paragraphs
  $('p').each((_, el) => {
    const $el = $(el);
    const paragraphText = $el.text().trim();
    if (paragraphText) {
      text += paragraphText + '\n\n';
    }
  });
  
  // Process lists
  $('ul, ol').each((_, el) => {
    const $el = $(el);
    text += '\n';
    $el.find('li').each((_, li) => {
      const listItemText = $(li).text().trim();
      if (listItemText) {
        text += '- ' + listItemText + '\n';
      }
    });
    text += '\n';
  });
  
  // Process tables
  $('table').each((_, table) => {
    const $table = $(table);
    text += 'Table: ';
    
    // Add caption if exists
    const caption = $table.find('caption').text().trim();
    if (caption) {
      text += caption + '\n';
    } else {
      text += 'Data table\n';
    }
    
    // Process rows
    $table.find('tr').each((_, row) => {
      const $row = $(row);
      const rowData: string[] = [];
      
      // Process cells
      $row.find('th, td').each((_, cell) => {
        rowData.push($(cell).text().trim());
      });
      
      if (rowData.length > 0) {
        text += rowData.join(' | ') + '\n';
      }
    });
    
    text += '\n';
  });
  
  // If we didn't extract anything with the structured approach, fall back to getting all text
  if (!text.trim()) {
    console.log("Structured extraction yielded no content, falling back to all text");
    text = $('body').text();
  }
  
  // Clean up whitespace
  const cleanedText = text
    .replace(/\n{3,}/g, '\n\n')  // Replace 3+ newlines with just 2
    .replace(/\s{2,}/g, ' ')     // Replace multiple spaces with one
    .trim();                     // Remove leading/trailing whitespace
  
  console.log(`Cleaned HTML content length: ${cleanedText.length} characters`);
  return cleanedText;
}

/**
 * Split content into manageable chunks for LLM processing
 */
function chunkContent(text: string, maxChunkSize: number = 1500): string[] {
  if (text.length <= maxChunkSize) {
    return [text];
  }
  
  const chunks: string[] = [];
  let currentChunk = '';
  
  // Split by paragraphs first
  const paragraphs = text.split(/\n\n+/);
  
  for (const paragraph of paragraphs) {
    // If adding this paragraph would exceed the chunk size, save current chunk and start a new one
    if (currentChunk.length + paragraph.length + 2 > maxChunkSize) {
      if (currentChunk.length > 0) {
        chunks.push(currentChunk);
        currentChunk = '';
      }
      
      // If a single paragraph is too large, split it by sentences
      if (paragraph.length > maxChunkSize) {
        const sentences = paragraph.split(/(?<=[.!?])\s+/);
        let sentenceChunk = '';
        
        for (const sentence of sentences) {
          if (sentenceChunk.length + sentence.length + 1 > maxChunkSize) {
            chunks.push(sentenceChunk);
            sentenceChunk = sentence;
          } else {
            sentenceChunk += (sentenceChunk ? ' ' : '') + sentence;
          }
        }
        
        if (sentenceChunk.length > 0) {
          currentChunk = sentenceChunk;
        }
      } else {
        currentChunk = paragraph;
      }
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
    }
  }
  
  // Add the last chunk if it has content
  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }
  
  return chunks;
}

/**
 * Extract potential URLs from content
 */
function extractUrls(content: string): string[] {
  // Match URLs in format "text (http...)" which we formatted earlier
  const urlRegex = /\(https?:\/\/[^)]+\)/g;
  const matches = content.match(urlRegex) || [];
  
  return matches
    .map(match => match.slice(1, -1)) // Remove parentheses
    .filter(url => url.includes('fs.usda.gov')); // Only Forest Service URLs
}

/**
 * Image information from scraping
 */
export interface ImageInfo {
  src: string;
  alt: string;
  fullUrl: string;
}

/**
 * Process content for the LLM
 */
export async function processContent(scrapedContent: {
  content: string;
  urls: Array<{ url: string; status: string }>;
  images?: ImageInfo[];
}): Promise<{
  processedContent: string;
  sourceUrls: string[];
  processedSize: number;
  chunks: string[];
  llmDetails: LLMDetails;
  images: ImageInfo[];
}> {
  try {
    // Clean the HTML content
    const cleanedText = cleanHtml(scrapedContent.content);
    
    // Split into chunks
    const chunks = chunkContent(cleanedText);
    
    // Extract URLs from content
    const extractedUrls = extractUrls(cleanedText);
    
    // Combine with successful scraped URLs
    const successfulUrls = scrapedContent.urls
      .filter(url => url.status === 'success')
      .map(url => url.url);
      
    const sourceUrls = Array.from(new Set([...successfulUrls, ...extractedUrls]));
    
    // Calculate processed size
    const processedSize = Buffer.from(cleanedText).length;
    
    // Calculate LLM details (estimated)
    const tokens = Math.ceil(cleanedText.length / 4); // Very rough approximation
    
    const llmDetails: LLMDetails = {
      model: "gpt-4o",
      tokens: {
        input: tokens,
        output: Math.ceil(tokens * 0.3) // Estimate output tokens as 30% of input
      },
      processingTime: 0 // Will be updated during LLM processing
    };
    
    // Get images from scraped content or use empty array if none provided
    const images = scrapedContent.images || [];
    
    return {
      processedContent: cleanedText,
      sourceUrls,
      processedSize,
      chunks,
      llmDetails,
      images
    };
  } catch (error) {
    console.error("Error processing content:", error);
    return {
      processedContent: "",
      sourceUrls: [],
      processedSize: 0,
      chunks: [],
      llmDetails: {
        model: "gpt-4o",
        tokens: { input: 0, output: 0 },
        processingTime: 0
      },
      images: []
    };
  }
}
