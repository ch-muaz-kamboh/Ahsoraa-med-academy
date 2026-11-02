/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Skip ESLint during production builds – avoids errors like "Invalid Options".
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  compress: true,
  poweredByHeader: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@supabase/supabase-js'],
  },
  images: {
    formats: ['image/webp'],
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*.(svg|jpg|jpeg|png|webp|avif|ico|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/free-mock',
        destination: '/free-imat-mock-test',
        permanent: true,
      },
      {
        source: '/imat',
        destination: '/imat-exam-guide',
        permanent: true,
      },
      {
        source: '/resources',
        destination: '/imat-past-papers-and-resources',
        permanent: true,
      },
      {
        source: '/courses',
        destination: '/imat-preparation-courses',
        permanent: true,
      },
      {
        source: '/universities',
        destination: '/medical-universities-italy',
        permanent: true,
      },
      {
        source: '/universities/scholarships',
        destination: '/medical-universities-italy/scholarships',
        permanent: true,
      },
      {
        source: '/scholarships',
        destination: '/medical-universities-italy/scholarships',
        permanent: true,
      },
      {
        source: '/universities/:id',
        destination: '/medical-universities-italy/:id',
        permanent: true,
      },
      {
        source: '/news',
        destination: '/imat-news-and-updates',
        permanent: true,
      },
      {
        source: '/news/:slug',
        destination: '/imat-news-and-updates/:slug',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
