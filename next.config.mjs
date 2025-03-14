/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
    },
  },
  images: {
    domains: [process.env.NEXT_PUBLIC_IMAGE_HOST], // Allow dynamic hostname from .env
    remotePatterns: [
      {
        protocol: "http",
        hostname: process.env.NEXT_PUBLIC_IMAGE_HOST,
        port: "5252",
        pathname: "/api/image/**", // Adjust to match your API path
      },
    ],
  },
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
