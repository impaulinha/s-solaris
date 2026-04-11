import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { gsap } from 'gsap'
import * as THREE from 'three'
import { PlanetRing } from './PlanetRing'
import type { IPlanet } from '@/types/planet'

interface IPlanetSphereProps {
  planet: IPlanet
  radius?: number
}

export function PlanetSphere({ planet, radius = 1 }: IPlanetSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshStandardMaterial>(null)
  const [currentTexture, setCurrentTexture] = useState(planet.texture)
  const texture = useTexture(currentTexture)

  // rotação contínua
  useFrame((_, delta) => {
    if (!meshRef.current) return
    meshRef.current.rotation.y += delta * 0.12
  })

  useEffect(() => {
    if (!materialRef.current) return

    gsap.to(materialRef.current, {
      opacity: 0,
      duration: 0.35,
      ease: 'power2.in',
      onComplete: () => {
        setCurrentTexture(planet.texture)
        gsap.to(materialRef.current!, {
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
        })
      },
    })
  }, [planet.id])

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial
          ref={materialRef}
          map={texture}
          transparent
          opacity={1}
        />
      </mesh>

      {planet.ringTexture && <PlanetRing textureUrl={planet.ringTexture} />}
    </group>
  )
}
