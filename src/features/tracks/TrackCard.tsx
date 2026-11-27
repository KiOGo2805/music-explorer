import { Heart, Pause, Play } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { Track } from '@/entities/track/model/types'
import { useLibraryStore } from '@/shared/store/useLibraryStore'
import { Badge } from '@/shared/ui/Badge'
import { handleImageError } from '@/shared/ui/imageFallback'

export function TrackCard({ track }: { track: Track }) {
  const favoriteTrackIds = useLibraryStore((state) => state.favoriteTrackIds)
  const toggleFavorite = useLibraryStore((state) => state.toggleFavorite)
  const playTrack = useLibraryStore((state) => state.playTrack)
  const togglePlay = useLibraryStore((state) => state.togglePlay)
  const activeTrack = useLibraryStore((state) => state.activeTrack)
  const isPlaying = useLibraryStore((state) => state.isPlaying)

  const isFavorite = favoriteTrackIds.includes(track.id)
  const isActiveTrack = activeTrack?.id === track.id
  const isTrackPlaying = isActiveTrack && isPlaying

  return (
    <article
      className={`group overflow-hidden rounded-2xl border bg-zinc-900/60 transition ${
        isActiveTrack ? 'border-violet-500/60' : 'border-zinc-800 hover:border-zinc-700'
      }`}
    >
      <div className="relative aspect-square overflow-hidden bg-zinc-900">
        <Link to={`/tracks/${encodeURIComponent(track.id)}`} aria-label={`Відкрити ${track.title}`}>
          <img
            src={track.artworkUrl}
            alt={`Обкладинка: ${track.title}`}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
            onError={handleImageError}
          />
        </Link>
        <button
          type="button"
          aria-label={isFavorite ? 'Прибрати з обраного' : 'Додати до обраного'}
          className={`absolute right-3 top-3 cursor-pointer rounded-full bg-black/60 p-2 backdrop-blur transition hover:scale-105 hover:bg-black/80 ${
            isFavorite ? 'text-pink-400' : 'text-white hover:text-pink-400'
          }`}
          onClick={() => toggleFavorite(track.id)}
        >
          <Heart size={17} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
        <button
          type="button"
          aria-label={isTrackPlaying ? `Поставити на паузу ${track.title}` : `Відтворити ${track.title}`}
          className={`absolute bottom-3 right-3 cursor-pointer rounded-full bg-violet-500 p-3 text-white shadow-lg transition hover:scale-105 hover:bg-violet-400 focus-visible:opacity-100 ${
            isActiveTrack ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
          onClick={() => (isActiveTrack ? togglePlay() : playTrack(track))}
        >
          {isTrackPlaying ? (
            <Pause size={18} fill="currentColor" />
          ) : (
            <Play size={18} fill="currentColor" />
          )}
        </button>
      </div>
      <div className="space-y-2 p-4">
        <Link
          to={`/tracks/${encodeURIComponent(track.id)}`}
          className="block truncate font-semibold transition hover:text-violet-300"
        >
          {track.title}
        </Link>
        {track.artist.id ? (
          <Link
            to={`/artists/${encodeURIComponent(track.artist.id)}`}
            className="block truncate text-sm text-zinc-400 transition hover:text-zinc-200"
          >
            {track.artist.name}
          </Link>
        ) : (
          <p className="truncate text-sm text-zinc-400">{track.artist.name}</p>
        )}
        <Badge>{track.genre}</Badge>
      </div>
    </article>
  )
}