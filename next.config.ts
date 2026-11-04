import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'belesu.in',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  async redirects() {
    return [
      // ─── 1. Legacy WordPress WooCommerce Book Products ────────────────────
      {
        source: '/product/savi-kannada-english-translated-innovative-guidebook-class-1',
        destination: '/books/savi-kannada-class-1/',
        permanent: true,
      },
      {
        source: '/product/savi-kannada-english-translated-innovative-guidebook-class-2',
        destination: '/books/savi-kannada-class-2/',
        permanent: true,
      },
      {
        source: '/product/savi-kannada-english-translated-innovative-guidebook-class-3',
        destination: '/books/savi-kannada-class-3/',
        permanent: true,
      },
      {
        source: '/product/savi-kannada-english-translated-innovative-guidebook-class-4',
        destination: '/books/savi-kannada-class-4/',
        permanent: true,
      },
      {
        source: '/books/savi-kannada-english-translated-innovative-guidebook-class-1',
        destination: '/books/savi-kannada-class-1/',
        permanent: true,
      },
      {
        source: '/books/savi-kannada-english-translated-innovative-guidebook-class-2',
        destination: '/books/savi-kannada-class-2/',
        permanent: true,
      },
      {
        source: '/books/savi-kannada-english-translated-innovative-guidebook-class-3',
        destination: '/books/savi-kannada-class-3/',
        permanent: true,
      },
      {
        source: '/books/savi-kannada-english-translated-innovative-guidebook-class-4',
        destination: '/books/savi-kannada-class-4/',
        permanent: true,
      },
      {
        source: '/product/:slug',
        destination: '/books/:slug/',
        permanent: true,
      },
      {
        source: '/product',
        destination: '/books/',
        permanent: true,
      },

      // ─── 2. Legacy Shop & Category Listings ───────────────────────────────
      {
        source: '/shop',
        destination: '/books/',
        permanent: true,
      },
      {
        source: '/shop/:path*',
        destination: '/books/',
        permanent: true,
      },
      {
        source: '/products',
        destination: '/books/',
        permanent: true,
      },
      {
        source: '/products/:path*',
        destination: '/books/',
        permanent: true,
      },
      {
        source: '/product-category/:path*',
        destination: '/books/',
        permanent: true,
      },

      // ─── 3. Legacy User Account & Cart ────────────────────────────────────
      {
        source: '/my-account',
        destination: '/profile/',
        permanent: true,
      },
      {
        source: '/my-account/:path*',
        destination: '/profile/',
        permanent: true,
      },

      // ─── 4. Legacy Pages & Content ────────────────────────────────────────
      {
        source: '/about-us',
        destination: '/about/',
        permanent: true,
      },
      {
        source: '/contact-us',
        destination: '/contact/',
        permanent: true,
      },
      {
        source: '/faq',
        destination: '/faqs/',
        permanent: true,
      },
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/videos',
        destination: '/video-gallery/',
        permanent: true,
      },
      {
        source: '/policies/privacy',
        destination: '/privacy-policy/',
        permanent: true,
      },
      {
        source: '/policies/terms',
        destination: '/terms-and-conditions/',
        permanent: true,
      },
      {
        source: '/policies/returns',
        destination: '/returns/',
        permanent: true,
      },
      {
        source: '/policies/shipping',
        destination: '/shipping-policy/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
