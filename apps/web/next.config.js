/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  images: {
    domains: ['localhost'],
  },
  transpilePackages: ['@allerscan/shared'],
};

module.exports = nextConfig;