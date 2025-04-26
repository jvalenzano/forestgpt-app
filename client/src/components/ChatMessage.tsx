import { useState } from "react";
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
        className="flex items-start justify-end space-x-3"
        initial="initial"
        animate="animate"
        variants={{
          initial: { opacity: 0 },
          animate: { opacity: 1 }
        }}
      >
        <motion.div 
          className="user-message"
          variants={bubbleVariants}
        >
          <motion.div 
            className="text-sm"
            variants={contentVariants}
          >
            {message.content}
          </motion.div>
        </motion.div>
        <motion.div 
          className="user-avatar"
          variants={iconVariants}
        >
          <i className="fas fa-user"></i>
        </motion.div>
      </motion.div>
    );
  }
  
  // Determine if we have a user query to echo (from the previous message)
  const userQuery = previousMessage?.role === "user" ? previousMessage.content : null;
  
  return (
    <motion.div 
      className="flex items-start space-x-3"
      initial="initial"
      animate="animate"
      variants={{
        initial: { opacity: 0 },
        animate: { opacity: 1 }
      }}
    >
      <motion.div 
        className="bot-avatar"
        variants={iconVariants}
      >
        <i className="fas fa-tree"></i>
      </motion.div>
      <motion.div 
        className="bot-message"
        variants={bubbleVariants}
      >
        <motion.div 
          className="text-sm font-semibold text-forest-800 mb-1"
          variants={contentVariants}
        >
          ForestGPT
        </motion.div>
        
        {/* Echo the user's query in italics if available */}
        {userQuery && (
          <motion.div 
            className="text-xs italic text-gray-500 mb-2 border-l-2 border-forest-200 pl-2"
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
        
        {/* Collapsible sources section */}
        {message.sources && message.sources.length > 0 && (
          <motion.div 
            className="text-xs text-gray-500 mt-3 pt-2 border-t border-forest-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <button 
              onClick={() => setShowSources(!showSources)}
              className="flex items-center font-medium text-forest-600 hover:text-forest-700 focus:outline-none transition-colors"
              aria-expanded={showSources}
              aria-controls="source-links"
            >
              <i className="fas fa-quote-left text-forest-400 mr-1.5"></i>
              <span>Sources</span>
              <motion.span 
                className="ml-1 text-forest-500 inline-block" 
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
                  className="mt-2 pl-3 border-l-2 border-forest-200 space-y-1 py-1 bg-forest-50 rounded-r-md"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {message.sources.map((source, index) => (
                    <motion.a 
                      key={index}
                      href={source.url.startsWith("http") ? source.url : "#"} 
                      className={`block truncate ${source.url.startsWith("http") ? "text-forest-600 hover:text-forest-800 hover:underline" : ""}`}
                      target={source.url.startsWith("http") ? "_blank" : undefined}
                      rel={source.url.startsWith("http") ? "noopener noreferrer" : undefined}
                      title={source.url}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <i className="fas fa-link text-forest-400 mr-1.5 text-xs"></i>
                      {source.url}
                    </motion.a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
