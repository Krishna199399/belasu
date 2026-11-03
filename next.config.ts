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
      {
        source: '/videos',
        destination: '/video-gallery/',
        permanent: true,
      },
      {
        source: '/videos/',
        destination: '/video-gallery/',
        permanent: true,
      },
      {
        source: '/policies/privacy',
        destination: '/privacy-policy/',
        permanent: true,
      },
      {
        source: '/policies/privacy/',
        destination: '/privacy-policy/',
        permanent: true,
      },
      {
        source: '/policies/terms',
        destination: '/terms-and-conditions/',
        permanent: true,
      },
      {
        source: '/policies/terms/',
        destination: '/terms-and-conditions/',
        permanent: true,
      },
      {
        source: '/policies/returns',
        destination: '/returns/',
        permanent: true,
      },
      {
        source: '/policies/returns/',
        destination: '/returns/',
        permanent: true,
      },
      {
        source: '/policies/shipping',
        destination: '/shipping-policy/',
        permanent: true,
      },
      {
        source: '/policies/shipping/',
        destination: '/shipping-policy/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
