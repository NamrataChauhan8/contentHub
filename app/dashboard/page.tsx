// ** Next JS Imports
import { Metadata } from "next/types";
import Dashboard from "../sections/dashboard/Dashboard";

export const metadata: Metadata = {
  title: `Dashboard | Content Hub`,
};

const Page = () => <Dashboard />;

export default Page;
