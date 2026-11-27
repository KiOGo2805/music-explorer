import type { ReactNode } from 'react'

interface AsyncStateBoundaryProps {
  isLoading: boolean
  isError: boolean
  onRetry: () => void
  isEmpty?: boolean
  emptyMessage?: string
  children: ReactNode
}

export function AsyncStateBoundary({
  isLoading,
  isError,
  onRetry,
  isEmpty = false,
  emptyMessage = 'Тут поки нічого немає.',
  children,
}: AsyncStateBoundaryProps) {
  if (isLoading) {
    return <p className="py-16 text-center text-zinc-400">Завантаження…</p>
  }
  if (isError) {
    return (
      <div className="py-16 text-center">
        <p className="mb-4 text-zinc-300">Не вдалося завантажити дані.</p>
        <button
          type="button"
          className="cursor-pointer rounded-lg bg-violet-500 px-4 py-2 font-medium text-white transition hover:bg-violet-400"
          onClick={onRetry}
        >
          Спробувати ще
        </button>
      </div>
    )
  }
  if (isEmpty) return <p className="py-16 text-center text-zinc-400">{emptyMessage}</p>
  return children
}