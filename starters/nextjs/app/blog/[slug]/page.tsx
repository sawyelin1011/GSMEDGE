import { notFound } from 'next/navigation';
import { getBlogPost, getBlogPosts } from '@/lib/blog';
import type { Metadata } from 'next';

// Generate static params for all blog posts at build time
export async function generateStaticParams() {
  const posts = await getBlogPosts();
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate metadata for each blog post
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

// This page uses Incremental Static Regeneration (ISR)
// It will be statically generated at build time, then revalidated
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
          <span>By {post.author}</span>
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>
      </div>

      <div className="mb-8 p-4 bg-green-50 dark:bg-green-900 rounded-lg">
        <p className="text-sm">
          <strong>Incremental Static Regeneration (ISR):</strong> This page is
          statically generated at build time and revalidated every 60 seconds.
          After revalidation, the next visitor gets the updated page.
        </p>
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      <div className="mt-12 p-6 border rounded-lg bg-purple-50 dark:bg-purple-900">
        <h3 className="text-xl font-semibold mb-2">About ISR</h3>
        <p className="mb-2">
          Incremental Static Regeneration (ISR) combines the benefits of SSG and SSR:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Pages are statically generated at build time</li>
          <li>Automatically regenerated in the background after revalidation time</li>
          <li>Visitors always get a fast, cached response</li>
          <li>Content stays fresh without rebuilding the entire site</li>
          <li>Perfect for content that updates periodically</li>
        </ul>
        <p className="mt-4 text-sm font-mono">
          This page revalidates every 60 seconds (configured in the page component)
        </p>
      </div>

      <div className="mt-8">
        <a
          href="/blog"
          className="text-blue-600 hover:underline"
        >
          ← Back to all posts
        </a>
      </div>
    </article>
  );
}

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

// Optional: Configure dynamic rendering behavior
export const dynamicParams = true; // Allow dynamic slugs not in generateStaticParams
