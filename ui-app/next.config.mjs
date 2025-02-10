/** @type {import('next').NextConfig} */
const allowedOrigins = process.env.BACKEND_ORIGIN?.split(",");

const nextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      allowedOrigins: allowedOrigins,
    },
  },
};

export default nextConfig;
