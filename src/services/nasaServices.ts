import { nasaApi } from './instances/nasaApi'

export async function getPlanetImage(nasaQuery: string): Promise<string> {
  try {
    const response = await nasaApi.get('search', {
      params: {
        q: nasaQuery,
        media_type: 'image',
        page_size: 1,
      },
    })

    const items = response.data.collection.items

    if (items.length === 0) {
      throw new Error(`Nenhuma imagem encontrada para "${nasaQuery}"`)
    }

    return items[0].links[0].href
  } catch (error) {
    throw new Error(`Erro ao buscar imagem para "${nasaQuery}": ${error}`)
  }
}
