import type { Metadata } from 'next';
import { Outfit, Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { Toaster } from 'react-hot-toast';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Belesu - English Translated Kannada Guidebooks (Classes 1 to 5)',
  description: 'Kannada Mathadi, Kannada Belesi. Belesu offers research-backed, English-translated study guidebooks for Savi, Kali, Siri, and Tili Kannada curricula across primary classes in Karnataka.',
  keywords: [
    'Belesu Kannada',
    'English Translated Kannada Guidebook',
    'Class 4 Savi Kannada',
    'Class 5 Siri Kannada',
    'Class 1 Kali Kannada',
    'Kannada study aid for non Kannadiga parents'
  ],
  authors: [{ name: 'Belesu Academic Publishers' }],
  openGraph: {
    title: 'Belesu - English Translated Kannada Academic Guidebooks',
    description: 'Empowering students & parents across Karnataka to master school Kannada with line-by-line English translations.',
    url: 'https://belesu.in',
    siteName: 'Belesu',
    images: [
      {
        url: 'https://belesu.in/wp-content/uploads/2024/04/Belesu-logo1.png',
        width: 800,
        height: 600,
        alt: 'Belesu Logo'
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Belesu - English Translated Kannada Guidebooks',
    description: 'Master primary school Kannada with clear English translations & solved exercise answers.',
    site: '@kannadabelesu'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <body className="font-sans antialiased bg-stone-50 text-slate-900 selection:bg-amber-200 selection:text-amber-950">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <CartDrawer />
            <WhatsAppButton />
            <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' } }} />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
