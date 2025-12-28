import app from '../../server';

// Vercel Edge Functions entry point
export default async function handler(request: Request) {
  return app.fetch(request);
}

export const config = {
  runtime: 'edge',
};
