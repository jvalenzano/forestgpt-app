import OpenAI from "openai";
import { encode } from "gpt-tokenizer";

// Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

export interface LLMDetails {
  model: string;
  tokens: {
    input: number;
    output: number;
  };
  processingTime: number;
}

interface Source {
  url: string;
  title?: string;
}

interface ImageInfo {
  src: string;
  alt: string;
  fullUrl: string;
}

/**
 * Generate a response using OpenAI's GPT model based on scraped content
 */
export async function generateResponse(
  query: string,
  processedData: {
    processedContent: string;
    sourceUrls: string[];
    chunks: string[];
    llmDetails: LLMDetails;
    images: ImageInfo[];
  }
): Promise<{
  response: string;
  sources: Source[];
  llmDetails: LLMDetails;
  images: ImageInfo[];
}> {
  const startTime = Date.now();
  
  try {
    const { processedContent, sourceUrls, chunks, llmDetails } = processedData;
    
    // System message that instructs the LLM how to respond
    const systemPrompt = `
      You are ForestGPT, the official assistant for the US Forest Service. Your purpose is to provide authoritative information about the US Forest Service.
      
      Follow these rules strictly:
      1. NEVER repeat the user's question in your response - the interface already shows it.
      2. Start your response directly with the answer - no introduction needed.
      3. NEVER express uncertainty or doubt in your responses.
      4. NEVER use phrases like "based on the Forest Service website" or "the context doesn't mention" or "not explicitly stated".
      5. Present ALL information as definitive Forest Service fact - speak with complete confidence.
      6. Format your response in HTML for better readability (<p>, <ul>, <li>, <strong> tags are supported).
      7. If asked "how to" do something, provide specific, step-by-step instructions.
      8. DO NOT include statements like "You can find additional details at fs.usda.gov or by contacting your local Forest Service office" - this is redundant as sources are displayed separately.
      9. NEVER include generic URLs like "https://www.fs.usda.gov" in your response text - only include specific, directly relevant pages if needed.
      10. Maintain an authoritative, knowledgeable tone throughout all responses.
      11. Never acknowledge limitations in your knowledge - simply provide the information you do have confidently.
      12. Be concise and direct - avoid unnecessary qualifiers like "generally" or "typically" unless they add essential meaning.
      13. Always speak as a definitive source of Forest Service information.
    `;
    
    // Combine chunks into context, being mindful of token limits
    const maxContextTokens = 6000; // Conservative limit for gpt-4o
    let context = "";
    let contextTokens = 0;
    
    for (const chunk of chunks) {
      const chunkTokens = encode(chunk).length;
      
      // If adding this chunk would exceed token limit, stop adding chunks
      if (contextTokens + chunkTokens > maxContextTokens) {
        break;
      }
      
      context += chunk + "\n\n";
      contextTokens += chunkTokens;
    }
    
    // If we have no context, provide a fallback message
    if (!context.trim()) {
      const fallbackResponse = `
        <p>Based on the Forest Service website resources, the specific information you're looking for would be best found through one of these options:</p>
        <ul>
          <li>Visit the official US Forest Service website at <a href="https://www.fs.usda.gov" target="_blank">fs.usda.gov</a> and use the search function</li>
          <li>Contact your local Forest Service office for the most accurate and up-to-date information</li>
          <li>Check the specific forest or grassland page for detailed information related to your question</li>
        </ul>
        <p>Is there another Forest Service topic I can help you with today?</p>
      `;
      
      const processingTime = (Date.now() - startTime) / 1000;
      
      return {
        response: fallbackResponse,
        sources: [{ url: "No relevant information found" }],
        llmDetails: {
          ...llmDetails,
          tokens: { input: 0, output: 0 },
          processingTime
        },
        images: []
      };
    }
    
    // User message includes the original query with clear instructions
    const userMessage = `
      User's Question: "${query}"
      
      As the official ForestGPT assistant, provide a direct, authoritative, and confident answer to this question.
      
      CRITICAL INSTRUCTIONS:
      - DO NOT repeat or restate the user's question in your response - the interface already shows it
      - Start your response directly with the answer - no introduction needed
      - Answer with complete authority and certainty - NEVER express doubt or uncertainty
      - If the question asks HOW TO do something, provide STEP-BY-STEP instructions
      - Include SPECIFIC details relevant to the question (locations, requirements, contacts, etc.)
      - NEVER say "based on the Forest Service website" or "the context doesn't mention" - simply provide the information directly
      - DO NOT include generic closing statements like "You can find more information at fs.usda.gov" - this is redundant
      - DO NOT add URLs to generic Forest Service pages - only include specific, directly relevant page links if essential
      - Speak as if you have complete knowledge of all Forest Service information
      - Be concise and to the point - avoid unnecessary filler text
      - Format your response to be EASY TO READ (use lists, paragraphs, bold as appropriate)
      
      Forest Service Website Content:
      ${context}
    `;
    
    // Calculate input tokens
    const inputTokens = encode(systemPrompt + userMessage).length;
    
    // Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      temperature: 0.3, // Lower temperature for more focused, direct responses
      max_tokens: 1000
    });
    
    // Get the response content
    const generatedResponse = response.choices[0].message.content?.trim() || "";
    
    // Calculate output tokens
    const outputTokens = encode(generatedResponse).length;
    
    // Calculate processing time
    const processingTime = (Date.now() - startTime) / 1000;
    
    // Update LLM details
    const updatedLLMDetails: LLMDetails = {
      model: "gpt-4o",
      tokens: {
        input: inputTokens,
        output: outputTokens
      },
      processingTime
    };
    
    // Filter and format sources to only include the most relevant ones
    let filteredSourceUrls = sourceUrls.filter(url => {
      // Skip generic top-level URLs
      if (url === "https://www.fs.usda.gov") {
        return false;
      }
      
      // Keep more specific URLs (deeper paths)
      return true;
    });
    
    // If we have search URLs, prioritize the most specific content URLs
    const searchUrls = filteredSourceUrls.filter(url => url.includes("/search?"));
    const contentUrls = filteredSourceUrls.filter(url => !url.includes("/search?"));
    
    // If we have both content and search URLs, prefer content URLs
    if (contentUrls.length > 0) {
      // Sort URLs by specificity (roughly estimated by path length)
      contentUrls.sort((a, b) => b.length - a.length);
      
      // Only keep up to 2 most specific content URLs
      filteredSourceUrls = contentUrls.slice(0, 2);
    } else if (searchUrls.length > 0) {
      // If we only have search URLs, use just one
      filteredSourceUrls = searchUrls.slice(0, 1);
    }
    
    // Format source URLs
    const sources: Source[] = filteredSourceUrls.map(url => ({ url }));
    
    // Only include images if they're from sources we actually used in the response
    // and if we have at least one relevant source
    let relevantImages: ImageInfo[] = [];
    if (sources.length > 0 && processedData.images.length > 0) {
      // Extract domains from sources we used
      const sourceDomains = sources.map(source => {
        try {
          const url = new URL(source.url);
          return url.hostname;
        } catch {
          return "";
        }
      }).filter(Boolean);
      
      // Improved image selection logic for better context matching
      const queryKeywords = query.toLowerCase().split(/\s+/);
      const responseKeywords = generatedResponse.toLowerCase().split(/\s+/);
      
      // Filter for images from domains we used in the response
      let candidateImages = processedData.images.filter(image => {
        try {
          const imageUrl = new URL(image.fullUrl);
          return sourceDomains.some(domain => imageUrl.hostname.includes(domain));
        } catch {
          return false;
        }
      });
      
      // Score each image based on its alt text's relevance to the query and response
      const scoredImages = candidateImages.map(image => {
        const altText = image.alt.toLowerCase();
        const altKeywords = altText.split(/\s+/);
        
        // Calculate relevance score based on keyword matches
        let score = 0;
        
        // Check for query keyword matches in alt text (higher weight)
        queryKeywords.forEach(keyword => {
          if (keyword.length > 3 && altText.includes(keyword)) {
            score += 3;
          }
        });
        
        // Check for response keyword matches in alt text
        responseKeywords.forEach(keyword => {
          if (keyword.length > 3 && altText.includes(keyword)) {
            score += 1;
          }
        });
        
        // Exact matches for important entities (people, places, specific concepts)
        const entities = [
          // Names and titles (prioritized very high)
          {term: 'chief', weight: 10},
          {term: 'secretary', weight: 10},
          {term: 'ranger', weight: 8},
          {term: 'supervisor', weight: 8},
          {term: 'director', weight: 8},
          {term: 'forester', weight: 8},
          {term: 'employee', weight: 7},
          {term: 'staff', weight: 7},
          {term: 'official', weight: 7},
          // Places and landmarks (medium priority)
          {term: 'forest', weight: 6},
          {term: 'park', weight: 6},
          {term: 'trail', weight: 6},
          {term: 'mountain', weight: 6},
          {term: 'river', weight: 5},
          {term: 'lake', weight: 5},
          // Specific topics (lower priority)
          {term: 'permit', weight: 5},
          {term: 'camping', weight: 4},
          {term: 'hiking', weight: 4},
          {term: 'conservation', weight: 4},
          {term: 'wildlife', weight: 4}
        ];
        
        entities.forEach(entity => {
          // Extra points for direct entity matches with weighted importance
          if (query.toLowerCase().includes(entity.term) && altText.includes(entity.term)) {
            score += entity.weight;
          }
        });
        
        // Special boost for person/people images when query is about people
        const personRelatedTerms = ['chief', 'secretary', 'director', 'ranger', 'forester', 'employee', 'staff', 'person', 'people'];
        const queryContainsPerson = personRelatedTerms.some(term => query.toLowerCase().includes(term));
        
        // Strong boost for person-related images when the query is about a person
        if (queryContainsPerson && (altText.includes('person') || altText.includes('people'))) {
          score += 8;
        }
        
        // Significant boost for images of people in uniform when asking about forest service staff
        if (queryContainsPerson && (altText.includes('uniform') || altText.includes('official'))) {
          score += 10;
        }
        
        // Special case for Chief of Forest Service
        if (query.toLowerCase().includes('chief') || query.toLowerCase().includes('director')) {
          if (altText.toLowerCase().includes('chief') || altText.toLowerCase().includes('director')) {
            score += 15; // Very high priority for chief/director images
          }
        }
        
        // Downgrade scores for generic images
        if (altText.includes('logo') || altText.includes('icon')) {
          score -= 5;
        }
        
        // Significantly downgrade low-information images
        if (altText.length < 10 || altText.includes('banner') || altText.includes('header')) {
          score -= 8;
        }
        
        return { image, score };
      });
      
      // Sort by score and take the most relevant image
      scoredImages.sort((a, b) => b.score - a.score);
      
      // Only include the top scoring image if it has a reasonable score
      // Higher threshold for better relevance
      if (scoredImages.length > 0 && scoredImages[0].score > 5) {
        relevantImages = [scoredImages[0].image];
        
        // Debug image selection
        console.log(`Selected image: "${scoredImages[0].image.alt}" with score: ${scoredImages[0].score}`);
        if (scoredImages.length > 1) {
          console.log(`Next best image: "${scoredImages[1].image.alt}" with score: ${scoredImages[1].score}`);
        }
      } else {
        // No image scored high enough
        console.log(`No images matched well enough for query: "${query}"`);
        if (scoredImages.length > 0) {
          console.log(`Best image only scored ${scoredImages[0].score}: "${scoredImages[0].image.alt}"`);
        }
        relevantImages = [];
      }
    }
    
    return {
      response: generatedResponse,
      sources,
      llmDetails: updatedLLMDetails,
      images: relevantImages
    };
  } catch (error) {
    console.error("Error generating response:", error);
    
    const errorResponse = `
      <p>There appears to be a temporary issue accessing the Forest Service information system. This usually resolves quickly. Please try your question again in a moment, or you can:</p>
      <ul>
        <li>Rephrase your question to be more specific</li>
        <li>Visit <a href="https://www.fs.usda.gov" target="_blank">fs.usda.gov</a> directly for the information you need</li>
      </ul>
    `;
    
    const processingTime = (Date.now() - startTime) / 1000;
    
    return {
      response: errorResponse,
      sources: [{ url: "Error processing request" }],
      images: [],
      llmDetails: {
        model: "gpt-4o",
        tokens: { input: 0, output: 0 },
        processingTime
      }
    };
  }
}
