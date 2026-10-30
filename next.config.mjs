/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Skip ESLint during production builds – avoids errors like "Invalid Options".
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return [
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
        source: '/universities/:id',
        destination: '/medical-universities-italy/:id',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
