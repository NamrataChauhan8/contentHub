// ** Next JS Imports
import MyBlogs from "@/sections/blogs/MyBlogs";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: `My Blogs | Content Hub`,
};

const Page = () => <MyBlogs />;

export default Page;
