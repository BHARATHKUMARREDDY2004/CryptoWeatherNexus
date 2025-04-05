/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
  eslint: {
    // Don't stop the build on eslint warnings, only fail on errors
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'assets.coingecko.com',
      'via.placeholder.com',
      'newsdata.io',
      'openweathermap.org'
    ],
  },
};

module.exports = nextConfig;
