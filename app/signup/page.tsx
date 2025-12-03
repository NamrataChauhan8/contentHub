// ** Next JS Imports
import { Metadata } from "next/types";
import SignupPage from "../sections/signup/SignupPage";

export const metadata: Metadata = {
  title: `Signup`,
};

const Page = () => <SignupPage />;

export default Page;
