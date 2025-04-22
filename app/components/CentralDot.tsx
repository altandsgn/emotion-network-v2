'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CentralDot() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dotRef.current) return;

    // Create a pulsating animation
    gsap.to(dotRef.current, {
      scale: 1.2,
      opacity: 0.8,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });
  }, []);

  return (
    <div 
      ref={dotRef}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-green-500 rounded-full"
      style={{
        boxShadow: '0 0 30px rgba(34, 197, 94, 0.6)',
        zIndex: 10
      }}
    />
  );
} 