// ** Next JS Imports
import { Metadata } from "next/types";
import CreateBlog from "../sections/blogs/CreateBlog";

export const metadata: Metadata = {
  title: `Create Blog | Content Hub`,
};

const Page = () => <CreateBlog />;

export default Page;
