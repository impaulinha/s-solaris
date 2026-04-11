import { Layout } from '@/components/Layout'
import { Navbar } from '@/components/Navbar'
import { useActivePlanet } from './hooks/useActivePlanet'
import { useScrollHijack } from './hooks/useScrollHijack'
import { PlanetRoulette } from './components/PlanetRoulette'
import { PlanetInfo } from './components/PlanetInfo'

function App() {
  const {
    activeIndex,
    activePlanet,
    goToIndexPlanet,
    goToNextPlanet,
    goToPrevPlanet,
  } = useActivePlanet()

  useScrollHijack({ onNext: goToNextPlanet, onPrev: goToPrevPlanet })

  return (
    <>
      <Navbar />
      <Layout
        roulette={
          <PlanetRoulette
            activeIndex={activeIndex}
            onNext={goToNextPlanet}
            onPrev={goToPrevPlanet}
            onSelect={goToIndexPlanet}
          />
        }
        info={<PlanetInfo planet={activePlanet} />}
        scene={<p>Planeta</p>}
      />
    </>
  )
}

export default App
