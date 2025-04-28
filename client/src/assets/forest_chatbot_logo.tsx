
import React from "react";

export const ForestChatbotLogo = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    width="100%" 
    height="100%" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className="forest-chatbot-logo"
  >
    {/* Robot head - more rounded shape */}
    <path d="M4,6 Q4,4 6,4 L18,4 Q20,4 20,6 L20,16 Q20,18 18,18 L6,18 Q4,18 4,16 Z" className="text-forest-100" />
    
    {/* Digital eyes */}
    <rect x="8" y="8" width="2" height="2" fill="currentColor" className="text-forest-100" />
    <rect x="14" y="8" width="2" height="2" fill="currentColor" className="text-forest-100" />
    
    {/* Antenna */}
    <circle cx="12" cy="2" r="1" className="text-green-400" />
    <line x1="12" y1="2" x2="12" y2="4" stroke="currentColor" className="text-green-400" />
    
    {/* Digital smile */}
    <path d="M9,12 L10,13 L14,13 L15,12" className="text-forest-100" />
    
    {/* Chat indicator */}
    <path d="M12,18 L12,20 L9,18 L6,18 L6,22 L18,22 L18,18" className="text-forest-100" />
  </svg>
);

export default ForestChatbotLogo;
