import type { Artist } from '@/entities/artist/model/types'
import type { PaginatedTracks, Track, TrackQueryParams } from '@/entities/track/model/types'
import { API_BASE_URL } from '@/shared/config/constants'
import { fetchJson } from '@/shared/api/httpClient'
import type { IMusicRepository } from '@/shared/api/music.repository'

interface AudiusUserDto {
  id: string
  name?: string
  handle?: string
  bio?: string | null
  profile_picture?: { '150x150'?: string; '1000x1000'?: string } | null
  follower_count?: number
  track_count?: number
  is_verified?: boolean
}

interface AudiusTrackDto {
  id: string
  title?: string
  genre?: string | null
  duration?: number
  artwork?: { '150x150'?: string; '480x480'?: string; '1000x1000'?: string } | null
  play_count?: number
  release_date?: string | null
  created_at?: string
  user?: AudiusUserDto
}

interface AudiusResponse<T> {
  data: T
}

const PLACEHOLDER_COVER = './placeholder-cover.svg'
const APP_NAME = 'MusicExplorer'

function mapTrack(dto: AudiusTrackDto): Track {
  const artist = dto.user
  return {
    id: dto.id,
    title: dto.title ?? 'Untitled track',
    genre: dto.genre ?? 'Unknown',
    durationSec: dto.duration ?? 0,
    artworkUrl: dto.artwork?.['480x480'] ?? dto.artwork?.['150x150'] ?? PLACEHOLDER_COVER,
    streamUrl: `${API_BASE_URL}/tracks/${encodeURIComponent(dto.id)}/stream?app_name=${APP_NAME}`,
    playCount: dto.play_count ?? 0,
    releaseDate: dto.release_date ?? dto.created_at ?? '',
    artist: {
      id: artist?.id ?? '',
      name: artist?.name ?? 'Unknown artist',
      handle: artist?.handle ?? '',
    },
  }
}

function mapArtist(dto: AudiusUserDto): Artist {
  return {
    id: dto.id,
    name: dto.name ?? 'Unknown artist',
    handle: dto.handle ?? '',
    bio: dto.bio ?? '',
    avatarUrl: dto.profile_picture?.['1000x1000'] ?? dto.profile_picture?.['150x150'] ?? PLACEHOLDER_COVER,
    followerCount: dto.follower_count ?? 0,
    trackCount: dto.track_count ?? 0,
    isVerified: dto.is_verified ?? false,
  }
}

function apiUrl(path: string, params?: URLSearchParams): string {
  const query = new URLSearchParams(params)
  query.set('app_name', APP_NAME)
  return `${API_BASE_URL}${path}?${query.toString()}`
}

function sortTracks(tracks: Track[], sort?: TrackQueryParams['sort']): Track[] {
  if (sort === 'popular') {
    return [...tracks].sort((a, b) => b.playCount - a.playCount)
  }
  if (sort === 'recent') {
    return [...tracks].sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))
  }
  return tracks
}

export class AudiusMusicRepository implements IMusicRepository {
  async getTracks(params: TrackQueryParams): Promise<PaginatedTracks> {
    const trimmedQuery = params.q?.trim() ?? ''
    const isSearch = trimmedQuery.length > 0

    const query = new URLSearchParams({
      limit: String(params.limit),
      offset: String(Math.max(0, params.page - 1) * params.limit),
    })

    if (params.genre && params.genre !== 'All') {
      query.set('genre', params.genre)
    }

    if (isSearch) {
      query.set('query', trimmedQuery)
    } else if (params.sort === 'popular') {
      query.set('time', 'allTime')
    }

    const endpoint = isSearch ? '/tracks/search' : '/tracks/trending'
    const response = await fetchJson<AudiusResponse<AudiusTrackDto[]>>(apiUrl(endpoint, query))
    const mapped = response.data.map(mapTrack)
    const filtered =
      isSearch && params.genre && params.genre !== 'All'
        ? mapped.filter((track) => track.genre.toLowerCase() === params.genre?.toLowerCase())
        : mapped
    const items = sortTracks(filtered, params.sort)

    return {
      items,
      page: params.page,
      hasMore: mapped.length === params.limit,
    }
  }

  async getTrackById(id: string): Promise<Track> {
    const response = await fetchJson<AudiusResponse<AudiusTrackDto>>(
      apiUrl(`/tracks/${encodeURIComponent(id)}`),
    )
    return mapTrack(response.data)
  }

  async getArtistById(id: string): Promise<Artist> {
    const response = await fetchJson<AudiusResponse<AudiusUserDto>>(
      apiUrl(`/users/${encodeURIComponent(id)}`),
    )
    return mapArtist(response.data)
  }

  async getArtistTracks(artistId: string): Promise<Track[]> {
    const response = await fetchJson<AudiusResponse<AudiusTrackDto[]>>(
      apiUrl(`/users/${encodeURIComponent(artistId)}/tracks`),
    )
    return response.data.map(mapTrack)
  }
}

export const musicRepository: IMusicRepository = new AudiusMusicRepository()