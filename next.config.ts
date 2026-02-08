import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    typescript:{
        ignoreBuildErrors: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
            }
        ]
    },
    cacheComponents: true,
    experimental: {
        // Enable filesystem caching for `next dev`
        turbopackFileSystemCacheForDev: true,
        // Enable filesystem caching for `next build`
        turbopackFileSystemCacheForBuild: true,

    },

};

export default nextConfig;
