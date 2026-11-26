import type { Track } from '@/entities/track/model/types'

export type PlaylistMood = 'Focus' | 'Workout' | 'Chill' | 'Party'

export interface PlaylistItem {
  track: Track
  addedAt: string
  note?: string
}

export interface Playlist {
  id: string
  name: string
  description: string
  moodTag: PlaylistMood
  createdAt: string
  items: PlaylistItem[]
}
