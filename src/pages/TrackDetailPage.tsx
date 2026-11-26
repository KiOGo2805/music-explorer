import { Heart, Play } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'

import { musicRepository } from '@/shared/api/audius.repository'
import { useLibraryStore } from '@/shared/store/useLibraryStore'
import { AsyncStateBoundary } from '@/shared/ui/AsyncStateBoundary'
import { Badge } from '@/shared/ui/Badge'

export default function TrackDetailPage() {
  const { trackId = '' } = useParams()
  const query = useQuery({
    queryKey: ['track', trackId],
    queryFn: () => musicRepository.getTrackById(trackId),
    enabled: Boolean(trackId),
  })
  const favoriteTrackIds = useLibraryStore((state) => state.favoriteTrackIds)
  const toggleFavorite = useLibraryStore((state) => state.toggleFavorite)
  const playTrack = useLibraryStore((state) => state.playTrack)
  const track = query.data

  return (
    <AsyncStateBoundary isLoading={query.isLoading} isError={query.isError} onRetry={() => void query.refetch()}>
      {track && (
        <article className="grid gap-8 md:grid-cols-[minmax(240px,380px)_1fr] md:items-center">
          <img className="aspect-square w-full rounded-3xl object-cover shadow-2xl" src={track.artworkUrl} alt={`Обкладинка: ${track.title}`} />
          <div>
            <Badge>Трек</Badge>
            <h1 className="mt-4 text-4xl font-bold">{track.title}</h1>
            <Link to={`/artists/${encodeURIComponent(track.artist.id)}`} className="mt-3 inline-block text-lg text-zinc-400 hover:text-white">
              {track.artist.name}
            </Link>
            <p className="mt-5 text-zinc-400">{track.genre} · {Math.floor(track.durationSec / 60)}:{String(track.durationSec % 60).padStart(2, '0')}</p>
            <div className="mt-8 flex gap-3">
              <button className="flex items-center gap-2 rounded-full bg-violet-500 px-5 py-3 font-semibold" onClick={() => playTrack(track)}>
                <Play size={18} fill="currentColor" /> Слухати
              </button>
              <button
                aria-label="Перемкнути обране"
                className="rounded-full border border-zinc-700 p-3"
                onClick={() => toggleFavorite(track.id)}
              >
                <Heart fill={favoriteTrackIds.includes(track.id) ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
        </article>
      )}
    </AsyncStateBoundary>
  )
}
