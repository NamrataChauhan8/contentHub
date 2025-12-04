import BlogDetails from "@/sections/blogs/BlogDetails";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: `Details | Content Hub`,
};

const Page = () => <BlogDetails />;

export default Page;