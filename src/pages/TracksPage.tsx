import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { TrackCard } from '@/features/tracks/TrackCard'
import { MUSIC_GENRES, PAGE_SIZE, SORT_OPTIONS } from '@/shared/config/constants'
import { musicRepository } from '@/shared/api/audius.repository'
import { AsyncStateBoundary } from '@/shared/ui/AsyncStateBoundary'
import { Pagination } from '@/shared/ui/Pagination'

export default function TracksPage() {
  const [search, setSearch] = useState('')
  const [genre, setGenre] = useState<string>('All')
  const [sort, setSort] = useState<(typeof SORT_OPTIONS)[number]>('trending')
  const [page, setPage] = useState(1)
  const tracksQuery = useQuery({
    queryKey: ['tracks', search, genre, sort, page],
    queryFn: () =>
      musicRepository.getTracks({
        q: search || undefined,
        genre,
        sort,
        page,
        limit: PAGE_SIZE,
      }),
  })

  return (
    <>
      <section className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">Відкривай своє звучання</p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Знайди наступний улюблений трек</h1>
      </section>
      <section className="mb-6 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <input
          aria-label="Пошук треків"
          className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 outline-none placeholder:text-zinc-500 focus:border-violet-500"
          onChange={(event) => {
            setSearch(event.target.value)
            setPage(1)
          }}
          placeholder="Пошук музики…"
          value={search}
        />
        <select
          aria-label="Жанр"
          className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3"
          onChange={(event) => {
            setGenre(event.target.value)
            setPage(1)
          }}
          value={genre}
        >
          {MUSIC_GENRES.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select
          aria-label="Сортування"
          className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 capitalize"
          onChange={(event) => {
            setSort(event.target.value as (typeof SORT_OPTIONS)[number])
            setPage(1)
          }}
          value={sort}
        >
          {SORT_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </section>
      <AsyncStateBoundary
        isLoading={tracksQuery.isLoading}
        isError={tracksQuery.isError}
        onRetry={() => void tracksQuery.refetch()}
        isEmpty={!tracksQuery.isLoading && !tracksQuery.isError && tracksQuery.data?.items.length === 0}
        emptyMessage="Треки не знайдено. Спробуй інший пошук або жанр."
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {tracksQuery.data?.items.map((track) => <TrackCard key={track.id} track={track} />)}
        </div>
      </AsyncStateBoundary>
      {tracksQuery.data && (
        <Pagination page={page} hasMore={tracksQuery.data.hasMore} onPageChange={setPage} />
      )}
    </>
  )
}
