import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === CORE MONOREPO SCHEMA (Foundation) ===

// Helper for UUIDs in SQLite
const uuid = (name: string) => text(name).$defaultFn(() => crypto.randomUUID());
// Helper for Timestamps in SQLite  
const timestamp = (name: string) => text(name).$defaultFn(() => new Date().toISOString());

// Tenants (Multi-tenancy root)
export const tenants = sqliteTable("tenants", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  status: text("status").notNull().default("active"), // active, suspended
  config: text("config", { mode: "json" }).$type<Record<string, any>>().default({}),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

// Users (Role-aware)
export const users = sqliteTable("users", {
  id: uuid("id").primaryKey(),
  tenantId: text("tenant_id").references(() => tenants.id),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(), // Foundation only, will use Auth provider later
  name: text("name"),
  role: text("role").notNull().default("member"), // owner, admin, member, readonly
  createdAt: timestamp("created_at"),
});

// API Keys (Machine access)
export const apiKeys = sqliteTable("api_keys", {
  id: uuid("id").primaryKey(),
  tenantId: text("tenant_id").references(() => tenants.id),
  name: text("name").notNull(),
  keyPrefix: text("key_prefix").notNull(),
  keyHash: text("key_hash").notNull(),
  scopes: text("scopes", { mode: "json" }).$type<string[]>().default([]),
  lastUsedAt: text("last_used_at"),
  createdAt: timestamp("created_at"),
});

// Audit Logs (Security requirement)
export const auditLogs = sqliteTable("audit_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  tenantId: text("tenant_id").references(() => tenants.id),
  actorId: text("actor_id"), // User or API Key ID
  action: text("action").notNull(),
  resource: text("resource").notNull(),
  metadata: text("metadata", { mode: "json" }),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at"),
});

// Relations
export const usersRelations = relations(users, ({ one }) => ({
  tenant: one(tenants, {
    fields: [users.tenantId],
    references: [tenants.id],
  }),
}));

export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
  tenant: one(tenants, {
    fields: [apiKeys.tenantId],
    references: [tenants.id],
  }),
}));

// Schemas
export const insertTenantSchema = createInsertSchema(tenants).omit({ id: true, createdAt: true, updatedAt: true });
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertApiKeySchema = createInsertSchema(apiKeys).omit({ id: true, lastUsedAt: true, createdAt: true });

// Types
export type Tenant = typeof tenants.$inferSelect;
export type InsertTenant = z.infer<typeof insertTenantSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type ApiKey = typeof apiKeys.$inferSelect;
export type InsertApiKey = z.infer<typeof insertApiKeySchema>;
