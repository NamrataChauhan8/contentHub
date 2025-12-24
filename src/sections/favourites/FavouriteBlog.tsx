'use client'
import Pagination from '@/components/Pagination'
import Searchbar from '@/components/Searchbar'
import { api } from '@/functions/api'
import usePagination from '@/hooks/usePagination'
import { useUser } from '@/providers/UserProvider'
import BlogDescription from '@/utils/convert'
import { displayLikeCount } from '@/utils/functions'
import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FaArrowRightLong, FaHeart } from 'react-icons/fa6'
import { FcLike } from 'react-icons/fc'
import { GoHeart } from 'react-icons/go'
import { PiUserCircleFill } from 'react-icons/pi'
import { toast } from 'react-toastify'
import BlogCardSkeleton from '../blogs/BlogCardSkeleton'

interface Blog {
  id: string
  title: string
  description: string
  image: string | null
  category: string
  createdAt: Date
  userId: string
  likeCount: number
  likedBy: string[]
  user: {
    name: string
    image: string | null
    email: string
  }
}

const FavouriteBlog = () => {
  const { user }: any = useUser()

  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  const fetchFavourites = async () => {
    try {
      setLoading(true)
      const res: any = await api.get('/api/favouriteBlogs')
      if (res?.status === 200) {
        setBlogs(Array.isArray(res.blogs) ? res.blogs : [])
      } else {
        toast.error('Failed to fetch favourite blogs')
      }
    } catch (error) {
      console.error('Error fetching favourite blogs:', error)
      toast.error('Something went wrong while fetching favourite blogs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFavourites()
  }, [user])

  const handleLikeToggle = async (id: string) => {
    try {
      const payload = { blogId: id, userId: user?.id } // Replace with actual current user ID
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
        fetchFavourites()
      } else {
        toast.error('Failed to toggle like')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleSearch = async (title: string, category: string) => {
    try {
      if (!user) {
        return
      }
      const res: any = await api.get(`/api/search?title=${title}&category=${category}&isLiked=true&userId=${user?.id}`)
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

  const capitalizeName = (name: string) => name.toLowerCase().replace(/\b\w/g, char => char.toUpperCase())

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <section className='w-full'>
        <div className='relative rounded-none sm:rounded-md overflow-hidden bg-gradient-to-t from-[#cc3478] to-[#cc4375]/30 h-48 sm:h-56 md:h-64 lg:h-72 flex items-center'>
          <div className='w-full px-4 sm:px-8'>
            <div className='text-center'>
              <h1 className='text-white text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight flex items-center justify-center gap-2'>
                <span>Your Favourite</span>
                <FaHeart />
                <span>Blogs</span>
              </h1>

              <p className='mt-2 sm:mt-3 text-white/90 text-xs sm:text-sm md:text-base max-w-3xl mx-auto'>
                Explore and revisit your favourite blogs all in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className='mb-4'>
        <Searchbar onSearch={handleSearch} />
      </div>

      {/* Blog Listing */}
      <section className='max-w-6xl mx-auto px-3 sm:px-6 py-8'>
        {loading ? (
          <div className='flex items-center justify-center py-12'>
            <BlogCardSkeleton />
          </div>
        ) : blogs.length === 0 ? (
          <p className='text-center text-gray-500 dark:text-gray-400 py-12'>You have no favourite blogs yet.</p>
        ) : (
          <>
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
              {paginated?.map(blog => (
                <div
                  key={blog.id}
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
                      <h2 className='text-base xs:text-lg sm:text-lg md:text-xl font-semibold tracking-tight text-gray-900 dark:text-white mb-2 line-clamp-2'>
                        {blog?.title}
                      </h2>
                      <div
                        onClick={() => handleLikeToggle(blog.id)}
                        className='cursor-pointer flex flex-col text-xs items-center'
                      >
                        {blog?.likedBy.includes(user?.id) ? (
                          <FcLike className='w-6 h-6' />
                        ) : (
                          <GoHeart className='w-6 h-6' />
                        )}
                        <p>{displayLikeCount(blog?.likeCount || 0)}</p>
                      </div>
                    </div>

                    <div
                      className='
                      text-sm text-gray-700 dark:text-gray-300
                      prose prose-sm max-w-none line-clamp-3
                    '
                    >
                      <BlogDescription html={blog.description || ''} />
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

                    <div className='text-xs text-gray-500 dark:text-gray-400'>
                      {blog?.user?.image ? (
                        <Image
                          src={blog?.user?.image || '/person.png'}
                          alt='Author Avatar'
                          width={28}
                          height={28}
                          className='inline-block rounded-full mr-1'
                        />
                      ) : (
                        <PiUserCircleFill className='w-7 h-7 inline-block rounded-full mr-1' />
                      )}
                      <span> {blog.user.name && capitalizeName(blog.user.name)}</span>
                    </div>
                  </div>

                  <div className='mt-2'>
                    <div className='flex items-center justify-between space-x-2'>
                      <span className='bg-gray-100 text-gray-900 text-sm font-medium px-2 py-1 rounded-full'>
                        {blog?.category}
                      </span>
                      <span className='text-xs text-gray-500 dark:text-gray-400'>
                        {moment(blog.createdAt).format('MMM DD, YYYY')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  )
}

export default FavouriteBlog
