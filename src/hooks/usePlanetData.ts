import { getPlanetById } from '@/services/solarSystemServices'
import type { ISolarSystemBody } from '@/types/solarSystemApi'
import { useQuery } from '@tanstack/react-query'

export function usePlanetData(apiId: string) {
  return useQuery<ISolarSystemBody>({
    queryKey: ['planet', apiId],
    queryFn: async () => getPlanetById(apiId),
    staleTime: 1000 * 60 * 5,
    enabled: !!apiId,
  })
}
