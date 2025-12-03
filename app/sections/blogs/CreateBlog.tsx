"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import RichTextEditor from "../../components/RichTextEditor";
import { api } from "../../functions/api";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const CreateBlog = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return null;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", imageFile);

      const response = await api.postFormData<{
        url: string;
        public_id: string;
      }>("/api/upload", formData);

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

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }

    try {
      setSubmitting(true);
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await handleImageUpload();
        if (!imageUrl) {
          toast.error("Failed to upload image");
          setSubmitting(false);
          return;
        }
      }

      await api.post("/api/blogs", {
        title: title.trim(),
        category,
        description: description.trim(),
        image: imageUrl,
      });

      router.push("/myblogs");
    } catch (error: any) {
      toast.error(error?.message || "Failed to create blog");
      setSubmitting(false);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="">
      <section className="relative w-full h-56 sm:h-64 md:h-72 lg:h-80 overflow-hidden rounded-none sm:rounded-md mb-8">
        <div className="absolute inset-0 bg-linear-to-r from-gray-900 to-purple-900" />
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="text-center">
            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
              Create your own Blog
            </h1>
            <p className="mt-3 text-white/90 text-sm sm:text-base max-w-2xl mx-auto">
              Create your own blog with us in a few clicks. Fill the form below
              to create your blog.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <b>Title</b> <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog title"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              required
            />
          </div>
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <b>Category</b> <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              <option value="Technology">Technology</option>
              <option value="Health">Health</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Finance">Finance</option>
              <option value="Travel">Travel</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <b>Description</b> <span className="text-red-500">*</span>
            </label>
            <RichTextEditor
              value={description}
              onChange={setDescription}
              placeholder="Write your blog description here..."
            />
          </div>

          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <b>Featured Image</b>
            </label>
            <div className="space-y-4">
              {!image ? (
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
                    <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      PNG, JPG, GIF up to 5MB
                    </span>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <div className="relative w-full h-64 sm:h-96 rounded-md overflow-hidden border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800">
                    <Image
                      src={image}
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

          {/* Error Message */}

          {/* Submit Button */}
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
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {submitting || uploading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
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
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {uploading ? "Uploading..." : "Creating..."}
                </>
              ) : (
                "Create Blog"
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default CreateBlog;
