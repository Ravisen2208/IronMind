/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const apiUrl =
      process.env.SERVER_API_URL ||
      process.env.NEXT_PUBLIC_SERVER_API_URL ||
      "http://localhost:5000";

    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl.replace(/\/$/, "")}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
