"use client";
import { usePathname } from "next/navigation";

export default function PageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Same logic as Navbar to determine if navbar should be visible
  const hideNavbar =
    pathname === "/" ||
    pathname === "/signup" ||
    pathname === "/api/auth/signin";

  return <main className={hideNavbar ? "" : "pt-16"}>{children}</main>;
}
