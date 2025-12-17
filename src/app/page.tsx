import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next/types'
import logo from '../assets/images/contenthub.png'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: `Content Hub`
}

export default function Home() {
  return (
    <div className='flex min-h-screen flex-col overflow-hidden bg-zinc-50 font-sans dark:bg-black'>
      {/* Page content */}
      <div className='flex flex-1 items-center justify-center'>
        <div className='flex w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start'>
          <div className='mb-32'>
            <Image src={logo} alt='Next.js logo' width={150} height={50} priority />
          </div>

          <div className='flex flex-col items-center gap-6 text-center sm:items-start sm:text-left mb-32'>
            <h1 className='max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50'>
              Welcome to Content Hub ....!!!
            </h1>
            <p className='max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400'>
              Create your Blogs with us in a few clicks.
            </p>
          </div>

          <div className='flex flex-col gap-4 text-base font-medium sm:flex-row'>
            <Link
              className='flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]'
              href='/api/auth/signin?callbackUrl=/dashboard'
            >
              <Image className='dark:invert' src='/vercel.svg' alt='Vercel logomark' width={16} height={16} />
              Login
            </Link>

            <Link
              className='flex h-12 w-full items-center justify-center rounded-full border border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]'
              href='/signup'
            >
              Signup
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className='shrink-0'>
        <Footer />
      </footer>
    </div>
  )
}
