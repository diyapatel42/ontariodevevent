"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

export interface MagneticFieldBackgroundProps {
  className?: string
  children?: React.ReactNode
  /** Number of particles (iron filings) */
  particleCount?: number
  /** Number of fixed magnetic poles */
  poleCount?: number
  /** Particle color */
  particleColor?: string
  /** Length of each filing line */
  lineLength?: number
  /** Line thickness */
  lineWidth?: number
  /** Overall opacity */
  opacity?: number
  /** Cursor magnetic strength */
  cursorStrength?: number
  /** Cursor polarity: 1 for north, -1 for south */
  cursorPolarity?: number
  /** Show continuous field lines */
  showFieldLines?: boolean
  /** Field line color */
  fieldLineColor?: string
}

interface Pole {
  x: number
  y: number
  strength: number
  polarity: number // 1 or -1
}

interface Particle {
  x: number
  y: number
}

export function MagneticFieldBackground({
  className,
  children,
  particleCount = 1500,
  poleCount = 4,
  particleColor = "rgba(180, 180, 200, 0.6)",
  lineLength = 12,
  lineWidth = 1.5,
  opacity = 1,
  cursorStrength = 2,
  cursorPolarity = 1,
  showFieldLines = false,
  fieldLineColor = "rgba(100, 140, 255, 0.15)",
}: MagneticFieldBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = container.getBoundingClientRect()
    let width = rect.width
    let height = rect.height
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.scale(dpr, dpr)

    let animationId: number
    let mouseX = -10000
    let mouseY = -10000

    // Create fixed poles
    const poles: Pole[] = []
    for (let i = 0; i < poleCount; i++) {
      const angle = (i / poleCount) * Math.PI * 2
      const radius = Math.min(width, height) * 0.3
      poles.push({
        x: width / 2 + Math.cos(angle) * radius,
        y: height / 2 + Math.sin(angle) * radius,
        strength: 1 + Math.random() * 0.5,
        polarity: i % 2 === 0 ? 1 : -1,
      })
    }

    // Create particles (iron filings)
    const particles: Particle[] = []
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
      })
    }

    // Calculate magnetic field vector at a point
    const getFieldVector = (x: number, y: number): [number, number] => {
      let bx = 0
      let by = 0

      // Contribution from fixed poles
      for (const pole of poles) {
        const dx = x - pole.x
        const dy = y - pole.y
        const distSq = dx * dx + dy * dy
        const dist = Math.sqrt(distSq) + 1 // +1 to prevent division by zero

        // Simplified dipole field (radial component)
        const strength = (pole.strength * pole.polarity) / (dist * dist)
        bx += (dx / dist) * strength
        by += (dy / dist) * strength
      }

      // Contribution from cursor (if active)
      if (mouseX > -1000 && mouseY > -1000) {
        const dx = x - mouseX
        const dy = y - mouseY
        const distSq = dx * dx + dy * dy
        const dist = Math.sqrt(distSq) + 1

        const strength = (cursorStrength * cursorPolarity) / (dist * dist)
        bx += (dx / dist) * strength
        by += (dy / dist) * strength
      }

      // Normalize
      const mag = Math.sqrt(bx * bx + by * by) + 0.001
      return [bx / mag, by / mag]
    }

    // Mouse handlers
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      mouseY = e.clientY - rect.top
    }

    const handleMouseLeave = () => {
      mouseX = -10000
      mouseY = -10000
    }

    container.addEventListener("mousemove", handleMouseMove)
    container.addEventListener("mouseleave", handleMouseLeave)

    // Resize handler
    const handleResize = () => {
      const rect = container.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.scale(dpr, dpr)

      // Reposition poles
      for (let i = 0; i < poles.length; i++) {
        const angle = (i / poles.length) * Math.PI * 2
        const radius = Math.min(width, height) * 0.3
        poles[i].x = width / 2 + Math.cos(angle) * radius
        poles[i].y = height / 2 + Math.sin(angle) * radius
      }

      // Redistribute particles
      for (const p of particles) {
        p.x = Math.random() * width
        p.y = Math.random() * height
      }
    }

    const ro = new ResizeObserver(handleResize)
    ro.observe(container)

    // Draw field lines
    const drawFieldLines = () => {
      if (!showFieldLines) return

      ctx.strokeStyle = fieldLineColor
      ctx.lineWidth = 1

      // Start field lines from around each pole
      for (const pole of poles) {
        const lineCount = 12
        for (let i = 0; i < lineCount; i++) {
          const startAngle = (i / lineCount) * Math.PI * 2
          let x = pole.x + Math.cos(startAngle) * 20
          let y = pole.y + Math.sin(startAngle) * 20

          ctx.beginPath()
          ctx.moveTo(x, y)

          // Trace field line
          const direction = pole.polarity
          for (let step = 0; step < 100; step++) {
            const [fx, fy] = getFieldVector(x, y)
            x += fx * 5 * direction
            y += fy * 5 * direction

            if (x < 0 || x > width || y < 0 || y > height) break

            // Check if we're close to another pole
            let nearPole = false
            for (const p of poles) {
              const dx = x - p.x
              const dy = y - p.y
              if (dx * dx + dy * dy < 400) {
                nearPole = true
                break
              }
            }
            if (nearPole) break

            ctx.lineTo(x, y)
          }

          ctx.stroke()
        }
      }
    }

    // Animation
    const animate = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.globalAlpha = opacity

      // Draw field lines first (background)
      drawFieldLines()

      // Draw particles as aligned filings
      ctx.strokeStyle = particleColor
      ctx.lineWidth = lineWidth
      ctx.lineCap = "round"

      for (const particle of particles) {
        const [fx, fy] = getFieldVector(particle.x, particle.y)

        // Draw filing aligned to field
        const halfLen = lineLength / 2
        const x1 = particle.x - fx * halfLen
        const y1 = particle.y - fy * halfLen
        const x2 = particle.x + fx * halfLen
        const y2 = particle.y + fy * halfLen

        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }

      // Draw subtle glow at pole positions
      for (const pole of poles) {
        const gradient = ctx.createRadialGradient(pole.x, pole.y, 0, pole.x, pole.y, 50)
        const color = pole.polarity > 0 ? "255, 100, 100" : "100, 100, 255"
        gradient.addColorStop(0, `rgba(${color}, 0.1)`)
        gradient.addColorStop(1, "transparent")
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(pole.x, pole.y, 50, 0, Math.PI * 2)
        ctx.fill()
      }

      // Draw cursor pole indicator
      if (mouseX > -1000 && mouseY > -1000) {
        const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 80)
        const color = cursorPolarity > 0 ? "255, 150, 100" : "100, 150, 255"
        gradient.addColorStop(0, `rgba(${color}, 0.15)`)
        gradient.addColorStop(1, "transparent")
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(mouseX, mouseY, 80, 0, Math.PI * 2)
        ctx.fill()
      }

      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationId)
      container.removeEventListener("mousemove", handleMouseMove)
      container.removeEventListener("mouseleave", handleMouseLeave)
      ro.disconnect()
    }
  }, [
    particleCount,
    poleCount,
    particleColor,
    lineLength,
    lineWidth,
    opacity,
    cursorStrength,
    cursorPolarity,
    showFieldLines,
    fieldLineColor,
  ])

  return (
    <div
      ref={containerRef}
      className={cn("fixed inset-0 overflow-hidden bg-neutral-950", className)}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Subtle center glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(120, 80, 200, 0.05) 0%, transparent 50%)",
        }}
      />

      {/* Vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(5,5,10,0.9) 100%)",
        }}
      />

      {/* Content layer */}
      {children && <div className="relative z-10 h-full w-full">{children}</div>}
    </div>
  )
}

export default function MagneticFieldBackgroundDemo() {
  return <MagneticFieldBackground showFieldLines />
}
