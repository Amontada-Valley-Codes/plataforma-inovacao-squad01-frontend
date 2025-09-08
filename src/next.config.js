/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts']
  },
  images: {
    domains: ['images.unsplash.com'],
  }
};

module.exports = nextConfig;