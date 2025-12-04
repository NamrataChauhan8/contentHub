// ** Next JS Imports
import CreateBlog from "@/sections/blogs/CreateBlog";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: `Create Blog | Content Hub`,
};

const Page = () => <CreateBlog />;

export default Page;
