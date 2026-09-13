import { useRef } from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { gsap, useGSAP } from '@/lib/gsap'

const INTERACTIVE_SELECTOR = 'a, button, [data-cursor-label]'

export function Cursor() {
  const hasFinePointer = useMediaQuery('(pointer: fine)')
  const reducedMotion = usePrefersReducedMotion()

  if (!hasFinePointer || reducedMotion) return null

  return <CursorFollower />
}

function CursorFollower() {
  const dotRef = useRef<HTMLDivElement>(null)
  const followerRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useGSAP(() => {
    const dot = dotRef.current
    const follower = followerRef.current
    const ring = ringRef.current
    const label = labelRef.current
    if (!dot || !follower || !ring || !label) return

    document.documentElement.classList.add('has-custom-cursor')
    gsap.set([dot, follower], { autoAlpha: 0 })

    // o ponto acompanha o mouse na hora; o anel vem atrás, com atraso
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power3' })
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power3' })
    const followerX = gsap.quickTo(follower, 'x', {
      duration: 0.55,
      ease: 'power3',
    })
    const followerY = gsap.quickTo(follower, 'y', {
      duration: 0.55,
      ease: 'power3',
    })

    let isVisible = false
    let hoveredElement: Element | null = null

    const show = (visible: boolean) => {
      isVisible = visible
      gsap.to([dot, follower], { autoAlpha: visible ? 1 : 0, duration: 0.3 })
    }

    const handleMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return

      if (!isVisible) {
        gsap.set([dot, follower], { x: event.clientX, y: event.clientY })
        show(true)
      }

      dotX(event.clientX)
      dotY(event.clientY)
      followerX(event.clientX)
      followerY(event.clientY)
    }

    const handleOver = (event: PointerEvent) => {
      const target =
        event.target instanceof Element
          ? event.target.closest(INTERACTIVE_SELECTOR)
          : null
      if (target === hoveredElement) return

      hoveredElement = target
      const text = target?.getAttribute('data-cursor-label') ?? ''

      if (text) label.textContent = text
      ring.dataset.state = target ? (text ? 'label' : 'hover') : 'idle'

      gsap.to(ring, {
        scale: target ? (text ? 2.6 : 1.8) : 1,
        duration: 0.6,
        ease: 'expo.out',
      })
      gsap.to(dot, { scale: target ? 0 : 1, duration: 0.3 })
      gsap.to(label, { autoAlpha: text ? 1 : 0, duration: 0.3 })
    }

    const handleDown = () => gsap.to(follower, { scale: 0.8, duration: 0.2 })
    const handleUp = () => gsap.to(follower, { scale: 1, duration: 0.4 })
    const handleLeaveWindow = (event: MouseEvent) => {
      if (!event.relatedTarget) show(false)
    }

    window.addEventListener('pointermove', handleMove, { passive: true })
    window.addEventListener('pointerover', handleOver, { passive: true })
    window.addEventListener('pointerdown', handleDown, { passive: true })
    window.addEventListener('pointerup', handleUp, { passive: true })
    document.addEventListener('mouseout', handleLeaveWindow)

    return () => {
      document.documentElement.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerover', handleOver)
      window.removeEventListener('pointerdown', handleDown)
      window.removeEventListener('pointerup', handleUp)
      document.removeEventListener('mouseout', handleLeaveWindow)
    }
  })

  return (
    <>
      <div
        ref={followerRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[60]"
      >
        {/* margens negativas centralizam: o GSAP controla o transform */}
        <div
          ref={ringRef}
          data-state="idle"
          className="absolute -mt-5 -ml-5 size-10 rounded-full border border-star-100/40 transition-colors duration-500 data-[state=hover]:border-planet data-[state=label]:border-planet data-[state=label]:bg-planet"
        />
        <span
          ref={labelRef}
          className="invisible absolute -translate-1/2 font-mono text-[9px] tracking-[0.2em] whitespace-nowrap text-space-950 uppercase opacity-0"
        />
      </div>

      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[60] -mt-[3px] -ml-[3px] size-1.5 rounded-full bg-star-100 mix-blend-difference"
      />
    </>
  )
}
