import type { Artist } from '@/entities/artist/model/types'
import type { PaginatedTracks, Track, TrackQueryParams } from '@/entities/track/model/types'

export interface IMusicRepository {
  getTracks(params: TrackQueryParams): Promise<PaginatedTracks>
  getTrackById(id: string): Promise<Track>
  getArtistById(id: string): Promise<Artist>
  getArtistTracks(artistId: string): Promise<Track[]>
}
