export type IPlanetCategory =
  | 'Planeta rochoso'
  | 'Gigante gasoso'
  | 'Gigante de gelo'

export interface IPlanet {
  id: string
  index: number
  name: string
  apiId: string
  category: IPlanetCategory
  description: string
  // cor de destaque aplicada na interface e no brilho da atmosfera
  color: string
  // inclinação axial real, em graus
  axialTilt: number
  // intensidade do brilho atmosférico (0 = sem atmosfera)
  atmosphere: number
  texture: string
  cloudsTexture?: string
  ringTexture?: string
}

// sentido da navegação: 1 = próximo, -1 = anterior
export type Direction = 1 | -1
