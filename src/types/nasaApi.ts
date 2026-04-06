interface INasaImageLink {
  href: string
  rel: string
  render?: string
}

interface INasaImageData {
  title: string
  description: string
  date_created: string
  nasa_id: string
  media_type: string
}

interface INasaImageItem {
  href: string
  links: INasaImageLink[]
  data: INasaImageData[]
}

interface INasaCollectionMetadata {
  total_hits: number
}

interface INasaCollection {
  href: string
  items: INasaImageItem[]
  metadata: INasaCollectionMetadata
}

export interface INasaSearchResponse {
  collection: INasaCollection
}
