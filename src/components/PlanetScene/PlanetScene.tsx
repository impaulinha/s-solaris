import { Suspense, type RefObject } from 'react'
import { Canvas } from '@react-three/fiber'
import { CAMERA_DISTANCE, CAMERA_FOV, SUN_POSITION } from '@/constants/scene'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import type { Direction, IPlanet } from '@/types/planet'
import { PlanetSphere } from './PlanetSphere'
import { Starfield } from './Starfield'
import { TexturePreloader } from './TexturePreloader'
import { useStageFraming } from './useStageFraming'

interface IPlanetSceneProps {
  planet: IPlanet
  direction: Direction
  isReady: boolean
  stageRef: RefObject<HTMLElement | null>
}

interface ISceneContentProps extends IPlanetSceneProps {
  starCount: number
}

export function PlanetScene(props: IPlanetSceneProps) {
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  return (
    <Canvas
      camera={{
        position: [0, 0, CAMERA_DISTANCE],
        fov: CAMERA_FOV,
        near: 0.1,
        far: 200,
      }}
      dpr={[1, isDesktop ? 1.75 : 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%' }}
    >
      <SceneContent {...props} starCount={isDesktop ? 2800 : 1400} />
    </Canvas>
  )
}

function SceneContent({
  planet,
  direction,
  isReady,
  stageRef,
  starCount,
}: ISceneContentProps) {
  const radius = useStageFraming(stageRef)

  return (
    <>
      {/* pouca luz ambiente para o lado noturno ficar dramático */}
      <ambientLight intensity={0.05} />

      {/* simula o sol vindo da esquerda */}
      <directionalLight position={SUN_POSITION} intensity={2.8} />

      <Starfield
        count={starCount}
        planetId={planet.id}
        direction={direction}
        isReady={isReady}
      />

      <Suspense fallback={null}>
        <TexturePreloader />
        {radius > 0 && (
          <PlanetSphere
            planet={planet}
            direction={direction}
            radius={radius}
            isReady={isReady}
          />
        )}
      </Suspense>
    </>
  )
}
