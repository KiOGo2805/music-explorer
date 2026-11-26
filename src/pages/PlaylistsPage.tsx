import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { z } from 'zod'

import { playlistFormSchema } from '@/entities/playlist/model/schemas'
import { useLibraryStore } from '@/shared/store/useLibraryStore'
import { AsyncStateBoundary } from '@/shared/ui/AsyncStateBoundary'
import { Badge } from '@/shared/ui/Badge'

type PlaylistFormValues = z.infer<typeof playlistFormSchema>

export default function PlaylistsPage() {
  const playlists = useLibraryStore((state) => state.playlists)
  const createPlaylist = useLibraryStore((state) => state.createPlaylist)
  const navigate = useNavigate()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<PlaylistFormValues>({
    resolver: zodResolver(playlistFormSchema),
    defaultValues: { name: '', description: '', moodTag: 'Chill' },
  })

  const onSubmit = (values: PlaylistFormValues) => {
    const playlistId = createPlaylist(values)
    reset()
    navigate(`/playlists/${encodeURIComponent(playlistId)}`)
  }

  return (
    <>
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">Твоя колекція</p>
        <h1 className="mt-2 text-3xl font-bold">Плейлисти</h1>
      </header>
      <form className="mb-8 grid gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 sm:grid-cols-2" onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
        <label className="text-sm text-zinc-300">
          Назва
          <input className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2" {...register('name')} />
          {errors.name && <span className="mt-1 block text-xs text-rose-400">{errors.name.message}</span>}
        </label>
        <label className="text-sm text-zinc-300">
          Настрій
          <select className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2" {...register('moodTag')}>
            {(['Focus', 'Workout', 'Chill', 'Party'] as const).map((mood) => <option key={mood} value={mood}>{mood}</option>)}
          </select>
        </label>
        <label className="text-sm text-zinc-300 sm:col-span-2">
          Опис
          <input className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2" {...register('description')} />
          {errors.description && <span className="mt-1 block text-xs text-rose-400">{errors.description.message}</span>}
        </label>
        <button className="rounded-lg bg-violet-500 px-4 py-2 font-semibold text-white sm:col-span-2 sm:justify-self-start" type="submit">
          Створити плейлист
        </button>
      </form>
      <AsyncStateBoundary
        isLoading={false}
        isError={false}
        onRetry={() => undefined}
        isEmpty={playlists.length === 0}
        emptyMessage="Тут з’являться твої плейлисти."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {playlists.map((playlist) => (
            <Link key={playlist.id} to={`/playlists/${encodeURIComponent(playlist.id)}`} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 transition hover:border-violet-500/60">
              <Badge>{playlist.moodTag}</Badge>
              <h2 className="mt-4 text-xl font-semibold">{playlist.name}</h2>
              <p className="mt-2 line-clamp-2 text-sm text-zinc-400">{playlist.description || 'Без опису'}</p>
              <p className="mt-4 text-xs text-zinc-500">{playlist.items.length} треків</p>
            </Link>
          ))}
        </div>
      </AsyncStateBoundary>
    </>
  )
}
