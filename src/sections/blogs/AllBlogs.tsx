'use client'

import { Blog } from '@prisma/client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FaArrowRightLong } from 'react-icons/fa6'
import { toast } from 'react-toastify'
import moment from 'moment'
import { FcLike } from 'react-icons/fc'
import { GoHeart } from 'react-icons/go'
import { useUser } from '@/providers/UserProvider'
import { api } from '@/functions/api'
import usePagination from '@/hooks/usePagination'
import Pagination from '@/components/Pagination'
import BlogDescription from '@/utils/convert'
import Searchbar from '@/components/Searchbar'

const AllBlogs = () => {
  const { user }: any = useUser()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchBlogs = async () => {
      try {
        const res: any = await api.get('/api/allBlogs')
        if (!isMounted) return

        if (res?.status === 200) {
          setBlogs(Array.isArray(res.blogs) ? res.blogs : [])
        } else {
          toast.error('Failed to fetch blog data')
        }
      } catch (error) {
        console.error('Error fetching blogs:', error)
        toast.error('Something went wrong while fetching blogs')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchBlogs()

    return () => {
      isMounted = false
    }
  }, [])

  const handleLikeToggle = async (id: string) => {
    try {
      const payload = { blogId: id, userId: user?.id }
      const res: any = await api.post('/api/toggleLike', payload)
      if (res?.status === 200) {
        toast.success(res.message)
        setBlogs(prevBlogs =>
          prevBlogs.map(blog =>
            blog.id === id
              ? {
                  ...blog,
                  likeCount: res.likeCount,
                  likedBy: res.likedBy
                }
              : blog
          )
        )
      } else {
        toast.error('Failed to toggle like')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleSearch = async (title: string, category: string) => {
    try {
      const res: any = await api.get(`/api/search?title=${title}&category=${category}`)
      if (res?.status === 200) {
        setBlogs(Array.isArray(res.data) ? res.data : [])
      } else {
        toast.error('Failed to fetch blog data')
      }
    } catch (error) {
      console.error('Error fetching blogs:', error)
      toast.error('Something went wrong while fetching blogs')
    }
  }

  const { paginated, currentPage, pageSize, setPageSize, total, totalPages, goTo, prev, next } = usePagination<Blog>(
    blogs,
    {
      initialPageSize: 5,
      resetOnItemsChange: true
    }
  )

  return (
    <>
      <div className='mb-4'>
        <Searchbar onSearch={handleSearch} />
      </div>
      <section className='max-w-6xl mx-auto px-3 sm:px-6 py-8'>
        {loading ? (
          <div className='flex items-center justify-center py-12'>
            <svg
              className='animate-spin h-8 w-8 text-gray-500'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              aria-hidden
            >
              <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
              <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z' />
            </svg>
          </div>
        ) : total === 0 ? (
          <p className='text-center text-gray-500'>No blogs available</p>
        ) : (
          <>
            {/* Pagination controls */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              setPageSize={setPageSize}
              goTo={goTo}
              prev={prev}
              next={next}
              total={total}
              pageSizeOptions={[5, 10, 25, 50]}
            />

            <div
              className='
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              gap-4
              sm:gap-6
            '
            >
              {paginated.map(blog => (
                <div
                  key={blog?.id}
                  className='
                  flex flex-col justify-between
                  p-4 sm:p-5
                  bg-white dark:bg-gray-800
                  border border-gray-200 dark:border-gray-700
                  rounded-lg shadow-sm
                  hover:shadow-md transition-shadow
                  min-h-[180px]
                '
                >
                  <div className='mb-3'>
                    <div className='flex justify-between items-start'>
                      <h2
                        className='
                      text-base xs:text-lg sm:text-lg md:text-xl
                      font-semibold tracking-tight
                      text-gray-900 dark:text-white
                      mb-2 line-clamp-2
                    '
                      >
                        {blog?.title}
                      </h2>
                      <div onClick={() => handleLikeToggle(blog.id)} className='cursor-pointer'>
                        {blog?.likedBy.includes(user?.id) ? (
                          <FcLike className='w-6 h-6' />
                        ) : (
                          <GoHeart className='w-6 h-6' />
                        )}
                      </div>
                    </div>

                    <div
                      className='
                      text-sm text-gray-700 dark:text-gray-300
                      prose prose-sm max-w-none line-clamp-3
                    '
                    >
                      <BlogDescription html={blog?.description || ''} />
                    </div>
                  </div>

                  <div className='flex items-center justify-between'>
                    <Link
                      href={`/myblogs/${blog.id}`}
                      className='
                    inline-flex items-center text-sm font-medium
                    text-blue-700 hover:text-blue-800
                    dark:text-blue-400 dark:hover:text-blue-300
                  '
                    >
                      Read more
                      <FaArrowRightLong className='ml-2' />
                    </Link>

                    <div
                      className='
                      text-xs
                      text-gray-500 dark:text-gray-400
                    '
                    >
                      {moment(blog.createdAt).format('MMM DD, YYYY')}
                    </div>
                  </div>

                  <div className='mt-2'>
                    <div className='flex items-center space-x-2'>
                      <span className='bg-gray-100 text-gray-900 text-sm font-medium px-2 py-1 rounded-full'>
                        {blog?.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </>
  )
}

export default AllBlogs
