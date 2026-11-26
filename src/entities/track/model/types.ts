export interface Track {
  id: string
  title: string
  genre: string
  durationSec: number
  artworkUrl: string
  streamUrl: string
  playCount: number
  releaseDate: string
  artist: {
    id: string
    name: string
    handle: string
  }
}

export interface TrackQueryParams {
  q?: string
  genre?: string
  sort?: 'trending' | 'popular' | 'recent'
  page: number
  limit: number
}

export interface PaginatedTracks {
  items: Track[]
  page: number
  hasMore: boolean
}
