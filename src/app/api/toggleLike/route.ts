import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const { blogId, userId } = await req.json()

    if (!blogId || !userId) {
      return NextResponse.json({ message: 'Blog ID and User ID are required' }, { status: 400 })
    }

    const blog = await prisma.blog.findUnique({ where: { id: blogId } })
    if (!blog) {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 })
    }

    const isLikedBefore = blog.likedBy.includes(userId)

    let updatedBlog

    if (isLikedBefore) {
      // UNLIKE
      updatedBlog = await prisma.blog.update({
        where: { id: blogId },
        data: {
          likedBy: {
            set: blog.likedBy.filter(id => id !== userId)
          },
          likeCount: { decrement: 1 }
        }
      })
    } else {
      // LIKE
      updatedBlog = await prisma.blog.update({
        where: { id: blogId },
        data: {
          likedBy: { push: userId },
          likeCount: { increment: 1 }
        }
      })
    }

    return NextResponse.json({
      status: 200,
      message: isLikedBefore ? 'Removed from Favourites' : 'Added to Favourites',
      isLiked: !isLikedBefore,
      likeCount: updatedBlog.likeCount,
      likedBy: updatedBlog.likedBy
    })
  } catch (error) {
    console.error('Error toggling like:', error)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
