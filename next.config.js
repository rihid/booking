module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/safari/product/**',
      },
      {
        protocol: 'https',
        hostname: 'backend.callistech.co.id',
        port: '',
        pathname: '/product/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  reactStrictMode: false
}