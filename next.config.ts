import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
            }
        ]
    },
    experimental: {
        turbopackFileSystemCacheForDev: true,
        turbopackFileSystemCacheForBuild: true,
    },
};

export default nextConfig;

