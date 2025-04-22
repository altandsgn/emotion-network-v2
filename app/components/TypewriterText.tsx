import { useEffect, useState, useCallback, memo } from 'react';

interface TypewriterTextProps {
  text: string;
  delay?: number;
  className?: string;
}

const TypewriterText = memo(function TypewriterText({ text, delay = 50, className = '' }: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);

  const getRandomDelay = useCallback(() => {
    return delay + (Math.random() * 20 - 10); // Reduced variation for better performance
  }, [delay]);

  // Handle cursor blinking
  useEffect(() => {
    if (!isTyping) {
      const blinkInterval = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 530);

      return () => clearInterval(blinkInterval);
    }
  }, [isTyping]);

  useEffect(() => {
    if (!text) {
      setDisplayedText('');
      setIsTyping(false);
      return;
    }

    setDisplayedText('');
    setIsTyping(true);
    setShowCursor(true);
    
    let currentIndex = 0;
    let timeoutId: NodeJS.Timeout;
    
    const typeNextCharacter = () => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
        timeoutId = setTimeout(typeNextCharacter, getRandomDelay());
      } else {
        setIsTyping(false);
      }
    };

    timeoutId = setTimeout(typeNextCharacter, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [text, getRandomDelay]);

  return (
    <div className={`font-mono ${className} overflow-hidden`}>
      {displayedText}
      <span 
        className="inline-block w-2 h-5 ml-1"
        style={{
          backgroundColor: '#00FF00',
          boxShadow: '0 0 10px rgba(0, 255, 0, 0.7)',
          opacity: showCursor ? 1 : 0,
          transition: isTyping ? 'none' : 'opacity 0.1s ease-in-out'
        }}
      />
    </div>
  );
});

export default TypewriterText; 