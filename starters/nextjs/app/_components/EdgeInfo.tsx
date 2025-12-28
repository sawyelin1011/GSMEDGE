// Server Component that detects the runtime environment
export async function EdgeInfo() {
  // Detect runtime environment
  const runtime = detectRuntime();
  const headers = getRequestHeaders();

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold mb-2">Runtime Environment:</h4>
        <p className="font-mono text-lg text-blue-600 dark:text-blue-400">
          {runtime}
        </p>
      </div>

      <div>
        <h4 className="font-semibold mb-2">Request Headers:</h4>
        <div className="bg-white dark:bg-gray-800 p-4 rounded overflow-x-auto">
          <pre className="text-sm">
            {JSON.stringify(headers, null, 2)}
          </pre>
        </div>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400">
        <p>
          This information is detected on the server. Different runtimes may provide
          different headers and environment variables.
        </p>
      </div>
    </div>
  );
}

function detectRuntime(): string {
  // Check for Cloudflare Workers
  if (typeof globalThis.caches !== 'undefined' && 'default' in globalThis.caches) {
    return 'Cloudflare Workers';
  }

  // Check for Vercel Edge
  if (process.env.VERCEL) {
    return 'Vercel Edge Functions';
  }

  // Check for Deno
  if (typeof (globalThis as any).Deno !== 'undefined') {
    return 'Deno Deploy';
  }

  // Check for Node.js
  if (typeof process !== 'undefined' && process.versions?.node) {
    return `Node.js ${process.versions.node}`;
  }

  return 'Unknown Runtime';
}

function getRequestHeaders(): Record<string, string> {
  // In a real app, you'd get these from the request object
  // For now, return some example headers
  return {
    'user-agent': 'Next.js Server Component',
    'x-runtime': detectRuntime(),
    'x-timestamp': new Date().toISOString(),
  };
}
