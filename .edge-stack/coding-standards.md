# Coding Standards

## 🚫 Forbidden
- **Node.js Imports**: `import fs from 'fs'`, `import path from 'path'`, `import process from 'process'`.
- **Direct Env Access**: `process.env.MY_VAR` in `/src/`.
- **Platform-Specific Code**: `if (typeof Deno !== 'undefined')` in `/src/`.
- **Hardcoded Secrets**: Never commit secrets.

## ✅ Required
- **Web APIs**: Use `fetch`, `crypto.subtle`, `URL`, etc.
- **Zod Validation**: All API inputs must be validated with Zod.
- **JSDoc**: All exported functions and types must have JSDoc comments.
- **Types**: Full TypeScript strict mode. No `any`.
- **Tests**: Unit tests for all logic.

## Common Mistakes & Fixes

### 1. Importing Node.js Modules
❌ `import crypto from 'crypto';`
✅ `const hash = await crypto.subtle.digest('SHA-256', data);` (Web Crypto API)

### 2. Using process.env
❌ `const dbUrl = process.env.DATABASE_URL;`
✅ `const dbUrl = c.env.DATABASE_URL;` (Hono Context)

### 3. Missing Validation
❌ `const data = c.req.json();`
✅ `const data = await c.req.valid('json');` (Using Zod Validator)

## Documentation Structure

### JSDoc Example
```typescript
/**
 * Creates a new user in the database.
 * @param email - User email address (must be unique)
 * @param name - User full name
 * @returns The created user object
 * @throws Error if validation fails
 */
export async function createUser(email: string, name: string): Promise<User> { ... }
```

### API Route Documentation
Routes should document:
- HTTP Method & Path
- Request Body Schema
- Response Schema (Success & Error)
- HTTP Status Codes
