import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)

    const title = searchParams.get('title') || undefined
    const category = searchParams.get('category') || undefined
    const userId = searchParams.get('userId') || undefined
    const isLiked = searchParams.get('isLiked') === 'true'

    const filters: any = {
      AND: []
    }

    if (title) {
      filters.AND.push({
        title: { contains: title, mode: 'insensitive' }
      })
    }

    if (category) {
      filters.AND.push({
        category: { contains: category, mode: 'insensitive' }
      })
    }

    if (userId && !isLiked) {
      filters.AND.push({
        userId: userId
      })
    }

    if (userId && isLiked) {
      filters.AND.push({
        likedBy: {
          has: userId
        }
      })
    }

    const blogs = await prisma.blog.findMany({
      where: filters
    })

    return NextResponse.json(
      {
        status: 200,
        message: 'Blogs fetched successfully',
        data: blogs
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching blogs:', error)

    return NextResponse.json(
      {
        status: 500,
        message: 'Internal Server Error'
      },
      { status: 500 }
    )
  }
}
