'use client';

import { FC, useEffect, useRef } from 'react';

const PixelCursor: FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      if (!cursorRef.current) return;
      
      requestAnimationFrame(() => {
        if (!cursorRef.current) return;
        // Adjust the position to center the cursor on the mouse pointer
        const cursorWidth = 15; // Width from CSS
        const cursorHeight = 20; // Height from CSS
        const x = e.clientX - (cursorWidth / 2);
        const y = e.clientY - (cursorHeight / 2);
        cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
    };

    window.addEventListener('mousemove', updatePosition, { passive: true });

    return () => {
      window.removeEventListener('mousemove', updatePosition);
    };
  }, []);

  return (
    <div 
      ref={cursorRef} 
      className="pixelated-cursor" 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        willChange: 'transform'
      }}
    />
  );
}

export default PixelCursor; 