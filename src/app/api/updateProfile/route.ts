import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { prisma } from '../../../../prisma/client'
import { authOptions } from '../auth/[...nextauth]/route' // Import your authOptions

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions) // Pass authOptions
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { name, image } = await req.json()

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        image
      }
    })

    // Return updated user data
    return NextResponse.json(
      {
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          image: updatedUser.image
        },
        message: 'Profile updated successfully',
        status: 200
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
