'use client';

import { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    let animationFrameId: number;

    const updatePosition = (e: MouseEvent) => {
      if (!cursorRef.current) return;
      
      // Use requestAnimationFrame for smooth movement
      animationFrameId = requestAnimationFrame(() => {
        if (!cursorRef.current) return;
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      });
    };

    const updateHoverState = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsHovering(target.closest('[data-hoverable]') !== null);
    };

    window.addEventListener('mousemove', updatePosition, { passive: true });
    window.addEventListener('mouseover', updateHoverState);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', updateHoverState);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <div 
      ref={cursorRef}
      className="pointer-events-none fixed z-[100]"
      style={{ 
        mixBlendMode: 'difference',
        willChange: 'transform',
        width: isHovering ? '32px' : '24px',
        height: isHovering ? '32px' : '24px',
      }}
    >
      {/* Main cursor circle */}
      <div 
        className="absolute inset-0 rounded-full transition-transform duration-150"
        style={{
          border: '2px solid #00FF00',
          boxShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
          transform: `scale(${isHovering ? 1.2 : 1})`,
          opacity: 1,
        }}
      />
      
      {/* Outer glow ring */}
      <div 
        className="absolute -inset-2 rounded-full transition-transform duration-150"
        style={{
          border: '1px solid #00FF00',
          boxShadow: '0 0 15px rgba(0, 255, 0, 0.3)',
          opacity: isHovering ? 0.5 : 0,
          transform: `scale(${isHovering ? 1.3 : 1})`,
        }}
      />
    </div>
  );
} 