/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ['images.start.gg'], // Add any other allowed domains here if needed
  },
}

module.exports = nextConfig
