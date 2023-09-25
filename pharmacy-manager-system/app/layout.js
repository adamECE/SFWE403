import './globals.css';

export const metadata = {
  title: 'Pharamcy Management System',
  description: 'Fullstack project for SFWE403',
};

export default function RootLayout({children}) {
  return (
    <html lang="en">
      <body>
        {children}

        {/* All page.js pages are displayed in the body within "children" */}
      </body>
    </html>
  );
}
