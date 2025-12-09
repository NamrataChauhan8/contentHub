import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../prisma/client'

export async function GET(req: NextRequest) {
  // return withAuth(req, async ({ userId }) => {
  //   const id = req.nextUrl.pathname.split("/").pop();

  //   const blog = await prisma.blog.findUnique({
  //     where: { id },
  //   });

  //   if (!blog) {
  //     return NextResponse.json({ message: "Blog not found" }, { status: 404 });
  //   }

  //   if (blog.userId !== userId) {
  //     return NextResponse.json(
  //       { message: "Forbidden: You cannot access this blog" },
  //       { status: 403 }
  //     );
  //   }

  //   return NextResponse.json({ blog, status: 200 });
  // });

  // Temporary: Allow access without authorization

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token || !token.sub) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
  const id = req.nextUrl.pathname.split('/').pop()

  const blog = await prisma.blog.findUnique({
    where: { id }
  })

  if (!blog) {
    return NextResponse.json({ message: 'Blog not found' }, { status: 404 })
  }

  return NextResponse.json({ blog, status: 200 })
}
