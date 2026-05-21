import './globals.css';
import MainLayout from '@/components/layout/MainLayout';
import { Playfair_Display, Montserrat } from 'next/font/google';

const serif = Playfair_Display({ subsets: ['latin', 'vietnamese'], variable: '--font-serif' });
const sans = Montserrat({ subsets: ['latin', 'vietnamese'], variable: '--font-sans' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${serif.variable} ${sans.variable}`}>
      <head>
        <meta charSet="UTF-8"></meta>
        <link rel="icon" href="assets/nailsxanh_vector.svg" type="image/svg+xml"></link>
      </head>
      <body>
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  );
}