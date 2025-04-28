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
    {/* Robot head shape - rounded rectangle */}
    <rect x="3" y="4" width="18" height="12" rx="2" ry="2" className="text-forest-100" />
    
    {/* Eyes */}
    <circle cx="9" cy="9" r="1" fill="currentColor" className="text-forest-100" />
    <circle cx="15" cy="9" r="1" fill="currentColor" className="text-forest-100" />
    
    {/* Small tree on top of head */}
    <path d="M12,2 L14,4 L13,4 L15,6 L9,6 L11,4 L10,4 Z" fill="currentColor" className="text-green-400" />
    
    {/* Antenna/stem */}
    <line x1="12" y1="2" x2="12" y2="4" stroke="currentColor" className="text-green-400" strokeWidth="1" />
    
    {/* Chat bubble */}
    <path 
      d="M12,16 L12,19 L9,16 L3,16 L3,20 C3,21.1 3.9,22 5,22 L19,22 C20.1,22 21,21.1 21,20 L21,16 L12,16" 
      className="text-forest-100" 
    />
    
    {/* Mouth - a happy curve */}
    <path d="M9,12 C9,13.5 15,13.5 15,12" className="text-forest-100" fill="none" />
  </svg>
);

export default ForestChatbotLogo;