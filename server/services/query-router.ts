import { storage } from "../storage";
import OpenAI from "openai";

// Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

// Categories for Forest Service website sections
const categories = [
  { name: "Visit", baseUrl: "fs.usda.gov/visit", description: "Recreation, trails, camping, accessibility" },
  { name: "Managing Land", baseUrl: "fs.usda.gov/managing-land", description: "Forest management, conservation, fire" },
  { name: "About Agency", baseUrl: "fs.usda.gov/about-agency", description: "Mission, leadership, organization" },
  { name: "Working with Us", baseUrl: "fs.usda.gov/working-with-us", description: "Careers, partnerships, contracts" }
];

/**
 * Classify a user query to determine which section of the Forest Service website is most relevant
 */
export async function classifyQuery(query: string): Promise<{ 
  category: string; 
  confidence: number; 
  baseUrl: string;
}> {
  try {
    // Create a system prompt for classification
    const systemPrompt = `
      You are a query classifier for a US Forest Service chatbot. Your job is to determine which section of the Forest Service website would most likely contain information relevant to the user's query.
      
      Website sections:
      ${categories.map(c => `- ${c.name}: ${c.description}`).join('\n')}
      
      Classify the query into EXACTLY ONE of these categories. Your response should be in JSON format with two fields:
      1. "category": The name of the category (one of: Visit, Managing Land, About Agency, Working with Us)
      2. "confidence": A number between 0 and 1 indicating your confidence in this classification
    `;
    
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
          content: query
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3
    });
    
    // Parse the response
    const result = JSON.parse(response.choices[0].message.content);
    
    // Find the corresponding baseUrl
    const category = categories.find(c => c.name === result.category);
    if (!category) {
      // If category not found, default to Visit
      return {
        category: "Visit",
        confidence: 0.5,
        baseUrl: "fs.usda.gov/visit"
      };
    }
    
    return {
      category: result.category,
      confidence: result.confidence,
      baseUrl: category.baseUrl
    };
  } catch (error) {
    console.error("Error classifying query:", error);
    
    // Fallback to Visit category
    return {
      category: "Visit",
      confidence: 0.5,
      baseUrl: "fs.usda.gov/visit"
    };
  }
}
