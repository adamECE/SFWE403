"use client";

import './globals.css';
import { AuthProvider } from './contexts/authContext'

// export const metadata = {
//   title: 'Pharamcy Management System',
//   description: 'Fullstack project for SFWE403',
// };

export default function RootLayout({children}) {
  return (
    <html>
      <body>
        <AuthProvider >{children}</AuthProvider>
      </body>
    </html>
  )
}
   

