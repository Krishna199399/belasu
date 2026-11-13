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
      // 2a. Legacy WooCommerce Specific Book Products
      {
        source: '/shop/books/:slug',
        destination: '/books/:slug/',
        permanent: true,
      },
      {
        source: '/shop/kali/:slug',
        destination: '/books/:slug/',
        permanent: true,
      },
      {
        source: '/shop/savi/:slug',
        destination: '/books/:slug/',
        permanent: true,
      },
      {
        source: '/shop/:category/:slug',
        destination: '/books/:slug/',
        permanent: true,
      },

      // 2b. Legacy WooCommerce Product Categories
      {
        source: '/product-category/siri',
        destination: '/books/siri-kannada-english-translated-guidebook-class-5/',
        permanent: true,
      },
      {
        source: '/product-category/tili',
        destination: '/books/tili-kannada-english-translated-innovative-guidebook-class-5/',
        permanent: true,
      },
      {
        source: '/product-category/savi',
        destination: '/books/?series=Savi',
        permanent: true,
      },
      {
        source: '/product-category/kali',
        destination: '/books/?series=Kali',
        permanent: true,
      },
      {
        source: '/product-category/:path*',
        destination: '/books/',
        permanent: true,
      },

      // 2c. Legacy Generic Fallbacks (/shop, /products)
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
