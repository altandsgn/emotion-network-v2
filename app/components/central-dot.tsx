"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

export default function CentralDot() {
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!dotRef.current) return

    // Create pulsating animation
    const timeline = gsap.timeline({
      repeat: -1,
      yoyo: true,
    })

    timeline.to(dotRef.current, {
      scale: 1.2,
      duration: 1,
      ease: "power1.inOut",
    })

    return () => {
      timeline.kill()
    }
  }, [])

  return (
    <div
      ref={dotRef}
      className="absolute top-1/2 left-1/2 w-4 h-4 bg-green-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"
      style={{
        boxShadow: "0 0 20px rgba(34, 197, 94, 0.5)",
      }}
    />
  )
} 