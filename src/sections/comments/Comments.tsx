'use client'

import DeleteModal from '@/components/modals/DeleteModal'
import { api } from '@/functions/api'
import { useUser } from '@/providers/UserProvider'
import moment from 'moment'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { MdEdit, MdOutlineDelete } from 'react-icons/md'
import { toast } from 'react-toastify'

const buildCommentTree = (list: any[]) => {
  const map: Record<string, any> = {}
  const roots: any[] = []

  list.forEach(item => {
    map[item.id] = { ...item, replies: [] }
  })

  list.forEach(item => {
    if (item.parentId) {
      map[item.parentId]?.replies.push(map[item.id])
    } else {
      roots.push(map[item.id])
    }
  })

  return roots
}

export default function Comments() {
  const { id } = useParams()
  const { user } = useUser()

  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState('')
  const [replyValue, setReplyValue] = useState<Record<string, string>>({})
  const [replyOpen, setReplyOpen] = useState<Record<string, boolean>>({})
  const [deleteModal, setDeleteModal] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true)
      try {
        const res: any = await api.get(`/api/comments/${id}`)

        if (res?.status === 200) {
          const tree = buildCommentTree(res.comments || [])
          setComments(tree)
        } else {
          toast.error(res?.message)
        }
      } catch (error) {
        console.error('Error fetching comments:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchComments()
  }, [id, user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setLoading(true)

    try {
      const payload = {
        blogId: id,
        content: newComment.trim()
      }

      const res: any = await api.post('/api/comments', payload)
      if (res?.status === 200) {
        await api.get(`/api/comments/${id}`).then((res: any) => {
          if (res?.status === 200) {
            setComments(buildCommentTree(res.comments || []))
          }
        })
        setNewComment('')
      }
    } catch (error) {
      console.error('Error posting comment', error)
    } finally {
      setLoading(false)
    }
  }
  const postReply = async (commentId: string) => {
    const text = replyValue[commentId]?.trim()
    if (!text) return
    setLoading(true)
    try {
      const payload = {
        blogId: id,
        content: text,
        parentId: commentId
      }

      const res: any = await api.post('/api/comments', payload)

      if (res?.status === 200) {
        await api.get(`/api/comments/${id}`).then((res: any) => {
          if (res?.status === 200) {
            setComments(buildCommentTree(res.comments || []))
          }
        })
        setReplyValue(r => ({ ...r, [commentId]: '' }))
        setReplyOpen(r => ({ ...r, [commentId]: false }))
      } else {
        toast.error(res?.message)
      }
    } catch (error) {
      console.log('Error posting reply:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteComment: any = async (commentId: string) => {
    setLoading(true)
    try {
      const payload = {
        commentId
      }
      const res: any = await api.delete(`/api/comments`, payload)
      if (res?.status === 200) {
        toast.success(res?.message)
        await api.get(`/api/comments/${id}`).then((res: any) => {
          if (res?.status === 200) {
            setComments(buildCommentTree(res.comments || []))
          }
          setDeleteModal(null)
        })
      } else {
        toast.error(res?.message)
      }
    } catch (error) {
      console.log('Error deleting comment:', error)
    } finally {
      setLoading(false)
    }
  }

  const confirmDelete = async () => {
    if (!deleteModal) return
    await handleDeleteComment(deleteModal)
  }

  const handleUpdateComment = async (commentId: string, content: string) => {
    try {
      const payload = {
        commentId,
        content
      }
      const res: any = await api.patch(`/api/comments`, payload)
      if (res?.status === 200) {
        toast.success(res?.message)
        await api.get(`/api/comments/${id}`).then((res: any) => {
          if (res?.status === 200) {
            setComments(buildCommentTree(res.comments || []))
            setEditingId(null)
          }
        })
      } else {
        toast.error(res?.message)
      }
    } catch (error) {
      console.log('Error updating comment:', error)
    }
  }

  const startEdit = (itemId: string, currentContent: string) => {
    setEditingId(itemId)
    setEditValue(e => ({ ...e, [itemId]: currentContent }))
  }

  const cancelEdit = (itemId: string) => {
    setEditingId(prev => (prev === itemId ? null : prev))
    setEditValue(e => ({ ...e, [itemId]: '' }))
  }

  const saveEdit = async (itemId: string) => {
    const newContent = editValue[itemId]?.trim()
    if (!newContent) {
      toast.error('Content cannot be empty')
      return
    }
    setLoading(true)
    await handleUpdateComment(itemId, newContent)
    setLoading(false)
  }

  return (
    <>
      <DeleteModal
        setShowDeleteModal={setDeleteModal}
        showDeleteModal={deleteModal}
        onConfirm={confirmDelete}
        loading={loading}
        title='Delete Comment'
        content='Are you sure you want to delete this comment?'
      />

      <div className='flex items-center justify-between mb-4 sm:mb-5'>
        <div>
          <h2 className='text-lg sm:text-xl font-semibold text-heading'>Comments</h2>
          <p className='text-xs text-muted'>A place for feedback — be kind and constructive</p>
        </div>
      </div>

      <ul className='space-y-3 sm:space-y-4'>
        {(comments || []).map((c: any) => (
          <li key={c.id} className='p-2 sm:p-3 rounded-2xl hover:shadow-md transition-shadow bg-cadet'>
            <div className='flex gap-3 items-start' data-dropdown-root>
              {/* avatar: keeps fixed size */}
              <div className='w-8 h-8 flex-shrink-0 rounded-full overflow-hidden'>
                <Image
                  src={`${c?.user?.image || '/person.png'}`}
                  alt={c?.user?.name || 'avatar'}
                  width={32}
                  height={32}
                  style={{ objectFit: 'cover' }}
                />
              </div>

              <div className='flex-1 min-w-0'>
                <div
                  className={
                    editingId === c.id
                      ? 'flex flex-col gap-2' // editing: stack vertically so textarea can be full width
                      : 'flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2'
                  }
                >
                  {/* LEFT column (content) */}
                  <div className='min-w-0 flex-1'>
                    <div className='flex items-center gap-3'>
                      <span className='text-sm font-bold text-heading truncate block min-w-0'>{c?.user?.name}</span>
                      <div className='text-xs text-muted whitespace-nowrap'>{moment(c?.createdAt).fromNow()}</div>
                    </div>

                    <div className='mt-2'>
                      {editingId === c.id ? (
                        <div>
                          <textarea
                            value={editValue[c.id] || ''}
                            onChange={e =>
                              setEditValue(ev => ({
                                ...ev,
                                [c.id]: e.target.value
                              }))
                            }
                            rows={4}
                            className='w-full rounded-lg border border-neutral-200 dark:border-neutral-700 p-3 text-sm resize-y bg-neutral-50 dark:bg-neutral-800 text-body dark:text-white'
                          />
                          <div className='flex items-center justify-end gap-2 mt-2'>
                            <button
                              onClick={() => cancelEdit(c.id)}
                              className='cursor-pointer text-xs px-2 py-1 rounded-md border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                              disabled={loading}
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => saveEdit(c.id)}
                              className='cursor-pointer text-xs px-3 py-1 rounded-md bg-primary-600 text-white'
                              disabled={loading}
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className='text-sm text-body break-words whitespace-normal'>{c?.content}</p>
                      )}
                    </div>
                  </div>

                  <div
                    className={
                      editingId === c.id
                        ? 'flex items-center gap-2 self-start sm:self-auto'
                        : 'flex-shrink-0 flex items-center gap-2 self-start sm:self-auto'
                    }
                  >
                    {c?.authorId === user?.id && (
                      <div className='flex items-center gap-2'>
                        <button
                          className='bg-red-400 rounded-full p-1 hover:bg-red-500 text-xl'
                          onClick={() => setDeleteModal(c.id)}
                        >
                          <MdOutlineDelete className='cursor-pointer' />
                        </button>
                        <div
                          className='bg-blue-500 rounded-full p-1 hover:bg-blue-700 text-xl'
                          onClick={() => startEdit(c.id, c.content)}
                        >
                          <MdEdit className='cursor-pointer' />
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() => setReplyOpen((r: any) => ({ ...r, [c.id]: !r[c.id] }))}
                      className='text-xs px-3 py-1 rounded-md border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                      aria-expanded={!!replyOpen[c.id]}
                      aria-controls={`reply-box-${c.id}`}
                    >
                      Reply
                    </button>
                  </div>
                </div>

                {/* Replies */}
                <div className='mt-3 space-y-3'>
                  {(c.replies || []).map((r: any) => (
                    <div key={r.id} className='flex items-start gap-3 pl-10 sm:pl-12 min-w-0'>
                      <div className='w-7 h-7 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center text-xs font-semibold text-muted'>
                        <Image
                          src={r?.user?.image || '/person.png'}
                          alt={r?.user?.name || 'reply avatar'}
                          width={28}
                          height={28}
                          style={{ objectFit: 'cover' }}
                        />
                      </div>

                      <div className='flex-1 min-w-0 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl p-2 sm:p-3 border border-neutral-100 dark:border-neutral-800'>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-2 min-w-0'>
                            <span className='text-sm font-bold text-heading truncate min-w-0'>{r?.user?.name}</span>
                            <div className='text-xs text-muted whitespace-nowrap'>{moment(r.createdAt).fromNow()}</div>
                          </div>

                          {r?.authorId === user?.id && (
                            <div className='flex items-center gap-2 flex-shrink-0'>
                              <button
                                className='bg-red-400 rounded-full p-1 hover:bg-red-500 text-xl'
                                onClick={() => setDeleteModal(r.id)}
                              >
                                <MdOutlineDelete className='cursor-pointer' />
                              </button>
                              <div
                                className='bg-blue-500 rounded-full p-1 hover:bg-blue-700 text-xl'
                                onClick={() => startEdit(r.id, r.content)}
                              >
                                <MdEdit className='cursor-pointer' />
                              </div>
                            </div>
                          )}
                        </div>

                        <div className='mt-1'>
                          {editingId === r.id ? (
                            <div>
                              <textarea
                                value={editValue[r.id] || ''}
                                onChange={e =>
                                  setEditValue(ev => ({
                                    ...ev,
                                    [r.id]: e.target.value
                                  }))
                                }
                                className='w-full max-w-full box-border min-h-[100px] rounded-lg border border-neutral-200 dark:border-neutral-700 p-3 text-sm bg-neutral-50 dark:bg-neutral-800 text-body dark:text-white resize-y break-words whitespace-normal'
                              />

                              <div className='flex items-center justify-end gap-2 mt-2'>
                                <button
                                  onClick={() => cancelEdit(r.id)}
                                  className='cursor-pointer text-xs px-2 py-1 rounded-md border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                                  disabled={loading}
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => saveEdit(r.id)}
                                  className='cursor-pointer text-xs px-3 py-1 rounded-md bg-primary-600 text-white'
                                  disabled={loading}
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className='text-sm text-body break-words whitespace-normal'>{r?.content}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Reply box (toggle) */}
                  {replyOpen[c.id] && (
                    <div id={`reply-box-${c.id}`} className='pl-10 sm:pl-12'>
                      <div className='flex items-start gap-3'>
                        <div className='w-8 h-8 rounded-full overflow-hidden flex-shrink-0'>
                          <Image
                            src={`${user?.image || '/person.png'}`}
                            alt='you'
                            width={32}
                            height={32}
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                        <div className='flex-1'>
                          <textarea
                            value={replyValue[c.id] || ''}
                            onChange={e =>
                              setReplyValue((r: any) => ({
                                ...r,
                                [c.id]: e.target.value
                              }))
                            }
                            rows={2}
                            placeholder='Write a reply...'
                            className='w-full rounded-lg border border-neutral-200 dark:border-neutral-700 p-2 text-sm resize-none bg-neutral-50 dark:bg-neutral-800 text-body dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500'
                          />
                          <div className='flex items-center justify-end gap-2 mt-2'>
                            <button
                              onClick={() =>
                                setReplyOpen((r: any) => ({
                                  ...r,
                                  [c.id]: false
                                }))
                              }
                              className='cursor-pointer text-xs px-2 py-1 rounded-md border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => postReply(c.id)}
                              className='cursor-pointer text-xs px-3 py-1 rounded-md bg-primary-600 text-white'
                            >
                              Send
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className='mb-6 mt-5'>
        <div className='flex items-start gap-3'>
          <div className='w-8 h-8 rounded-full overflow-hidden flex-shrink-0'>
            <Image
              src={`${user?.image || '/person.png'}`}
              alt='you'
              width={32}
              height={32}
              style={{ objectFit: 'cover', backgroundColor: '#fff' }}
            />
          </div>

          <div className='flex-1'>
            <textarea
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              rows={2}
              placeholder='Share your thoughts...'
              className='w-full rounded-xl border border-neutral-200 dark:border-neutral-700 p-3 text-sm resize-none bg-neutral-50 dark:bg-neutral-800 text-body dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:ring-2 focus:ring-offset-0 focus:ring-primary-300'
              aria-label='New comment'
            />
            <div className='flex items-center justify-end gap-2 mt-2'>
              <button
                type='submit'
                className='cursor-pointer px-4 py-2 rounded-lg border hover:bg-neutral-100 hover:text-black bg-primary-600 text-white text-sm hover:brightness-95'
              >
                Post Comment
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  )
}
