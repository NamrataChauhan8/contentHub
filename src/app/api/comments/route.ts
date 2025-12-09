import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    if (!token || !token.sub) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const authorId = String(token.sub)
    const { blogId, content, parentId } = await req.json()

    if (!blogId || !content) {
      return NextResponse.json({ message: 'Blog ID and content are required' }, { status: 400 })
    }

    if (parentId) {
      const parent = await prisma.comment.findUnique({
        where: { id: String(parentId) }
      })

      if (!parent) {
        return NextResponse.json({ message: 'Parent comment not found' }, { status: 404 })
      }

      const reply = await prisma.comment.create({
        data: {
          blogId,
          content,
          authorId,
          parentId: String(parentId)
        }
      })

      return NextResponse.json({ message: 'Reply created successfully', reply, status: 200 }, { status: 201 })
    }

    // Otherwise create a top-level comment
    const comment = await prisma.comment.create({
      data: {
        blogId,
        content,
        authorId
      }
    })

    return NextResponse.json({ message: 'Comment created successfully', comment, status: 200 }, { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    if (!token || !token.sub) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { commentId } = await req.json()

    if (!commentId) {
      return NextResponse.json({ message: 'Comment ID is required', status: 400 }, { status: 400 })
    }

    const existing = await prisma.comment.findUnique({
      where: { id: String(commentId) },
      select: { id: true, parentId: true }
    })

    if (!existing) {
      return NextResponse.json({ message: 'Comment not found', status: 404 }, { status: 404 })
    }

    if (existing.parentId === null) {
      const [deletedRepliesCount, deletedComment] = await prisma.$transaction([
        prisma.comment.deleteMany({ where: { parentId: String(commentId) } }),
        prisma.comment.delete({ where: { id: String(commentId) } })
      ])

      return NextResponse.json(
        {
          message: 'Comment deleted successfully',
          deletedReplies: deletedRepliesCount.count ?? deletedRepliesCount,
          comment: deletedComment,
          status: 200
        },
        { status: 200 }
      )
    } else {
      const deleted = await prisma.comment.delete({
        where: { id: String(commentId) }
      })

      return NextResponse.json(
        {
          message: 'Reply deleted successfully',
          comment: deleted,
          status: 200
        },
        { status: 200 }
      )
    }
  } catch (error) {
    console.error('Error deleting comment:', error)
    return NextResponse.json({ message: 'Internal server error', status: 500 }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    if (!token || !token.sub) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { commentId, content } = await req.json()

    if (!commentId || !content) {
      return NextResponse.json({ message: 'Comment ID and content are required' }, { status: 400 })
    }

    const comment = await prisma.comment.update({
      where: { id: String(commentId) },
      data: { content }
    })

    return NextResponse.json({ message: 'Comment updated successfully', comment, status: 200 }, { status: 200 })
  } catch (error) {
    console.error('Error updating comment:', error)
    return NextResponse.json({ message: 'Internal server error', status: 500 }, { status: 500 })
  }
}
