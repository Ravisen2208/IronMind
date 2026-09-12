/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    let apiUrl =
      process.env.SERVER_API_URL ||
      process.env.NEXT_PUBLIC_SERVER_API_URL ||
      "http://localhost:5000";

    apiUrl = apiUrl.trim();

    // Map internal Render service name to public HTTPS domain, or localhost for local dev
    if (apiUrl.includes("localhost") || apiUrl.includes("127.0.0.1")) {
      apiUrl = "http://localhost:5000";
    } else if (apiUrl === "ironmind-server" || apiUrl === "http://ironmind-server:5000") {
      apiUrl = "https://ironmind-server.onrender.com";
    } else if (
      !apiUrl.startsWith("http://") &&
      !apiUrl.startsWith("https://") &&
      !apiUrl.startsWith("/")
    ) {
      if (apiUrl.includes(".onrender.com")) {
        apiUrl = `https://${apiUrl}`;
      } else {
        apiUrl = `https://${apiUrl}.onrender.com`;
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


