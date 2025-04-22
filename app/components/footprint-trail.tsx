'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import type { Footprint } from '../types/footprint';
import { motion } from 'framer-motion';

interface FootprintTrailProps {
  footprint: Footprint;
  onHover: (footprint: Footprint, shouldExit: boolean) => void;
}

const emotionColors = {
  anger: '#FF073A',    // Neon Red
  disgust: '#66FF00',  // Neon Green
  fear: '#B967FF',     // Neon Purple
  happiness: '#FFFF00', // Neon Yellow
  sadness: '#0099FF',  // Neon Blue
  surprise: '#FF6EC7'  // Neon Pink
} as const;

export default function FootprintTrail({ footprint, onHover }: FootprintTrailProps) {
  const trailRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const color = footprint.emotion && footprint.emotion in emotionColors 
    ? emotionColors[footprint.emotion as keyof typeof emotionColors] 
    : '#7AF278'; // Default to matrix green if no emotion
  const animationRef = useRef<gsap.core.Timeline>();
  const currentAnimationRef = useRef<gsap.core.Tween>();
  const dotSize = footprint.size; // Use the original size without scaling

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    onHover(footprint, false);
    if (currentAnimationRef.current) {
      currentAnimationRef.current.pause();
    }
  }, [footprint, onHover, currentAnimationRef, setIsHovered]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    onHover(footprint, true);
    if (currentAnimationRef.current) {
      currentAnimationRef.current.resume();
    }
  }, [footprint, onHover, currentAnimationRef, setIsHovered]);

  useEffect(() => {
    if (!trailRef.current) return;

    // Set initial position
    gsap.set(trailRef.current, {
      x: footprint.x,
      y: footprint.y,
      opacity: 0.8
    });

    const MIN_DISTANCE = 60;
    const MOVEMENT_RADIUS = 150;
    const MOVEMENT_DURATION = 20;
    const TOP_BLOCKED_ZONE = 80; // Top 80px blocked
    const BOTTOM_BLOCKED_ZONE = 64; // Bottom 64px blocked

    const findValidPosition = (currentX: number, currentY: number) => {
      let attempts = 0;
      const maxAttempts = 8;
      
      while (attempts < maxAttempts) {
        const baseAngle = (Math.PI / 4) * Math.floor(Math.random() * 8);
        const angle = baseAngle + (Math.random() * Math.PI / 4 - Math.PI / 8);
        const distance = MOVEMENT_RADIUS;
        
        let newX = currentX + Math.cos(angle) * distance;
        let newY = currentY + Math.sin(angle) * distance;

        // Enforce margins including blocked zones
        const margin = 50;
        newX = Math.max(margin, Math.min(window.innerWidth - margin, newX));
        newY = Math.max(TOP_BLOCKED_ZONE, Math.min(window.innerHeight - BOTTOM_BLOCKED_ZONE, newY));

        // Check if new position is in blocked zones
        if (newY < TOP_BLOCKED_ZONE || newY > window.innerHeight - BOTTOM_BLOCKED_ZONE) {
          attempts++;
          continue;
        }

        const dots = Array.from(document.querySelectorAll('[data-hoverable]'));
        let isValid = true;

        for (const dot of dots) {
          if (dot === trailRef.current) continue;
          
          const rect = dot.getBoundingClientRect();
          const dotX = rect.left + rect.width / 2;
          const dotY = rect.top + rect.height / 2;
          
          const dx = newX - dotX;
          const dy = newY - dotY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < MIN_DISTANCE) {
            isValid = false;
            break;
          }
        }

        if (isValid) {
          return { x: newX, y: newY };
        }

        attempts++;
      }

      // Fallback: move horizontally if in blocked zone
      const fallbackAngle = Math.random() * Math.PI * 2;
      let fallbackY = currentY;
      
      // If in blocked zone, move to nearest safe zone
      if (fallbackY < TOP_BLOCKED_ZONE) {
        fallbackY = TOP_BLOCKED_ZONE + MIN_DISTANCE;
      } else if (fallbackY > window.innerHeight - BOTTOM_BLOCKED_ZONE) {
        fallbackY = window.innerHeight - BOTTOM_BLOCKED_ZONE - MIN_DISTANCE;
      }
      
      return {
        x: currentX + Math.cos(fallbackAngle) * MIN_DISTANCE,
        y: fallbackY
      };
    };

    const createWanderAnimation = (fromX: number, fromY: number) => {
      const { x: newX, y: newY } = findValidPosition(fromX, fromY);

      const tween = gsap.to(trailRef.current, {
        x: newX,
        y: newY,
        duration: MOVEMENT_DURATION,
        ease: "none",
        onComplete: () => {
          if (!isHovered && trailRef.current) {
            const currentX = gsap.getProperty(trailRef.current, "x") as number;
            const currentY = gsap.getProperty(trailRef.current, "y") as number;
            currentAnimationRef.current = createWanderAnimation(currentX, currentY);
          }
        }
      });

      return tween;
    };

    currentAnimationRef.current = createWanderAnimation(footprint.x, footprint.y);

    if (isHovered && currentAnimationRef.current) {
      currentAnimationRef.current.pause();
    }

    const pulseAnimation = gsap.timeline({ repeat: -1 });
    
    pulseAnimation.to(trailRef.current, {
      scale: isHovered ? 1.2 : 1.05,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Add continuous rotation animation
    gsap.to(trailRef.current.querySelector('svg'), {
      rotation: 360,
      duration: 20,
      repeat: -1,
      ease: "none",
      transformOrigin: "center center"
    });

    gsap.to(trailRef.current, {
      opacity: 0.4,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      onUpdate: () => {
        if (isHovered) {
          gsap.set(trailRef.current, { opacity: 0.9 });
        }
      }
    });

    return () => {
      if (currentAnimationRef.current) {
        currentAnimationRef.current.kill();
      }
      pulseAnimation.kill();
      gsap.killTweensOf(trailRef.current);
    };
  }, [footprint.x, footprint.y]);

  return (
    <motion.div
      ref={trailRef}
      className="absolute"
      style={{
        width: dotSize,
        height: dotSize,
        left: 0,
        top: 0,
        cursor: 'none',
        willChange: 'transform',
        opacity: 0.8,
        visibility: 'visible',
        zIndex: isHovered ? 2 : 1,
        pointerEvents: 'all',
        transform: 'translate(-50%, -50%)'
      }}
      data-hoverable
      data-footprint-id={footprint.id}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <svg width="100%" height="100%" viewBox="0 0 32 32">
        {/* Larger hit area for hover */}
        <circle
          cx="16"
          cy="16"
          r="16"
          fill="transparent"
          style={{ pointerEvents: 'all' }}
        />
        {/* Semi-transparent fill */}
        <circle
          cx="16"
          cy="16"
          r="12"
          fill={color}
          fillOpacity="0.4"
        />
        {/* Pixelated outline - complete circle */}
        <path d="M14 4h4v2h-4zM10 6h4v2h-4zM18 6h4v2h-4zM8 8h2v2H8zM22 8h2v2h-2zM6 10h2v4H6zM24 10h2v4h-2zM4 14h2v4H4zM26 14h2v4h-2zM6 18h2v4H6zM24 18h2v4h-2zM8 22h2v2H8zM22 22h2v2h-2zM10 24h4v2h-4zM18 24h4v2h-4zM14 26h4v2h-4z"
          fill={color}
          fillOpacity={isHovered ? "0.9" : "0.8"}
        />
      </svg>
    </motion.div>
  );
} 