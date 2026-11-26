import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">404</p>
      <h1 className="mt-3 text-3xl font-bold">Сторінку не знайдено</h1>
      <Link to="/tracks" className="mt-6 inline-block rounded-lg bg-violet-500 px-4 py-2 font-medium">
        До каталогу
      </Link>
    </section>
  )
}
