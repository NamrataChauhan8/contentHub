"use client";

import Pagination from "@/app/components/Pagination";
import { api } from "@/app/functions/api";
import usePagination from "@/app/hooks/usePagination";
import BlogDescription from "@/app/utils/convert";
import { Blog } from "@prisma/client";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const AllBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchBlogs = async () => {
      try {
        const res: any = await api.get("/api/allBlogs");
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

  const {
    paginated,
    currentPage,
    pageSize,
    setPageSize,
    total,
    totalPages,
    goTo,
    prev,
    next,
  } = usePagination<Blog>(blogs, {
    initialPageSize: 5,
    resetOnItemsChange: true,
  });

  return (
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
      ) : total === 0 ? (
        <p className="text-center text-gray-500">No blogs available</p>
      ) : (
        <>
          {/* Pagination controls */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            setPageSize={setPageSize}
            goTo={goTo}
            prev={prev}
            next={next}
            total={total}
            pageSizeOptions={[5, 10, 25, 50]}
          />

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
            {paginated.map((blog) => (
              <div
                key={blog?.id}
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
                    {blog?.title}
                  </h2>

                  <div
                    className="
                      text-sm text-gray-700 dark:text-gray-300
                      prose prose-sm max-w-none line-clamp-3
                    "
                  >
                    <BlogDescription html={blog?.description || ""} />
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
        </>
      )}
    </section>
  );
};

export default AllBlogs;
