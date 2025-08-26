"use client"
import { cn } from "@/lib/utils"
import type React from "react"
import { useEffect, useRef } from "react"

export const CanvasRevealEffect = ({
  animationSpeed = 0.4,
  colors = [[0, 255, 255]],
  containerClassName,
  showGradient = false,
}: {
  animationSpeed?: number
  colors?: number[][]
  containerClassName?: string
  showGradient?: boolean
}) => {
  return (
    <div className={cn("h-full relative bg-white w-full", containerClassName)}>
      <div className="h-full w-full">
        <MatrixEffect colors={colors} animationSpeed={animationSpeed} />
      </div>
      {showGradient && <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-[84%]" />}
    </div>
  )
}

const MatrixEffect: React.FC<{ colors: number[][]; animationSpeed: number }> = ({ colors, animationSpeed }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * 2
      canvas.height = canvas.offsetHeight * 2
      ctx.scale(2, 2)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const fontSize = 14
    const columns = Math.floor(canvas.width / fontSize)
    const drops: number[] = []

    // Initialize drops
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * canvas.height
    }

    const draw = () => {
      ctx.fillStyle = "rgba(255, 255, 255, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const colorIndex = Math.floor(Math.random() * colors.length)
        const [r, g, b] = colors[colorIndex]

        const opacity = Math.random() * 0.4 + 0.2
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`

        // Random character (numbers and letters)
        const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
        const char = chars[Math.floor(Math.random() * chars.length)]

        ctx.fillText(char, i * fontSize, drops[i])

        // Reset drop to top randomly
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }

        drops[i] += animationSpeed * 20
      }
    }

    const interval = setInterval(draw, 50)

    return () => {
      clearInterval(interval)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [colors, animationSpeed])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ opacity: 0.3 }} />
}
