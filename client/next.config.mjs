/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    let apiUrl =
      process.env.SERVER_API_URL ||
      process.env.NEXT_PUBLIC_SERVER_API_URL ||
      "http://localhost:5000";

    apiUrl = apiUrl.trim();

    // Ensure apiUrl always has a valid protocol prefix
    if (
      !apiUrl.startsWith("http://") &&
      !apiUrl.startsWith("https://") &&
      !apiUrl.startsWith("/")
    ) {
      if (apiUrl.includes(".onrender.com") || apiUrl.includes(".")) {
        apiUrl = `https://${apiUrl}`;
      } else {
        // Internal service name or hostname
        apiUrl = `http://${apiUrl}:5000`;
      }
    }

    const cleanApiUrl = apiUrl.replace(/\/$/, "");

    return [
      {
        source: "/api/:path*",
        destination: `${cleanApiUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;

