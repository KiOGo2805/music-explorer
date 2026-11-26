import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { ArrowLeft, Pencil, Play, Trash2, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'

import { playlistFormSchema } from '@/entities/playlist/model/schemas'
import type { Playlist } from '@/entities/playlist/model/types'
import { useLibraryStore } from '@/shared/store/useLibraryStore'
import { AsyncStateBoundary } from '@/shared/ui/AsyncStateBoundary'
import { Badge } from '@/shared/ui/Badge'
import { handleImageError } from '@/shared/ui/imageFallback'

type PlaylistFormValues = z.infer<typeof playlistFormSchema>

function EditPlaylistForm({ playlist, onClose }: { playlist: Playlist; onClose: () => void }) {
  const updatePlaylist = useLibraryStore((state) => state.updatePlaylist)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PlaylistFormValues>({
    resolver: zodResolver(playlistFormSchema),
    defaultValues: {
      name: playlist.name,
      description: playlist.description,
      moodTag: playlist.moodTag,
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (values: PlaylistFormValues) => {
      await new Promise((resolve) => window.setTimeout(resolve, 250))
      updatePlaylist({
        ...playlist,
        name: values.name,
        description: values.description ?? '',
        moodTag: values.moodTag,
      })
    },
    onSuccess: onClose,
  })

  return (
    <form
      className="mb-8 grid gap-4 rounded-2xl border border-violet-500/40 bg-zinc-900/70 p-5 sm:grid-cols-2"
      onSubmit={(event) => void handleSubmit((values) => updateMutation.mutate(values))(event)}
    >
      <label className="text-sm text-zinc-300">
        Назва
        <input
          className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none focus:border-violet-500"
          {...register('name')}
        />
        {errors.name && <span className="mt-1 block text-xs text-rose-400">{errors.name.message}</span>}
      </label>

      <label className="text-sm text-zinc-300">
        Настрій
        <select
          className="mt-2 w-full cursor-pointer rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none focus:border-violet-500"
          {...register('moodTag')}
        >
          {(['Focus', 'Workout', 'Chill', 'Party'] as const).map((mood) => (
            <option key={mood} value={mood}>
              {mood}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm text-zinc-300 sm:col-span-2">
        Опис
        <input
          className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none focus:border-violet-500"
          {...register('description')}
        />
        {errors.description && (
          <span className="mt-1 block text-xs text-rose-400">{errors.description.message}</span>
        )}
      </label>

      <div className="flex items-center gap-3 sm:col-span-2">
        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="cursor-pointer rounded-lg bg-violet-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {updateMutation.isPending ? 'Збереження...' : 'Зберегти зміни'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
        >
          <X size={15} /> Скасувати
        </button>
      </div>
    </form>
  )
}

export default function PlaylistDetailPage() {
  const { playlistId = '' } = useParams()
  const [isEditing, setIsEditing] = useState(false)
  const playlist = useLibraryStore((state) => state.playlists.find((item) => item.id === playlistId))
  const removeTrackFromPlaylist = useLibraryStore((state) => state.removeTrackFromPlaylist)
  const deletePlaylist = useLibraryStore((state) => state.deletePlaylist)
  const playTrack = useLibraryStore((state) => state.playTrack)
  const navigate = useNavigate()

  if (!playlist) {
    return (
      <section>
        <h1 className="text-2xl font-bold">Плейлист не знайдено</h1>
        <Link
          className="mt-4 inline-flex items-center gap-2 text-violet-400 transition hover:text-violet-300"
          to="/playlists"
        >
          <ArrowLeft size={16} /> Повернутися до плейлистів
        </Link>
      </section>
    )
  }

  return (
    <>
      <Link
        to="/playlists"
        className="mb-6 inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
      >
        <ArrowLeft size={16} /> До плейлистів
      </Link>

      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge>{playlist.moodTag}</Badge>
          <h1 className="mt-3 text-3xl font-bold">{playlist.name}</h1>
          {playlist.description && <p className="mt-2 text-zinc-400">{playlist.description}</p>}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-200 transition hover:border-violet-500 hover:bg-zinc-900 hover:text-violet-300"
            onClick={() => setIsEditing((prev) => !prev)}
          >
            <Pencil size={15} /> Редагувати
          </button>
          <button
            type="button"
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 transition hover:border-rose-500 hover:bg-rose-500/10 hover:text-rose-300"
            onClick={() => {
              deletePlaylist(playlist.id)
              navigate('/playlists')
            }}
          >
            <Trash2 size={16} /> Видалити
          </button>
        </div>
      </header>

      {isEditing && <EditPlaylistForm playlist={playlist} onClose={() => setIsEditing(false)} />}

      <AsyncStateBoundary
        isLoading={false}
        isError={false}
        onRetry={() => undefined}
        isEmpty={playlist.items.length === 0}
        emptyMessage="Плейлист порожній. Відкрий будь-який трек у каталозі та додай його сюди."
      >
        <ul className="divide-y divide-zinc-800">
          {playlist.items.map(({ track, addedAt, note }) => (
            <li
              key={track.id}
              className="flex items-center gap-4 rounded-xl px-2 py-3 transition hover:bg-zinc-900/60"
            >
              <button
                type="button"
                className="cursor-pointer rounded-full bg-zinc-800 p-2.5 text-zinc-200 transition hover:bg-violet-500 hover:text-white"
                aria-label={`Відтворити ${track.title}`}
                onClick={() => playTrack(track)}
              >
                <Play size={14} fill="currentColor" />
              </button>
              <img
                className="h-12 w-12 rounded-md object-cover"
                src={track.artworkUrl}
                alt=""
                onError={handleImageError}
              />
              <div className="min-w-0 flex-1">
                <Link
                  to={`/tracks/${encodeURIComponent(track.id)}`}
                  className="block truncate font-medium transition hover:text-violet-300"
                >
                  {track.title}
                </Link>
                <p className="truncate text-sm text-zinc-400">
                  {track.artist.name}
                  {note ? ` · ${note}` : ''}
                </p>
              </div>
              <time className="hidden text-xs text-zinc-500 md:block" dateTime={addedAt}>
                Додано: {new Date(addedAt).toLocaleDateString('uk-UA')}
              </time>
              <button
                type="button"
                className="cursor-pointer rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-800 hover:text-rose-300"
                aria-label={`Видалити ${track.title}`}
                onClick={() => removeTrackFromPlaylist(playlist.id, track.id)}
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      </AsyncStateBoundary>
    </>
  )
}