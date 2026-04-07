import { PLANETS } from '@/constants/planets'
import { useCallback, useState } from 'react'

export function useActivePlanet() {
  const [activeIndex, setActiveIndex] = useState(0)

  const goToNextPlanet = useCallback(() => {
    setActiveIndex((prev) => (prev < PLANETS.length - 1 ? prev + 1 : 0))
  }, [])

  const goToPrevPlanet = useCallback(() => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : PLANETS.length - 1))
  }, [])

  const goToIndexPlanet = useCallback((index: number) => {
    if (index >= 0 && index < PLANETS.length) {
      setActiveIndex(index)
    }
  }, [])

  return {
    activeIndex,
    goToNextPlanet,
    goToPrevPlanet,
    goToIndexPlanet,
    activePlanet: PLANETS[activeIndex],
  }
}
