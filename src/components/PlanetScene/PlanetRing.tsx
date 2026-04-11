import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

interface PlanetRingProps {
  textureUrl: string
}

export function PlanetRing({ textureUrl }: PlanetRingProps) {
  const texture = useTexture(textureUrl)

  return (
    <mesh rotation={[Math.PI / 2.5, 0, 0]}>
      <ringGeometry args={[1.4, 2.4, 128]} />
      <meshStandardMaterial
        map={texture}
        side={THREE.DoubleSide}
        transparent
        opacity={0.8}
      />
    </mesh>
  )
}
