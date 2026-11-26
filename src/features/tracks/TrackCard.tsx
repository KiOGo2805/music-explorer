import { Heart, Play } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { Track } from '@/entities/track/model/types'
import { useLibraryStore } from '@/shared/store/useLibraryStore'
import { Badge } from '@/shared/ui/Badge'
import { handleImageError } from '@/shared/ui/imageFallback'

export function TrackCard({ track }: { track: Track }) {
  const favoriteTrackIds = useLibraryStore((state) => state.favoriteTrackIds)
  const toggleFavorite = useLibraryStore((state) => state.toggleFavorite)
  const playTrack = useLibraryStore((state) => state.playTrack)
  const isFavorite = favoriteTrackIds.includes(track.id)

  return (
    <article className="group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 transition hover:border-zinc-700">
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
          aria-label={isFavorite ? 'Прибрати з обраного' : 'Додати до обраного'}
          className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white backdrop-blur hover:text-pink-400"
          onClick={() => toggleFavorite(track.id)}
        >
          <Heart size={17} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
        <button
          aria-label={`Відтворити ${track.title}`}
          className="absolute bottom-3 right-3 rounded-full bg-violet-500 p-3 text-white opacity-0 shadow-lg transition group-hover:opacity-100"
          onClick={() => playTrack(track)}
        >
          <Play size={18} fill="currentColor" />
        </button>
      </div>
      <div className="space-y-2 p-4">
        <Link to={`/tracks/${encodeURIComponent(track.id)}`} className="block truncate font-semibold hover:text-violet-300">
          {track.title}
        </Link>
        <Link to={`/artists/${encodeURIComponent(track.artist.id)}`} className="block truncate text-sm text-zinc-400 hover:text-zinc-200">
          {track.artist.name}
        </Link>
        <Badge>{track.genre}</Badge>
      </div>
    </article>
  )
}
