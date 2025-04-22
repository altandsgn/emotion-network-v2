'use client';

import { useState, useCallback, useEffect, FC } from 'react';
import Link from 'next/link';
import TypewriterText from './TypewriterText';

const menuItems = [
  { id: 'archive', text: 'Archive', href: '/archive' },
  { id: 'about', text: 'About', href: '/about' },
  { id: 'submit', text: 'Submit', href: '/submit' }
];

interface NavbarProps {
  currentPath?: string;
}

const Navbar: FC<NavbarProps> = ({ currentPath = '/' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [menuWidths, setMenuWidths] = useState<{ [key: string]: number }>({});

  const handleMouseEnter = useCallback((id: string, href: string) => {
    if (href !== currentPath) {
      setHoveredItem(id);
    }
  }, [currentPath]);

  const handleMouseLeave = useCallback(() => {
    setHoveredItem(null);
  }, []);

  const shouldShowBackground = currentPath !== '/';

  // Function to measure text width including the cursor
  const measureText = useCallback((id: string, text: string) => {
    if (typeof window !== 'undefined') {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (context) {
        context.font = '16px monospace'; // Match your font-mono style
        const width = context.measureText(text + '█').width; // Add cursor width
        setMenuWidths(prev => ({
          ...prev,
          [id]: Math.ceil(width)
        }));
      }
    }
  }, []);

  // Measure text widths on mount
  useEffect(() => {
    menuItems.forEach(item => {
      measureText(item.id, item.text);
    });
  }, [measureText]);

  return (
    <nav className={`fixed top-0 left-0 right-0 h-16 z-50 cursor-none ${
      shouldShowBackground ? 'bg-black/20 backdrop-blur-md' : ''
    }`}>
      {/* Bottom border with neon effect */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#00FF00] shadow-[0_0_10px_#00FF00]"></div>

      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        {/* Site Name */}
        <Link 
          href="/"
          className="text-[#00FF00] font-mono text-xl cursor-none relative group"
          onMouseEnter={() => handleMouseEnter('home', '/')}
          onMouseLeave={handleMouseLeave}
        >
          <span>Emotion Network</span>
          <div className={`absolute -bottom-1 left-0 right-0 h-[1px] bg-[#00FF00] shadow-[0_0_5px_#00FF00] transition-transform duration-200 ${
            hoveredItem === 'home' ? 'scale-x-100' : 'scale-x-0'
          }`}></div>
        </Link>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-[#00FF00] hover:opacity-80 transition-opacity cursor-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 cursor-none">
          {menuItems.map(item => (
            <Link
              key={item.id}
              href={item.href}
              className={`text-[#00FF00] font-mono relative group cursor-none flex items-center ${
                currentPath === item.href ? 'pointer-events-none' : ''
              }`}
              onMouseEnter={() => handleMouseEnter(item.id, item.href)}
              onMouseLeave={handleMouseLeave}
            >
              <div 
                className="relative overflow-hidden"
                style={{ 
                  width: menuWidths[item.id] ? `${menuWidths[item.id]}px` : 'auto',
                  height: '24px'
                }}
              >
                <div className="absolute inset-0 flex items-center">
                  {hoveredItem === item.id ? (
                    <div className="flex items-center">
                      <TypewriterText
                        text={item.text}
                        delay={30}
                        className="cursor-none whitespace-nowrap"
                      />
                    </div>
                  ) : (
                    <span className="cursor-none whitespace-nowrap">{item.text}</span>
                  )}
                </div>
              </div>
              <div className={`absolute -bottom-1 left-0 right-0 h-[1px] bg-[#00FF00] shadow-[0_0_5px_#00FF00] transition-transform duration-200 ${
                hoveredItem === item.id || currentPath === item.href ? 'scale-x-100' : 'scale-x-0'
              }`}></div>
            </Link>
          ))}
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden fixed top-16 left-0 right-0 bg-black/90 backdrop-blur-sm transition-transform duration-300 cursor-none ${
          isMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}>
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {menuItems.map(item => (
              <Link
                key={item.id}
                href={item.href}
                className={`text-[#00FF00] font-mono text-lg py-2 relative group cursor-none flex items-center ${
                  currentPath === item.href ? 'pointer-events-none' : ''
                }`}
                onMouseEnter={() => handleMouseEnter(item.id, item.href)}
                onMouseLeave={handleMouseLeave}
                onClick={() => setIsMenuOpen(false)}
              >
                <div 
                  className="relative overflow-hidden"
                  style={{ 
                    width: menuWidths[item.id] ? `${menuWidths[item.id]}px` : 'auto',
                    height: '24px'
                  }}
                >
                  <div className="absolute inset-0 flex items-center">
                    {hoveredItem === item.id ? (
                      <div className="flex items-center">
                        <TypewriterText
                          text={item.text}
                          delay={30}
                          className="cursor-none whitespace-nowrap"
                        />
                      </div>
                    ) : (
                      <span className="cursor-none whitespace-nowrap">{item.text}</span>
                    )}
                  </div>
                </div>
                <div className={`absolute -bottom-1 left-0 right-0 h-[1px] bg-[#00FF00] shadow-[0_0_5px_#00FF00] transition-transform duration-200 ${
                  hoveredItem === item.id || currentPath === item.href ? 'scale-x-100' : 'scale-x-0'
                }`}></div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 