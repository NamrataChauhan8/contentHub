import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const title = searchParams.get('title') || undefined
  const category = searchParams.get('category') || undefined

  const blogs = await prisma.blog.findMany({
    where: {
      AND: [
        title ? { title: { contains: title, mode: 'insensitive' } } : {},
        category ? { category: { contains: category, mode: 'insensitive' } } : {}
      ]
    }
  })

  return NextResponse.json(
    {
      status: 200,
      message: 'Blogs fetched successfully',
      data: blogs
    },
    { status: 200 }
  )
}
