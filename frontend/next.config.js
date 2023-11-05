/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: {
      ssr: true,
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
