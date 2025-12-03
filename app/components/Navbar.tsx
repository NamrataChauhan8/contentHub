"use client";
import Image from "next/image";
import React, { useState } from "react";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useUser } from "../providers/UserProvider";
import Link from "next/link";

const Navbar = () => {
  const pathname = usePathname();
  const { user } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const hideSidebar =
    pathname === "/" ||
    pathname === "/signup" ||
    pathname === "/api/auth/signin";

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  async function logout() {
    await signOut({ callbackUrl: "/" });
  }

  return (
    <>
      {!hideSidebar && (
        <>
          <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div className="px-3 py-3 lg:px-5 lg:pl-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-start rtl:justify-end">
                  <a href="localhost:3001" className="flex ms-2 md:me-24">
                    <Image
                      src="/contenthub.png"
                      className="h-8 me-3"
                      alt="Content Hub Logo"
                      width={70}
                      height={100}
                    />
                  </a>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center ms-3 relative">
                    <div>
                      <button
                        type="button"
                        onClick={toggleDropdown}
                        className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                        aria-expanded={isDropdownOpen}
                      >
                        <span className="sr-only">Open user menu</span>
                        <svg
                          className="w-6 h-6 text-gray-800 dark:text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 12 21Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                          />
                        </svg>
                      </button>
                    </div>
                    {isDropdownOpen && (
                      <div
                        className="absolute right-0 top-12 z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-sm shadow-sm dark:bg-gray-700 dark:divide-gray-600"
                        id="dropdown-user"
                      >
                        <div className="px-4 py-3" role="none">
                          <p
                            className="text-sm text-gray-900 dark:text-white"
                            role="none"
                          >
                            {user?.name}
                          </p>
                          <p
                            className="text-sm font-medium text-gray-900 truncate dark:text-gray-300"
                            role="none"
                          >
                            {user?.email}
                          </p>
                        </div>
                        <ul className="py-1" role="none">
                          <li>
                            <a
                              href="/dashboard"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                              role="menuitem"
                            >
                              Dashboard
                            </a>
                          </li>
                          <li>
                            <Link
                              href="/myblogs"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                              role="menuitem"
                            >
                              My Blogs
                            </Link>
                          </li>
                          <li>
                            <a
                              href="/create-blog"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                              role="menuitem"
                            >
                              Create Blog
                            </a>
                          </li>
                          <li>
                            <button
                              onClick={logout}
                              className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                              role="menuitem"
                            >
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
        </>
      )}
    </>
  );
};

export default Navbar;
