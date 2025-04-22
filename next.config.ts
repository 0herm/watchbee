import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
        NEXT_PUBLIC_VERSION: process.env.npm_package_version,
    },
};

export default nextConfig;
