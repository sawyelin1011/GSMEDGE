import { Hono } from 'hono';
import { z } from 'zod';

// User schema
const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  email: z.string().email(),
  createdAt: z.string().datetime(),
});

const createUserSchema = userSchema.omit({ id: true, createdAt: true });
const updateUserSchema = createUserSchema.partial();

type User = z.infer<typeof userSchema>;

// Mock data (replace with database in production)
let users: User[] = [
  {
    id: crypto.randomUUID(),
    name: 'John Doe',
    email: 'john@example.com',
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Jane Smith',
    email: 'jane@example.com',
    createdAt: new Date().toISOString(),
  },
];

const app = new Hono();

// GET /api/users - List all users
app.get('/', (c) => {
  return c.json({
    users,
    total: users.length,
  });
});

// GET /api/users/:id - Get user by ID
app.get('/:id', (c) => {
  const id = c.req.param('id');
  const user = users.find(u => u.id === id);

  if (!user) {
    return c.json({
      error: 'Not Found',
      message: 'User not found',
    }, 404);
  }

  return c.json(user);
});

// POST /api/users - Create new user
app.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const validated = createUserSchema.parse(body);

    const newUser: User = {
      id: crypto.randomUUID(),
      ...validated,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    return c.json(newUser, 201);
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

// PUT /api/users/:id - Update user
app.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const validated = updateUserSchema.parse(body);

    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      return c.json({
        error: 'Not Found',
        message: 'User not found',
      }, 404);
    }

    const updatedUser = {
      ...users[userIndex],
      ...validated,
    };
    users[userIndex] = updatedUser as typeof users[0];

    return c.json(users[userIndex]);
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

// DELETE /api/users/:id - Delete user
app.delete('/:id', (c) => {
  const id = c.req.param('id');
  const userIndex = users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    return c.json({
      error: 'Not Found',
      message: 'User not found',
    }, 404);
  }

  users.splice(userIndex, 1);

  return c.json({
    message: 'User deleted successfully',
  });
});

export default app;
