import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SUN_POSITION } from '@/constants/scene'

interface IPlanetAtmosphereProps {
  color: string
  intensity: number
}

const vertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    vNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`

// halo: lado interno de uma esfera maior que o planeta, mais forte rente à
// superfície e mais intenso do lado iluminado pelo sol
const haloFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  uniform vec3 uSunDirection;

  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    vec3 normal = normalize(vNormal);

    float rim = clamp(-dot(viewDirection, normal) / 0.55, 0.0, 1.0);
    float sunlight = smoothstep(-0.5, 0.8, dot(normal, uSunDirection));
    float alpha = pow(rim, 3.0) * mix(0.3, 1.0, sunlight) * uIntensity;

    gl_FragColor = vec4(uColor, alpha);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

// névoa na borda do próprio planeta (efeito fresnel)
const limbFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  uniform vec3 uSunDirection;

  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    vec3 normal = normalize(vNormal);

    float fresnel = pow(1.0 - clamp(dot(viewDirection, normal), 0.0, 1.0), 3.5);
    float sunlight = smoothstep(-0.3, 0.9, dot(normal, uSunDirection));
    float alpha = fresnel * mix(0.15, 1.0, sunlight) * uIntensity;

    gl_FragColor = vec4(uColor, alpha);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

export function PlanetAtmosphere({ color, intensity }: IPlanetAtmosphereProps) {
  const haloRef = useRef<THREE.ShaderMaterial>(null)
  const targetColor = useMemo(() => new THREE.Color(color), [color])

  // os dois materiais compartilham os mesmos uniforms
  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color() },
      uIntensity: { value: 0 },
      uSunDirection: {
        value: new THREE.Vector3(...SUN_POSITION).normalize(),
      },
    }),
    []
  )

  useFrame((_, delta) => {
    const material = haloRef.current
    if (!material) return

    material.uniforms.uColor.value.lerp(targetColor, 1 - Math.exp(-delta * 6))
    material.uniforms.uIntensity.value = THREE.MathUtils.damp(
      material.uniforms.uIntensity.value,
      intensity,
      6,
      delta
    )
  })

  return (
    <>
      <mesh scale={1.2}>
        <sphereGeometry args={[1, 64, 48]} />
        <shaderMaterial
          ref={haloRef}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={haloFragmentShader}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          transparent
          depthWrite={false}
        />
      </mesh>

      <mesh scale={1.004}>
        <sphereGeometry args={[1, 64, 48]} />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={limbFragmentShader}
          blending={THREE.AdditiveBlending}
          transparent
          depthWrite={false}
        />
      </mesh>
    </>
  )
}
