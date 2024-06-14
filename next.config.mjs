/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "35.236.145.210",
        // port: "3005"
      },
      {
        protocol: "http",
        hostname: "localhost",
        // port: "3005"
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
