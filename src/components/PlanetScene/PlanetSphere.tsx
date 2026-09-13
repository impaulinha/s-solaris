import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { RINGED_PLANET_SCALE } from '@/constants/scene'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { gsap } from '@/lib/gsap'
import { pointer } from '@/lib/pointer'
import type { Direction, IPlanet } from '@/types/planet'
import { PlanetAtmosphere } from './PlanetAtmosphere'
import { PlanetClouds } from './PlanetClouds'
import { PlanetRing } from './PlanetRing'

interface IPlanetSphereProps {
  planet: IPlanet
  direction: Direction
  radius: number
  isReady: boolean
}

// inclina o eixo em direção à câmera para mostrar polos e anéis
const VIEW_TILT = 0.32
const SPIN_SPEED = 0.1
// distância percorrida na troca, medida em raios do planeta
const TRAVEL = 2.4

export function PlanetSphere({
  planet,
  direction,
  radius,
  isReady,
}: IPlanetSphereProps) {
  const reducedMotion = usePrefersReducedMotion()
  // planeta renderizado: só acompanha o ativo depois da animação de saída
  const [displayed, setDisplayed] = useState(planet)
  const texture = useTexture(displayed.texture)

  const rigRef = useRef<THREE.Group>(null)
  const spinRef = useRef<THREE.Group>(null)
  // valores animados pelo GSAP e aplicados na cena a cada frame
  const motionRef = useRef({ scale: 0, x: 0, spin: -3 })

  useEffect(() => {
    if (!isReady) return

    const motion = motionRef.current

    if (planet.id !== displayed.id) {
      // saída: o planeta atual encolhe e escapa no sentido oposto ao da navegação
      const tween = gsap.to(motion, {
        scale: 0,
        x: reducedMotion ? 0 : -direction * TRAVEL,
        spin: `+=${direction * 1.6}`,
        duration: reducedMotion ? 0.2 : 0.55,
        ease: 'power3.in',
        onComplete: () => {
          motion.x = reducedMotion ? 0 : direction * TRAVEL
          motion.spin -= direction * 2.4
          setDisplayed(planet)
        },
      })

      return () => {
        tween.kill()
      }
    }

    // entrada: também é a animação de abertura, logo após o preloader
    const tween = gsap.to(motion, {
      scale: 1,
      x: 0,
      spin: `+=${direction * 2.4}`,
      duration: reducedMotion ? 0.3 : 1.8,
      ease: 'expo.out',
    })

    return () => {
      tween.kill()
    }
  }, [planet, displayed, direction, isReady, reducedMotion])

  useFrame((state, delta) => {
    const rig = rigRef.current
    const spin = spinRef.current
    if (!rig || !spin) return

    const motion = motionRef.current
    const size = radius * (displayed.ringTexture ? RINGED_PLANET_SCALE : 1)

    rig.scale.setScalar(Math.max(motion.scale * size, 0.0001))
    rig.position.x = motion.x * size

    // parallax suave: o planeta "olha" para o mouse
    rig.rotation.x = THREE.MathUtils.damp(
      rig.rotation.x,
      -pointer.y * 0.12,
      2.5,
      delta
    )
    rig.rotation.y = THREE.MathUtils.damp(
      rig.rotation.y,
      pointer.x * 0.2,
      2.5,
      delta
    )

    spin.rotation.y = state.clock.elapsedTime * SPIN_SPEED + motion.spin
  })

  return (
    <>
      <group ref={rigRef}>
        <group
          rotation={[
            VIEW_TILT,
            0,
            -THREE.MathUtils.degToRad(displayed.axialTilt),
          ]}
        >
          <group ref={spinRef}>
            <mesh>
              <sphereGeometry args={[1, 96, 64]} />
              <meshStandardMaterial map={texture} roughness={1} metalness={0} />
            </mesh>

            {displayed.cloudsTexture && (
              <PlanetClouds textureUrl={displayed.cloudsTexture} />
            )}
          </group>

          {displayed.ringTexture && (
            <PlanetRing textureUrl={displayed.ringTexture} />
          )}
        </group>

        <PlanetAtmosphere
          color={displayed.color}
          intensity={displayed.atmosphere}
        />
      </group>

      {/* contraluz na cor do planeta: desenha a borda do lado noturno */}
      <directionalLight
        position={[6, 1.5, -5]}
        intensity={1.6}
        color={displayed.color}
      />
    </>
  )
}
