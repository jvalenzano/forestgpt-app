
import React from "react";

export const ForestServiceLogo = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 200 200" 
    width="100%" 
    height="100%"
    className="forest-service-logo"
  >
    {/* Shield shape */}
    <path d="M100,10 L175,45 L175,155 L100,190 L25,155 L25,45 Z" fill="#024731" stroke="#FFD700" strokeWidth="5" />
    
    {/* Detailed pine tree */}
    <path d="M100,30 L135,90 L120,90 L145,130 L125,130 L150,170 L50,170 L75,130 L55,130 L80,90 L65,90 Z" fill="#FFD700" />
    
    {/* Curved text */}
    <path id="top-curve" d="M50,40 A 70,70 0 0,1 150,40" fill="none" />
    <path id="bottom-curve" d="M50,160 A 70,70 0 0,0 150,160" fill="none" />
    
    <text fill="#FFD700" fontSize="16" fontFamily="Times New Roman" fontWeight="bold">
      <textPath href="#top-curve" textAnchor="middle" startOffset="50%">UNITED STATES</textPath>
    </text>
    <text fill="#FFD700" fontSize="16" fontFamily="Times New Roman" fontWeight="bold">
      <textPath href="#bottom-curve" textAnchor="middle" startOffset="50%">FOREST SERVICE</textPath>
    </text>
    
    {/* Department indication */}
    <text x="100" y="180" fill="#FFD700" fontSize="12" fontFamily="Times New Roman" textAnchor="middle">DEPARTMENT OF AGRICULTURE</text>
  </svg>
);

export default ForestServiceLogo;
