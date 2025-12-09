import { useEffect, useMemo, useState } from 'react'

export type UsePaginationOptions = {
  initialPage?: number
  initialPageSize?: number
  resetOnItemsChange?: boolean // reset to page 1 when items array changes
}

export default function usePagination<T>(items: T[] = [], options: UsePaginationOptions = {}) {
  const { initialPage = 1, initialPageSize = 5, resetOnItemsChange = true } = options

  const [currentPage, setCurrentPage] = useState<number>(initialPage)
  const [pageSize, setPageSize] = useState<number>(initialPageSize)

  const total = items?.length ?? 0
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  // reset when items or pageSize change (optional)
  useEffect(() => {
    if (resetOnItemsChange) setCurrentPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, pageSize])

  const startIndex = useMemo(() => (currentPage - 1) * pageSize, [currentPage, pageSize])
  const endIndex = useMemo(() => Math.min(currentPage * pageSize, total), [currentPage, pageSize, total])

  const paginated = useMemo(() => {
    return (items || []).slice(startIndex, startIndex + pageSize)
  }, [items, startIndex, pageSize])

  const goTo = (page: number) => setCurrentPage(Math.min(Math.max(1, Math.floor(page)), totalPages))
  const prev = () => goTo(currentPage - 1)
  const next = () => goTo(currentPage + 1)
  const reset = () => {
    setCurrentPage(1)
    setPageSize(initialPageSize)
  }

  return {
    // state
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,

    // derived
    total,
    totalPages,
    startIndex,
    endIndex,

    // data
    paginated,

    // actions
    goTo,
    prev,
    next,
    reset
  } as const
}
