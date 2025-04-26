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
      <div className="bg-white rounded-xl shadow-lg p-4 flex-grow flex flex-col overflow-hidden border border-forest-100">
        <div className="border-b border-forest-100 pb-4 mb-4">
          <div className="flex items-center space-x-2 mb-1">
            <div className="bg-forest-600 text-white rounded-full p-1.5 w-8 h-8 flex items-center justify-center shadow-sm">
              <i className="fas fa-tree"></i>
            </div>
            <h2 className="text-xl font-bold text-forest-900 bg-gradient-to-r from-forest-700 to-forest-500 bg-clip-text text-transparent">
              Chat with ForestGPT
            </h2>
          </div>
          <p className="text-sm text-gray-600 pl-10">
            Ask questions about the US Forest Service. All responses are based on content from fs.usda.gov
          </p>
        </div>
        
        {/* Chat Messages Container */}
        <div 
          className="flex-grow overflow-y-auto px-2 space-y-5 py-2 scrollbar-thin scrollbar-thumb-forest-200 scrollbar-track-transparent"
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
        <div className="pt-2 border-t border-forest-100">
          <ChatForm onSendMessage={handleSendMessage} disabled={isLoading} />
        </div>
      </div>
    </section>
  );
}
