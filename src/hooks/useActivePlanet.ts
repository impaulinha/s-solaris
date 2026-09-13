import { PLANETS } from '@/constants/planets'
import { getCircularOffset } from '@/lib/utils'
import type { Direction } from '@/types/planet'
import { useCallback, useState } from 'react'

interface IActivePlanetState {
  index: number
  direction: Direction
}

export function useActivePlanet() {
  const [state, setState] = useState<IActivePlanetState>({
    index: 0,
    direction: 1,
  })

  const goToNextPlanet = useCallback(() => {
    setState(({ index }) => ({
      index: (index + 1) % PLANETS.length,
      direction: 1,
    }))
  }, [])

  const goToPrevPlanet = useCallback(() => {
    setState(({ index }) => ({
      index: (index - 1 + PLANETS.length) % PLANETS.length,
      direction: -1,
    }))
  }, [])

  const goToIndexPlanet = useCallback((nextIndex: number) => {
    if (nextIndex < 0 || nextIndex >= PLANETS.length) return

    setState((prev) => {
      if (prev.index === nextIndex) return prev

      const offset = getCircularOffset(prev.index, nextIndex, PLANETS.length)
      return { index: nextIndex, direction: offset > 0 ? 1 : -1 }
    })
  }, [])

  return {
    activeIndex: state.index,
    activePlanet: PLANETS[state.index],
    direction: state.direction,
    goToNextPlanet,
    goToPrevPlanet,
    goToIndexPlanet,
  }
}
