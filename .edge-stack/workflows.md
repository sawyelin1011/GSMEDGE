# Workflows & Templates

## 1. Create New Shared Package
**Command:** `pnpm create-package @edge/[name]`
- **Goal**: Create a reusable library in `packages/`.
- **Steps**:
    1.  Define purpose and exports.
    2.  Generate `package.json`, `tsconfig.json`, `tsup.config.ts`.
    3.  Implement logic in `src/`.
    4.  Add tests in `__tests__/`.
- **Rules**: No Node.js deps, full JSDoc, >80% coverage.

## 2. Create API Route
- **Goal**: Add a new endpoint to `apps/api/src/routes/`.
- **Steps**:
    1.  Define Zod schema in `@edge/validation`.
    2.  Create route handler in `apps/api/src/routes/`.
    3.  Use `zValidator` middleware.
    4.  Implement business logic (calling `@edge/db` or services).
    5.  Add tests.

## 3. Create Database Query
- **Goal**: Add data access logic.
- **Steps**:
    1.  Update schema in `@edge/db/src/schema.ts`.
    2.  Create query functions in `@edge/db/src/queries/`.
    3.  Generate migrations.
    4.  Test with mock DB.

## 4. Migrate to WinterCG
**Source**: Express/Node.js app.
**Target**: Hono Edge app.
- **Steps**:
    1.  **Extract Logic**: Remove `fs`, `path`, `process`.
    2.  **Convert Routes**: Express `req/res` -> Hono `c.req/c.json`.
    3.  **Replace Validation**: Joi/Yup -> Zod.
    4.  **Migrate DB**: TypeORM/Sequelize -> Drizzle.
    5.  **Adapters**: Create platform adapters in `deploy/`.

## 5. Troubleshooting
- **Issue**: "Function fails on Cloudflare but works locally."
- **Check**:
    1.  Are you using `process.env`? (Switch to `c.env`).
    2.  Are you using `fs`? (Not supported).
    3.  Are you using Node.js `crypto`? (Use Web Crypto).
