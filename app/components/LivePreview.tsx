import { useState } from 'react';
import PixelDot from './PixelDot';
import TypewriterText from './TypewriterText';

interface LivePreviewProps {
  id: string;
  message: string;
  emotion: string | null;
  emotionColor: string;
}

export default function LivePreview({ id, message, emotion, emotionColor }: LivePreviewProps) {
  const [isHovered, setIsHovered] = useState(false);
  const defaultColor = '#DDDDDD';

  return (
    <div className="flex items-center h-[50px]">
      <div className="relative">
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <svg 
            width="40" 
            height="40" 
            viewBox="0 0 32 32" 
            className={`transition-transform duration-200 ${isHovered ? 'scale-110' : ''}`}
          >
            {/* Semi-transparent fill */}
            <circle
              cx="16"
              cy="16"
              r="12"
              fill={emotion ? emotionColor : defaultColor}
              fillOpacity="0.2"
            />
            {/* Pixelated outline - complete circle */}
            <path 
              d="M14 4h4v2h-4zM10 6h4v2h-4zM18 6h4v2h-4zM8 8h2v2H8zM22 8h2v2h-2zM6 10h2v4H6zM24 10h2v4h-2zM4 14h2v4H4zM26 14h2v4h-2zM6 18h2v4H6zM24 18h2v4h-2zM8 22h2v2H8zM22 22h2v2h-2zM10 24h4v2h-4zM18 24h4v2h-4zM14 26h4v2h-4z"
              fill={emotion ? emotionColor : defaultColor}
              fillOpacity="0.8"
            />
          </svg>
        </div>

        {/* Preview Text Box */}
        {isHovered && (
          <div
            className="absolute left-full top-1/2 -translate-y-1/2 ml-4 border border-green-500 p-4 rounded-lg text-green-500 font-mono backdrop-blur-sm z-10"
            style={{
              width: '320px',
              background: 'radial-gradient(50% 50% at 50% 50%, rgba(34, 46, 30, 0.9) 0%, rgba(24, 28, 22, 0.85) 100%), rgba(0, 0, 0, 0.75)'
            }}
          >
            <div className="mb-2 opacity-80 text-sm">
              {`ID: ${id || 'anonymous'}`}
            </div>
            <div className="mb-3">
              <TypewriterText 
                text={`>${message || 'Your message will look like this.'}`}
                delay={50}
                className="text-base"
              />
            </div>
            {emotion && (
              <div className="flex items-center opacity-80 text-sm">
                <PixelDot color={emotionColor} />
                <span>Emotion: {emotion}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 