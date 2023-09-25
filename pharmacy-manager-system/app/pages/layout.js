import '../globals.css';

import Link from 'next/link';

export const metadata = {
  title: 'Pharamcy Management System',
  description: 'Fullstack project for SFWE403',
};

/*
The layout.js page is a page used for general formating of each "page.js". 
This page will be used to setup the navbar that will be displayed on each page. 
*/

export default function RootLayout({children}) {
  return (
    <html lang="en">
      {/* Navbar displayed here */}

      {/* All page.js pages are displayed in the body within "children" */}
      <body>
        <header className="navbar-container">
          <Link href="../" className="navbar-link">
            Home
          </Link>

          <Link href="./settings" className="navbar-link">
            Settings
          </Link>
        </header>
        {children}
      </body>
    </html>
  );
}
