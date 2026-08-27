'use client'

import { useEffect, useRef } from 'react'

type P = { x: number; y: number; z: number }

/**
 * True-3D particle starfield rendered on canvas: points live in 3D space,
 * are perspective-projected, slowly orbit, and parallax with the cursor.
 * Nearby particles get connected with faint lines for a "network" feel.
 */
export function HeroParticles({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let w = 0
    let h = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)

    const DEPTH = 900
    const COUNT = 150
    const particles: P[] = Array.from({ length: COUNT }, () => ({
      x: (Math.random() - 0.5) * 1800,
      y: (Math.random() - 0.5) * 1100,
      z: Math.random() * DEPTH,
    }))

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 }
    let angle = 0

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      w = rect.width
      h = rect.height
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const onMouse = (e: MouseEvent) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2
    }

    const project = (p: P, rot: number) => {
      // Slow orbital rotation around the Y axis
      const cos = Math.cos(rot)
      const sin = Math.sin(rot)
      const rx = p.x * cos - (p.z - DEPTH / 2) * sin
      const rz = p.x * sin + (p.z - DEPTH / 2) * cos + DEPTH / 2
      const fov = 420
      const scale = fov / (fov + rz)
      return {
        sx: w / 2 + (rx + mouse.x * 60) * scale,
        sy: h / 2 + (p.y + mouse.y * 40) * scale,
        scale,
        depth: rz / DEPTH,
      }
    }

    const frame = () => {
      ctx.clearRect(0, 0, w, h)
      angle += 0.0011
      mouse.x += (mouse.tx - mouse.x) * 0.03
      mouse.y += (mouse.ty - mouse.y) * 0.03

      const projected = particles.map((p) => project(p, angle))

      // Connection lines between close particles
      ctx.lineWidth = 1
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const a = projected[i]
          const b = projected[j]
          const dx = a.sx - b.sx
          const dy = a.sy - b.sy
          const dist = dx * dx + dy * dy
          if (dist < 8500) {
            const alpha = (1 - dist / 8500) * 0.16 * a.scale
            ctx.strokeStyle = `rgba(103, 200, 255, ${alpha})`
            ctx.beginPath()
            ctx.moveTo(a.sx, a.sy)
            ctx.lineTo(b.sx, b.sy)
            ctx.stroke()
          }
        }
      }

      // Particles
      for (const pt of projected) {
        const r = Math.max(0.4, 2.4 * pt.scale)
        const alpha = 0.25 + (1 - pt.depth) * 0.55
        const grad = ctx.createRadialGradient(pt.sx, pt.sy, 0, pt.sx, pt.sy, r * 3)
        grad.addColorStop(0, `rgba(147, 217, 255, ${alpha})`)
        grad.addColorStop(1, 'rgba(147, 217, 255, 0)')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(pt.sx, pt.sy, r * 3, 0, Math.PI * 2)
        ctx.fill()
      }

      raf = requestAnimationFrame(frame)
    }

    resize()
    window.addEventListener('resize', resize)
    if (!reduce) {
      window.addEventListener('mousemove', onMouse)
      raf = requestAnimationFrame(frame)
    } else {
      // Static single render for reduced motion
      const projected = particles.map((p) => project(p, 0.4))
      for (const pt of projected) {
        ctx.fillStyle = `rgba(147, 217, 255, ${0.2 + (1 - pt.depth) * 0.4})`
        ctx.beginPath()
        ctx.arc(pt.sx, pt.sy, Math.max(0.5, 2 * pt.scale), 0, Math.PI * 2)
        ctx.fill()
      }
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden className={`pointer-events-none ${className || ''}`} />
}
