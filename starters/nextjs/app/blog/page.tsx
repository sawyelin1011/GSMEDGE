import Link from 'next/link';
import { getBlogPosts } from '@/lib/blog';

// This page uses Static Site Generation (SSG)
// It will be pre-rendered at build time
export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      
      <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
        <p className="text-sm">
          <strong>Static Site Generation (SSG):</strong> This page is pre-rendered at build time.
          The list of blog posts is generated once during the build process.
        </p>
      </div>

      <div className="grid gap-6">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="p-6 border rounded-lg hover:shadow-lg transition"
          >
            <Link href={`/blog/${post.slug}`}>
              <h2 className="text-2xl font-semibold mb-2 hover:text-blue-600">
                {post.title}
              </h2>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {post.excerpt}
            </p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{post.author}</span>
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8 p-6 border rounded-lg bg-blue-50 dark:bg-blue-900">
        <h3 className="text-xl font-semibold mb-2">About SSG</h3>
        <p className="mb-2">
          Static Site Generation (SSG) pre-renders pages at build time. This means:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Pages are generated once during build</li>
          <li>Served as static HTML (super fast!)</li>
          <li>Perfect for content that doesn't change often</li>
          <li>Can be cached on CDN for global distribution</li>
        </ul>
      </div>
    </div>
  );
}

// Optional: Configure page metadata
export const metadata = {
  title: 'Blog',
  description: 'Read our latest blog posts',
};

// Optional: Revalidate every hour (ISR)
export const revalidate = 3600;
