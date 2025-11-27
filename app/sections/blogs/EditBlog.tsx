"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import { api } from "@/app/functions/api";
import RichTextEditor from "@/app/components/RichTextEditor";

const EditBlog = () => {
  const router = useRouter();
  const { id } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({
    title: "",
    description: "",
    image: "",
  });


  const fetchBlogDetails = async () => {
    try {
      const res: any = await api.get(`/api/userBlogDetails/getEditBlogDetails/${id}`);
      if (res.status === 200) {
        setDetails(res.blog);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  useEffect(() => {
    fetchBlogDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(null);
    setImageFile(null);
    setDetails((prev) => ({ ...prev, image: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageUpload = async () => {
    if (!imageFile) return image; // return existing image if unchanged
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", imageFile);
      const response: any = await api.postFormData("/api/upload", formData);
      return response.url;
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error?.message || "Failed to upload image");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!details.title.trim() || !details.description.trim()) {
      toast.error("Title and description are required");
      return;
    }

    try {
      setSubmitting(true);
      const imageUrl = await handleImageUpload();

      await api.put(`/api/blogs/${id}`, {
        title: details.title.trim(),
        description: details.description.trim(),
        image: imageUrl,
      });

      toast.success("Blog updated successfully!");
      router.push(`/myblogs/${id}`);
    } catch (error: any) {
      toast.error(error?.message || "Failed to update blog");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-96 text-gray-500">
        Loading blog details...
      </div>
    );

  return (
    <div>
      <section className="relative w-full h-56 sm:h-64 md:h-72 lg:h-80 overflow-hidden rounded-none sm:rounded-md mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-purple-900" />
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="text-center">
            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
              Edit your Blog
            </h1>
            <p className="mt-3 text-white/90 text-sm sm:text-base max-w-2xl mx-auto">
              Update your blog details below.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <b>Title</b> <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={details.title}
              onChange={(e) =>
                setDetails({ ...details, title: e.target.value })
              }
              placeholder="Enter blog title"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <b>Description</b> <span className="text-red-500">*</span>
            </label>
            <RichTextEditor
              value={details.description}
              onChange={(e) => setDetails({ ...details, description: e })}
              placeholder="Write your blog description here..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <b>Featured Image</b>
            </label>
            <div className="space-y-4">
              {!image && !details.image ? (
                // No image case
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-6 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    id="image"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <label
                    htmlFor="image"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <svg
                      className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Click to upload image
                    </span>
                  </label>
                </div>
              ) : (
                // Show preview of existing or new image
                <div className="relative">
                  <div className="relative w-full h-64 sm:h-96 rounded-md overflow-hidden border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800">
                    <Image
                      src={image || details.image}
                      alt="Preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    title="Remove image"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || uploading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {submitting || uploading ? "Saving..." : "Update Blog"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default EditBlog;
