import { useEffect, useRef } from 'react'

interface IUseScrollHijackProps {
  onNext: () => void
  onPrev: () => void
}

export function useScrollHijack({ onNext, onPrev }: IUseScrollHijackProps) {
  const cooldownRef = useRef(false)

  useEffect(() => {
    function handleWheel(event: WheelEvent) {
      event.preventDefault()

      if (cooldownRef.current) return

      if (event.deltaY > 0) {
        onNext()
      } else {
        onPrev()
      }

      // cooldown de 800ms para evitar troca rápida demais
      setTimeout(() => {
        cooldownRef.current = false
      }, 800)

      window.addEventListener('wheel', handleWheel, { passive: false })

      return () => {
        window.removeEventListener('wheel', handleWheel)
      }
    }
  }, [onNext, onPrev])
}
