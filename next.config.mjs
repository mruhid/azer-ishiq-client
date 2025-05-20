/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
    },
  },
  images: {
    domains: [process.env.NEXT_PUBLIC_IMAGE_HOST],
    remotePatterns: [
      {
        protocol: "http",
        hostname: process.env.NEXT_PUBLIC_IMAGE_HOST,
        port: "5252",
        pathname: "/api/image/**",
      },
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;
