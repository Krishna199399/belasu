import type { Metadata, Viewport } from 'next';
import { Outfit, Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { Toaster } from 'react-hot-toast';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#ffffff',
};

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
  title: 'Kannada Guidebooks for Academic Learning | Belesu',
  description: 'Explore Belesu’s English-translated Kannada academic guidebooks for school students, with lesson explanations, pronunciation support, and exercise guidance.',
  keywords: [
    'Kannada guidebooks',
    'Kannada guidebooks for school students',
    'English-translated Kannada guidebooks',
    'Kannada academic guidebooks',
    'Kannada study books',
    'Kannada learning books',
    'Belesu Kannada',
    'Kannada Mathadi, Kannada Belesi'
  ],
  authors: [{ name: 'Belesu Academic Publishers' }],
  openGraph: {
    title: 'Kannada Guidebooks for Academic Learning | Belesu',
    description: 'Explore Belesu’s English-translated Kannada academic guidebooks for school students, with lesson explanations, pronunciation support, and exercise guidance.',
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
    title: 'Kannada Guidebooks for Academic Learning | Belesu',
    description: 'Explore Belesu’s English-translated Kannada academic guidebooks for school students, with lesson explanations, pronunciation support, and exercise guidance.',
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
