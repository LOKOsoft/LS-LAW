import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";
import { buildContentSecurityPolicy, SECURITY_HEADERS } from "./src/lib/platform/security/headers";

const isProduction = process.env.NODE_ENV === "production";

const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === "true" });

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          ...SECURITY_HEADERS,
          { key: "Content-Security-Policy", value: buildContentSecurityPolicy(isProduction) },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
