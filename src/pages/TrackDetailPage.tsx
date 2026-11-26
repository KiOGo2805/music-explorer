import { useState } from 'react'
import { ArrowLeft, Check, Heart, ListPlus, Play, Plus } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'

import { musicRepository } from '@/shared/api/audius.repository'
import { useLibraryStore } from '@/shared/store/useLibraryStore'
import { AsyncStateBoundary } from '@/shared/ui/AsyncStateBoundary'
import { Badge } from '@/shared/ui/Badge'
import { handleImageError } from '@/shared/ui/imageFallback'

export default function TrackDetailPage() {
  const { trackId = '' } = useParams()
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('')
  const [justAdded, setJustAdded] = useState(false)

  const query = useQuery({
    queryKey: ['track', trackId],
    queryFn: () => musicRepository.getTrackById(trackId),
    enabled: Boolean(trackId),
  })

  const favoriteTrackIds = useLibraryStore((state) => state.favoriteTrackIds)
  const toggleFavorite = useLibraryStore((state) => state.toggleFavorite)
  const playTrack = useLibraryStore((state) => state.playTrack)
  const playlists = useLibraryStore((state) => state.playlists)
  const addTrackToPlaylist = useLibraryStore((state) => state.addTrackToPlaylist)

  const track = query.data
  const isFavorite = track ? favoriteTrackIds.includes(track.id) : false
  const targetPlaylistId = selectedPlaylistId || playlists[0]?.id || ''
  const targetPlaylist = playlists.find((playlist) => playlist.id === targetPlaylistId)
  const isAlreadyInTarget = Boolean(
    track && targetPlaylist?.items.some((item) => item.track.id === track.id),
  )
  const playlistsWithTrack = track
    ? playlists.filter((playlist) => playlist.items.some((item) => item.track.id === track.id))
    : []

  const handleAddToPlaylist = () => {
    if (!track || !targetPlaylistId || isAlreadyInTarget) return
    addTrackToPlaylist(targetPlaylistId, track)
    setJustAdded(true)
    window.setTimeout(() => setJustAdded(false), 1800)
  }

  return (
    <div>
      <Link
        to="/tracks"
        className="mb-6 inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
      >
        <ArrowLeft size={16} /> До каталогу
      </Link>

      <AsyncStateBoundary
        isLoading={query.isLoading}
        isError={query.isError}
        onRetry={() => void query.refetch()}
      >
        {track && (
          <article className="grid gap-8 md:grid-cols-[minmax(240px,380px)_1fr] md:items-center">
            <img
              className="aspect-square w-full rounded-3xl border border-zinc-800 object-cover shadow-2xl"
              src={track.artworkUrl}
              alt={`Обкладинка: ${track.title}`}
              onError={handleImageError}
            />
            <div>
              <Badge>{track.genre}</Badge>
              <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{track.title}</h1>
              {track.artist.id ? (
                <Link
                  to={`/artists/${encodeURIComponent(track.artist.id)}`}
                  className="mt-3 inline-block text-lg text-zinc-400 transition hover:text-violet-300"
                >
                  {track.artist.name}
                </Link>
              ) : (
                <p className="mt-3 text-lg text-zinc-400">{track.artist.name}</p>
              )}

              <p className="mt-4 text-sm text-zinc-400">
                Тривалість: {Math.floor(track.durationSec / 60)}:
                {String(track.durationSec % 60).padStart(2, '0')} ·{' '}
                {track.playCount.toLocaleString()} прослуховувань
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="flex cursor-pointer items-center gap-2 rounded-full bg-violet-500 px-6 py-3 font-semibold text-white transition hover:bg-violet-400"
                  onClick={() => playTrack(track)}
                >
                  <Play size={18} fill="currentColor" /> Слухати
                </button>

                <button
                  type="button"
                  aria-label={isFavorite ? 'Прибрати з обраного' : 'Додати до обраного'}
                  className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-3 text-sm font-medium transition ${
                    isFavorite
                      ? 'border-pink-500/50 bg-pink-500/10 text-pink-400 hover:bg-pink-500/20'
                      : 'border-zinc-700 text-zinc-200 hover:border-zinc-500 hover:bg-zinc-900 hover:text-pink-400'
                  }`}
                  onClick={() => toggleFavorite(track.id)}
                >
                  <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                  <span>{isFavorite ? 'В обраному' : 'В обране'}</span>
                </button>
              </div>

              <div className="mt-8 max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                <p className="mb-3 flex items-center gap-2 text-sm font-medium text-zinc-200">
                  <ListPlus size={16} className="text-violet-400" />
                  Додати до плейлиста
                </p>

                {playlists.length === 0 ? (
                  <div className="flex flex-col items-start gap-3">
                    <p className="text-sm text-zinc-400">У тебе ще немає створених плейлистів.</p>
                    <Link
                      to="/playlists"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-violet-500/15 px-3.5 py-2 text-sm font-medium text-violet-300 transition hover:bg-violet-500/25 hover:text-white"
                    >
                      <Plus size={16} />
                      Створити перший плейлист
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <select
                      aria-label="Оберіть плейлист"
                      className="flex-1 cursor-pointer rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition hover:border-zinc-500 focus:border-violet-500"
                      value={targetPlaylistId}
                      onChange={(event) => {
                        setSelectedPlaylistId(event.target.value)
                        setJustAdded(false)
                      }}
                    >
                      {playlists.map((playlist) => (
                        <option key={playlist.id} value={playlist.id}>
                          {playlist.name} ({playlist.items.length})
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      disabled={isAlreadyInTarget}
                      onClick={handleAddToPlaylist}
                      className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-violet-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-400"
                    >
                      {isAlreadyInTarget || justAdded ? (
                        <>
                          <Check size={15} className="text-emerald-400" />
                          <span>{justAdded ? 'Додано' : 'Вже у списку'}</span>
                        </>
                      ) : (
                        <span>Додати</span>
                      )}
                    </button>
                  </div>
                )}

                {playlistsWithTrack.length > 0 && (
                  <p className="mt-3 text-xs text-zinc-400">
                    Збережено у:{' '}
                    {playlistsWithTrack.map((playlist, index) => (
                      <span key={playlist.id}>
                        {index > 0 && ', '}
                        <Link
                          to={`/playlists/${encodeURIComponent(playlist.id)}`}
                          className="text-violet-400 transition hover:text-violet-300 hover:underline"
                        >
                          {playlist.name}
                        </Link>
                      </span>
                    ))}
                  </p>
                )}
              </div>
            </div>
          </article>
        )}
      </AsyncStateBoundary>
    </div>
  )
}