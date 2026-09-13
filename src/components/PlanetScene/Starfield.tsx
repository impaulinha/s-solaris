import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { gsap } from '@/lib/gsap'
import { pointer } from '@/lib/pointer'
import type { Direction } from '@/types/planet'

interface IStarfieldProps {
  count: number
  planetId: string
  direction: Direction
  isReady: boolean
}

const STAR_COLORS = ['#ffffff', '#dbe6ff', '#fff1d6', '#c3d2ff'].map(
  (hex) => new THREE.Color(hex)
)

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uWarp;

  attribute float aSize;
  attribute float aPhase;

  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    vColor = color;
    vTwinkle = 0.55 + 0.45 * sin(uTime * (0.6 + aPhase * 1.8) + aPhase * 6.2831);
    gl_PointSize = aSize * uPixelRatio * (1.0 + uWarp * 1.5) * (55.0 / -mvPosition.z);
  }
`

const fragmentShader = /* glsl */ `
  uniform float uOpacity;

  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    float distanceToCenter = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.05, distanceToCenter) * vTwinkle * uOpacity;

    gl_FragColor = vec4(vColor, alpha);

    #include <colorspace_fragment>
  }
`

// gerador pseudoaleatório com semente: o céu é sempre o mesmo a cada visita
function createRandom(seed: number) {
  let state = seed

  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function createStars(count: number) {
  const random = createRandom(1337)
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const phases = new Float32Array(count)
  const vector = new THREE.Vector3()

  for (let i = 0; i < count; i++) {
    // casca esférica ao redor do planeta, sempre atrás da câmera
    const radius = 30 + random() * 60
    const phi = Math.acos(2 * random() - 1)
    const theta = random() * Math.PI * 2

    vector.setFromSphericalCoords(radius, phi, theta).toArray(positions, i * 3)
    STAR_COLORS[Math.floor(random() * STAR_COLORS.length)].toArray(
      colors,
      i * 3
    )
    // a maioria das estrelas é pequena; poucas se destacam
    sizes[i] = 0.8 + Math.pow(random(), 3) * 3.4
    phases[i] = random()
  }

  return { positions, colors, sizes, phases }
}

export function Starfield({
  count,
  planetId,
  direction,
  isReady,
}: IStarfieldProps) {
  const reducedMotion = usePrefersReducedMotion()
  const pointsRef = useRef<THREE.Points>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const warpRef = useRef({ warp: 0, depth: -40, shift: 0, opacity: 0 })
  const previousPlanetRef = useRef(planetId)

  const stars = useMemo(() => createStars(count), [count])
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
      uWarp: { value: 0 },
      uOpacity: { value: 0 },
    }),
    []
  )

  // abertura: as estrelas avançam em direção à câmera
  useEffect(() => {
    if (!isReady) return

    const tween = gsap.to(warpRef.current, {
      depth: 0,
      opacity: 1,
      duration: reducedMotion ? 0.4 : 3.2,
      ease: 'expo.out',
    })

    return () => {
      tween.kill()
    }
  }, [isReady, reducedMotion])

  // "salto" espacial a cada troca de planeta
  useEffect(() => {
    if (previousPlanetRef.current === planetId) return
    previousPlanetRef.current = planetId

    if (reducedMotion) return

    const timeline = gsap
      .timeline()
      .to(warpRef.current, {
        warp: 1,
        depth: 9,
        shift: -direction * 4,
        duration: 0.55,
        ease: 'power2.in',
      })
      .to(warpRef.current, {
        warp: 0,
        depth: 0,
        shift: 0,
        duration: 1.8,
        ease: 'expo.out',
      })

    return () => {
      timeline.kill()
    }
  }, [planetId, direction, reducedMotion])

  useFrame((state, delta) => {
    const points = pointsRef.current
    const material = materialRef.current
    if (!points || !material) return

    const { warp, depth, shift, opacity } = warpRef.current

    material.uniforms.uTime.value = state.clock.elapsedTime
    material.uniforms.uPixelRatio.value = state.viewport.dpr
    material.uniforms.uWarp.value = warp
    material.uniforms.uOpacity.value = opacity

    points.position.set(shift, 0, depth)

    // deriva lenta + parallax menor que o do planeta, sugerindo profundidade
    points.rotation.x = THREE.MathUtils.damp(
      points.rotation.x,
      -pointer.y * 0.04,
      1.5,
      delta
    )
    points.rotation.y = THREE.MathUtils.damp(
      points.rotation.y,
      state.clock.elapsedTime * 0.006 + pointer.x * 0.06,
      1.5,
      delta
    )
  })

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[stars.positions, 3]}
        />
        <bufferAttribute attach="attributes-color" args={[stars.colors, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[stars.sizes, 1]} />
        <bufferAttribute attach="attributes-aPhase" args={[stars.phases, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
