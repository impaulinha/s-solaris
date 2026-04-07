import { useMediaQuery } from '@/hooks/useMediaQuery'
import { RouletteVertical } from './RouletteVertical'
import { RouletteHorizontal } from './RouletteHorizontal'

interface IPlanetRouletteProps {
  activeIndex: number
  onSelect: (index: number) => void
  onNext: () => void
  onPrev: () => void
}

export function PlanetRoulette({
  activeIndex,
  onSelect,
  onNext,
  onPrev,
}: IPlanetRouletteProps) {
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  if (isDesktop) {
    return <RouletteVertical activeIndex={activeIndex} onSelect={onSelect} />
  }

  return (
    <RouletteHorizontal
      activeIndex={activeIndex}
      onSelect={onSelect}
      onNext={onNext}
      onPrev={onPrev}
    />
  )
}
