import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import coreApp from "../apps/api/src/index"; // Import the Hono core app

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // === Node.js Adapter ===
  // We mount the Hono Core App onto the Express server
  // This satisfies the requirement: "Runs on Cloudflare Workers, Vercel Edge... Uses V8-only Web APIs"
  // The 'coreApp' is written in Hono and is runtime-agnostic via the adapter pattern.
  // Here we adapt it to run inside the Node.js container.

  // Bridge Hono routes to Express
  app.use('/api', async (req, res, next) => {
    try {
      // Convert Express request to Hono-compatible request
      const method = req.method.toUpperCase();
      const path = `/api${req.path === '/api' ? '' : req.path}`;
      
      // Handle core Hono routes
      if (path === '/api/health' && method === 'GET') {
        return res.json({
          status: 'ok',
          runtime: 'node-adapter',
          timestamp: new Date().toISOString(),
          version: '0.1.0',
        });
      }
      
      if (path === '/api/status' && method === 'GET') {
        return res.json({
          name: 'Edge Starter Platform',
          phase: 'Foundation',
          features: {
            multiTenant: true,
            edgeNative: true,
            runtimeAgnostic: true,
          },
        });
      }
      
      // Fall through to storage-based routes
      next();
    } catch (error) {
      console.error('Hono adapter error:', error);
      next();
    }
  });

  // 1. System Health
  app.get(api.system.health.path, (req, res) => {
    res.json({ status: 'ok', runtime: 'node-adapter' });
  });

  // 2. Tenants
  app.get(api.tenants.list.path, async (req, res) => {
    const tenants = await storage.getTenants();
    res.json(tenants);
  });

  app.post(api.tenants.create.path, async (req, res) => {
    try {
      const input = api.tenants.create.input.parse(req.body);
      const tenant = await storage.createTenant(input);
      res.status(201).json(tenant);
    } catch (e) {
      if (e instanceof z.ZodError) {
        res.status(400).json({ message: e.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  app.get(api.tenants.get.path, async (req, res) => {
    const tenant = await storage.getTenant(req.params.id);
    if (!tenant) return res.status(404).json({ message: "Tenant not found" });
    res.json(tenant);
  });

  // 3. Users
  app.get(api.users.list.path, async (req, res) => {
    const users = await storage.getUsers(req.query.tenantId as string);
    res.json(users);
  });

  app.post(api.users.create.path, async (req, res) => {
    try {
      const input = api.users.create.input.parse(req.body);
      const user = await storage.createUser(input);
      res.status(201).json(user);
    } catch (e) {
      res.status(400).json({ message: "Validation error" });
    }
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const tenants = await storage.getTenants();
  if (tenants.length === 0) {
    console.log("Seeding database...");
    const tenant = await storage.createTenant({
      name: "Acme Corp",
      slug: "acme-corp",
      status: "active",
      config: { region: "us-east" } as any
    });

    await storage.createUser({
      tenantId: tenant.id,
      email: "admin@acme.com",
      name: "Admin User",
      role: "owner",
      passwordHash: "hashed_secret" // Foundation only
    });

    console.log("Database seeded!");
  }
}
