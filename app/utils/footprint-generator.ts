import { Footprint } from '../types/footprint';

const messages = [
  "Exploring the digital realm...",
  "Leaving traces in cyberspace...",
  "Following the white rabbit...",
  "Decoding the matrix...",
  "Seeking the truth...",
  "Breaking free from illusion...",
  "Questioning reality...",
  "Embracing the unknown...",
];

const emotions = [
  "curious",
  "determined",
  "hopeful",
  "skeptical",
  "enlightened",
  "rebellious",
];

const locations = [
  "The Grid",
  "Zion",
  "The Construct",
  "The Loading Program",
  "The Training Simulation",
];

export function generateRandomFootprints(count: number): Footprint[] {
  const footprints: Footprint[] = [];
  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;
  const centerX = windowWidth / 2;
  const centerY = windowHeight / 2;
  const centerRadius = 150;

  for (let i = 0; i < count; i++) {
    // Generate position away from center
    let x, y;
    do {
      x = Math.random() * windowWidth;
      y = Math.random() * windowHeight;
    } while (
      Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)) < centerRadius
    );

    footprints.push({
      id: Math.random().toString(36).substring(2, 9),
      x,
      y,
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2,
      size: 32,
      opacity: Math.random() * 0.3 + 0.4,
      message: messages[Math.floor(Math.random() * messages.length)],
      emotion: Math.random() > 0.3 ? emotions[Math.floor(Math.random() * emotions.length)] : undefined,
      location: Math.random() > 0.3 ? locations[Math.floor(Math.random() * locations.length)] : undefined,
      timestamp: Date.now(),
    });
  }

  return footprints;
} 