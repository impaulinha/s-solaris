import type { IPlanetDetails } from './planetDetails'

export type IPlanetColor =
  | 'planet-mercury'
  | 'planet-venus'
  | 'planet-earth'
  | 'planet-mars'
  | 'planet-jupiter'
  | 'planet-saturn'
  | 'planet-uranus'
  | 'planet-neptune'

export interface IPlanet {
  id: string
  index: number
  name: string
  apiId: string
  nasaQuery: string
  texture: string
  color: IPlanetColor
  ringTexture?: string
  description: string
}

export type IPlanetId = string

export type PlanetFull = IPlanet & {
  details?: IPlanetDetails
}
