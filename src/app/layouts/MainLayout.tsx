import { useEffect, useRef } from 'react'
import { Disc3, Heart, ListMusic, Music, Pause, Play } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'

import { useLibraryStore } from '@/shared/store/useLibraryStore'

const links = [
  { to: '/tracks', label: 'Каталог', icon: Music },
  { to: '/playlists', label: 'Плейлисти', icon: ListMusic },
  { to: '/favorites', label: 'Обране', icon: Heart },
]

export function MainLayout() {
  const activeTrack = useLibraryStore((state) => state.activeTrack)
  const isPlaying = useLibraryStore((state) => state.isPlaying)
  const togglePlay = useLibraryStore((state) => state.togglePlay)
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

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800/80 bg-zinc-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4">
          <NavLink to="/tracks" className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <Disc3 className="text-violet-400" size={23} />
            Music Explorer
          </NavLink>
          <nav className="flex items-center gap-1">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                    isActive ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
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
        <Outlet />
      </main>

      {activeTrack && (
        <footer className="fixed inset-x-0 bottom-0 z-10 border-t border-zinc-800 bg-zinc-950/95 px-5 py-3 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center gap-4">
            <img className="h-12 w-12 rounded-md object-cover" src={activeTrack.artworkUrl} alt="" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{activeTrack.title}</p>
              <p className="truncate text-xs text-zinc-400">{activeTrack.artist.name}</p>
            </div>
            <button
              aria-label={isPlaying ? 'Пауза' : 'Відтворити'}
              className="rounded-full bg-violet-500 p-2 text-white"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <audio
              ref={audioRef}
              className="h-10 w-40 sm:w-64"
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
