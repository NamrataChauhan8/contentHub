import React, { useEffect, useRef, useState } from 'react'
import { TbCategoryFilled } from 'react-icons/tb'
import { IoMdArrowDropdown } from 'react-icons/io'
import { CATEGORY_OPTIONS } from '@/constants/constants'

const Searchbar = ({ onSearch }: { onSearch: (title: string, category: string) => void }) => {
  const [open, setOpen] = useState(false)
  const [category, setCategory] = useState('')
  const [title, setTitle] = useState('')

  const containerRef: any = useRef(null)

  useEffect(() => {
    function onDocClick(e: any) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    const timeout = setTimeout(() => {
      onSearch(title, category)
    }, 400)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, category])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.startsWith(' ')) return
    setTitle(e.target.value)
  }

  return (
    <div ref={containerRef} className='w-full px-3 sm:px-0 max-w-3xl mx-auto mt-6'>
      <div className='flex flex-col sm:flex-row items-stretch border border-neutral-300 bg-white shadow-sm hover:shadow transition-shadow duration-300 relative'>
        {/* Category Button */}
        <button
          type='button'
          aria-haspopup='listbox'
          aria-expanded={open}
          onClick={() => setOpen(prev => !prev)}
          className='flex items-center justify-between sm:justify-start gap-2 bg-neutral-100 text-gray-700 font-medium px-4 py-3 sm:border-b-0 sm:border-r border-neutral-300 hover:bg-neutral-200 transition-colors w-full sm:w-auto'
        >
          <TbCategoryFilled className='w-5 h-5' />
          <span className='hidden sm:inline'>{category || 'All Categories'}</span>
          <IoMdArrowDropdown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {/* Category Dropdown */}
        <div
          className={`absolute left-0 top-full mt-2 bg-white border border-neutral-200 rounded-lg shadow-xl w-48 transition-all duration-200 origin-top ${
            open ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-95 opacity-0 pointer-events-none'
          } z-10`}
        >
          <ul className='py-2 text-sm text-gray-700'>
            <li className='cursor-pointer'>
              <button
                type='button'
                className='w-full text-left px-3 py-2 hover:bg-neutral-100 hover:text-black rounded-md transition-colors cursor-pointer'
                onClick={() => {
                  setCategory('')
                  setOpen(false)
                  onSearch(title, '')
                }}
              >
                All Categories
              </button>
            </li>
            {CATEGORY_OPTIONS.map(item => (
              <li key={item} className='cursor-pointer'>
                <button
                  type='button'
                  className='w-full text-left px-3 py-2 hover:bg-neutral-100 hover:text-black rounded-md transition-colors cursor-pointer'
                  onClick={() => {
                    setCategory(item)
                    setOpen(false)
                    onSearch(title, item)
                  }}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <input
          type='search'
          placeholder='Search by Title'
          value={title}
          onChange={handleTitleChange}
          className='flex-1 px-4 py-3 bg-white text-gray-900 placeholder:text-gray-400 outline-none text-sm w-full'
        />
      </div>
    </div>
  )
}

export default Searchbar
