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
  }
): Promise<{
  response: string;
  sources: Source[];
  llmDetails: LLMDetails;
}> {
  const startTime = Date.now();
  
  try {
    const { processedContent, sourceUrls, chunks, llmDetails } = processedData;
    
    // System message that instructs the LLM how to respond
    const systemPrompt = `
      You are ForestGPT, an assistant for the US Forest Service. Your purpose is to provide accurate information about the US Forest Service based ONLY on the content provided.
      
      Follow these rules:
      1. Only use information from the provided context to answer the question.
      2. If the context doesn't contain enough information to answer the question fully, acknowledge the limitations.
      3. Format your response in HTML for better readability (<p>, <ul>, <li>, <strong> tags are supported).
      4. Do NOT make up or infer information that isn't present in the context.
      5. Do NOT mention that you're an AI or that you're using provided context - stay in character as a Forest Service assistant.
      6. When mentioning specific information, be specific rather than general when the context allows.
      7. Your knowledge is limited to the US Forest Service topics found in the provided context.
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
        <p>I'm sorry, but I couldn't find specific information about that topic on the US Forest Service website. 
        You might want to:</p>
        <ul>
          <li>Try rephrasing your question</li>
          <li>Check the official US Forest Service website directly at 
            <a href="https://www.fs.usda.gov" target="_blank">fs.usda.gov</a></li>
          <li>Contact the Forest Service directly for more specific information</li>
        </ul>
      `;
      
      const processingTime = (Date.now() - startTime) / 1000;
      
      return {
        response: fallbackResponse,
        sources: [{ url: "No relevant information found" }],
        llmDetails: {
          ...llmDetails,
          tokens: { input: 0, output: 0 },
          processingTime
        }
      };
    }
    
    // User message includes the original query
    const userMessage = `
      Question: ${query}
      
      Context:
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
      temperature: 0.7,
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
    
    // Format source URLs
    const sources: Source[] = sourceUrls.map(url => ({ url }));
    
    return {
      response: generatedResponse,
      sources,
      llmDetails: updatedLLMDetails
    };
  } catch (error) {
    console.error("Error generating response:", error);
    
    const errorResponse = `
      <p>I apologize, but I encountered an error while processing your request. 
      Please try again later or rephrase your question.</p>
    `;
    
    const processingTime = (Date.now() - startTime) / 1000;
    
    return {
      response: errorResponse,
      sources: [{ url: "Error processing request" }],
      llmDetails: {
        model: "gpt-4o",
        tokens: { input: 0, output: 0 },
        processingTime
      }
    };
  }
}
