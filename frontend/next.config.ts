import type { NextConfig } from "next";
import { SECURITY_HEADERS } from "./shared/security/headers";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [...SECURITY_HEADERS]
      }
    ];
  }
};

export default nextConfig;
