import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import { PlanetSphere } from './PlanetSphere'
import type { IPlanet } from '@/types/planet'
import { useMediaQuery } from '@/hooks/useMediaQuery'

interface IPlanetSceneProps {
  planet: IPlanet
}

export function PlanetScene({ planet }: IPlanetSceneProps) {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const isTablet = useMediaQuery('(min-width: 768px)')

  function getPlanetRadius(): number {
    if (isDesktop) return 1
    if (isTablet) return 0.9
    return 0.7
  }

  return (
    <div className="relative h-full w-full flex items-center justify-center">
      <Canvas
        camera={{
          position: [0, 0, 3],
          fov: 45,
          near: 0.1,
          far: 100,
        }}
        gl={{ antialias: true, alpha: true }}
        className="!bg-transparent"
        style={{ width: '100%', height: '100%' }}
      >
        {/* evita o lado escuro ficar 100% preto */}
        <ambientLight intensity={0.15} />

        {/* simula o sol vindo da esquerda */}
        <pointLight position={[-6, 2, 4]} intensity={80} color="#ffffff" />

        <pointLight position={[4, -2, 2]} intensity={8} color="#4a7cdc" />

        <Suspense fallback={null}>
          <PlanetSphere planet={planet} radius={getPlanetRadius()} />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  )
}
