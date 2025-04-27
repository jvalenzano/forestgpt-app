import { useState, useEffect } from 'react';

type UseTriviaOptions = {
  initialDelay?: number; // Delay before first trivia popup in ms
  interval?: number; // Time between trivia popups in ms
  duration?: number; // How long each trivia popup stays visible in ms
  enabled?: boolean; // Whether trivia is enabled
};

export function useTrivia({
  initialDelay = 20000, // Default 20 seconds initial delay
  interval = 120000,    // Default 2 minutes between popups
  duration = 5000,      // Default 5 seconds display time (reduced from 10s)
  enabled = true        // Enabled by default
}: UseTriviaOptions = {}) {
  const [isTriviaVisible, setIsTriviaVisible] = useState<boolean>(false);
  const [isFirstTriviaShown, setIsFirstTriviaShown] = useState<boolean>(false);

  // Handle showing trivia on a timer
  useEffect(() => {
    if (!enabled) return;

    // Initial trivia display after delay
    const initialTimer = setTimeout(() => {
      if (!isFirstTriviaShown) {
        setIsTriviaVisible(true);
        setIsFirstTriviaShown(true);
        
        // Auto-hide after duration
        setTimeout(() => {
          setIsTriviaVisible(false);
        }, duration);
      }
    }, initialDelay);

    // Regular interval trivia display
    const intervalTimer = setInterval(() => {
      if (isFirstTriviaShown) {
        setIsTriviaVisible(true);
        
        // Auto-hide after duration
        setTimeout(() => {
          setIsTriviaVisible(false);
        }, duration);
      }
    }, interval);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, [enabled, initialDelay, interval, duration, isFirstTriviaShown]);

  // Function to manually hide trivia
  const hideTrivia = () => {
    setIsTriviaVisible(false);
  };

  // Function to manually show trivia
  const showTrivia = () => {
    setIsTriviaVisible(true);
    setIsFirstTriviaShown(true);
    
    // Auto-hide after duration
    setTimeout(() => {
      setIsTriviaVisible(false);
    }, duration);
  };

  return {
    isTriviaVisible,
    hideTrivia,
    showTrivia
  };
}