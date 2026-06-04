/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ['192.168.18.17'],
  async rewrites() {
    if (process.env.NEXT_PUBLIC_API_URL) {
      return []
    }

    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:4000/api/:path*',
      },
    ]
  },
}

export default nextConfig
