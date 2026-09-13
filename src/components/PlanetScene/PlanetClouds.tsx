import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import type * as THREE from 'three'

interface IPlanetCloudsProps {
  textureUrl: string
}

export function PlanetClouds({ textureUrl }: IPlanetCloudsProps) {
  const texture = useTexture(textureUrl)
  const meshRef = useRef<THREE.Mesh>(null)

  // as nuvens se deslocam um pouco mais rápido que a superfície
  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.03
  })

  return (
    <mesh ref={meshRef} scale={1.015}>
      <sphereGeometry args={[1, 96, 64]} />
      <meshStandardMaterial
        alphaMap={texture}
        color="#ffffff"
        roughness={1}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}
