"use client";
import "../globals.css";
import { AiFillHome } from "react-icons/ai";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
export default function RootLayout({ children }) {
  const router = useRouter();

  if (usePathname().endsWith("/pages/dashboards")) {
    router.push("/pages/");
    return null;
  }

  const navLinkStyle =
    "inline-block text-sm px-4 py-2  leading-none  rounded text-white border-white hover:border-transparent hover:text-sky-700 hover:bg-blue-200 mt-4 lg:mt-0";
  const logoStyle =
    "font-semibold text-sky-700 text-xl tracking-tight hover:border-transparent hover:text-sky-700";

  return (
    <html lang="en">
      {/* All page.js pages are displayed in the body within "children" */}
      <body>
        {/* Navbar displayed here */}
        <nav className="flex items-center justify-between flex-wrap p-2 resetNav">
          <div className="flex items-center flex-shrink-0 text-white mr-6">
            <Link href="./" className={logoStyle}>
              PHARMACY-X02
            </Link>
          </div>

          <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
            <div className="text-sm lg:flex-grow"></div>
            <div className="mx-2">
              {" "}
              <Link href="./" className={navLinkStyle}>
                <AiFillHome size={25} />
              </Link>
            </div>
            <div>
              <a href="#" className={navLinkStyle}>
                Logout
              </a>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
