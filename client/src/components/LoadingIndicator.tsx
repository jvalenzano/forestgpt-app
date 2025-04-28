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
  
  const messageVariants = {
    initial: { opacity: 0, x: -5 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100
      }
    }
  };

  // Dots animation variants
  const dotsContainerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  // Colors for the dots
  const dotColors = [
    // Light green
    ["#a7f3d0", "#6ee7b7", "#a7f3d0"],
    // Leaf green to yellow
    ["#84cc16", "#facc15", "#84cc16"],
    // Forest green to emerald
    ["#166534", "#10b981", "#166534"],
  ];
  
  const dotVariants = (colorSet: string[]) => ({
    initial: { y: 0, backgroundColor: colorSet[0] },
    animate: {
      y: [0, -10, 0],
      backgroundColor: colorSet,
      transition: {
        y: {
          repeat: Infinity,
          duration: 1,
          ease: "easeInOut"
        },
        backgroundColor: {
          repeat: Infinity,
          duration: 1,
          ease: "easeInOut"
        }
      }
    }
  });

  return (
    <motion.div 
      className="flex items-start space-x-3 p-2"
      initial="initial"
      animate="animate"
      variants={containerVariants}
    >
      <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center text-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 22v-8h4l-6-8-6 8h4v8z" />
          <path d="M13 2v5l-4-4" />
          <path d="M11 2v5l4-4" />
        </svg>
      </div>
      <motion.div 
        className="bg-forest-700 text-white px-6 py-4 rounded-lg shadow-md flex items-center"
        variants={messageVariants}
      >
        <span className="mr-3">Searching forests</span>
        
        <motion.div 
          className="flex space-x-1" 
          variants={dotsContainerVariants}
        >
          <motion.div
            className="w-3 h-3 rounded-full"
            custom={dotColors[0]}
            variants={dotVariants(dotColors[0])}
          />
          <motion.div
            className="w-3 h-3 rounded-full"
            custom={dotColors[1]}
            variants={dotVariants(dotColors[1])}
          />
          <motion.div
            className="w-3 h-3 rounded-full"
            custom={dotColors[2]}
            variants={dotVariants(dotColors[2])}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}