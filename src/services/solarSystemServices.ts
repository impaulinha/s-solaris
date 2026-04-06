import type { ISolarSystemBody } from '@/types/solarSystemApi'
import { solarSystemApi } from './instances/solarSystemApi'

export async function getPlanetById(apiId: string): Promise<ISolarSystemBody> {
  try {
    const response = await solarSystemApi.get<ISolarSystemBody>(
      `bodies/${apiId}`
    )

    return response.data
  } catch (error) {
    throw new Error(`Falha ao obter dados do planeta para "${apiId}": ${error}`)
  }
}
