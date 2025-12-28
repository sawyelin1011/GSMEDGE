import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Turbopack configuration (Next.js 16+)
  turbopack: {},

  // Enable experimental features for edge runtime
  experimental: {
    // Enable React Server Components (default in App Router)
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // Output configuration for different deployment targets
  // For Cloudflare: handled by OpenNext
  // For Vercel: automatic
  // For Node.js: standalone
  output: process.env.BUILD_TARGET === 'node' ? 'standalone' : undefined,

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // For Cloudflare: use custom loader or external service
    loader: process.env.BUILD_TARGET === 'cloudflare' ? 'custom' : 'default',
    loaderFile: process.env.BUILD_TARGET === 'cloudflare' ? './image-loader.ts' : undefined,
  },

  // Headers for security and caching
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/old-blog/:slug',
        destination: '/blog/:slug',
        permanent: true,
      },
    ];
  },

  // Rewrites for API proxy (if using separate Hono API)
  async rewrites() {
    return [
      {
        source: '/hono-api/:path*',
        destination: process.env.HONO_API_URL || 'http://localhost:3001/:path*',
      },
    ];
  },

  // Webpack configuration for edge compatibility
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ensure edge-compatible modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },

  // TypeScript configuration
  typescript: {
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: false,
  },

  // ESLint configuration (removed in Next.js 16)
  // eslint: {
  //   ignoreDuringBuilds: false,
  // },
};

export default nextConfig;
