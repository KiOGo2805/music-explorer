import { useQuery } from '@tanstack/react-query'

import type { Track } from '@/entities/track/model/types'
import { TrackCard } from '@/features/tracks/TrackCard'
import { musicRepository } from '@/shared/api/audius.repository'
import { useLibraryStore } from '@/shared/store/useLibraryStore'
import { AsyncStateBoundary } from '@/shared/ui/AsyncStateBoundary'

export default function FavoritesPage() {
  const favoriteTrackIds = useLibraryStore((state) => state.favoriteTrackIds)

  const query = useQuery({
    queryKey: ['favorite-tracks', favoriteTrackIds],
    queryFn: async () => {
      const results = await Promise.allSettled(
        favoriteTrackIds.map((id) => musicRepository.getTrackById(id)),
      )
      return results
        .filter((result): result is PromiseFulfilledResult<Track> => result.status === 'fulfilled')
        .map((result) => result.value)
    },
  })

  return (
    <>
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">Збережені треки</p>
        <h1 className="mt-2 text-3xl font-bold">Обране</h1>
      </header>
      <AsyncStateBoundary
        isLoading={query.isLoading}
        isError={query.isError}
        onRetry={() => void query.refetch()}
        isEmpty={!query.isLoading && !query.isError && (query.data?.length ?? 0) === 0}
        emptyMessage="Тут поки немає обраних треків."
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {query.data?.map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
      </AsyncStateBoundary>
    </>
  )
}