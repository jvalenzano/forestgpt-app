import { useState, useRef, FormEvent, ChangeEvent, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatFormProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export default function ChatForm({ onSendMessage, disabled = false }: ChatFormProps) {
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const sendButtonRef = useRef<HTMLButtonElement>(null);
  const inputFormRef = useRef<HTMLDivElement>(null);
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (inputValue.trim() && !disabled && !isSending) {
      sendMessage();
    }
  };
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  
  const handleClear = () => {
    setInputValue("");
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim() && !disabled && !isSending) {
        sendMessage();
      }
    }
  };
  
  const sendMessage = () => {
    setIsSending(true);
    
    // Create a longer delay to allow the animation to play
    setTimeout(() => {
      onSendMessage(inputValue);
      setInputValue("");
      setIsSending(false);
    }, 850); // Increased delay for slower animation
  };
  
  // Animation variants for send button
  const sendButtonVariants = {
    idle: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 10
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 300
      }
    },
    tap: {
      scale: 0.95
    },
    sending: {
      scale: [1, 0.9, 1.1, 0.8, 0],
      y: [0, 0, -10, -40, -80],
      x: [0, 0, 5, 20, 40],
      rotate: [0, 0, 5, 10, 15],
      opacity: [1, 1, 1, 0.7, 0],
      transition: {
        times: [0, 0.2, 0.4, 0.7, 1],
        duration: 0.8, // Slower animation
        ease: "easeOut"
      }
    }
  };
  
  // Animation for floating text bubble
  const floatingBubbleVariants = {
    initial: { 
      opacity: 0,
      scale: 0.5,
      y: 0, 
      x: 0
    },
    animate: {
      opacity: [0, 1, 1, 0.8, 0],
      scale: [0.6, 1, 1.1, 0.9, 0.7],
      y: [0, -20, -40, -70, -100],
      x: [0, 10, 20, 40, 60],
      transition: {
        times: [0, 0.2, 0.4, 0.7, 1],
        duration: 0.8, // Slower animation
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -100,
      transition: {
        duration: 0.3
      }
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="relative w-full flex items-center">
        <div className="relative flex-grow" ref={inputFormRef}>
          <input
            type="text"
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask about the US Forest Service..."
            className="chat-input"
            disabled={disabled || isSending}
            autoComplete="off"
          />
          
          {/* Clear button */}
          {inputValue && !isSending && (
            <motion.button 
              type="button" 
              onClick={handleClear}
              className="absolute right-14 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Clear input"
            >
              <i className="fas fa-times-circle"></i>
            </motion.button>
          )}
          
          {/* Animated floating bubble that appears during sending */}
          <AnimatePresence>
            {isSending && inputValue.trim() && (
              <motion.div
                className="user-message absolute z-10 text-sm px-4 py-3 shadow-md"
                style={{ 
                  top: '-20px', 
                  right: '40px',
                  maxWidth: '80%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
                variants={floatingBubbleVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {inputValue}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Send button with animations */}
        <motion.button
          ref={sendButtonRef}
          type="button"
          onClick={isSending ? undefined : sendMessage}
          className={`ml-2 bg-gradient-to-br from-forest-600 to-forest-700 text-white rounded-full w-12 h-12 flex items-center justify-center ${
            disabled || !inputValue.trim() || isSending
            ? "opacity-50 cursor-not-allowed" 
            : "shadow-md"
          }`}
          disabled={disabled || !inputValue.trim() || isSending}
          variants={sendButtonVariants}
          initial="idle"
          animate={isSending ? "sending" : "idle"}
          whileHover={disabled || !inputValue.trim() || isSending ? {} : "hover"}
          whileTap={disabled || !inputValue.trim() || isSending ? {} : "tap"}
          aria-label="Send message"
        >
          <i className="fas fa-paper-plane"></i>
        </motion.button>
        
        {/* Loading spinner that appears after sending animation */}
        <AnimatePresence>
          {isSending && (
            <motion.div
              className="absolute right-0 ml-2 bg-gradient-to-br from-forest-600 to-forest-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-md"
              initial={{ opacity: 0, scale: 0, rotate: -15 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                rotate: 0,
                transition: {
                  delay: 0.35,
                  type: "spring",
                  damping: 12,
                  stiffness: 150
                }
              }}
              exit={{
                opacity: 0,
                scale: 0,
                transition: { 
                  duration: 0.2 
                }
              }}
              aria-label="Sending message"
            >
              <motion.div
                animate={{
                  rotate: 360
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "linear"
                }}
              >
                <i className="fas fa-paper-plane"></i>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Accessibility improvement: hidden submit button to support form submission */}
      <button type="submit" className="sr-only">Send</button>
    </form>
  );
}
