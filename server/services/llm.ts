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
    
    // Get the images from the processed data
    const { images } = processedData;
    
    return {
      response: generatedResponse,
      sources,
      llmDetails: updatedLLMDetails,
      images
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
