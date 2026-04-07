import { PLANETS } from '@/constants/planets'
import gsap from 'gsap'
import React, { useEffect, useRef } from 'react'
import { RouletteItem } from './RouletteItem'

interface IRouletteHorizontalProps {
  activeIndex: number
  onSelect: (index: number) => void
  onNext: () => void
  onPrev: () => void
}

export function RouletteHorizontal({
  activeIndex,
  onSelect,
  onNext,
  onPrev,
}: IRouletteHorizontalProps) {
  const listRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number>(0)
  const ITEM_WIDTH = 100

  useEffect(() => {
    if (!listRef.current) return

    gsap.to(listRef.current, {
      x: -(activeIndex * ITEM_WIDTH),
      duration: 0.7,
      ease: 'power3.out',
    })

    //efeito de arco no menu
    const items = listRef.current.children

    Array.from(items).forEach((item, i) => {
      const diff = Math.abs(i - activeIndex)

      gsap.to(item, {
        y: diff * 20,
        duration: 0.7,
        ease: 'power3.out',
      })
    })
  }, [activeIndex])

  function getPosition(index: number) {
    const diff = index - activeIndex

    if (diff === 0) return 'active'
    if (diff === -1) return 'prev'
    if (diff === 1) return 'next'
    return 'hidden'
  }

  function handleTouchStart(event: React.TouchEvent) {
    touchStartX.current = event.touches[0].clientX
  }

  function handleTouchEnd(event: React.TouchEvent) {
    const threshold = 40
    const deltaX = touchStartX.current - event.changedTouches[0].clientX

    if (deltaX > threshold) onNext()
    else if (deltaX < -threshold) onPrev()
  }

  return (
    <div
      className="relative flex h-32 w-full items-center justify-center overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        ref={listRef}
        className="relative flex items-center"
        style={{ width: ITEM_WIDTH }}
      >
        {PLANETS.map((planet, index) => (
          <div
            key={planet.id}
            className="flex shrink-0 items-center justify-center"
            style={{ width: ITEM_WIDTH }}
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
