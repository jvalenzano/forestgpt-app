
import React from "react";

export const ForestServiceLogo = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 200 200" 
    width="100%" 
    height="100%"
    className="forest-service-logo"
  >
    <g transform="translate(15,10) scale(0.85,0.85)">
      {/* Shield outline */}
      <path d="M100,0 L185,30 L185,170 L100,200 L15,170 L15,30 Z" fill="#004D25" stroke="#FFD700" strokeWidth="2"/>
      
      {/* Pine trees group */}
      <path d="M100,35 
               L130,80 L115,80 
               L140,120 L120,120 
               L145,165 L55,165 
               L80,120 L60,120 
               L85,80 L70,80 Z" 
            fill="#FFD700"/>
      
      {/* Text */}
      <path id="top-curve" d="M35,45 A 85,85 0 0,1 165,45" fill="none"/>
      <path id="bottom-curve" d="M35,155 A 85,85 0 0,0 165,155" fill="none"/>
      
      <text fill="#FFD700" fontFamily="Times New Roman" fontWeight="bold">
        <textPath href="#top-curve" startOffset="50%" textAnchor="middle" fontSize="18">FOREST SERVICE</textPath>
      </text>
      <text fill="#FFD700" fontFamily="Times New Roman" fontWeight="bold">
        <textPath href="#bottom-curve" startOffset="50%" textAnchor="middle" fontSize="18">UNITED STATES</textPath>
      </text>
      
      <text x="100" y="185" fill="#FFD700" fontFamily="Times New Roman" fontSize="12" textAnchor="middle">DEPARTMENT OF AGRICULTURE</text>
    </g>
  </svg>
);

export default ForestServiceLogo;
