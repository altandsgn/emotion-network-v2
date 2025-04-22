export interface Footprint {
  id: string
  x: number
  y: number
  speedX: number
  speedY: number
  size: number
  opacity: number
  message: string
  emotion?: "curious" | "determined" | "hopeful" | "skeptical" | "enlightened" | "rebellious"
  location?: string
  timestamp: number
} 