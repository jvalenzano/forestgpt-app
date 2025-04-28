import React from "react";

// Forest Service Shield Logo as an inline SVG component
export const ForestServiceLogo = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 200 200" 
    width="100%" 
    height="100%"
    className="forest-service-logo"
  >
    {/* Shield shape */}
    <path d="M100,10 L175,45 L175,155 L100,190 L25,155 L25,45 Z" fill="#234d20" stroke="#e7bf60" strokeWidth="5" />
    
    {/* Pine tree silhouette */}
    <path d="M100,30 L120,70 L110,70 L130,110 L115,110 L140,150 L60,150 L85,110 L70,110 L90,70 L80,70 Z" fill="#e7bf60" />
    
    {/* Curved text */}
    <path id="top-curve" d="M50,40 A 70,70 0 0,1 150,40" fill="none" />
    <path id="bottom-curve" d="M50,160 A 70,70 0 0,0 150,160" fill="none" />
    
    <text fill="#e7bf60" fontSize="14" fontFamily="serif" fontWeight="bold">
      <textPath href="#top-curve" textAnchor="middle" startOffset="50%">UNITED STATES</textPath>
    </text>
    <text fill="#e7bf60" fontSize="14" fontFamily="serif" fontWeight="bold">
      <textPath href="#bottom-curve" textAnchor="middle" startOffset="50%">FOREST SERVICE</textPath>
    </text>
    
    {/* Department indication */}
    <text x="100" y="175" fill="#e7bf60" fontSize="10" fontFamily="serif" textAnchor="middle">DEPARTMENT OF AGRICULTURE</text>
  </svg>
);

export default ForestServiceLogo;