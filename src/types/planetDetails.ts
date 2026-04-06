export interface IPlanetDetails {
  id: string
  name: string
  mass: string // ex: "3.30 × 10²³ kg"
  gravity: string // ex: "3.7 m/s²"
  radius: string // ex: "2,439 km"
  orbitDays: string // ex: "87.97 days"
  moons: number // quantidade de luas
  avgTemp: string // ex: "167 °C"
  axialTilt: string // ex: "0.03°"
  imageUrl: string
  imageTitle: string
}
