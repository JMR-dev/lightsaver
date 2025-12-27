import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  async rewrites() {
    const kratosUrl =
      process.env.KRATOS_PUBLIC_URL || "http://localhost:4433";
    return [
      {
        source: "/api/kratos/:path*",
        destination: `${kratosUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
