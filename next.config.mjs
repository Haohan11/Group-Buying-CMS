/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "34.80.78.173",
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
