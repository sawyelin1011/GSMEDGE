// Server Component that displays the current server time
export async function ServerTime() {
  // This runs on the server for every request
  const serverTime = new Date().toLocaleString('en-US', {
    timeZone: 'UTC',
    dateStyle: 'full',
    timeStyle: 'long',
  });

  return (
    <div className="space-y-2">
      <p className="font-mono text-lg">{serverTime}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        This timestamp is generated on the server for each request.
      </p>
    </div>
  );
}
