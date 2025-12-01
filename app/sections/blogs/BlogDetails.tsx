"use client";

import { api } from "@/app/functions/api";
import { useUser } from "@/app/providers/UserProvider";
import BlogDescription from "@/app/utils/convert";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { toast } from "react-toastify";

const BlogDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useUser();

  const [details, setDetails] = useState({
    title: "",
    description: "",
    image: null,
    userId: "",
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchBlogDetails = async () => {
    try {
      const res: any = await api.get(`/api/userBlogDetails/${id}`);
      if (res.status === 200) {
        setDetails(res.blog);
      } else {
        toast.error(res.message || "Failed to fetch blog details");
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  useEffect(() => {
    fetchBlogDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteBlog = async () => {
    setLoading(true);
    try {
      const res: any = await api.delete(`/api/blogs/${id}`);
      if (res.status === 200) {
        toast.success(res.message);
        router.push("/myblogs");
      }
    } catch (error) {
      toast.error("Failed to delete blog");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  const isAuthor = user?.id === details?.userId;
  return (
    <main className="min-h-screen relative">
      {/* HEADER SECTION */}
      <section className="relative w-full h-56 sm:h-64 md:h-72 lg:h-80 overflow-hidden rounded-none sm:rounded-md mb-10">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1e8a56] to-[#1e3a8a]/30" />
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="text-center">
            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
              {details?.title}
            </h1>
          </div>
        </div>
        {isAuthor && (
          <>
            <button
              onClick={() => router.push(`/myblogs/${id}/edit`)}
              className="absolute bottom-4 right-20 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-md transition-colors shadow-md"
              title="Edit Blog"
            >
              <MdEdit className="w-5 h-5" />
            </button>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="absolute bottom-4 right-4 bg-red-500 hover:bg-red-600 text-white p-3 rounded-full backdrop-blur-md transition-colors shadow-md"
              title="Delete Blog"
            >
              <MdDelete className="w-5 h-5" />
            </button>
          </>
        )}
      </section>

      {/* IMAGE SECTION */}
      <section className="mx-auto px-4">
        {details?.image && (
          <div className="w-full mb-8 flex justify-center overflow-hidden">
            <div className="relative w-full h-[400px]">
              <Image
                src={details.image}
                alt={details.title || "Blog Image"}
                fill
                className="object-contain rounded-xl"
              />
            </div>
          </div>
        )}

        <div className="mb-4 text-gray-700 dark:text-gray-400 prose dark:prose-invert max-w-none">
          <BlogDescription html={details?.description} />
        </div>
      </section>

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-[90%] sm:w-[400px]">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Delete Blog
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete this blog? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteBlog}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition disabled:opacity-60"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default BlogDetails;
