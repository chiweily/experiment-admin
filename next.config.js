/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [{
      source: '/api/:path*',
      destination: 'https://mock.apifox.com/m1/3496755-0-default/api/:path*'
    }]
  }
}

module.exports = nextConfig
