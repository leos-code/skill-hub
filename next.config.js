/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/skill-hub',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  assetPrefix: '/skill-hub',
}

module.exports = nextConfig
