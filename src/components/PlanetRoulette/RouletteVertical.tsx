import { PLANETS } from '@/constants/planets'
import { useEffect, useRef } from 'react'
import { RouletteItem } from './RouletteItem'

interface IRouletteVerticalProps {
  activeIndex: number
  onSelect: (index: number) => void
}

export function RouletteVertical({
  activeIndex,
  onSelect,
}: IRouletteVerticalProps) {
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!listRef.current) return

    //const items = listRef.current.querySelectorAll('[data-roulette-item]')
  }, [activeIndex])

  function getPosition(index: number) {
    const diff = index - activeIndex
    if (diff === 0) return 'active'
    if (diff === -1) return 'prev'
    if (diff === 1) return 'next'
    return 'others'
  }

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <div ref={listRef} className="relative flex flex-col items-center gap-6">
        {PLANETS.map((planet, index) => (
          <div
            key={planet.id}
            className="flex shrink-0 items-center justify-center"
          >
            <RouletteItem
              planet={planet}
              position={getPosition(index)}
              onClick={() => onSelect(index)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
