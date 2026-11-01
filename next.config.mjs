/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Skip ESLint during production builds – avoids errors like "Invalid Options".
    ignoreDuringBuilds: true,
  },
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 2592000,
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
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|ico|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
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
