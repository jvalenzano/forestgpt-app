import { useState } from "react";
import { ChatMessage as ChatMessageType } from "@/lib/types";

interface ChatMessageProps {
  message: ChatMessageType;
  previousMessage?: ChatMessageType;
}

export default function ChatMessage({ message, previousMessage }: ChatMessageProps) {
  const [showSources, setShowSources] = useState(false);
  const isUser = message.role === "user";
  
  if (isUser) {
    return (
      <div className="flex items-start justify-end space-x-3">
        <div className="bg-forest-600 text-white rounded-lg p-3 max-w-[85%]">
          <div className="text-sm">{message.content}</div>
        </div>
        <div className="bg-gray-200 rounded-full p-2 flex-shrink-0">
          <i className="fas fa-user"></i>
        </div>
      </div>
    );
  }
  
  // Determine if we have a user query to echo (from the previous message)
  const userQuery = previousMessage?.role === "user" ? previousMessage.content : null;
  
  return (
    <div className="flex items-start space-x-3">
      <div className="bg-forest-700 text-white rounded-full p-2 flex-shrink-0">
        <i className="fas fa-tree"></i>
      </div>
      <div className="bg-gray-100 rounded-lg p-3 max-w-[85%]">
        <div className="text-sm font-medium text-forest-800">ForestGPT</div>
        
        {/* Echo the user's query in italics if available */}
        {userQuery && (
          <div className="text-xs italic text-gray-500 mb-2">
            {userQuery}
          </div>
        )}
        
        <div 
          className="prose prose-sm text-gray-700 font-serif"
          dangerouslySetInnerHTML={{ __html: message.content }}
        />
        
        {/* Collapsible sources section */}
        {message.sources && message.sources.length > 0 && (
          <div className="text-xs text-gray-500 mt-2">
            <button 
              onClick={() => setShowSources(!showSources)}
              className="flex items-center font-medium text-forest-700 hover:underline focus:outline-none"
            >
              <span>Sources</span>
              <span className="ml-1">{showSources ? "▲" : "▼"}</span>
            </button>
            
            {showSources && (
              <div className="mt-1 pl-2 border-l-2 border-forest-200 space-y-1">
                {message.sources.map((source, index) => (
                  <a 
                    key={index}
                    href={source.url.startsWith("http") ? source.url : "#"} 
                    className={`block ${source.url.startsWith("http") ? "text-forest-700 hover:underline" : ""}`}
                    target={source.url.startsWith("http") ? "_blank" : undefined}
                    rel={source.url.startsWith("http") ? "noopener noreferrer" : undefined}
                  >
                    {source.url}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
