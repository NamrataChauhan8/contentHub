'use client'

import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { MdDelete, MdEdit } from 'react-icons/md'
import { toast } from 'react-toastify'
import { SiCircuitverse } from 'react-icons/si'
import { GiBank, GiHealthNormal, GiRollingSuitcase } from 'react-icons/gi'
import { FaGraduationCap, FaUmbrellaBeach } from 'react-icons/fa6'
import { api } from '@/functions/api'
import { useUser } from '@/providers/UserProvider'
import BlogDescription from '@/utils/convert'
import Comments from '../comments/Comments'
import DeleteModal from '@/components/modals/DeleteModal'
import moment from 'moment'
import { IoArrowBack } from 'react-icons/io5'
import { BlogDetailsLoading } from './BlogDetailsLoading'

const BlogDetails = () => {
  const { id }: any = useParams()
  const router = useRouter()
  const { user } = useUser()

  const [details, setDetails] = useState<any>({})

  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const fetchBlogDetails = async () => {
    setLoading(true)
    try {
      const res: any = await api.get(`/api/userBlogDetails/${id}`)
      if (res.status === 200) {
        setDetails(res.blog)
      } else {
        toast.error(res.message || 'Failed to fetch blog details')
      }
    } catch (error) {
      console.log('error: ', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const handleDeleteBlog = async () => {
    setLoading(true)
    try {
      const res: any = await api.delete(`/api/blogs/${id}`)
      if (res.status === 200) {
        toast.success(res.message)
        router.push('/myblogs')
      }
    } catch (error) {
      toast.error('Failed to delete blog')
    } finally {
      setLoading(false)
      setShowDeleteModal(null)
    }
  }

  const confirmDelete = async () => {
    if (!showDeleteModal) return
    await handleDeleteBlog()
  }

  const ICON_CLASS = 'w-6 h-6'

  const handleCategoryIcon = (category: string) => {
    if (!category) return null
    const cls = ICON_CLASS + ' inline-block'
    switch (category.toLowerCase()) {
      case 'technology':
        return <SiCircuitverse className={cls} />
      case 'health':
        return <GiHealthNormal className={cls} />
      case 'lifestyle':
        return <GiRollingSuitcase className={cls} />
      case 'finance':
        return <GiBank className={cls} />
      case 'travel':
        return <FaUmbrellaBeach className={cls} />

      case 'education':
        return <FaGraduationCap className={cls} />

      default:
        return null
    }
  }

  const isAuthor = user?.id === details?.userId
  const capitalizeName = (name: string) => name.toLowerCase().replace(/\b\w/g, char => char.toUpperCase())

  return (
    <main className='h-screen relative'>
      {loading ? (
        <BlogDetailsLoading />
      ) : (
        <>
          <section className='relative w-full h-80 overflow-hidden rounded-none sm:rounded-md mb-10'>
            <div className='absolute inset-0 bg-gradient-to-r from-[#1e8a56] to-[#1e3a8a]/30' />
            <div className='absolute inset-0 flex items-center justify-center px-6'>
              <div className='text-center'>
                <h1 className='text-white text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight'>
                  {details?.title}
                </h1>
                {details?.user?.name && (
                  <p className='mt-3 text-white/90 text-sm sm:text-base mx-auto font-semibold italic'>
                    By {capitalizeName(details?.user?.name)}
                  </p>
                )}
                {details?.createdAt && (
                  <p className='mt-3 text-white/90 text-sm mx-auto italic'>
                    Published on {moment(details?.createdAt).format('MMMM Do, YYYY')}
                  </p>
                )}
              </div>
            </div>

            <div className='bg-black'>
              <p
                className='absolute top-6 left-4 bg-black hover:bg-black/60 text-white px-4 py-2 rounded-full backdrop-blur-md transition-colors shadow-md text-sm flex items-center gap-2 cursor-pointer'
                onClick={() => router.back()}
              >
                <IoArrowBack className='w-5 h-5' />
                <span>Back</span>
              </p>
            </div>
            {details?.category && (
              <div className='bg-black'>
                <p className='absolute bottom-4 left-4 bg-black hover:bg-black/60 text-white px-4 py-2 rounded-full backdrop-blur-md transition-colors shadow-md text-sm flex items-center gap-2'>
                  {handleCategoryIcon(details?.category)}
                  <span>{details?.category}</span>
                </p>
              </div>
            )}

            {isAuthor && (
              <>
                <button
                  onClick={() => router.push(`/myblogs/${id}/edit`)}
                  className='cursor-pointer absolute bottom-4 right-20 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-md transition-colors shadow-md'
                  title='Edit Blog'
                >
                  <MdEdit className='w-5 h-5' />
                </button>

                <button
                  onClick={() => setShowDeleteModal(id)}
                  className='cursor-pointer absolute bottom-4 right-4 bg-red-500 hover:bg-red-600 text-white p-3 rounded-full backdrop-blur-md transition-colors shadow-md'
                  title='Delete Blog'
                >
                  <MdDelete className='w-5 h-5' />
                </button>
              </>
            )}
          </section>

          <section className='mx-auto px-4'>
            {details?.image && (
              <div className='w-full mb-8 flex justify-center overflow-hidden'>
                <div className='relative w-full h-[400px]'>
                  <Image
                    src={details.image}
                    alt={details.title || 'Blog Image'}
                    fill
                    className='object-contain rounded-xl'
                  />
                </div>
              </div>
            )}

            <div className='mb-4 text-gray-700 dark:text-gray-400 prose dark:prose-invert max-w-none'>
              <BlogDescription html={details?.description} />
            </div>
          </section>

          <section>
            <div className='w-full mx-auto bg-white dark:bg-neutral-800 p-7 max-h-[80vh] overflow-y-auto'>
              <Comments />
            </div>
          </section>

          {/* DELETE CONFIRMATION MODAL */}
          <DeleteModal
            setShowDeleteModal={setShowDeleteModal}
            showDeleteModal={showDeleteModal}
            onConfirm={confirmDelete}
            loading={loading}
            title='Delete Blog'
            content='Are you sure you want to delete this blog? This action cannot be undone.'
          />
        </>
      )}
      {/* HEADER SECTION */}
    </main>
  )
}

export default BlogDetails
