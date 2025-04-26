import { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import ChatForm from "./ChatForm";
import LoadingIndicator from "./LoadingIndicator";
import { ChatMessage as ChatMessageType } from "@/lib/types";
import { sendChatMessage } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface ChatInterfaceProps {
  debugMode: boolean;
  onUpdateDebugInfo: (debugInfo: any) => void;
}

export default function ChatInterface({ 
  debugMode, 
  onUpdateDebugInfo 
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: "welcome",
      role: "bot",
      content: `<p>Hello! I'm ForestGPT, your US Forest Service assistant. I can help answer questions about:</p>
      <ul class="list-disc pl-5 mt-2">
        <li>Recreation and visiting national forests</li>
        <li>Forest management and conservation</li>
        <li>The Forest Service organization</li>
        <li>Career opportunities and partnerships</li>
      </ul>
      <p class="mt-2">What would you like to know about today?</p>`,
      timestamp: new Date(),
      sources: [{ url: "Internal system message" }]
    }
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;
    
    // Add user message to chat
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Send message to server
      const response = await sendChatMessage(message);
      
      setMessages(prev => [...prev, response.message]);
      
      // Update debug info if available
      if (response.debugInfo && debugMode) {
        onUpdateDebugInfo(response.debugInfo);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again later.",
        variant: "destructive"
      });
      
      // Add error message
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "bot",
          content: "<p>I'm sorry, I encountered an error while processing your request. Please try again later.</p>",
          timestamp: new Date(),
          sources: [{ url: "System error message" }]
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex-grow md:w-3/4 flex flex-col h-[calc(100vh-8rem)]">
      <div className="bg-white rounded-lg shadow-md p-4 flex-grow flex flex-col overflow-hidden">
        <div className="border-b pb-3 mb-4">
          <h2 className="text-lg font-semibold text-forest-900">Chat with ForestGPT</h2>
          <p className="text-sm text-gray-600">
            Ask questions about the US Forest Service. All responses are based on content from fs.usda.gov
          </p>
        </div>
        
        {/* Chat Messages Container */}
        <div 
          className="flex-grow overflow-y-auto px-2 space-y-4"
          style={{ scrollBehavior: "smooth" }}
        >
          {messages.map((message, index) => (
            <ChatMessage 
              key={message.id} 
              message={message} 
              previousMessage={index > 0 ? messages[index - 1] : undefined}
            />
          ))}
          
          {isLoading && <LoadingIndicator />}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Chat Input Form */}
        <ChatForm onSendMessage={handleSendMessage} disabled={isLoading} />
      </div>
    </section>
  );
}
