// import type { OpenNextConfig } from 'open-next/types/open-next';
type OpenNextConfig = any; // Type will be available when open-next is installed

const config: OpenNextConfig = {
  default: {
    // Use Cloudflare Workers adapter
    override: {
      wrapper: 'cloudflare-worker',
      converter: 'edge',
      // Use Cloudflare bindings for caching
      incrementalCache: 'cloudflare-kv',
      tagCache: 'cloudflare-kv',
      queue: 'cloudflare-queue',
    },
  },

  // Middleware configuration
  middleware: {
    external: true,
    override: {
      wrapper: 'cloudflare-worker',
      converter: 'edge',
    },
  },

  // Function configuration
  functions: {
    // ISR function for revalidation
    ssr: {
      runtime: 'edge',
      placement: 'regional',
    },
  },

  // Cloudflare-specific configuration
  cloudflare: {
    // KV namespace for incremental cache
    kvNamespace: 'NEXT_CACHE',
    // KV namespace for tag cache
    tagCacheNamespace: 'NEXT_TAG_CACHE',
    // R2 bucket for large cache items
    r2Bucket: 'NEXT_CACHE_BUCKET',
    // D1 database for revalidation queue
    d1Database: 'NEXT_REVALIDATION_DB',
    // Durable Object for skew protection
    durableObject: 'NEXT_SKEW_PROTECTION',
    // Enable skew protection to prevent version mismatches
    skewProtection: true,
  },

  // Build configuration
  build: {
    // Output directory
    outputDir: '.open-next',
    // Minify output
    minify: true,
    // Source maps for debugging
    sourcemap: process.env.NODE_ENV === 'development',
  },

  // Dangerous options (use with caution)
  dangerous: {
    // Disable incremental cache (not recommended)
    disableIncrementalCache: false,
    // Disable tag cache (not recommended)
    disableTagCache: false,
  },
};

export default config;
