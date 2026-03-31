import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  
  // Image optimization - disabled for static export compatibility
  images: {
    unoptimized: true,
  },
  
  // Enable compression for better performance
  compress: true,
  
  // Production source maps (disable in production for smaller bundles)
  productionBrowserSourceMaps: false,
  
  // Experimental features for performance
  experimental: {
    // Optimize package imports for common libraries
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
    ],
  },
  
  // Headers for caching and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        // Cache static assets - use non-capturing groups
        source: '/((?!api|_next|static).*)\\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Redirects for common paths
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
