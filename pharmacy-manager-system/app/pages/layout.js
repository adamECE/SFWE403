"use client";
import "../globals.css";
import { AuthProvider } from '../contexts/authContext'
import { useContext } from 'react';
import { AuthContext } from '../contexts/authContext';
import { AiFillHome } from "react-icons/ai";
import { setCookie, parseCookies } from 'nookies'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";



export default function RonotLayout({ children }) {
  const router = useRouter();
const { signOut } = useContext(AuthContext)

  if (usePathname().endsWith("/pages/dashboards")) {
     router.push ("/pages/");
  }

  const { ['pharmacyauth.token']: token } = parseCookies()


  const handleLogout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('role')
    localStorage.removeItem('isACCountActive');
   signOut()
  };

  const navLinkStyle =
    "inline-block text-sm px-4 py-2  leading-none  rounded text-white border-white hover:border-transparent hover:text-sky-700 hover:bg-blue-200 mt-4 lg:mt-0";
  const logoStyle =
    "font-semibold text-sky-700 text-xl tracking-tight hover:border-transparent hover:text-sky-700";

  return (
    <>
   
       {/* <AuthProvider > */}
     
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
                {/* <h2>{ user.email}</h2> */}
              <Link href="./" className={navLinkStyle}>
                <AiFillHome size={25} />
              </Link>
            </div>
            <div>
              <button className={navLinkStyle} onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </nav>
        {children}
      
        {/* </AuthProvider> */}
      </>
   );
   }