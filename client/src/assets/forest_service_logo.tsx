
import React from "react";

export const ForestServiceLogo = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 200 200" 
    width="100%" 
    height="100%"
    className="forest-service-logo"
  >
    <g transform="translate(25,10) scale(0.75,0.75)">
      {/* Shield outline */}
      <path d="M100,0 L200,35 L200,165 L100,200 L0,165 L0,35 Z" fill="#004D25" stroke="#FFD700" strokeWidth="4"/>
      
      {/* Pine trees */}
      <path d="M100,25 L140,90 L125,90 L155,140 L135,140 L165,190 L35,190 L65,140 L45,140 L75,90 L60,90 Z" fill="#FFD700"/>
      
      {/* Text paths */}
      <path id="curve-top" d="M40,45 A 80,80 0 0,1 160,45" fill="none"/>
      <path id="curve-bottom" d="M40,155 A 80,80 0 0,0 160,155" fill="none"/>
      
      {/* Text */}
      <text fill="#FFD700" fontFamily="Times New Roman" fontWeight="bold">
        <textPath href="#curve-top" startOffset="50%" textAnchor="middle" fontSize="20">UNITED STATES</textPath>
      </text>
      <text fill="#FFD700" fontFamily="Times New Roman" fontWeight="bold">
        <textPath href="#curve-bottom" startOffset="50%" textAnchor="middle" fontSize="20">FOREST SERVICE</textPath>
      </text>
      
      {/* Department text */}
      <text x="100" y="175" fill="#FFD700" fontFamily="Times New Roman" fontSize="14" textAnchor="middle">DEPARTMENT OF AGRICULTURE</text>
    </g>
  </svg>
);

export default ForestServiceLogo;
