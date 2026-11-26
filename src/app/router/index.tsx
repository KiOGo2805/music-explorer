import { lazy, Suspense } from 'react'
import { createHashRouter, Navigate, RouterProvider } from 'react-router-dom'

import { MainLayout } from '@/app/layouts/MainLayout'

const TracksPage = lazy(() => import('@/pages/TracksPage'))
const TrackDetailPage = lazy(() => import('@/pages/TrackDetailPage'))
const ArtistDetailPage = lazy(() => import('@/pages/ArtistDetailPage'))
const PlaylistsPage = lazy(() => import('@/pages/PlaylistsPage'))
const PlaylistDetailPage = lazy(() => import('@/pages/PlaylistDetailPage'))
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

const router = createHashRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/tracks" replace /> },
      { path: 'tracks', element: <TracksPage /> },
      { path: 'tracks/:trackId', element: <TrackDetailPage /> },
      { path: 'artists/:artistId', element: <ArtistDetailPage /> },
      { path: 'playlists', element: <PlaylistsPage /> },
      { path: 'playlists/:playlistId', element: <PlaylistDetailPage /> },
      { path: 'favorites', element: <FavoritesPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export function AppRouter() {
  return (
    <Suspense fallback={<p className="py-16 text-center text-zinc-400">Завантаження сторінки…</p>}>
      <RouterProvider router={router} />
    </Suspense>
  )
}
