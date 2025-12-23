'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { IoClose } from 'react-icons/io5'
import { FiTrash2 } from 'react-icons/fi'
import { useUser } from '@/providers/UserProvider'
import { toast } from 'react-toastify'
import { api } from '@/functions/api'

type User = {
  id: string | null
  name: string | null
  email: string | null
  image: string | null
}

type Props = {
  open: boolean
  onClose: () => void
}

const EditProfileModal = ({ open, onClose }: Props) => {
  const { user, refreshUser } = useUser()

  const [name, setName] = useState('')
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [removeImage, setRemoveImage] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open && user) {
      setName(user.name || '')
      setPreviewImage(user.image || null)
      setImageFile(null)
      setRemoveImage(false)
    }
  }, [open, user])

  if (!open) return null

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image')
      e.target.value = ''
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB')
      e.target.value = '' // Reset input
      return
    }

    setImageFile(file)
    setRemoveImage(false)

    const reader = new FileReader()
    reader.onloadend = () => setPreviewImage(reader.result as string)
    reader.readAsDataURL(file)

    e.target.value = ''
  }

  const handleRemoveImage = () => {
    setPreviewImage(null)
    setImageFile(null)
    setRemoveImage(true)
  }

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null

    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('file', imageFile)

      const res = await api.postFormData<{ url: string }>('/api/upload', formData)
      return res.url
    } catch (err: any) {
      toast.error(err?.message || 'Image upload failed')
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error('Name is required')
      return
    }

    try {
      setSaving(true)

      let imageUrl = user?.image || null

      // Handle image removal
      if (removeImage) {
        imageUrl = null
      } else if (imageFile) {
        // Handle new image upload
        const uploaded = await uploadImage()
        if (!uploaded) return
        imageUrl = uploaded
      }

      const response: any = await api.put<{ user: User }>('/api/updateProfile', {
        name: name.trim(),
        image: imageUrl
      })

      if (response.status === 200) {
        toast.success(response.message || 'Profile updated successfully!')
        await refreshUser()
        onClose()
      } else {
        toast.error('Failed to update profile')
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <form onSubmit={handleSave} className='bg-white dark:bg-gray-800 rounded-xl w-[90%] sm:w-[420px] p-6 relative'>
        <button type='button' onClick={onClose} className='absolute top-3 right-3 text-gray-400 hover:text-gray-600'>
          <IoClose size={22} />
        </button>

        <h2 className='text-lg font-semibold mb-4'>Edit Profile</h2>

        <div className='flex flex-col items-center gap-3 mb-4'>
          <div className='relative'>
            <div className='w-24 h-24 rounded-full overflow-hidden bg-gray-200'>
              {previewImage ? (
                <Image src={previewImage} alt='profile' width={96} height={96} className='object-cover' />
              ) : (
                <div className='w-full h-full flex items-center justify-center text-sm text-gray-500'>No Image</div>
              )}
            </div>

            {previewImage && (
              <button
                type='button'
                onClick={handleRemoveImage}
                className='absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-colors'
                title='Remove photo'
              >
                <FiTrash2 size={14} />
              </button>
            )}
          </div>

          <label className='text-sm cursor-pointer text-blue-600 hover:text-blue-700'>
            {uploading ? 'Uploading...' : 'Change Photo'}
            <input type='file' accept='image/*' hidden onChange={handleImageSelect} disabled={uploading} />
          </label>
        </div>

        <div className='mb-3'>
          <label className='text-sm text-gray-600 dark:text-gray-300'>Username</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            className='w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white'
          />
        </div>

        <div className='mb-5'>
          <label className='text-sm text-gray-600 dark:text-gray-300'>Email</label>
          <input
            value={user?.email || ''}
            disabled
            className='w-full mt-1 px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed dark:border-gray-600'
          />
        </div>

        <div className='flex justify-end gap-3'>
          <button
            type='button'
            onClick={onClose}
            className='px-4 py-2 border rounded-lg dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type='submit'
            className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-60 disabled:cursor-not-allowed'
            disabled={saving || uploading}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditProfileModal
