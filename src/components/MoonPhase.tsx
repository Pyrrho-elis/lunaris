import React from 'react';
import { motion } from 'framer-motion';

interface MoonPhaseProps {
  phase: string;
  size?: number;
  optimized?: boolean;
}

const MoonPhase: React.FC<MoonPhaseProps> = ({ phase, size = 200, optimized = false }) => {
  // Render different moon SVGs based on the phase
  const renderMoonSVG = () => {
    // Define SVG filter for optimized glow
    const svgFilter = optimized ? (
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
    ) : null;

    switch (phase) {
      case 'New Moon':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {svgFilter}
            <circle cx="50" cy="50" r="45" stroke="#FDE68A" strokeWidth="1" strokeOpacity="0.3" fill="none" />
            <circle cx="50" cy="50" r="43" fill="#0b0719" stroke="#FDE68A" strokeWidth="0.5" strokeOpacity="0.2" />
          </svg>
        );
      
      case 'Waxing Crescent':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {svgFilter}
            <circle cx="50" cy="50" r="45" fill="#0b0719" stroke="#FDE68A" strokeWidth="1" />
            <path d="M50 5C25.1472 5 5 25.1472 5 50C5 74.8528 25.1472 95 50 95C50 95 50 5 50 5Z" fill="#0b0719" />
            <path d="M50 5C74.8528 5 95 25.1472 95 50C95 74.8528 74.8528 95 50 95C65 95 65 5 50 5Z" fill="#FDE68A" />
          </svg>
        );
      
      case 'First Quarter':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {svgFilter}
            <circle cx="50" cy="50" r="45" fill="#0b0719" stroke="#FDE68A" strokeWidth="1" />
            <path d="M50 5C25.1472 5 5 25.1472 5 50C5 74.8528 25.1472 95 50 95V5Z" fill="#0b0719" />
            <path d="M50 5C74.8528 5 95 25.1472 95 50C95 74.8528 74.8528 95 50 95V5Z" fill="#FDE68A" />
          </svg>
        );
      
      case 'Waxing Gibbous':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {svgFilter}
            <circle cx="50" cy="50" r="45" fill="#FDE68A" stroke="#FDE68A" strokeWidth="1" />
            <path d="M50 5C25.1472 5 5 25.1472 5 50C5 74.8528 25.1472 95 50 95C35 95 35 5 50 5Z" fill="#0b0719" />
          </svg>
        );
      
      case 'Full Moon':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {svgFilter}
            <circle cx="50" cy="50" r="45" fill="#FDE68A" stroke="#FDE68A" strokeWidth="1" filter={optimized ? "url(#glow)" : undefined} />
            <circle cx="35" cy="35" r="8" fill="#FDE68A" fillOpacity="0.3" />
            <circle cx="65" cy="40" r="10" fill="#FDE68A" fillOpacity="0.2" />
            <circle cx="45" cy="70" r="12" fill="#FDE68A" fillOpacity="0.15" />
          </svg>
        );
      
      case 'Waning Gibbous':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {svgFilter}
            <circle cx="50" cy="50" r="45" fill="#FDE68A" stroke="#FDE68A" strokeWidth="1" />
            <path d="M50 5C74.8528 5 95 25.1472 95 50C95 74.8528 74.8528 95 50 95C65 95 65 5 50 5Z" fill="#0b0719" />
          </svg>
        );
      
      case 'Last Quarter':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {svgFilter}
            <circle cx="50" cy="50" r="45" fill="#0b0719" stroke="#FDE68A" strokeWidth="1" />
            <path d="M50 5C74.8528 5 95 25.1472 95 50C95 74.8528 74.8528 95 50 95V5Z" fill="#0b0719" />
            <path d="M50 5C25.1472 5 5 25.1472 5 50C5 74.8528 25.1472 95 50 95V5Z" fill="#FDE68A" />
          </svg>
        );
      
      case 'Waning Crescent':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {svgFilter}
            <circle cx="50" cy="50" r="45" fill="#0b0719" stroke="#FDE68A" strokeWidth="1" />
            <path d="M50 5C74.8528 5 95 25.1472 95 50C95 74.8528 74.8528 95 50 95C50 95 50 5 50 5Z" fill="#0b0719" />
            <path d="M50 5C25.1472 5 5 25.1472 5 50C5 74.8528 25.1472 95 50 95C35 95 35 5 50 5Z" fill="#FDE68A" />
          </svg>
        );
      
      default:
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {svgFilter}
            <circle cx="50" cy="50" r="45" fill="#FDE68A" stroke="#FDE68A" strokeWidth="1" />
          </svg>
        );
    }
  };

  return (
    <motion.div 
      className={optimized ? "moon-glow-optimized" : "moon-glow"}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      {renderMoonSVG()}
    </motion.div>
  );
};

export default MoonPhase;