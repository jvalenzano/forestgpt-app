import React, { useState } from "react";
import { ChatMessage as ChatMessageType } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessageProps {
  message: ChatMessageType;
  previousMessage?: ChatMessageType;
}

export default function ChatMessage({ message, previousMessage }: ChatMessageProps) {
  const [showSources, setShowSources] = useState(false);
  const isUser = message.role === "user";
  
  // Animation variants
  const bubbleVariants = {
    initial: { 
      opacity: 0, 
      scale: 0.8,
      y: 20,
      x: isUser ? 20 : -20 
    },
    animate: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      x: 0,
      transition: { 
        type: "spring", 
        damping: 15, 
        stiffness: 200,
        mass: 0.8
      } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      transition: { duration: 0.2 } 
    }
  };

  const iconVariants = {
    initial: { 
      opacity: 0, 
      scale: 0.5,
      rotate: isUser ? 15 : -15
    },
    animate: { 
      opacity: 1, 
      scale: 1,
      rotate: 0,
      transition: { 
        type: "spring", 
        delay: 0.1,
        damping: 10 
      } 
    }
  };
  
  const contentVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1, 
      transition: { 
        delay: 0.1, 
        duration: 0.3,
        staggerChildren: 0.1
      } 
    }
  };
  
  if (isUser) {
    return (
      <motion.div 
        className="flex items-start justify-end space-x-3 max-w-[95%] md:max-w-[85%] lg:max-w-[75%] ml-auto px-2 md:px-4"
        initial="initial"
        animate="animate"
        variants={{
          initial: { opacity: 0 },
          animate: { opacity: 1 }
        }}
      >
        <motion.div 
          className="user-message bg-amber-100 p-4 rounded-lg rounded-tr-none shadow-sm border border-amber-300"
          variants={bubbleVariants}
        >
          <motion.div 
            className="text-sm text-gray-800"
            variants={contentVariants}
          >
            {message.content}
          </motion.div>
        </motion.div>
        <motion.div 
          className="user-avatar bg-amber-200 w-8 h-8 rounded-full flex items-center justify-center"
          variants={iconVariants}
        >
          <i className="fas fa-user text-amber-800"></i>
        </motion.div>
      </motion.div>
    );
  }
  
  // Determine if we have a user query to echo (from the previous message)
  const userQuery = previousMessage?.role === "user" ? previousMessage.content : null;
  
  return (
    <motion.div 
      className="flex items-start space-x-3 max-w-[95%] md:max-w-[85%] lg:max-w-[75%] px-2 md:px-4"
      initial="initial"
      animate="animate"
      variants={{
        initial: { opacity: 0 },
        animate: { opacity: 1 }
      }}
    >
      <motion.div 
        className="bot-avatar bg-emerald-200 w-8 h-8 rounded-full flex items-center justify-center"
        variants={iconVariants}
      >
        <i className="fas fa-tree text-emerald-800"></i>
      </motion.div>
      <motion.div 
        className="bot-message bg-emerald-100 p-4 rounded-lg rounded-tl-none shadow-sm border border-emerald-300"
        variants={bubbleVariants}
      >
        <motion.div 
          className="text-sm font-semibold text-emerald-800 mb-1"
          variants={contentVariants}
        >
          ForestGPT
        </motion.div>
        
        {/* Echo the user's query in italics if available */}
        {userQuery && (
          <motion.div 
            className="text-xs italic text-gray-500 mb-2 border-l-2 border-emerald-200 pl-2"
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {userQuery}
          </motion.div>
        )}
        
        <motion.div 
          className="prose prose-sm text-gray-700"
          dangerouslySetInnerHTML={{ __html: message.content }}
          variants={contentVariants}
        />
        
        {/* Image display for bot responses with special handling for Chief queries */}
        {message.role === "bot" && (
          (message.content.toLowerCase().includes("randy moore") && 
           userQuery && (
             userQuery.toLowerCase().includes("chief") || 
             userQuery.toLowerCase().includes("leadership") || 
             userQuery.toLowerCase().includes("who is in charge") || 
             userQuery.toLowerCase().includes("who runs")
           )) ? (
            // Special case for Forest Service Chief
            <motion.div 
              className="mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <motion.div 
                className="relative overflow-hidden rounded-md shadow-sm border border-emerald-300 max-w-md mx-auto"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
              >
                <a 
                  href="https://upload.wikimedia.org/wikipedia/commons/e/e8/Randy_Moore_Headshot.jpg" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block"
                  title="Randy Moore, Chief of the Forest Service"
                >
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/e/e8/Randy_Moore_Headshot.jpg" 
                    alt="Randy Moore, Chief of the Forest Service" 
                    className="w-full h-auto max-h-[250px] object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = "https://www.fs.usda.gov/sites/default/files/media_wysiwyg/fs_shield.png";
                      target.className = "w-auto h-auto max-h-[80px] mx-auto my-4";
                    }}
                  />
                  <div className="bg-emerald-900 bg-opacity-80 text-white text-xs p-2 absolute bottom-0 left-0 right-0">
                    Randy Moore, Chief of the Forest Service
                  </div>
                </a>
              </motion.div>
            </motion.div>
          ) : (
            // Standard image display for regular queries
            message.images && message.images.length > 0 && (
              <motion.div 
                className="mt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <motion.div 
                  className="relative overflow-hidden rounded-md shadow-sm border border-emerald-300 max-w-md mx-auto"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <a 
                    href={message.images[0].fullUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="block"
                    title={message.images[0].alt}
                  >
                    <img 
                      src={message.images[0].fullUrl} 
                      alt={message.images[0].alt} 
                      className="w-full h-auto max-h-[250px] object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = "https://www.fs.usda.gov/sites/default/files/media_wysiwyg/fs_shield.png";
                        target.className = "w-auto h-auto max-h-[80px] mx-auto my-4";
                      }}
                    />
                    {message.images[0].alt && (
                      <div className="bg-emerald-900 bg-opacity-80 text-white text-xs p-2 absolute bottom-0 left-0 right-0">
                        {message.images[0].alt}
                      </div>
                    )}
                  </a>
                </motion.div>
              </motion.div>
            )
          )
        )}
        
        {/* Compact collapsible sources section */}
        {message.sources && message.sources.length > 0 && message.sources[0].url !== "No relevant information found" && message.sources[0].url !== "Error processing request" && (
          <motion.div 
            className="text-xs text-gray-500 mt-3 pt-2 border-t border-emerald-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <button 
              onClick={() => setShowSources(!showSources)}
              className="flex items-center px-2 py-1 rounded-md bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 focus:outline-none font-medium text-emerald-700 transition-colors"
              aria-expanded={showSources}
              aria-controls="source-links"
            >
              <i className="fas fa-link text-emerald-600 mr-1.5"></i>
              <span>View Source{message.sources.length > 1 ? 's' : ''}</span>
              <motion.span 
                className="ml-1 text-emerald-500 inline-block" 
                animate={{ rotateZ: showSources ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <i className="fas fa-chevron-down text-xs"></i>
              </motion.span>
            </button>
            
            <AnimatePresence>
              {showSources && (
                <motion.div 
                  id="source-links" 
                  className="mt-2 pl-3 border-l-2 border-emerald-300 space-y-2 py-2 bg-emerald-50 rounded-r-md"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {message.sources.map((source, index) => {
                    // Format URL for display
                    let displayUrl = source.url;
                    try {
                      // Try to parse URL and format for display
                      const urlObj = new URL(source.url);
                      const path = urlObj.pathname;
                      // Remove trailing slashes
                      const cleanPath = path.replace(/\/$/, "");
                      // Get the last part of the path for display
                      const pathSegments = cleanPath.split('/').filter(Boolean);
                      const lastSegment = pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : '';
                      
                      // Create a friendly display format
                      let displayName = lastSegment.length > 0 
                        ? lastSegment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                        : urlObj.hostname.replace('www.', '');
                        
                      // For search results, show a cleaner label
                      if (source.url.includes('/search?')) {
                        displayName = "Forest Service Search Results";
                      }
                      
                      displayUrl = displayName;
                    } catch (e) {
                      // If URL parsing fails, use the original URL
                      console.error("Error parsing URL:", e);
                    }
                    
                    return (
                      <motion.a 
                        key={index}
                        href={source.url.startsWith("http") ? source.url : "#"} 
                        className="flex items-center px-2 py-1.5 bg-white rounded-md shadow-sm border border-emerald-200 hover:border-emerald-300 transition-colors"
                        target={source.url.startsWith("http") ? "_blank" : undefined}
                        rel={source.url.startsWith("http") ? "noopener noreferrer" : undefined}
                        title={source.url}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <i className="fas fa-external-link-alt text-emerald-500 mr-2"></i>
                        <span className="font-medium text-emerald-700">{displayUrl}</span>
                      </motion.a>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
