import { useEffect } from 'react'

interface IUseKeyboardNavigationProps {
  total: number
  onNext: () => void
  onPrev: () => void
  onSelect: (index: number) => void
  enabled?: boolean
}

const NEXT_KEYS = new Set(['ArrowDown', 'ArrowRight', 'PageDown'])
const PREV_KEYS = new Set(['ArrowUp', 'ArrowLeft', 'PageUp'])

export function useKeyboardNavigation({
  total,
  onNext,
  onPrev,
  onSelect,
  enabled = true,
}: IUseKeyboardNavigationProps) {
  useEffect(() => {
    if (!enabled) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.repeat || event.altKey || event.ctrlKey || event.metaKey) {
        return
      }

      // teclas 1 a 8 levam direto ao planeta
      const digit = Number(event.key)

      if (NEXT_KEYS.has(event.key)) onNext()
      else if (PREV_KEYS.has(event.key)) onPrev()
      else if (event.key === 'Home') onSelect(0)
      else if (event.key === 'End') onSelect(total - 1)
      else if (digit >= 1 && digit <= total) onSelect(digit - 1)
      else return

      event.preventDefault()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [enabled, total, onNext, onPrev, onSelect])
}
