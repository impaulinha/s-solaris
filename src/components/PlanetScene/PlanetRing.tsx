import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

interface PlanetRingProps {
  textureUrl: string
}

// proporções aproximadas dos anéis de Saturno, em raios do planeta
const INNER_RADIUS = 1.24
const OUTER_RADIUS = 2.3

// a textura do anel é uma faixa horizontal: o eixo U precisa ir do raio
// interno ao externo (o mapeamento padrão do RingGeometry é planar)
function createRingGeometry(innerRadius: number, outerRadius: number) {
  const geometry = new THREE.RingGeometry(innerRadius, outerRadius, 180, 1)
  const position = geometry.attributes.position
  const uv = geometry.attributes.uv
  const vertex = new THREE.Vector3()

  for (let i = 0; i < position.count; i++) {
    vertex.fromBufferAttribute(position, i)
    uv.setXY(
      i,
      (vertex.length() - innerRadius) / (outerRadius - innerRadius),
      0.5
    )
  }

  return geometry
}

const RING_GEOMETRY = createRingGeometry(INNER_RADIUS, OUTER_RADIUS)

export function PlanetRing({ textureUrl }: PlanetRingProps) {
  const texture = useTexture(textureUrl)

  return (
    <mesh geometry={RING_GEOMETRY} rotation-x={-Math.PI / 2} dispose={null}>
      <meshStandardMaterial
        map={texture}
        side={THREE.DoubleSide}
        roughness={1}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}
