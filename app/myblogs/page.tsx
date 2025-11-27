// ** Next JS Imports
import { Metadata } from "next/types";
import MyBlogs from "../sections/blogs/MyBlogs";

export const metadata: Metadata = {
  title: `My Blogs | Content Hub`,
};

const Page = () => <MyBlogs />;

export default Page;
