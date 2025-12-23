import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    if (!token || !token.sub) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true, image: true }
        }
      }
    })

    return NextResponse.json({ blogs, status: 200 })
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
