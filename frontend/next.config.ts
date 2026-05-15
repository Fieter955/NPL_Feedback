import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  async rewrites() {
    const backendBase = process.env.BACKEND_API_URL || "http://127.0.0.1:8000";

    return [
      {
        source: "/api/:path*",
        destination: `${backendBase}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
