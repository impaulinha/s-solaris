import { PLANET_TEXTURES } from '@/constants/planets'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

// as texturas são usadas como cor: definir o espaço de cor antes do upload
// evita que a GPU precise recebê-las de novo quando forem aplicadas
function prepareTextures(textures: THREE.Texture | THREE.Texture[]) {
  const list = Array.isArray(textures) ? textures : [textures]

  list.forEach((texture) => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 8
  })
}

// carrega todas as texturas de uma vez (o preloader acompanha o progresso)
// e já as envia para a GPU, então a troca de planeta não trava
export function TexturePreloader() {
  useTexture(PLANET_TEXTURES, prepareTextures)
  return null
}
