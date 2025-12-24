import React from 'react'

interface Props {
  setShowDeleteModal: React.Dispatch<React.SetStateAction<string | null>>
  showDeleteModal: string | null
  onConfirm: () => void
  loading: boolean
  title: string
  content: string
}

const DeleteModal = ({ setShowDeleteModal, showDeleteModal, onConfirm, loading, title, content }: Props) => {
  if (!showDeleteModal) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-[90%] sm:w-[400px]'>
        <h2 className='text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4'>{title}</h2>
        <p className='text-gray-600 dark:text-gray-300 mb-6'>{content}</p>
        <div className='flex justify-end gap-3'>
          <button
            onClick={() => setShowDeleteModal(null)}
            className='cursor-pointer px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition'
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className='cursor-pointer px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition disabled:opacity-60'
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal
