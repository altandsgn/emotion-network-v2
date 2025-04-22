'use client';

import { useState } from 'react';
import TypewriterText from './TypewriterText';

interface SubmissionCardProps {
  id: string;
  message: string;
  emotion: string;
  emotionColor: string;
}

const SubmissionCard = ({ id, message, emotion, emotionColor }: SubmissionCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative border border-green-500/50 rounded-lg bg-black/80 transition-all duration-200 hover:border-green-500 hover:bg-black/90 mt-[48px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Emotion Dot */}
      <div className="absolute -top-[40px] left-1/2 -translate-x-1/2">
        <svg width="32" height="32" viewBox="0 0 32 32" className="transition-transform duration-200">
          <circle
            cx="16"
            cy="16"
            r="12"
            fill={emotionColor}
            fillOpacity={isHovered ? "0.4" : "0.2"}
            className="transition-all duration-200"
          />
          <path 
            d="M14 4h4v2h-4zM10 6h4v2h-4zM18 6h4v2h-4zM8 8h2v2H8zM22 8h2v2h-2zM6 10h2v4H6zM24 10h2v4h-2zM4 14h2v4H4zM26 14h2v4h-2zM6 18h2v4H6zM24 18h2v4h-2zM8 22h2v2H8zM22 22h2v2h-2zM10 24h4v2h-4zM18 24h4v2h-4zM14 26h4v2h-4z"
            fill={emotionColor}
            fillOpacity={isHovered ? "0.9" : "0.6"}
            className="transition-all duration-200"
          />
        </svg>
        {isHovered && (
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow: `0 0 10px ${emotionColor}`,
              animation: 'pulse 2s infinite'
            }}
          />
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col h-full">
        {/* Top Content */}
        <div className="space-y-4">
          {/* ID Line */}
          <div className="flex items-center gap-2">
            <span className="text-green-500 font-mono">ID:</span>
            <span className="text-green-500/60 font-mono">{id || 'anonymous'}</span>
          </div>

          {/* Message */}
          <div className="text-green-500 font-mono">
            <span className="text-green-500/80">&gt;</span>
            <span className="ml-2">{message}</span>
          </div>
        </div>

        {/* Emotion Status - Always at Bottom */}
        <div className="flex items-center gap-2 mt-auto pt-4">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: emotionColor }}
          />
          <span className="text-green-500/80 font-mono text-sm first-letter:uppercase">
            {emotion}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SubmissionCard; 