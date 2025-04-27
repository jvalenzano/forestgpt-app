import { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import ChatForm from "./ChatForm";
import LoadingIndicator from "./LoadingIndicator";
import ForestTrivia from "./ForestTrivia";
import ForestRegionMap from "./ForestRegionMap";
import { ChatMessage as ChatMessageType } from "@/lib/types";
import { sendChatMessage } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useTrivia } from "@/hooks/use-trivia";

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
  const [isRegionMapVisible, setIsRegionMapVisible] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Initialize trivia hook with custom settings
  const { isTriviaVisible, hideTrivia, showTrivia } = useTrivia({
    initialDelay: 20000,   // First trivia appears after 20 seconds
    interval: 180000,      // New trivia every 3 minutes
    duration: 5000,        // Each trivia shows for 5 seconds
    enabled: true          // Trivia is enabled by default
  });
  
  // Function to check if a message contains location/region related keywords
  const containsRegionKeywords = (message: string): boolean => {
    const regionKeywords = [
      'region', 'regions', 'map', 'location', 'where', 'area', 'areas', 
      'forest service regions', 'forest regions', 'national forest locations',
      'where is', 'located', 'northern region', 'southern region', 'eastern region',
      'western region', 'pacific', 'rocky mountain', 'alaska', 'southwestern'
    ];
    
    const lowercaseMessage = message.toLowerCase();
    return regionKeywords.some(keyword => lowercaseMessage.includes(keyword));
  };

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
    
    // Check if the message contains region-related keywords to show the map
    if (containsRegionKeywords(message)) {
      // Show the map with a slight delay to allow the message to be sent first
      setTimeout(() => {
        setIsRegionMapVisible(true);
      }, 500);
    }
    
    try {
      // Send message to server
      const response = await sendChatMessage(message);
      
      setMessages(prev => [...prev, response.message]);
      
      // Update debug info if available
      if (response.debugInfo && debugMode) {
        onUpdateDebugInfo(response.debugInfo);
      }
      
      // Also check bot response for region keywords to show map
      if (!isRegionMapVisible && containsRegionKeywords(response.message.content)) {
        setIsRegionMapVisible(true);
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
      {/* Forest Trivia Component */}
      <ForestTrivia isVisible={isTriviaVisible} onClose={hideTrivia} />
      
      {/* Forest Region Map Component */}
      <ForestRegionMap isVisible={isRegionMapVisible} onClose={() => setIsRegionMapVisible(false)} />
      
      <div className="chat-container p-4 flex-grow flex flex-col overflow-hidden forest-element">
        <div className="leaf"></div>
        <div className="leaf"></div>
        <div className="leaf"></div>
        <div className="border-b border-green-800 pb-4 mb-6">
          <div className="flex items-center mb-2">
            <div className="bot-avatar w-12 h-12 forest-element mr-3">
              <i className="fas fa-tree text-lg"></i>
              <div className="leaf"></div>
              <div className="leaf"></div>
              <div className="leaf"></div>
            </div>
            <div>
              <h2 className="text-2xl forest-gradient-text">
                ForestGPT
              </h2>
              <p className="text-sm text-green-300">
                Your US Forest Service virtual assistant
              </p>
            </div>
            <div className="ml-auto">
              <button 
                onClick={() => setIsRegionMapVisible(true)}
                className="text-xs bg-green-900 hover:bg-green-800 text-green-100 py-1 px-3 rounded-full flex items-center space-x-1 transition-colors"
              >
                <i className="fas fa-map-marked-alt text-green-400 mr-1"></i>
                <span>Forest Regions</span>
              </button>
            </div>
          </div>
          <p className="text-sm text-green-300 pl-2 border-l-4 border-green-700 ml-2 mt-3">
            Ask questions about the US Forest Service. All responses are based on content from fs.usda.gov
          </p>
        </div>
        
        {/* Initial welcome message if no messages */}
        {messages.length === 0 && (
          <div className="flex items-start space-x-3 mb-6">
            <div className="bot-avatar forest-element">
              <i className="fas fa-tree"></i>
              <div className="leaf"></div>
              <div className="leaf"></div>
              <div className="leaf"></div>
            </div>
            <div className="bot-message forest-element">
              <div className="leaf"></div>
              <div className="leaf"></div>
              <div className="leaf"></div>
              <div className="text-sm font-semibold text-green-100 mb-2">ForestGPT</div>
              <div className="prose prose-invert prose-sm">
                <p>Hello! I'm ForestGPT, your US Forest Service assistant. I can help answer questions about:</p>
                <ul className="pl-5 mt-2 space-y-1">
                  <li className="flex items-center">
                    <i className="fas fa-campground text-green-400 mr-2"></i>
                    Recreation and visiting national forests
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-leaf text-green-400 mr-2"></i>
                    Forest management and conservation
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-sitemap text-green-400 mr-2"></i>
                    The Forest Service organization
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-handshake text-green-400 mr-2"></i>
                    Career opportunities and partnerships
                  </li>
                </ul>
                <p className="mt-3">What would you like to know about today?</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Chat Messages Container */}
        <div 
          className="flex-grow overflow-y-auto px-2 space-y-6 py-2"
          style={{ scrollBehavior: "smooth" }}
        >
          {messages.map((message, index) => (
            <ChatMessage 
              key={message.id} 
              message={message} 
              previousMessage={index > 0 ? messages[index - 1] : undefined}
              onShowRegionMap={() => setIsRegionMapVisible(true)}
            />
          ))}
          
          {isLoading && <LoadingIndicator />}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Chat Input Form */}
        <div className="pt-4 border-t border-green-800 mt-4">
          <ChatForm onSendMessage={handleSendMessage} disabled={isLoading} />
        </div>
      </div>
    </section>
  );
}
