import { motion } from "framer-motion";

export default function LoadingIndicator() {
  const containerVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        damping: 12
      }
    }
  };
  
  const iconVariants = {
    initial: { scale: 0.8, rotate: -10 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 100
      }
    }
  };
  
  const dotVariants = {
    initial: { y: 0 },
    animate: { 
      y: [0, -5, 0]
    }
  };
  
  return (
    <motion.div 
      className="flex items-start space-x-3"
      initial="initial"
      animate="animate"
      variants={containerVariants}
    >
      <motion.div 
        className="bot-avatar"
        variants={iconVariants}
      >
        <i className="fas fa-tree"></i>
      </motion.div>
      <motion.div 
        className="bot-message flex items-center relative"
        initial={{ opacity: 0, scale: 0.9, x: -10 }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          x: 0,
          transition: {
            type: "spring",
            damping: 15,
            stiffness: 200
          }
        }}
      >
        <div className="text-sm font-semibold text-forest-800 mr-2">ForestGPT</div>
        <div className="typing-dots flex space-x-1.5">
          <motion.span 
            className="h-2.5 w-2.5 bg-forest-400 rounded-full"
            initial={{ y: 0 }}
            animate={{ y: [0, -5, 0] }}
            transition={{ 
              repeat: Infinity, 
              repeatType: "loop", 
              duration: 1, 
              ease: "easeInOut" 
            }}
          />
          <motion.span 
            className="h-2.5 w-2.5 bg-forest-500 rounded-full"
            initial={{ y: 0 }}
            animate={{ y: [0, -5, 0] }}
            transition={{ 
              repeat: Infinity, 
              repeatType: "loop", 
              duration: 1, 
              ease: "easeInOut",
              delay: 0.15 
            }}
          />
          <motion.span 
            className="h-2.5 w-2.5 bg-forest-600 rounded-full"
            initial={{ y: 0 }}
            animate={{ y: [0, -5, 0] }}
            transition={{ 
              repeat: Infinity, 
              repeatType: "loop", 
              duration: 1, 
              ease: "easeInOut",
              delay: 0.3 
            }}
          />
        </div>
        <motion.span 
          className="ml-3 text-sm text-gray-500 italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <i className="fas fa-search text-forest-400 mr-1"></i>
          Searching Forest Service resources...
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
