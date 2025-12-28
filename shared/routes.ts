import { z } from 'zod';
import { insertTenantSchema, insertUserSchema, tenants, users } from './schema';

// Edge Starter API Contract
// This file defines the shared API contract used by both the client and server.
// It ensures type safety across the network boundary.

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  system: {
    health: {
      method: 'GET' as const,
      path: '/api/health',
      responses: {
        200: z.object({ status: z.string(), runtime: z.string() }),
      },
    },
  },
  tenants: {
    list: {
      method: 'GET' as const,
      path: '/api/tenants',
      responses: {
        200: z.array(z.custom<typeof tenants.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/tenants',
      input: insertTenantSchema,
      responses: {
        201: z.custom<typeof tenants.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/tenants/:id',
      responses: {
        200: z.custom<typeof tenants.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  users: {
    me: {
      method: 'GET' as const,
      path: '/api/users/me',
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/users',
      input: z.object({ tenantId: z.string().optional() }).optional(),
      responses: {
        200: z.array(z.custom<typeof users.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/users',
      input: insertUserSchema,
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
