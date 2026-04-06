import { getPlanetImage } from '@/services/nasaServices'
import { useQuery } from '@tanstack/react-query'

export function useNasaImage(nasaQuery: string) {
  return useQuery<string>({
    queryKey: ['nasaImage', nasaQuery],
    queryFn: async () => getPlanetImage(nasaQuery),
    staleTime: 1000 * 60 * 5,
    enabled: !!nasaQuery,
  })
}
