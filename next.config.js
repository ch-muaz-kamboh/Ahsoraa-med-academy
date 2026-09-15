/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Skip ESLint during production builds – avoids errors like "Invalid Options".
    ignoreDuringBuilds: true,
  },
  // You can add other Next.js config options here if needed.
};

module.exports = nextConfig;
