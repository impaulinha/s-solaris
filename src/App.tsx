import { useCallback, useEffect, useRef, useState } from 'react'
import { Cursor } from '@/components/Cursor'
import { Layout } from '@/components/Layout'
import { Navbar } from '@/components/Navbar'
import { PlanetBackdrop } from '@/components/PlanetBackdrop'
import { PlanetHud } from '@/components/PlanetHud'
import { PlanetInfo } from '@/components/PlanetInfo'
import { PlanetNav } from '@/components/PlanetNav'
import { PlanetRoulette } from '@/components/PlanetRoulette'
import { PlanetScene } from '@/components/PlanetScene'
import { Preloader } from '@/components/Preloader'
import { PLANETS } from '@/constants/planets'
import { useActivePlanet } from '@/hooks/useActivePlanet'
import { useIntroAnimation } from '@/hooks/useIntroAnimation'
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation'
import { useScrollHijack } from '@/hooks/useScrollHijack'

function App() {
  const {
    activeIndex,
    activePlanet,
    direction,
    goToIndexPlanet,
    goToNextPlanet,
    goToPrevPlanet,
  } = useActivePlanet()

  const [isReady, setIsReady] = useState(false)
  const stageRef = useRef<HTMLElement>(null)

  const handlePreloaderComplete = useCallback(() => setIsReady(true), [])

  useScrollHijack({
    onNext: goToNextPlanet,
    onPrev: goToPrevPlanet,
    enabled: isReady,
  })

  useKeyboardNavigation({
    total: PLANETS.length,
    onNext: goToNextPlanet,
    onPrev: goToPrevPlanet,
    onSelect: goToIndexPlanet,
    enabled: isReady,
  })

  useIntroAnimation(isReady)

  // a cor do planeta ativo vira uma variável CSS usada em toda a interface
  useEffect(() => {
    document.documentElement.style.setProperty('--planet', activePlanet.color)
  }, [activePlanet.color])

  return (
    <>
      <Preloader onComplete={handlePreloaderComplete} />
      <Cursor />
      <Navbar />
      <Layout
        stageRef={stageRef}
        backdrop={
          <PlanetBackdrop planet={activePlanet} direction={direction} />
        }
        scene={
          <PlanetScene
            planet={activePlanet}
            direction={direction}
            isReady={isReady}
            stageRef={stageRef}
          />
        }
        roulette={
          <PlanetRoulette
            activeIndex={activeIndex}
            onSelect={goToIndexPlanet}
          />
        }
        info={<PlanetInfo planet={activePlanet} isReady={isReady} />}
        hud={
          <PlanetHud
            planet={activePlanet}
            direction={direction}
            isReady={isReady}
          />
        }
        footer={
          <PlanetNav
            activeIndex={activeIndex}
            onNext={goToNextPlanet}
            onPrev={goToPrevPlanet}
            onSelect={goToIndexPlanet}
          />
        }
      />
    </>
  )
}

export default App
