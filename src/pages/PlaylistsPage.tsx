import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { ChevronDown, Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PlaylistFormValues>({
    resolver: zodResolver(playlistFormSchema),
    defaultValues: { name: '', description: '', moodTag: 'Chill' },
  })

  const createMutation = useMutation({
    mutationFn: async (values: PlaylistFormValues) => {
      await new Promise((resolve) => window.setTimeout(resolve, 250))
      return createPlaylist(values)
    },
    onSuccess: (playlistId) => {
      reset()
      navigate(`/playlists/${encodeURIComponent(playlistId)}`)
    },
  })

  return (
    <>
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">Твоя колекція</p>
        <h1 className="mt-2 text-3xl font-bold">Плейлисти</h1>
      </header>

      <form
        className="mb-8 grid gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 sm:grid-cols-2"
        onSubmit={(event) => void handleSubmit((values) => createMutation.mutate(values))(event)}
      >
        <label className="text-sm text-zinc-300">
          Назва
          <input
            autoComplete="off"
            placeholder="Наприклад: Нічний код"
            className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-violet-500"
            {...register('name')}
          />
          {errors.name && <span className="mt-1 block text-xs text-rose-400">{errors.name.message}</span>}
        </label>

        <label className="text-sm text-zinc-300">
          Настрій
          <div className="relative mt-2">
            <select
              className="w-full cursor-pointer appearance-none rounded-lg border border-zinc-700 bg-zinc-950 py-2 pl-3 pr-10 text-zinc-100 outline-none transition hover:border-zinc-500 focus:border-violet-500"
              {...register('moodTag')}
            >
              {(['Focus', 'Workout', 'Chill', 'Party'] as const).map((mood) => (
                <option key={mood} value={mood}>
                  {mood}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
            />
          </div>
        </label>

        <label className="text-sm text-zinc-300 sm:col-span-2">
          Опис
          <input
            autoComplete="off"
            placeholder="Короткий опис підбірки (необов’язково)"
            className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-violet-500"
            {...register('description')}
          />
          {errors.description && (
            <span className="mt-1 block text-xs text-rose-400">{errors.description.message}</span>
          )}
        </label>

        <button
          disabled={createMutation.isPending}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-violet-500 px-4 py-2.5 font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2 sm:justify-self-start"
          type="submit"
        >
          <Plus size={17} />
          {createMutation.isPending ? 'Створення...' : 'Створити плейлист'}
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
            <Link
              key={playlist.id}
              to={`/playlists/${encodeURIComponent(playlist.id)}`}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 transition hover:border-violet-500/60 hover:bg-zinc-900"
            >
              <Badge>{playlist.moodTag}</Badge>
              <h2 className="mt-4 text-xl font-semibold">{playlist.name}</h2>
              <p className="mt-2 line-clamp-2 text-sm text-zinc-400">
                {playlist.description || 'Без опису'}
              </p>
              <p className="mt-4 text-xs text-zinc-500">{playlist.items.length} треків</p>
            </Link>
          ))}
        </div>
      </AsyncStateBoundary>
    </>
  )
}