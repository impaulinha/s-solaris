interface ISolarBodyMass {
  massValue: number
  massExponent: number
}

interface ISolarBodyMoon {
  moon: string
  rel: string
}

export interface ISolarSystemBody {
  id: string
  name: string
  englishName: string
  gravity: number
  meanRadius: number
  semimajorAxis: number
  sideralOrbit: number
  sideralRotation: number
  avgTemp: number
  mass: ISolarBodyMass | null
  moons: ISolarBodyMoon[] | null
}
