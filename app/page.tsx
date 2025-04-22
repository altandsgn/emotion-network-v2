'use client';

import { useEffect, useState } from 'react';
import FootprintTrail from './components/footprint-trail';
import type { Footprint } from './types/footprint';
import { generateRandomFootprints } from './utils/footprint-generator';
import PixelCursor from './components/PixelCursor';
import SplineBackground from './components/SplineBackground';
import TypewriterText from './components/TypewriterText';
import Navbar from './components/Navbar';
import PixelDot from './components/PixelDot';

const emotionColors = {
  anger: '#FF073A',    // Neon Red
  disgust: '#66FF00',  // Neon Green
  fear: '#B967FF',     // Neon Purple
  happiness: '#FFFF00', // Neon Yellow
  sadness: '#0099FF',  // Neon Blue
  surprise: '#FF6EC7'  // Neon Pink
} as const;

interface HoverState {
  footprint: Footprint | null;
}

export default function Home() {
  const [footprints, setFootprints] = useState<Footprint[]>([]);
  const [hoveredFootprint, setHoveredFootprint] = useState<Footprint | null>(null);

  useEffect(() => {
    // Fetch approved submissions
    const fetchSubmissions = async () => {
      try {
        const response = await fetch('/api/submissions?limit=50');
        const data = await response.json();
        
        if (response.ok) {
          // Convert submissions to footprints
          const approvedFootprints = data.submissions.map((sub: any) => ({
            id: sub.id,
            message: sub.message,
            emotion: sub.emotion,
            location: sub.location,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            speedX: (Math.random() - 0.5) * 2,
            speedY: (Math.random() - 0.5) * 2,
            size: 32, // Match the SVG viewBox size
            opacity: Math.random() * 0.3 + 0.4,
            timestamp: Date.now()
          }));
          
          setFootprints(approvedFootprints);
        }
      } catch (error) {
        console.error('Error fetching submissions:', error);
        // Fallback to random footprints if fetch fails
        setFootprints(generateRandomFootprints(50));
      }
    };

    fetchSubmissions();
  }, []);

  const handleHover = (footprint: Footprint, shouldExit: boolean) => {
    setHoveredFootprint(shouldExit ? null : footprint);
  };

  const getOverlayPosition = (footprint: Footprint) => {
    const padding = 10;
    const boxWidth = 320;
    const boxHeight = 120;
    
    const dotElement = document.querySelector(`[data-footprint-id="${footprint.id}"]`);
    if (!dotElement) return { left: 0, top: 0 };

    const dotRect = dotElement.getBoundingClientRect();
    const dotCenterX = dotRect.left + (dotRect.width / 2);
    const dotCenterY = dotRect.top + (dotRect.height / 2);
    
    // Calculate positions relative to the dot's center
    const positions = [
      { 
        left: dotCenterX + padding,
        top: dotCenterY - (boxHeight / 2)
      },
      { 
        left: dotCenterX - boxWidth - padding,
        top: dotCenterY - (boxHeight / 2)
      },
      { 
        left: dotCenterX - (boxWidth / 2),
        top: dotCenterY + padding
      },
      { 
        left: dotCenterX - (boxWidth / 2),
        top: dotCenterY - boxHeight - padding
      }
    ];

    // Find the first position that keeps the box within viewport
    const position = positions.find(pos => {
      return pos.left >= 0 && 
             pos.left + boxWidth <= window.innerWidth &&
             pos.top >= 0 &&
             pos.top + boxHeight <= window.innerHeight;
    }) || positions[0];

    return {
      ...position,
      opacity: 1,
      visibility: 'visible' as const,
      transform: 'translate3d(0,0,0)',
      willChange: 'transform, left, top'
    };
  };

  return (
    <main 
      className="relative min-h-screen overflow-hidden pt-16"
      style={{
        background: 'radial-gradient(ellipse 50.00% 50.00% at 50.00% 50.00%, rgba(33.58, 45.81, 29.82, 0.64) 0%, rgba(23.56, 27.95, 22.46, 0.50) 100%), black'
      }}
    >
      <Navbar />
      <SplineBackground />
      <PixelCursor />
      
      {footprints.map((footprint) => (
        <FootprintTrail
          key={footprint.id}
          footprint={footprint}
          onHover={handleHover}
        />
      ))}

      {hoveredFootprint && (
        <div
          className="fixed border border-green-500 p-4 rounded-lg text-green-500 font-mono backdrop-blur-sm z-50"
          style={{
            ...getOverlayPosition(hoveredFootprint),
            width: '320px',
            maxWidth: '320px',
            transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
            opacity: hoveredFootprint ? 1 : 0,
            visibility: hoveredFootprint ? 'visible' : 'hidden',
            pointerEvents: 'none',
            background: 'radial-gradient(50% 50% at 50% 50%, rgba(34, 46, 30, 0.9) 0%, rgba(24, 28, 22, 0.85) 100%), rgba(0, 0, 0, 0.75)'
          }}
        >
          <div className="mb-2 opacity-80 text-sm">
            {`ID: ${hoveredFootprint.id}`}
          </div>
          <div className="mb-3">
            <TypewriterText 
              text={`>${hoveredFootprint.message}`}
              delay={50}
              className="text-base"
            />
          </div>
          <div className="flex items-center opacity-80 text-sm">
            <PixelDot color={emotionColors[hoveredFootprint.emotion]} />
            <span>Emotion: {hoveredFootprint.emotion}</span>
          </div>
        </div>
      )}
    </main>
  );
} 