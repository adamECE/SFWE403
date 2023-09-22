import './globals.css'
import Link from "next/link";

export const metadata = {
  title: 'Pharamcy Management System',
  description: 'Fullstack project for SFWE403',
}

/*
The layout.js page is a page used for general formating of each "page.js". 
This page will be used to setup the navbar that will be displayed on each page. 
*/

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* Navbar displayed here */}
      <head className='navbar-container'>
        <Link href="/" className="navbar-link">
          Home
        </Link>
        <Link href="/login" className="navbar-link">
          Login
        </Link>
        <Link href="/settings" className="navbar-link">
          Settings
        </Link>
      </head>

      {/* All page.js pages are displayed in the body within "children" */}
      <body>
        {children}
      </body>
    </html>
  )
}
