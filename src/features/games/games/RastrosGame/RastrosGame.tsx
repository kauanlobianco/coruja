import { Atom, Award } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { GlobalFeedback } from '../../shared/GlobalFeedback'
import { GameTopbar } from '../../shared/GameTopbar'
import { useFeedback } from '../../shared/useFeedback'

interface RastrosGameProps {
  onBack: () => void
}

export function RastrosGame({ onBack }: RastrosGameProps) {
  const [screen, setScreen] = useState<'start' | 'play'>('start')

  return (
    <div className="cg-page">
      {screen === 'start' ? (
        <RastrosStart onBack={onBack} onPlay={() => setScreen('play')} />
      ) : (
        <RastrosPlay onBack={() => setScreen('start')} />
      )}
    </div>
  )
}

function RastrosStart({ onBack, onPlay }: { onBack: () => void; onPlay: () => void }) {
  return (
    <div className="cg-inner">
      <GameTopbar onBack={onBack} />
      <div className="cg-start-content cg-start-content--rastros">
        <div className="cg-start-icon cg-start-icon--rastros">
          <Atom size={48} color="white" />
        </div>
        <h2 className="cg-preview-title">Rastros da Noite</h2>
        <p className="cg-preview-desc">
          Acompanhe o alvo em um balé fluído de esferas espaciais.
        </p>
        <button type="button" className="cg-btn-pill" onClick={onPlay}>
          START GAME
        </button>
      </div>
    </div>
  )
}

// ---------- types ----------
interface Sphere {
  x: number; y: number; r: number
  vx: number; vy: number
  history: { x: number; y: number }[]
}
interface Star {
  x: number; y: number; r: number; opacity: number
}
interface Pulse {
  x: number; y: number; r: number; alpha: number
}
interface Ripple {
  active: boolean; x: number; y: number; radius: number; maxRadius: number
}

type Phase = 'INIT' | 'OBSERVE' | 'SHUFFLE' | 'CHOOSE' | 'RESULT'

interface GameState {
  spheres: Sphere[]
  stars: Star[]
  pulses: Pulse[]
  targetIndex: number
  phase: Phase
  isPlaying: boolean
  ripple: Ripple
  pulseTime: number
  score: number
  timeouts: ReturnType<typeof setTimeout>[]
}

// ---------- play screen ----------
function RastrosPlay({ onBack }: { onBack: () => void }) {
  const { feedback, showFeedback } = useFeedback()
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const rafRef       = useRef<number>(0)
  const gsRef        = useRef<GameState>(createInitialGS())

  // React UI state
  const [score, setScore]       = useState(0)
  const [status, setStatus]     = useState('Observe o alvo...')
  const [gameOver, setGameOver] = useState(false)

  function createInitialGS(): GameState {
    return {
      spheres: [], stars: [], pulses: [], targetIndex: 0,
      phase: 'INIT', isPlaying: false,
      ripple: { active: false, x: 0, y: 0, radius: 0, maxRadius: 0 },
      pulseTime: 0, score: 0, timeouts: [],
    }
  }

  // ─── helpers ───────────────────────────────────────────────────────────
  const later = useCallback((fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms)
    gsRef.current.timeouts.push(t)
  }, [])

  const clearTimeouts = useCallback(() => {
    gsRef.current.timeouts.forEach(clearTimeout)
    gsRef.current.timeouts = []
  }, [])

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    canvas.width  = container.clientWidth
    canvas.height = container.clientHeight
    gsRef.current.ripple.maxRadius = Math.max(canvas.width, canvas.height) * 1.2
  }, [])

  const initStars = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    gsRef.current.stars = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5,
      opacity: 0.1 + Math.random() * 0.3,
    }))
  }, [])

  // ─── draw ──────────────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const gs = gsRef.current
    const w = canvas.width, h = canvas.height

    const bg = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w)
    bg.addColorStop(0, '#151632')
    bg.addColorStop(1, '#0a0b1e')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, w, h)

    // Stars
    gs.stars.forEach((s) => {
      ctx.globalAlpha = s.opacity
      ctx.beginPath()
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
      ctx.fillStyle = '#ffffff'
      ctx.fill()
    })
    ctx.globalAlpha = 1

    // Impact pulses
    gs.pulses.forEach((p) => {
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(34,211,238,${Math.max(0, p.alpha)})`
      ctx.lineWidth = 2.5
      ctx.stroke()
    })

    // Trails
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    gs.spheres.forEach((sp) => {
      if (sp.history.length > 1) {
        for (let i = 0; i < sp.history.length - 1; i++) {
          const p1 = sp.history[i], p2 = sp.history[i + 1]
          const ratio = i / sp.history.length
          ctx.beginPath()
          ctx.moveTo(p1.x, p1.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.strokeStyle = `rgba(34,211,238,${ratio * 0.4})`
          ctx.lineWidth = sp.r * ratio * 0.8
          ctx.stroke()
        }
      }
    })

    // Spheres
    gs.spheres.forEach((sp, idx) => {
      const isTarget = idx === gs.targetIndex
      const isHighlight = (gs.phase === 'OBSERVE' && isTarget) ||
                          (gs.phase === 'RESULT' && isTarget && !gs.ripple.active)

      if (isHighlight) {
        ctx.shadowBlur  = 30 + Math.sin(gs.pulseTime * 0.15) * 15
        ctx.shadowColor = '#22d3ee'
      } else {
        ctx.shadowBlur = 0
      }

      const grad = ctx.createRadialGradient(sp.x, sp.y, sp.r * 0.2, sp.x, sp.y, sp.r)
      if (isHighlight) {
        grad.addColorStop(0, 'rgba(255,255,255,0.9)')
        grad.addColorStop(0.5, 'rgba(34,211,238,0.8)')
        grad.addColorStop(1, 'rgba(8,145,178,0.9)')
      } else {
        grad.addColorStop(0, 'rgba(255,255,255,0.15)')
        grad.addColorStop(1, 'rgba(0,0,0,0.8)')
      }

      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2)
      ctx.fill()

      ctx.strokeStyle = isHighlight ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)'
      ctx.lineWidth   = isHighlight ? 2.5 : 1.5
      ctx.stroke()

      if (gs.phase === 'OBSERVE' && isTarget) {
        ctx.shadowBlur = 0
        ctx.beginPath()
        ctx.arc(sp.x, sp.y, sp.r + 12 + Math.sin(gs.pulseTime * 0.2) * 6, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(34,211,238,${0.5 + Math.sin(gs.pulseTime * 0.2) * 0.5})`
        ctx.lineWidth = 2
        ctx.stroke()
      }

      ctx.shadowBlur = 0
      // Specular highlight
      const hl = ctx.createRadialGradient(
        sp.x - sp.r * 0.35, sp.y - sp.r * 0.35, 0,
        sp.x - sp.r * 0.35, sp.y - sp.r * 0.35, sp.r * 0.6,
      )
      hl.addColorStop(0, 'rgba(255,255,255,0.8)')
      hl.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = hl
      ctx.beginPath()
      ctx.arc(sp.x - sp.r * 0.35, sp.y - sp.r * 0.35, sp.r * 0.6, 0, Math.PI * 2)
      ctx.fill()
    })

    // Ripple
    if (gs.ripple.active) {
      ctx.shadowBlur = 0
      ctx.beginPath()
      ctx.arc(gs.ripple.x, gs.ripple.y, gs.ripple.radius, 0, Math.PI * 2)
      const alpha = Math.max(0, 1 - gs.ripple.radius / gs.ripple.maxRadius)
      ctx.strokeStyle = `rgba(16,185,129,${alpha})`
      ctx.lineWidth   = 8
      ctx.stroke()
      ctx.fillStyle   = `rgba(16,185,129,${alpha * 0.1})`
      ctx.fill()
    }
  }, [])

  // ─── update ────────────────────────────────────────────────────────────
  const update = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gs = gsRef.current

    if (gs.ripple.active) {
      gs.ripple.radius += 12
      if (gs.ripple.radius > gs.ripple.maxRadius) gs.ripple.active = false
    }

    gs.pulses.forEach((p) => { p.r += 1.5; p.alpha -= 0.04 })
    gs.pulses = gs.pulses.filter((p) => p.alpha > 0)

    if (gs.phase === 'SHUFFLE') {
      gs.spheres.forEach((sp) => {
        sp.x += sp.vx; sp.y += sp.vy
        if (sp.x - sp.r < 0) { sp.x = sp.r; sp.vx *= -1 }
        else if (sp.x + sp.r > canvas.width) { sp.x = canvas.width - sp.r; sp.vx *= -1 }
        if (sp.y - sp.r < 0) { sp.y = sp.r; sp.vy *= -1 }
        else if (sp.y + sp.r > canvas.height) { sp.y = canvas.height - sp.r; sp.vy *= -1 }
        sp.history.push({ x: sp.x, y: sp.y })
        if (sp.history.length > 25) sp.history.shift()
      })

      for (let i = 0; i < gs.spheres.length; i++) {
        for (let j = i + 1; j < gs.spheres.length; j++) {
          const s1 = gs.spheres[i], s2 = gs.spheres[j]
          const dx = s2.x - s1.x, dy = s2.y - s1.y
          const dist = Math.hypot(dx, dy), minDist = s1.r + s2.r
          if (dist < minDist) {
            const nx = dx / dist, ny = dy / dist
            const overlap = minDist - dist
            s1.x -= nx * overlap * 0.5; s1.y -= ny * overlap * 0.5
            s2.x += nx * overlap * 0.5; s2.y += ny * overlap * 0.5
            const dvx = s2.vx - s1.vx, dvy = s2.vy - s1.vy
            const vAlong = dvx * nx + dvy * ny
            if (vAlong > 0) continue
            const impulse = -2 * vAlong / 2
            s1.vx -= nx * impulse; s1.vy -= ny * impulse
            s2.vx += nx * impulse; s2.vy += ny * impulse
            gs.pulses.push({ x: s1.x + nx * s1.r, y: s1.y + ny * s1.r, r: 5, alpha: 0.8 })
          }
        }
      }
    } else if (gs.phase === 'CHOOSE' || gs.phase === 'RESULT') {
      gs.spheres.forEach((sp) => { if (sp.history.length > 0) sp.history.shift() })
    }
  }, [])

  // ─── next round ────────────────────────────────────────────────────────
  const nextRound = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gs = gsRef.current

    const numSpheres = Math.min(7 + Math.floor(gs.score / 2), 15)
    const speedMult  = Math.min(gs.score * 0.25, 4.0)
    gs.spheres  = []
    gs.pulses   = []
    gs.ripple.active = false

    for (let i = 0; i < numSpheres; i++) {
      const r = 22
      let x = 0, y = 0, overlapping = true, attempts = 0
      while (overlapping && attempts < 100) {
        x = r + Math.random() * (canvas.width - r * 2)
        y = r + Math.random() * (canvas.height - r * 2)
        overlapping = false
        for (let j = 0; j < gs.spheres.length; j++) {
          if (Math.hypot(gs.spheres[j].x - x, gs.spheres[j].y - y) < r * 2) {
            overlapping = true; break
          }
        }
        attempts++
      }
      const speed = 3.0 + speedMult + Math.random() * 1.0
      const angle = Math.random() * Math.PI * 2
      gs.spheres.push({ x, y, r, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, history: [] })
    }

    gs.targetIndex = Math.floor(Math.random() * numSpheres)
    gs.phase = 'OBSERVE'
    setStatus('Observe o alvo...')

    later(() => {
      gs.phase = 'SHUFFLE'
      setStatus('Embaralhando...')
      later(() => {
        gs.phase = 'CHOOSE'
        setStatus('Onde está a esfera alvo?')
      }, 6000)
    }, 2000)
  }, [later])

  // ─── process click result ──────────────────────────────────────────────
  const processResult = useCallback((selectedIndex: number) => {
    const gs = gsRef.current
    gs.phase = 'RESULT'

    if (selectedIndex === gs.targetIndex) {
      showFeedback(true)
      gs.score++
      setScore(gs.score)
      setStatus('Excelente!')
      gs.ripple = {
        active: true,
        x: gs.spheres[gs.targetIndex].x,
        y: gs.spheres[gs.targetIndex].y,
        radius: gs.spheres[gs.targetIndex].r,
        maxRadius: (canvasRef.current?.width ?? 300) * 1.5,
      }
      later(() => nextRound(), 1500)
    } else {
      showFeedback(false)
      setStatus('Foco perdido...')
      later(() => {
        gs.isPlaying = false
        setGameOver(true)
        setStatus('FIM DE JOGO')
      }, 2500)
    }
  }, [later, nextRound, showFeedback])

  // ─── click handler ─────────────────────────────────────────────────────
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const gs = gsRef.current
    if (gs.phase !== 'CHOOSE') return

    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    let clientX: number, clientY: number
    if ('touches' in e) {
      clientX = e.touches[0]?.clientX ?? e.changedTouches[0].clientX
      clientY = e.touches[0]?.clientY ?? e.changedTouches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    const cx = (clientX - rect.left) * scaleX
    const cy = (clientY - rect.top)  * scaleY

    for (let i = 0; i < gs.spheres.length; i++) {
      if (Math.hypot(gs.spheres[i].x - cx, gs.spheres[i].y - cy) < gs.spheres[i].r + 5) {
        processResult(i)
        break
      }
    }
  }, [processResult])

  // ─── rAF loop ──────────────────────────────────────────────────────────
  const startLoop = useCallback(() => {
    const loop = () => {
      if (!gsRef.current.isPlaying) return
      update()
      draw()
      gsRef.current.pulseTime++
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
  }, [update, draw])

  // ─── start ─────────────────────────────────────────────────────────────
  const startGame = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    clearTimeouts()

    const gs = gsRef.current
    gs.score     = 0
    gs.isPlaying = true
    gs.pulseTime = 0
    gs.spheres   = []
    gs.pulses    = []
    gs.phase     = 'INIT'
    gs.ripple.active = false

    setScore(0)
    setStatus('Observe o alvo...')
    setGameOver(false)

    resizeCanvas()
    initStars()
    nextRound()
    startLoop()
  }, [clearTimeouts, resizeCanvas, initStars, nextRound, startLoop])

  // mount / unmount
  useEffect(() => {
    setTimeout(() => startGame(), 10)
    return () => {
      gsRef.current.isPlaying = false
      cancelAnimationFrame(rafRef.current)
      clearTimeouts()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="cg-inner">
      <GlobalFeedback feedback={feedback} />
      <GameTopbar
        onBack={onBack}
        title="Rastros da Noite"
        right={
          <span className="cg-score-card">
            <Award size={14} style={{ color: '#22d3ee' }} />
            {score}
          </span>
        }
      />
      <div className="cg-rastros-play">
        <div className="cg-rastros-status">{status}</div>

        <div className="cg-rastros-container" ref={containerRef}>
          <canvas
            ref={canvasRef}
            className="cg-rastros-canvas"
            onClick={handleCanvasClick}
            onTouchEnd={handleCanvasClick}
          />
          <div className={`cg-rastros-gameover${gameOver ? ' cg-show' : ''}`}>
            <p>Rodadas concluídas</p>
            <span className="cg-rastros-final">{score}</span>
            <button
              type="button"
              className="cg-btn-pill"
              style={{ margin: '0 auto' }}
              onClick={startGame}
            >
              TENTAR NOVAMENTE
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
