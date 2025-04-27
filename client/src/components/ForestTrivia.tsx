import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ForestTriviaProps {
  isVisible: boolean;
  onClose: () => void;
}

// Forest trivia facts sourced from Forest Service content
const triviaFacts = [
  {
    fact: "The U.S. Forest Service manages 193 million acres of land, an area the size of Texas!",
    source: "https://www.fs.usda.gov/about-agency"
  },
  {
    fact: "National Forests contain over 158,000 miles of hiking trails - that's enough to circle the Earth 6 times.",
    source: "https://www.fs.usda.gov/visit/hiking"
  },
  {
    fact: "Forest Service scientists have identified more than 3,000 species of plants in our national forests.",
    source: "https://www.fs.usda.gov/features/did-you-know-10-interesting-facts-about-national-forests"
  },
  {
    fact: "The Forest Service manages the largest research and development program of any federal land management agency.",
    source: "https://www.fs.usda.gov/research"
  },
  {
    fact: "America's National Forests provide drinking water to more than 180 million people across the United States.",
    source: "https://www.fs.usda.gov/managing-land/water"
  },
  {
    fact: "Approximately one-third of all U.S. endangered species make their home in National Forests and Grasslands.",
    source: "https://www.fs.usda.gov/wildlife"
  },
  {
    fact: "The Forest Service employs over 30,000 people during peak seasons to protect and maintain our forests.",
    source: "https://www.fs.usda.gov/about-agency/meet-forest-service"
  }
];

export default function ForestTrivia({ isVisible, onClose }: ForestTriviaProps) {
  const [currentFact, setCurrentFact] = useState<number>(0);
  
  // Randomly select a trivia fact when component mounts or becomes visible
  useEffect(() => {
    if (isVisible) {
      setCurrentFact(Math.floor(Math.random() * triviaFacts.length));
    }
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed bottom-24 right-5 max-w-xs z-20"
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 20 
          }}
        >
          <div className="bg-emerald-50 rounded-lg shadow-lg p-4 pr-10 border-2 border-emerald-200">
            <button 
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-emerald-700 transition-colors"
              aria-label="Close trivia"
            >
              <i className="fas fa-times"></i>
            </button>
            
            <div className="flex items-start space-x-3">
              <div className="bg-emerald-100 text-emerald-700 p-2 rounded-full flex-shrink-0">
                <i className="fas fa-tree text-lg"></i>
              </div>
              <div>
                <h4 className="font-bold text-emerald-800 mb-1">Forest Trivia</h4>
                <p className="text-sm text-gray-700">
                  {triviaFacts[currentFact].fact}
                </p>
                
                <div className="mt-2 pt-2 border-t border-emerald-100 text-xs text-emerald-600">
                  <a 
                    href={triviaFacts[currentFact].source} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center hover:underline"
                  >
                    <i className="fas fa-external-link-alt mr-1"></i>
                    Learn more
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}