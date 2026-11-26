interface PaginationProps {
  page: number
  hasMore: boolean
  onPageChange: (page: number) => void
}

export function Pagination({ page, hasMore, onPageChange }: PaginationProps) {
  return (
    <nav aria-label="Пагінація" className="mt-8 flex items-center justify-center gap-4">
      <button
        className="rounded-lg border border-zinc-700 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Назад
      </button>
      <span className="text-sm text-zinc-400">Сторінка {page}</span>
      <button
        className="rounded-lg border border-zinc-700 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
        disabled={!hasMore}
        onClick={() => onPageChange(page + 1)}
      >
        Далі
      </button>
    </nav>
  )
}
