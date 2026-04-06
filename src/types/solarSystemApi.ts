interface ISolarBodyMass {
  massValue: number
  massExponent: number
}

interface ISolarBodyVolume {
  volValue: number
  volExponent: number
}

interface ISolarBodyMoon {
  moon: string
  rel: string
}

export interface ISolarSystemBody {
  id: string
  name: string
  englishName: string
  isPlanet: boolean
  gravity: number
  meanRadius: number
  sideralOrbit: number
  sideralRotation: number
  avgTemp: number
  axialTilt: number
  mass: ISolarBodyMass | null
  vol: ISolarBodyVolume | null
  moons: ISolarBodyMoon[] | null
}
