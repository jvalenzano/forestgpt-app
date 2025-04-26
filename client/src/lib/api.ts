import { apiRequest } from "./queryClient";
import { 
  ChatMessage, 
  ChatResponse, 
  DebugInformation
} from "./types";

/**
 * Send a chat message to the server and get a response
 */
export async function sendChatMessage(
  message: string
): Promise<ChatResponse> {
  const response = await apiRequest(
    "POST",
    "/api/chat",
    { message }
  );
  return response.json();
}

/**
 * Get debug information for the last chat message
 */
export async function getDebugInfo(): Promise<DebugInformation> {
  const response = await apiRequest(
    "GET",
    "/api/debug"
  );
  return response.json();
}

/**
 * Toggle debug mode
 */
export async function toggleDebugMode(
  isEnabled: boolean
): Promise<{ success: boolean }> {
  const response = await apiRequest(
    "POST",
    "/api/debug/toggle",
    { isEnabled }
  );
  return response.json();
}
