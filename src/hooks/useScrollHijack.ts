import type { Direction } from '@/types/planet'
import { useEffect, useRef } from 'react'

interface IUseScrollHijackProps {
  onNext: () => void
  onPrev: () => void
  enabled?: boolean
}

// tempo mínimo entre trocas pelo scroll, alinhado com a transição do planeta
const WHEEL_COOLDOWN_MS = 1100
const SWIPE_COOLDOWN_MS = 450
// pausa que separa um gesto do próximo (a inércia do trackpad gera eventos contínuos)
const GESTURE_GAP_MS = 180
const WHEEL_THRESHOLD = 30
const SWIPE_THRESHOLD = 50

function normalizeWheelDelta(event: WheelEvent) {
  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) return event.deltaY * 16
  if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
    return event.deltaY * window.innerHeight
  }
  return event.deltaY
}

// o scroll só troca de planeta se não houver um elemento rolável sob o cursor
function canScrollInside(target: EventTarget | null, deltaY: number) {
  let element = target instanceof Element ? target : null

  while (element && element !== document.body) {
    const { overflowY } = window.getComputedStyle(element)
    const isScrollable =
      (overflowY === 'auto' || overflowY === 'scroll') &&
      element.scrollHeight > element.clientHeight

    if (isScrollable) {
      const isAtTop = element.scrollTop <= 0
      const isAtBottom =
        Math.ceil(element.scrollTop + element.clientHeight) >=
        element.scrollHeight

      if ((deltaY < 0 && !isAtTop) || (deltaY > 0 && !isAtBottom)) return true
    }

    element = element.parentElement
  }

  return false
}

export function useScrollHijack({
  onNext,
  onPrev,
  enabled = true,
}: IUseScrollHijackProps) {
  const lockedUntilRef = useRef(0)
  const lastWheelAtRef = useRef(0)
  const wheelDeltaRef = useRef(0)
  const gestureUsedRef = useRef(false)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    if (!enabled) return

    function navigate(direction: Direction, cooldown: number) {
      lockedUntilRef.current = performance.now() + cooldown

      if (direction === 1) onNext()
      else onPrev()
    }

    function handleWheel(event: WheelEvent) {
      // ctrl + scroll é o zoom de pinça do trackpad
      if (event.ctrlKey) return

      const deltaY = normalizeWheelDelta(event)
      if (canScrollInside(event.target, deltaY)) return

      event.preventDefault()

      const now = performance.now()
      if (now - lastWheelAtRef.current > GESTURE_GAP_MS) {
        gestureUsedRef.current = false
        wheelDeltaRef.current = 0
      }
      lastWheelAtRef.current = now

      // um planeta por gesto, respeitando o tempo da transição
      if (gestureUsedRef.current || now < lockedUntilRef.current) return

      wheelDeltaRef.current += deltaY
      if (Math.abs(wheelDeltaRef.current) < WHEEL_THRESHOLD) return

      gestureUsedRef.current = true
      navigate(wheelDeltaRef.current > 0 ? 1 : -1, WHEEL_COOLDOWN_MS)
    }

    function handleTouchStart(event: TouchEvent) {
      const touch = event.touches[0]
      touchStartRef.current = { x: touch.clientX, y: touch.clientY }
    }

    function handleTouchEnd(event: TouchEvent) {
      const start = touchStartRef.current
      touchStartRef.current = null

      if (!start || performance.now() < lockedUntilRef.current) return

      const touch = event.changedTouches[0]
      const deltaX = start.x - touch.clientX
      const deltaY = start.y - touch.clientY

      // só gestos predominantemente horizontais trocam de planeta
      const isHorizontalSwipe =
        Math.abs(deltaX) >= SWIPE_THRESHOLD &&
        Math.abs(deltaX) > Math.abs(deltaY) * 1.2

      if (isHorizontalSwipe) navigate(deltaX > 0 ? 1 : -1, SWIPE_COOLDOWN_MS)
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [enabled, onNext, onPrev])
}
