'use client'

import Link from 'next/link'
import { ReactNode } from 'react'
import { FaFacebookF, FaInstagram, FaGithub, FaYoutube } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'

export default function Footer() {
  return (
    <footer className='w-full sticky bottom-0'>
      <div className=' bg-gradient-to-r from-[#0b1220] to-[#0b1220] mb-0'>
        <div
          className='
            flex flex-col sm:flex-row
            items-center justify-between
            gap-4
            px-6 py-4
          '
        >
          <p className='text-sm text-gray-400 text-center sm:text-left'>
            © {new Date().getFullYear()} Content Hub, Inc. All rights reserved.
          </p>

          <div className='flex items-center gap-4 text-gray-400'>
            <SocialIcon href='#' icon={<FaFacebookF />} />
            <SocialIcon href='#' icon={<FaInstagram />} />
            <SocialIcon href='#' icon={<FaXTwitter />} />
            <SocialIcon href='#' icon={<FaGithub />} />
            <SocialIcon href='#' icon={<FaYoutube />} />
          </div>
        </div>
      </div>
    </footer>
  )
}

function SocialIcon({ href, icon }: { href: string; icon: ReactNode }) {
  return (
    <Link href={href} className='p-2 rounded-full hover:bg-white/10 hover:text-white transition-colors'>
      {icon}
    </Link>
  )
}
