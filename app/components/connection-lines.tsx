"use client"

import { useEffect, useRef } from "react"
import type { Footprint } from "../types/footprint"

interface ConnectionLinesProps {
  footprints: Footprint[]
}

export default function ConnectionLines({ footprints }: ConnectionLinesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const drawConnections = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.strokeStyle = "rgba(34, 197, 94, 0.2)"
      ctx.lineWidth = 1

      footprints.forEach((footprint1, i) => {
        footprints.slice(i + 1).forEach((footprint2) => {
          if (
            (footprint1.emotion && footprint2.emotion && footprint1.emotion === footprint2.emotion) ||
            (footprint1.location && footprint2.location && footprint1.location === footprint2.location)
          ) {
            ctx.beginPath()
            ctx.moveTo(footprint1.x, footprint1.y)
            ctx.lineTo(footprint2.x, footprint2.y)
            ctx.stroke()
          }
        })
      })
    }

    drawConnections()
    const animationFrame = requestAnimationFrame(function animate() {
      drawConnections()
      requestAnimationFrame(animate)
    })

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrame)
    }
  }, [footprints])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  )
} 