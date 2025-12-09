import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import Google from 'next-auth/providers/google'

const prisma = new PrismaClient()

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) throw new Error('Missing credentials')

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })
        if (!user || !user.password) throw new Error('Invalid email or password')

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) throw new Error('Invalid email or password')

        return user
      }
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET
})

export { handler as GET, handler as POST }
