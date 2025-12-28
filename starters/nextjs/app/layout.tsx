import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Next.js Edge Starter',
    template: '%s | Next.js Edge Starter',
  },
  description: 'Next.js 16 starter with OpenNext for edge deployment',
  keywords: ['Next.js', 'React', 'Edge', 'Cloudflare Workers', 'OpenNext'],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Next.js Edge Starter',
    description: 'Next.js 16 starter with OpenNext for edge deployment',
    siteName: 'Next.js Edge Starter',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Next.js Edge Starter',
    description: 'Next.js 16 starter with OpenNext for edge deployment',
    creator: '@yourusername',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <header className="border-b">
          <nav className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <a href="/" className="text-xl font-bold">
                Next.js Edge
              </a>
              <div className="flex gap-4">
                <a href="/" className="hover:underline">Home</a>
                <a href="/blog" className="hover:underline">Blog</a>
                <a href="/about" className="hover:underline">About</a>
              </div>
            </div>
          </nav>
        </header>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="border-t mt-auto">
          <div className="container mx-auto px-4 py-8 text-center text-sm text-gray-600">
            <p>© 2025 Next.js Edge Starter. Built with Next.js 16 + OpenNext.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
