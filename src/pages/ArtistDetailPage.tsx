import { ArrowLeft } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'

import { TrackCard } from '@/features/tracks/TrackCard'
import { musicRepository } from '@/shared/api/audius.repository'
import { AsyncStateBoundary } from '@/shared/ui/AsyncStateBoundary'
import { Badge } from '@/shared/ui/Badge'
import { handleImageError } from '@/shared/ui/imageFallback'

export default function ArtistDetailPage() {
  const { artistId = '' } = useParams()

  const artistQuery = useQuery({
    queryKey: ['artist', artistId],
    queryFn: () => musicRepository.getArtistById(artistId),
    enabled: Boolean(artistId),
  })

  const tracksQuery = useQuery({
    queryKey: ['artist-tracks', artistId],
    queryFn: () => musicRepository.getArtistTracks(artistId),
    enabled: Boolean(artistQuery.data),
  })

  return (
    <div>
      <Link
        to="/tracks"
        className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
      >
        <ArrowLeft size={16} /> До каталогу
      </Link>

      <AsyncStateBoundary
        isLoading={artistQuery.isLoading}
        isError={artistQuery.isError}
        onRetry={() => void artistQuery.refetch()}
      >
        {artistQuery.data && (
          <>
            <section className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center">
              <img
                className="h-28 w-28 rounded-full border border-zinc-800 object-cover sm:h-36 sm:w-36"
                src={artistQuery.data.avatarUrl}
                alt={artistQuery.data.name}
                onError={handleImageError}
              />
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm uppercase tracking-widest text-violet-400">Виконавець</p>
                  {artistQuery.data.isVerified && <Badge>Verified</Badge>}
                </div>
                <h1 className="mt-2 text-3xl font-bold">{artistQuery.data.name}</h1>
                <p className="mt-2 text-sm text-zinc-400">
                  @{artistQuery.data.handle} · {artistQuery.data.followerCount.toLocaleString()} слухачів ·{' '}
                  {artistQuery.data.trackCount} треків
                </p>
              </div>
            </section>

            {artistQuery.data.bio && (
              <p className="mb-8 max-w-3xl leading-relaxed text-zinc-300">{artistQuery.data.bio}</p>
            )}

            <h2 className="mb-4 text-xl font-semibold">Треки виконавця</h2>
            <AsyncStateBoundary
              isLoading={tracksQuery.isLoading}
              isError={tracksQuery.isError}
              onRetry={() => void tracksQuery.refetch()}
              isEmpty={!tracksQuery.isLoading && !tracksQuery.isError && tracksQuery.data?.length === 0}
              emptyMessage="У цього виконавця поки немає доступних треків."
            >
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {tracksQuery.data?.map((track) => (
                  <TrackCard key={track.id} track={track} />
                ))}
              </div>
            </AsyncStateBoundary>
          </>
        )}
      </AsyncStateBoundary>
    </div>
  )
}