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
    initial: { scale: 0.8, rotate: -5 },
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
  
  // New leaf growing animation variants
  const leafVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        repeat: Infinity,
        repeatType: "reverse" as const,
        duration: 1.5
      }
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
        className="bot-avatar forest-element"
        variants={iconVariants}
      >
        <i className="fas fa-tree"></i>
        <div className="leaf"></div>
        <div className="leaf"></div>
        <div className="leaf"></div>
      </motion.div>
      <motion.div 
        className="bot-message flex items-center justify-center py-4"
        variants={iconVariants}
      >
        <div className="tree-loader">
          {/* Tree trunk is added via CSS */}
          <motion.div 
            className="leaves w-4 h-4 rounded-full bg-green-700"
            variants={leafVariants}
          />
        </div>
        <div className="ml-6 text-green-100">Growing response...</div>
      </motion.div>
    </motion.div>
  );
}