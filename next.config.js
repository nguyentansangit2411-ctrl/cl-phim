/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // phimapi.com image proxy
    remotePatterns: [
      { protocol: 'https', hostname: 'phimimg.com' },
      { protocol: 'https', hostname: 'phimapi.com' },
      { protocol: 'https', hostname: 'img.ophim.live' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
