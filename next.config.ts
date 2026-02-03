import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
        // Enable filesystem caching for `next dev`
        turbopackFileSystemCacheForDev: true,
        // Enable filesystem caching for `next build`
        turbopackFileSystemCacheForBuild: true,
    },

};

export default nextConfig;
