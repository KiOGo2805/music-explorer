import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import { TrackCard } from '@/features/tracks/TrackCard'
import { MUSIC_GENRES, PAGE_SIZE, SORT_OPTIONS } from '@/shared/config/constants'
import { musicRepository } from '@/shared/api/audius.repository'
import { AsyncStateBoundary } from '@/shared/ui/AsyncStateBoundary'
import { Pagination } from '@/shared/ui/Pagination'

export default function TracksPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const qParam = searchParams.get('q') ?? ''
  const rawGenre = searchParams.get('genre') ?? 'All'
  const rawSort = searchParams.get('sort') ?? 'trending'
  const rawPage = Number(searchParams.get('page'))

  const genre = (MUSIC_GENRES as readonly string[]).includes(rawGenre) ? rawGenre : 'All'
  const sort = (SORT_OPTIONS as readonly string[]).includes(rawSort)
    ? (rawSort as (typeof SORT_OPTIONS)[number])
    : 'trending'
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1

  const [searchInput, setSearchInput] = useState(qParam)

  useEffect(() => {
    if (qParam !== searchInput.trim()) {
      setSearchInput(qParam)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qParam])

  useEffect(() => {
    const trimmed = searchInput.trim()
    if (trimmed === qParam) return

    const timer = window.setTimeout(() => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        if (trimmed) {
          next.set('q', trimmed)
        } else {
          next.delete('q')
        }
        next.delete('page')
        return next
      })
    }, 350)

    return () => window.clearTimeout(timer)
  }, [searchInput, qParam, setSearchParams])

  const updateParam = (key: string, value: string | null) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (value) {
        next.set(key, value)
      } else {
        next.delete(key)
      }
      if (key !== 'page') {
        next.delete('page')
      }
      return next
    })
  }

  const tracksQuery = useQuery({
    queryKey: ['tracks', qParam, genre, sort, page],
    queryFn: () =>
      musicRepository.getTracks({
        q: qParam || undefined,
        genre,
        sort,
        page,
        limit: PAGE_SIZE,
      }),
  })

  return (
    <>
      <section className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
          Відкривай своє звучання
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Знайди наступний улюблений трек
        </h1>
      </section>

      <section className="mb-6 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <input
          aria-label="Пошук треків"
          className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 outline-none placeholder:text-zinc-500 focus:border-violet-500"
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Пошук музики…"
          value={searchInput}
        />
        <select
          aria-label="Жанр"
          className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3"
          onChange={(event) => {
            const nextGenre = event.target.value
            updateParam('genre', nextGenre === 'All' ? null : nextGenre)
          }}
          value={genre}
        >
          {MUSIC_GENRES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          aria-label="Сортування"
          className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 capitalize"
          onChange={(event) => {
            const nextSort = event.target.value
            updateParam('sort', nextSort === 'trending' ? null : nextSort)
          }}
          value={sort}
        >
          {SORT_OPTIONS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
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
          {tracksQuery.data?.items.map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
      </AsyncStateBoundary>

      {tracksQuery.data && (
        <Pagination
          page={page}
          hasMore={tracksQuery.data.hasMore}
          onPageChange={(nextPage) => updateParam('page', nextPage <= 1 ? null : String(nextPage))}
        />
      )}
    </>
  )
}