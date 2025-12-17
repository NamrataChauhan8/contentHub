'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { useUser } from '../providers/UserProvider'
import Link from 'next/link'
import { PiUserCircleFill } from 'react-icons/pi'
import logo from '../assets/images/contenthub.png'
import { FiLogOut } from 'react-icons/fi'

const Navbar = () => {
  const pathname = usePathname()
  const { user } = useUser()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const hideSidebar = pathname === '/' || pathname === '/signup' || pathname === '/api/auth/signin'

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  async function logout() {
    setLoading(true)
    await signOut({ callbackUrl: '/' })
    setLoading(false)
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement

      if (isDropdownOpen && !target.closest('.user-dropdown-btn') && !target.closest('.user-dropdown-menu')) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isDropdownOpen])

  return (
    <>
      {!hideSidebar && (
        <>
          <nav className='fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700'>
            <div className='px-3 py-3 lg:px-5 lg:pl-3'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center justify-start rtl:justify-end'>
                  <Link href='/' className='flex ms-2 md:me-24'>
                    <Image src={logo} className='h-8 me-3' alt='Content Hub Logo' width={70} height={100} />
                  </Link>
                </div>
                <div className='flex items-center'>
                  <div className='flex items-center ms-3 relative'>
                    <div>
                      <button
                        type='button'
                        onClick={toggleDropdown}
                        className='user-dropdown-btn flex text-sm bg-gray-800 rounded-full'
                        aria-expanded={isDropdownOpen}
                      >
                        <span className='sr-only'>Open user menu</span>
                        {user?.image ? (
                          <Image
                            className='w-8 h-8 rounded-full'
                            src={user?.image}
                            alt='user'
                            width={100}
                            height={100}
                          />
                        ) : (
                          <PiUserCircleFill className='w-8 h-8' />
                        )}
                      </button>
                    </div>
                    {isDropdownOpen && (
                      <div
                        className='user-dropdown-menu absolute right-0 top-12 z-50 my-4 text-base bg-white dark:bg-gray-700 rounded-sm shadow-sm'
                        id='dropdown-user'
                      >
                        <div className='px-4 py-3' role='none'>
                          <p className='text-sm text-gray-900 dark:text-white' role='none'>
                            {user?.name}
                          </p>
                          <p className='text-sm font-medium text-gray-900 truncate dark:text-gray-300' role='none'>
                            {user?.email}
                          </p>
                        </div>
                        <ul className='py-1' role='none'>
                          <li>
                            <Link
                              href='/dashboard'
                              className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white'
                              role='menuitem'
                            >
                              Dashboard
                            </Link>
                          </li>
                          <li>
                            <Link
                              href='/myblogs'
                              className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white'
                              role='menuitem'
                            >
                              My Blogs
                            </Link>
                          </li>
                          <li>
                            <Link
                              href='/favourite-blogs'
                              className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white'
                              role='menuitem'
                            >
                              Favourite Blogs
                            </Link>
                          </li>
                          <li>
                            <Link
                              href='/create-blog'
                              className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white'
                              role='menuitem'
                            >
                              Create Blog
                            </Link>
                          </li>
                          <li>
                            <button
                              onClick={() => setShowModal(true)}
                              className='w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white'
                              role='menuitem'
                            >
                              <FiLogOut className='inline me-2' />
                              Logout
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {showModal && (
            <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
              <div className='bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-[90%] sm:w-[400px]'>
                <h2 className='text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4'>Logout</h2>
                <p className='text-gray-600 dark:text-gray-300 mb-6'>Are you sure you want to logout?</p>
                <div className='flex justify-end gap-3'>
                  <button
                    onClick={() => setShowModal(false)}
                    className='px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition'
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={logout}
                    className='px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition disabled:opacity-60'
                    disabled={loading}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}

export default Navbar
