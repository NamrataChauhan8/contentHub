import { PrismaClient } from '@prisma/client'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    if (!token || !token.sub) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const id = req.nextUrl.pathname.split('/').pop()

    const comments = await prisma.comment.findMany({
      where: { blogId: id },
      orderBy: { createdAt: 'desc' },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    })

    return NextResponse.json({ comments, status: 200 })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json({ message: 'Internal server error', comments: [], status: 500 }, { status: 500 })
  }
}
