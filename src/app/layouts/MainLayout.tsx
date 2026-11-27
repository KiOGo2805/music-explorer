import { useEffect, useRef, Suspense } from 'react'
import { Disc3, Heart, ListMusic, Music } from 'lucide-react'
import { Link, NavLink, Outlet } from 'react-router-dom'

import { useLibraryStore } from '@/shared/store/useLibraryStore'
import { handleImageError } from '@/shared/ui/imageFallback'

const links = [
  { to: '/tracks', label: 'Каталог', icon: Music },
  { to: '/playlists', label: 'Плейлисти', icon: ListMusic },
  { to: '/favorites', label: 'Обране', icon: Heart },
]

export function MainLayout() {
  const activeTrack = useLibraryStore((state) => state.activeTrack)
  const isPlaying = useLibraryStore((state) => state.isPlaying)
  const setIsPlaying = useLibraryStore((state) => state.setIsPlaying)
  const audioRef = useRef<HTMLAudioElement>(null)
  const streamUrl = activeTrack?.streamUrl

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !streamUrl) return
    if (isPlaying) {
      void audio.play().catch(() => setIsPlaying(false))
    } else {
      audio.pause()
    }
  }, [streamUrl, isPlaying, setIsPlaying])

  const trackHref = activeTrack ? `/tracks/${encodeURIComponent(activeTrack.id)}` : '/tracks'
  const artistHref = activeTrack?.artist.id
    ? `/artists/${encodeURIComponent(activeTrack.artist.id)}`
    : null

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800/80 bg-zinc-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4">
          <NavLink
            to="/tracks"
            className="flex items-center gap-2 rounded-lg px-2 py-1 text-lg font-bold tracking-tight transition hover:bg-zinc-900 hover:text-violet-300"
          >
            <Disc3 className="text-violet-400" size={23} />
            Music Explorer
          </NavLink>
          <nav className="flex items-center gap-1.5">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-zinc-800 text-white hover:bg-zinc-700'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                  }`
                }
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className={activeTrack ? 'mx-auto max-w-7xl px-5 pb-36 pt-8' : 'mx-auto max-w-7xl px-5 pb-12 pt-8'}>
        <Suspense fallback={<p className="py-16 text-center text-zinc-400">Завантаження сторінки…</p>}>
          <Outlet />
        </Suspense>
      </main>

      {activeTrack && (
        <footer className="fixed inset-x-0 bottom-0 z-10 border-t border-zinc-800 bg-zinc-950/95 px-5 py-3 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center gap-4">
            <Link to={trackHref} aria-label={`Відкрити трек ${activeTrack.title}`} className="shrink-0">
              <img
                className="h-12 w-12 rounded-md object-cover transition hover:opacity-80"
                src={activeTrack.artworkUrl}
                alt=""
                onError={handleImageError}
              />
            </Link>
            <div className="min-w-0 flex-1">
              <Link
                to={trackHref}
                className="block truncate text-sm font-medium transition hover:text-violet-300"
              >
                {activeTrack.title}
              </Link>
              {artistHref ? (
                <Link
                  to={artistHref}
                  className="block truncate text-xs text-zinc-400 transition hover:text-zinc-200"
                >
                  {activeTrack.artist.name}
                </Link>
              ) : (
                <p className="truncate text-xs text-zinc-400">{activeTrack.artist.name}</p>
              )}
            </div>
            <audio
              ref={audioRef}
              className="h-10 w-48 sm:w-72"
              src={activeTrack.streamUrl}
              controls
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          </div>
        </footer>
      )}
    </div>
  )
}