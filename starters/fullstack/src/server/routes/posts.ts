import { Hono } from 'hono';
import { z } from 'zod';

// Post schema
const postSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  authorId: z.string().uuid(),
  published: z.boolean().default(false),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

const createPostSchema = postSchema.omit({ id: true, createdAt: true, updatedAt: true });
const updatePostSchema = createPostSchema.partial();

type Post = z.infer<typeof postSchema>;

// Mock data (replace with database in production)
let posts: Post[] = [
  {
    id: crypto.randomUUID(),
    title: 'Getting Started with Edge Computing',
    content: 'Edge computing brings your application closer to your users...',
    authorId: crypto.randomUUID(),
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: 'Building APIs with Hono',
    content: 'Hono is a fast, lightweight web framework for edge runtimes...',
    authorId: crypto.randomUUID(),
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const app = new Hono();

// GET /api/posts - List all posts
app.get('/', (c) => {
  const published = c.req.query('published');
  
  let filteredPosts = posts;
  if (published !== undefined) {
    const isPublished = published === 'true';
    filteredPosts = posts.filter(p => p.published === isPublished);
  }

  return c.json({
    posts: filteredPosts,
    total: filteredPosts.length,
  });
});

// GET /api/posts/:id - Get post by ID
app.get('/:id', (c) => {
  const id = c.req.param('id');
  const post = posts.find(p => p.id === id);

  if (!post) {
    return c.json({
      error: 'Not Found',
      message: 'Post not found',
    }, 404);
  }

  return c.json(post);
});

// POST /api/posts - Create new post
app.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const validated = createPostSchema.parse(body);

    const newPost: Post = {
      id: crypto.randomUUID(),
      ...validated,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    posts.push(newPost);

    return c.json(newPost, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({
        error: 'Validation Error',
        details: error.errors,
      }, 400);
    }
    throw error;
  }
});

// PUT /api/posts/:id - Update post
app.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const validated = updatePostSchema.parse(body);

    const postIndex = posts.findIndex(p => p.id === id);

    if (postIndex === -1) {
      return c.json({
        error: 'Not Found',
        message: 'Post not found',
      }, 404);
    }

    const updatedPost = {
      ...posts[postIndex],
      ...validated,
      updatedAt: new Date().toISOString(),
    };
    posts[postIndex] = updatedPost as typeof posts[0];

    return c.json(posts[postIndex]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({
        error: 'Validation Error',
        details: error.errors,
      }, 400);
    }
    throw error;
  }
});

// DELETE /api/posts/:id - Delete post
app.delete('/:id', (c) => {
  const id = c.req.param('id');
  const postIndex = posts.findIndex(p => p.id === id);

  if (postIndex === -1) {
    return c.json({
      error: 'Not Found',
      message: 'Post not found',
    }, 404);
  }

  posts.splice(postIndex, 1);

  return c.json({
    message: 'Post deleted successfully',
  });
});

export default app;
