/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static2.finnhub.io',
        pathname: '/file/publicdatany/finnhubimage/stock_logo/**',
      },
    ],
  },
};

module.exports = nextConfig;
