/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
    domains: ["avatars.githubusercontent.com", "images.unsplash.com"],
    formats: ['image/webp'],
  },
  output: "export",
  distDir: "dist",
}

module.exports = nextConfig;
