"use client";

import React, { useEffect, useState } from "react";

import { api } from "@/app/functions/api";
import { toast } from "react-toastify";
import BlogDescription from "@/app/utils/convert";

interface Blog {
  id: string;
  title: string;
  description: string; // contains HTML
}

const MyBlogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchBlogs = async () => {
      try {
        const res: any = await api.get("/api/blogs");
        if (!isMounted) return;

        if (res?.status === 200) {
          setBlogs(Array.isArray(res.blogs) ? res.blogs : []);
        } else {
          toast.error("Failed to fetch blog data");
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
        toast.error("Something went wrong while fetching blogs");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBlogs();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header / Banner */}
      <section className="w-full">
        <div className="relative rounded-none sm:rounded-md overflow-hidden bg-gradient-to-r from-[#1e3a8a] to-[#1e3a8a]/30 h-48 sm:h-56 md:h-64 lg:h-72 flex items-center">
          <div className="w-full px-4 sm:px-8">
            <div className="text-center">
              <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
                My Blogs
              </h1>
              <p className="mt-2 sm:mt-3 text-white/90 text-xs sm:text-sm md:text-base max-w-3xl mx-auto">
                Create, organize, and publish your blogs with a seamless
                workflow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Listing */}
      <section className="max-w-6xl mx-auto px-3 sm:px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <svg
              className="animate-spin h-8 w-8 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
          </div>
        ) : blogs.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-12">
            No blogs available
          </p>
        ) : (
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              gap-4
              sm:gap-6
            "
          >
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="
                  flex flex-col justify-between
                  p-4 sm:p-5
                  bg-white dark:bg-gray-800
                  border border-gray-200 dark:border-gray-700
                  rounded-lg shadow-sm
                  hover:shadow-md transition-shadow
                  min-h-[180px]
                "
              >
                <div className="mb-3">
                  <h2
                    className="
                      text-base xs:text-lg sm:text-lg md:text-xl
                      font-semibold tracking-tight
                      text-gray-900 dark:text-white
                      mb-2 line-clamp-2
                    "
                  >
                    {blog.title}
                  </h2>

                  <div
                    className="
                      text-sm text-gray-700 dark:text-gray-300
                      prose prose-sm max-w-none line-clamp-3
                    "
                  >
                    <BlogDescription html={blog.description || ""} />
                  </div>
                </div>

                <a
                  href={`/myblogs/${blog.id}`}
                  className="
                    inline-flex items-center text-sm font-medium
                    text-blue-700 hover:text-blue-800
                    dark:text-blue-400 dark:hover:text-blue-300
                  "
                >
                  Read more
                  <svg
                    className="w-3.5 h-3.5 ms-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 5h12m0 0L9 1m4 4L9 9"
                    />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default MyBlogs;
