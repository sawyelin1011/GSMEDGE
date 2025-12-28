export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">About This Starter</h1>
      
      <div className="prose prose-lg">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Edge-First Fullstack Template</h2>
          <p className="text-gray-700 mb-4">
            This is a production-ready fullstack starter built with modern web standards.
            It runs on multiple edge runtimes without code changes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Tech Stack</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-xl font-semibold text-blue-600 mb-3">Backend</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Hono</strong> - Fast web framework</li>
                <li>• <strong>Zod</strong> - Type-safe validation</li>
                <li>• <strong>Drizzle ORM</strong> - Type-safe database</li>
                <li>• <strong>SQLite</strong> - Local development</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-xl font-semibold text-purple-600 mb-3">Frontend</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>React 18</strong> - UI library</li>
                <li>• <strong>React Router</strong> - Client routing</li>
                <li>• <strong>Vite</strong> - Build tool</li>
                <li>• <strong>Tailwind CSS</strong> - Styling</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Deployment Targets</h2>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-gray-200">
            <p className="text-gray-700 mb-4">
              Deploy to any of these platforms with zero code changes:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl mb-2">☁️</div>
                <div className="font-semibold">Cloudflare Workers</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl mb-2">▲</div>
                <div className="font-semibold">Vercel Edge</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl mb-2">🦕</div>
                <div className="font-semibold">Deno Deploy</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl mb-2">🟢</div>
                <div className="font-semibold">Node.js</div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Features</h2>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Type Safety</strong> - End-to-end TypeScript with Zod validation</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Edge Compatible</strong> - Runs on any edge runtime</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Hot Module Reload</strong> - Fast development with Vite</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>API Routes</strong> - RESTful API with CRUD operations</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Database ORM</strong> - Type-safe queries with Drizzle</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Modern UI</strong> - Responsive design with Tailwind CSS</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Getting Started</h2>
          <div className="bg-gray-900 text-gray-100 p-6 rounded-lg">
            <pre className="text-sm overflow-x-auto">
              <code>{`# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to Cloudflare
npm run deploy:cloudflare

# Deploy to Vercel
npm run deploy:vercel`}</code>
            </pre>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Learn More</h2>
          <div className="space-y-3">
            <a
              href="https://hono.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="font-semibold text-blue-600">Hono Documentation →</div>
              <div className="text-sm text-gray-600">Learn about the web framework</div>
            </a>
            <a
              href="https://react.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="font-semibold text-blue-600">React Documentation →</div>
              <div className="text-sm text-gray-600">Learn about React 18</div>
            </a>
            <a
              href="https://orm.drizzle.team"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="font-semibold text-blue-600">Drizzle ORM →</div>
              <div className="text-sm text-gray-600">Learn about type-safe database queries</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
