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
        <div className="user-message">
          <div className="text-sm">{message.content}</div>
        </div>
        <div className="user-avatar">
          <i className="fas fa-user"></i>
        </div>
      </div>
    );
  }
  
  // Determine if we have a user query to echo (from the previous message)
  const userQuery = previousMessage?.role === "user" ? previousMessage.content : null;
  
  return (
    <div className="flex items-start space-x-3">
      <div className="bot-avatar">
        <i className="fas fa-tree"></i>
      </div>
      <div className="bot-message">
        <div className="text-sm font-semibold text-forest-800 mb-1">ForestGPT</div>
        
        {/* Echo the user's query in italics if available */}
        {userQuery && (
          <div className="text-xs italic text-gray-500 mb-2 border-l-2 border-forest-200 pl-2">
            {userQuery}
          </div>
        )}
        
        <div 
          className="prose prose-sm text-gray-700"
          dangerouslySetInnerHTML={{ __html: message.content }}
        />
        
        {/* Collapsible sources section */}
        {message.sources && message.sources.length > 0 && (
          <div className="text-xs text-gray-500 mt-3 pt-2 border-t border-forest-100">
            <button 
              onClick={() => setShowSources(!showSources)}
              className="flex items-center font-medium text-forest-600 hover:text-forest-700 focus:outline-none transition-colors"
              aria-expanded={showSources}
              aria-controls="source-links"
            >
              <i className="fas fa-quote-left text-forest-400 mr-1.5"></i>
              <span>Sources</span>
              <span className="ml-1 text-forest-500 transition-transform duration-200" 
                style={{ transform: showSources ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                <i className="fas fa-chevron-down text-xs"></i>
              </span>
            </button>
            
            {showSources && (
              <div id="source-links" className="mt-2 pl-3 border-l-2 border-forest-200 space-y-1 py-1 bg-forest-50 rounded-r-md">
                {message.sources.map((source, index) => (
                  <a 
                    key={index}
                    href={source.url.startsWith("http") ? source.url : "#"} 
                    className={`block truncate ${source.url.startsWith("http") ? "text-forest-600 hover:text-forest-800 hover:underline" : ""}`}
                    target={source.url.startsWith("http") ? "_blank" : undefined}
                    rel={source.url.startsWith("http") ? "noopener noreferrer" : undefined}
                    title={source.url}
                  >
                    <i className="fas fa-link text-forest-400 mr-1.5 text-xs"></i>
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
