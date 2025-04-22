'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import PixelCursor from '../components/PixelCursor';
import Image from 'next/image';

export default function About() {
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Global mouse move handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      requestAnimationFrame(() => {
        setMousePosition({
          x: e.clientX,
          y: e.clientY
        });
      });
    };

    if (isImageHovered) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isImageHovered]);

  return (
    <>
      <Navbar currentPath="/about" />
      <PixelCursor />
      
      <main className="min-h-screen px-[120px] pt-16 pb-16 cursor-none">
        <div className="max-w-[800px] mx-auto">
          {/* Introduction Section */}
          <section className="mt-16">
            <h1 className="text-green-500 font-mono text-3xl mb-4">Introduction</h1>
            <div className="w-full h-[1px] bg-green-500/30 mb-8" />
            
            <div className="space-y-6 text-green-500/90 font-mono">
              <p>
                Expressing our deepest emotions can be incredibly challenging—even with the people closest to us. "Emotion Network" was created as a collective space dedicated to all the things left unsaid.
              </p>
              
              <p>
                Inspired by psychologist Paul Ekman's six universal human emotions—happiness, sadness, disgust, fear, surprise, and anger—this project aims to illuminate our hidden emotional landscapes. It began as a response to a simple yet profound realization: even when we feel most isolated, someone, somewhere, shares our experience.
              </p>
              
              <p>
                By inviting anonymous emotional expressions from people around the globe, a diverse tapestry emerges—full of raw honesty, vulnerability, and humanity. These intimate reflections become freely wandering points of color in a digital retro-space, subtly connecting and resonating with each other.
              </p>
              
              <p>
                Individually, each message reflects deep personal truth; collectively, they reveal patterns of shared human experiences, bridging feelings that often isolate us. The result is a living archive of empathy, vulnerability, and emotional connection, continuously expanding as new submissions join the space.
              </p>
              
              <p>
                Thank you to everyone who shares their voice here, offering comfort through shared silence and understanding through shared experience.
              </p>
            </div>
          </section>

          {/* About Me Section */}
          <section className="mt-24">
            <h2 className="text-green-500 font-mono text-3xl mb-4">About Me</h2>
            <div className="w-full h-[1px] bg-green-500/30 mb-8" />
            
            <div className="flex gap-8">
              <div 
                className="w-[320px] h-[288px] relative group"
                onMouseEnter={() => setIsImageHovered(true)}
                onMouseLeave={() => setIsImageHovered(false)}
              >
                <Image
                  src="/about-image.png"
                  alt="About Me"
                  fill
                  className="object-cover"
                  priority
                />
                
                {isImageHovered && (
                  <div 
                    className="fixed pointer-events-none z-50"
                    style={{
                      left: 0,
                      top: 0,
                      transform: `translate3d(${mousePosition.x + 20}px, ${mousePosition.y - 20}px, 0)`,
                      transition: 'transform 0.1s cubic-bezier(0.17, 0.67, 0.83, 0.67)'
                    }}
                  >
                    <div className="bg-black/80 border border-green-500 px-4 py-2 rounded-lg text-green-500 font-mono backdrop-blur-sm whitespace-nowrap">
                      Altan B. Arslan
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex-1 text-green-500/90 font-mono">
                <p>
                  Web interaction designer based in Istanbul, passionate about crafting emotionally engaging digital experiences and interactive internet art. My work explores how technology can bridge isolation and foster collective empathy through shared human experiences.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
} 