import type { NextConfig } from "next";
import { BASE_PATH } from "./src/lib/base";

const nextConfig: NextConfig = {
  // Served at www.convertleads.xyz/dashboard (proxied from the main site)
  basePath: BASE_PATH,
  async redirects() {
    return [{ source: "/", destination: BASE_PATH, basePath: false, permanent: false }];
  },
};

export default nextConfig;
