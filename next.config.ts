import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/api/itunes/lookup",
        destination: "https://itunes.apple.com/lookup",
      },
    ];
  },
  images: {
    remotePatterns: [
      new URL("https://audio-ssl.itunes.apple.com/**"),
      new URL("https://is1-ssl.mzstatic.com/**"),
    ],
  },
};

export default nextConfig;
