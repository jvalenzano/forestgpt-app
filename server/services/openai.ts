import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "" 
});

/**
 * Generate an OpenAI chat completion
 */
export async function generateChatCompletion(
  systemPrompt: string,
  userPrompt: string,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    jsonResponse?: boolean;
  } = {}
) {
  try {
    const {
      model = "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      temperature = 0.7,
      maxTokens = 1000,
      jsonResponse = false
    } = options;
    
    const response = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      temperature,
      max_tokens: maxTokens,
      ...(jsonResponse ? { response_format: { type: "json_object" } } : {})
    });
    
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    throw error;
  }
}

/**
 * Count tokens in a string
 */
export async function countTokens(text: string): Promise<number> {
  try {
    const response = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: text,
      max_tokens: 0,
      echo: true
    });
    
    return response.usage?.total_tokens || 0;
  } catch (error) {
    console.error("Error counting tokens:", error);
    // Fallback: rough approximation (4 chars per token on average)
    return Math.ceil(text.length / 4);
  }
}
