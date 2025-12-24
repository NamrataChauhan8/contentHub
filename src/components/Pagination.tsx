'use client'

import React from 'react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  pageSize: number
  setPageSize: (n: number) => void
  goTo: (page: number) => void
  prev: () => void
  next: () => void
  total: number
  pageSizeOptions?: number[]
  className?: string
}

function getPageWindow(current: number, total: number) {
  const pages: number[] = []
  for (let p = 1; p <= total; p++) pages.push(p)

  if (total <= 7) return pages

  const window = new Set<number>([1, total, current - 1, current, current + 1])
  const result: (number | 'gap')[] = []
  let lastAdded = 0

  for (const p of pages) {
    if (window.has(p)) {
      if (lastAdded && p - lastAdded > 1) result.push('gap')
      result.push(p)
      lastAdded = p
    }
  }
  return result
}

export default function Pagination({
  currentPage,
  totalPages,
  pageSize,
  setPageSize,
  goTo,
  prev,
  next,
  total,
  pageSizeOptions = [5, 10, 25, 50],
  className = ''
}: PaginationProps) {
  const pageItems = getPageWindow(currentPage, totalPages)

  return (
    <div className={`mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${className}`}>
      <div className='flex items-center gap-3'>
        <button
          onClick={prev}
          disabled={currentPage === 1}
          className='px-3 py-1.5 rounded-md border disabled:opacity-50 cursor-pointer'
          aria-label='Previous page'
        >
          Prev
        </button>

        <div className='flex items-center gap-1'>
          {pageItems.map((item, idx) =>
            item === 'gap' ? (
              <span key={`gap-${idx}`} className='px-2'>
                …
              </span>
            ) : (
              <button
                key={item}
                onClick={() => goTo(item)}
                aria-current={item === currentPage ? 'page' : undefined}
                className={`cursor-pointer px-3 py-1.5 rounded-md border ${
                  item === currentPage ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {item}
              </button>
            )
          )}
        </div>

        <button
          onClick={next}
          disabled={currentPage === totalPages}
          className='px-3 py-1.5 rounded-md border disabled:opacity-50 cursor-pointer'
          aria-label='Next page'
        >
          Next
        </button>
      </div>

      <div className='flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300'>
        <label htmlFor='pageSize' className='sr-only'>
          Items per page
        </label>
        <select
          id='pageSize'
          value={pageSize}
          onChange={e => setPageSize(Number(e.target.value))}
          className='px-2 py-1 border rounded'
          aria-label='Items per page'
        >
          {pageSizeOptions.map(n => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <span className='select-none'>per page</span>

        <div>
          <span>
            Showing{' '}
            <strong>
              {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, total)}
            </strong>{' '}
            of <strong>{total}</strong>
          </span>
        </div>
      </div>
    </div>
  )
}
