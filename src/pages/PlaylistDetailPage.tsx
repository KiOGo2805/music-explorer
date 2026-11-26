import { Trash2 } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { useLibraryStore } from '@/shared/store/useLibraryStore'
import { AsyncStateBoundary } from '@/shared/ui/AsyncStateBoundary'
import { Badge } from '@/shared/ui/Badge'
import { handleImageError } from '@/shared/ui/imageFallback'

export default function PlaylistDetailPage() {
  const { playlistId = '' } = useParams()
  const playlist = useLibraryStore((state) => state.playlists.find((item) => item.id === playlistId))
  const removeTrackFromPlaylist = useLibraryStore((state) => state.removeTrackFromPlaylist)
  const deletePlaylist = useLibraryStore((state) => state.deletePlaylist)
  const playTrack = useLibraryStore((state) => state.playTrack)
  const navigate = useNavigate()

  if (!playlist) {
    return (
      <section>
        <h1 className="text-2xl font-bold">Плейлист не знайдено</h1>
        <Link className="mt-4 inline-block text-violet-300" to="/playlists">Повернутися до плейлистів</Link>
      </section>
    )
  }

  return (
    <>
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <Badge>{playlist.moodTag}</Badge>
          <h1 className="mt-3 text-3xl font-bold">{playlist.name}</h1>
          {playlist.description && <p className="mt-2 text-zinc-400">{playlist.description}</p>}
        </div>
        <button
          className="flex items-center gap-2 rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 hover:border-rose-500 hover:text-rose-300"
          onClick={() => {
            deletePlaylist(playlist.id)
            navigate('/playlists')
          }}
        >
          <Trash2 size={16} /> Видалити
        </button>
      </header>
      <AsyncStateBoundary
        isLoading={false}
        isError={false}
        onRetry={() => undefined}
        isEmpty={playlist.items.length === 0}
        emptyMessage="Плейлист порожній. Додавай треки з каталогу."
      >
        <ul className="divide-y divide-zinc-800">
          {playlist.items.map(({ track, addedAt, note }) => (
            <li key={track.id} className="flex items-center gap-4 py-3">
              <button className="rounded-full bg-zinc-800 p-2" aria-label={`Відтворити ${track.title}`} onClick={() => playTrack(track)}>▶</button>
              <img
                className="h-12 w-12 rounded-md object-cover"
                src={track.artworkUrl}
                alt=""
                onError={handleImageError}
              />
              <div className="min-w-0 flex-1">
                <Link to={`/tracks/${encodeURIComponent(track.id)}`} className="truncate font-medium hover:text-violet-300">{track.title}</Link>
                <p className="text-sm text-zinc-400">{track.artist.name}{note ? ` · ${note}` : ''}</p>
              </div>
              <time className="hidden text-xs text-zinc-500 md:block" dateTime={addedAt}>{new Date(addedAt).toLocaleDateString('uk-UA')}</time>
              <button className="rounded-lg p-2 text-zinc-500 hover:text-rose-300" aria-label={`Видалити ${track.title}`} onClick={() => removeTrackFromPlaylist(playlist.id, track.id)}>
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      </AsyncStateBoundary>
    </>
  )
}
