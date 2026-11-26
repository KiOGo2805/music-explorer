import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { Playlist, PlaylistMood } from '@/entities/playlist/model/types'
import type { Track } from '@/entities/track/model/types'

interface LibraryState {
  favoriteTrackIds: string[]
  playlists: Playlist[]
  activeTrack: Track | null
  isPlaying: boolean
  toggleFavorite: (trackId: string) => void
  createPlaylist: (input: { name: string; description?: string; moodTag: PlaylistMood }) => string
  updatePlaylist: (playlist: Playlist) => void
  deletePlaylist: (playlistId: string) => void
  addTrackToPlaylist: (playlistId: string, track: Track) => void
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void
  updateTrackNote: (playlistId: string, trackId: string, note: string) => void
  playTrack: (track: Track) => void
  togglePlay: () => void
  setIsPlaying: (isPlaying: boolean) => void
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set) => ({
      favoriteTrackIds: [],
      playlists: [],
      activeTrack: null,
      isPlaying: false,
      toggleFavorite: (trackId) =>
        set((state) => ({
          favoriteTrackIds: state.favoriteTrackIds.includes(trackId)
            ? state.favoriteTrackIds.filter((id) => id !== trackId)
            : [...state.favoriteTrackIds, trackId],
        })),
      createPlaylist: (input) => {
        const id = crypto.randomUUID()
        const playlist: Playlist = {
          id,
          name: input.name,
          description: input.description ?? '',
          moodTag: input.moodTag,
          createdAt: new Date().toISOString(),
          items: [],
        }
        set((state) => ({ playlists: [...state.playlists, playlist] }))
        return id
      },
      updatePlaylist: (playlist) =>
        set((state) => ({
          playlists: state.playlists.map((item) => (item.id === playlist.id ? playlist : item)),
        })),
      deletePlaylist: (playlistId) =>
        set((state) => ({ playlists: state.playlists.filter((item) => item.id !== playlistId) })),
      addTrackToPlaylist: (playlistId, track) =>
        set((state) => ({
          playlists: state.playlists.map((playlist) =>
            playlist.id !== playlistId || playlist.items.some((item) => item.track.id === track.id)
              ? playlist
              : {
                  ...playlist,
                  items: [...playlist.items, { track, addedAt: new Date().toISOString() }],
                },
          ),
        })),
      removeTrackFromPlaylist: (playlistId, trackId) =>
        set((state) => ({
          playlists: state.playlists.map((playlist) =>
            playlist.id === playlistId
              ? { ...playlist, items: playlist.items.filter((item) => item.track.id !== trackId) }
              : playlist,
          ),
        })),
      updateTrackNote: (playlistId, trackId, note) =>
        set((state) => ({
          playlists: state.playlists.map((playlist) =>
            playlist.id === playlistId
              ? {
                  ...playlist,
                  items: playlist.items.map((item) =>
                    item.track.id === trackId ? { ...item, note } : item,
                  ),
                }
              : playlist,
          ),
        })),
      playTrack: (activeTrack) => set({ activeTrack, isPlaying: true }),
      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
      setIsPlaying: (isPlaying) => set({ isPlaying }),
    }),
    {
      name: 'music-explorer-library-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        favoriteTrackIds: state.favoriteTrackIds,
        playlists: state.playlists,
        activeTrack: state.activeTrack,
        isPlaying: state.isPlaying,
      }),
    },
  ),
)
