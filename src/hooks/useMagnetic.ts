import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { useMediaQuery } from './useMediaQuery'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

// o elemento é "atraído" pelo cursor enquanto ele passa por cima
export function useMagnetic<T extends HTMLElement>(strength = 0.35) {
  const elementRef = useRef<T>(null)
  const hasFinePointer = useMediaQuery('(pointer: fine)')
  const reducedMotion = usePrefersReducedMotion()

  useGSAP(
    () => {
      const element = elementRef.current
      if (!element || !hasFinePointer || reducedMotion) return

      const moveX = gsap.quickTo(element, 'x', {
        duration: 0.6,
        ease: 'power3.out',
      })
      const moveY = gsap.quickTo(element, 'y', {
        duration: 0.6,
        ease: 'power3.out',
      })

      const handleMove = (event: PointerEvent) => {
        const rect = element.getBoundingClientRect()
        // desconta o deslocamento atual para medir a partir da posição original
        const centerX =
          rect.left - Number(gsap.getProperty(element, 'x')) + rect.width / 2
        const centerY =
          rect.top - Number(gsap.getProperty(element, 'y')) + rect.height / 2

        moveX((event.clientX - centerX) * strength)
        moveY((event.clientY - centerY) * strength)
      }

      const handleLeave = () => {
        moveX(0)
        moveY(0)
      }

      element.addEventListener('pointermove', handleMove)
      element.addEventListener('pointerleave', handleLeave)

      return () => {
        element.removeEventListener('pointermove', handleMove)
        element.removeEventListener('pointerleave', handleLeave)
      }
    },
    { dependencies: [hasFinePointer, reducedMotion, strength] }
  )

  return elementRef
}
