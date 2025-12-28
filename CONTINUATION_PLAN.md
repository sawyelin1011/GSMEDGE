# Edge Starter Kit - Continuation Plan

## Current Status: CLI Complete ✅

The CLI tool is fully implemented and built. Now we need to create the starter templates and complete the ecosystem.

---

## Phase 1: Create Starter Templates 🎯 IMMEDIATE PRIORITY

### 1.1 Fullstack Template (`starters/fullstack/`)

**Purpose**: Complete application with Hono API + React client

**Structure**:
```
starters/fullstack/
├── package.json                 # All adapter scripts + dependencies
├── tsconfig.json               # TypeScript configuration
├── README.md                    # Setup guide with adapter switching
├── .cursorrules.starter        # AI agent rules for fullstack
├── .edge-config.json           # Template metadata
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
├── drizzle.config.ts           # Database configuration
├── vite.config.ts              # Vite configuration
├── index.html                  # HTML entry point
├── src/
│   ├── client/                 # React frontend
│   │   ├── main.tsx           # Client entry point
│   │   ├── App.tsx            # Main app component
│   │   ├── components/        # React components
│   │   └── lib/               # Client utilities
│   ├── server/                 # Hono backend
│   │   ├── index.ts           # Server entry point
│   │   ├── routes/            # API routes
│   │   └── middleware/        # Server middleware
│   └── adapters/              # Runtime adapters
│       ├── cloudflare/        # Cloudflare Workers adapter
│       ├── deno/              # Deno Deploy adapter
│       ├── vercel/            # Vercel Edge adapter
│       └── node/              # Node.js adapter
├── shared/                     # Shared types and contracts
│   ├── schema.ts              # Database schema
│   └── routes.ts              # API contracts
└── adapters/                   # Adapter-specific configs
    ├── cloudflare/
    │   └── wrangler.toml
    ├── deno/
    │   └── deno.json
    ├── vercel/
    │   └── vercel.json
    └── node/
        └── ecosystem.config.js  # PM2 config
```

**Key Files to Create**:

1. **package.json**
```json
{
  "name": "my-edge-app",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:cloudflare": "vite build && wrangler deploy --dry-run",
    "build:deno": "echo 'Deno uses direct deployment'",
    "build:vercel": "vercel build",
    "build:node": "vite build && tsup src/adapters/node/server.ts",
    "deploy:cloudflare": "wrangler deploy",
    "deploy:deno": "deployctl deploy --project=my-app src/adapters/deno/server.ts",
    "deploy:vercel": "vercel deploy --prod",
    "deploy:node": "pm2 start ecosystem.config.js",
    "db:generate": "drizzle-kit generate:sqlite",
    "db:migrate": "drizzle-kit push:sqlite",
    "db:studio": "drizzle-kit studio"
  },
  "dependencies": {
    "@edge/core": "workspace:*",
    "@edge/adapters": "workspace:*",
    "@edge/api": "workspace:*",
    "hono": "^4.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "drizzle-orm": "^0.29.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "vite": "^5.0.0",
    "typescript": "^5.3.0",
    "drizzle-kit": "^0.20.0",
    "wrangler": "^3.0.0",
    "tsup": "^8.0.0"
  }
}
```

2. **.cursorrules.starter**
```markdown
# Fullstack Edge Starter - AI Rules

## Project Type
Fullstack application with Hono API and React client.

## Architecture
- **Frontend**: React 18 + Vite
- **Backend**: Hono + Edge-compatible APIs
- **Database**: Drizzle ORM (SQLite dev, edge DB prod)
- **Adapters**: Multi-runtime support

## Key Constraints
1. All server code must be edge-compatible (Web Standards only)
2. No Node.js APIs in `src/server/` or `src/adapters/` (except node adapter)
3. Database access via Drizzle ORM only
4. API contracts defined in `shared/routes.ts`

## File Organization
- `src/client/` - React frontend (browser APIs only)
- `src/server/` - Hono backend (edge-compatible)
- `src/adapters/` - Runtime-specific entry points
- `shared/` - Type contracts and schemas

## Common Tasks
- Add API route: Define in `shared/routes.ts`, implement in `src/server/routes/`
- Add React component: Create in `src/client/components/`
- Add database table: Update `shared/schema.ts`, run `npm run db:generate`
- Switch adapter: `edge adapter use <adapter>`

## Testing
- Frontend: Vite dev server (`npm run dev`)
- Backend: Test via API calls
- Build: `npm run build:<adapter>`
- Deploy: `npm run deploy:<adapter>`
```

3. **.edge-config.json**
```json
{
  "template": "fullstack",
  "version": "1.0.0",
  "description": "Complete fullstack application with Hono API and React client",
  "adapters": ["cloudflare", "deno", "vercel", "node"],
  "defaultAdapter": "cloudflare",
  "features": [
    "react",
    "hono",
    "drizzle-orm",
    "typescript",
    "vite",
    "multi-adapter"
  ],
  "requiredEnv": [
    "DATABASE_URL",
    "API_URL"
  ]
}
```

### 1.2 Server-Only Template (`starters/server-only/`)

**Purpose**: Hono API without frontend

**Differences from Fullstack**:
- No `src/client/` directory
- No Vite configuration
- No React dependencies
- Simpler build process
- API-focused structure

**Structure**:
```
starters/server-only/
├── package.json
├── tsconfig.json
├── README.md
├── .cursorrules.starter
├── .edge-config.json
├── .env.example
├── drizzle.config.ts
├── src/
│   ├── index.ts               # Main Hono app
│   ├── routes/                # API routes
│   ├── middleware/            # Middleware
│   └── adapters/              # Runtime adapters
└── shared/
    ├── schema.ts              # Database schema
    └── routes.ts              # API contracts
```

### 1.3 Client-Only Template (`starters/client-only/`)

**Purpose**: React SPA calling external API

**Differences**:
- No server code
- No database
- No adapters (just static hosting)
- Vite for building
- Environment variables for API URL

**Structure**:
```
starters/client-only/
├── package.json
├── tsconfig.json
├── README.md
├── .cursorrules.starter
├── .edge-config.json
├── .env.example
├── vite.config.ts
├── index.html
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── components/
    ├── lib/
    └── api/                   # API client (fetch wrappers)
```

### 1.4 Next.js Template (`starters/nextjs/`)

**Purpose**: Full-stack Next.js with edge runtime

**Key Features**:
- App Router
- Server Components
- API Routes with edge runtime
- Edge-compatible middleware
- Integrated with @edge/* packages

**Structure**:
```
starters/nextjs/
├── package.json
├── tsconfig.json
├── next.config.js
├── README.md
├── .cursorrules.starter
├── .edge-config.json
├── .env.example
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── api/                   # API routes
│   └── components/
└── lib/
    ├── edge/                  # Edge runtime utilities
    └── adapters/              # Next.js adapters
```

### 1.5 Vite+React Template (`starters/vite-react/`)

**Purpose**: Modern React SPA with Vite (similar to client-only but more opinionated)

**Differences from Client-Only**:
- More complete example app
- Router setup (React Router)
- State management example
- API integration patterns
- Testing setup

---

## Phase 2: CLI Template Integration

### 2.1 Copy Templates to CLI Package

```bash
# Create templates directory in CLI
mkdir -p packages/cli/templates

# Copy each starter template
cp -r starters/fullstack packages/cli/templates/
cp -r starters/server-only packages/cli/templates/
cp -r starters/client-only packages/cli/templates/
cp -r starters/nextjs packages/cli/templates/
cp -r starters/vite-react packages/cli/templates/
```

### 2.2 Update create.ts

Modify `packages/cli/src/commands/create.ts`:
- Update template path to use `templates/` directory
- Add template validation
- Add post-creation hooks
- Add template-specific instructions

### 2.3 Test Template Cloning

```bash
# Test each template
edge create test-fullstack --template fullstack --adapter cloudflare
edge create test-server --template server-only --adapter deno
edge create test-client --template client-only
edge create test-nextjs --template nextjs --adapter vercel
edge create test-vite --template vite-react
```

---

## Phase 3: Documentation

### 3.1 CLI Guide (`.edge-stack/cli-guide.md`)

**Content**:
- Installation instructions
- Command reference
- Usage examples
- Troubleshooting
- Best practices

**Outline**:
```markdown
# CLI Guide

## Installation
## Commands
### create
### build
### deploy
### migrate
### setup
### adapter
## Workflows
### Creating a new project
### Switching adapters
### Deploying to production
## Troubleshooting
## FAQ
```

### 3.2 Custom Adapters Guide (`.edge-stack/custom-adapters.md`)

**Content**:
- Adapter architecture
- Creating custom adapters
- Adapter API reference
- Testing adapters
- Publishing adapters

**Outline**:
```markdown
# Custom Adapters Guide

## Overview
## Adapter Architecture
## Creating an Adapter
### Step 1: Generate scaffold
### Step 2: Implement fetch handler
### Step 3: Add build script
### Step 4: Add deploy script
## Adapter API
## Testing
## Examples
### Bun adapter
### AWS Lambda adapter
### Azure Functions adapter
## Publishing
```

### 3.3 Update Main README

Add sections:
- CLI installation and usage
- Template selection guide
- Adapter comparison table
- Quick start with CLI
- Migration from manual setup

---

## Phase 4: Testing & Validation

### 4.1 Template Testing

For each template:
- [ ] Create project with CLI
- [ ] Install dependencies
- [ ] Run dev server
- [ ] Build for each adapter
- [ ] Test API endpoints (if applicable)
- [ ] Test frontend (if applicable)
- [ ] Verify database migrations
- [ ] Test deployment (dry-run)

### 4.2 CLI Testing

- [ ] Test all commands with valid inputs
- [ ] Test error handling with invalid inputs
- [ ] Test interactive prompts
- [ ] Test adapter detection
- [ ] Test template cloning
- [ ] Test environment setup
- [ ] Test migration commands

### 4.3 Integration Testing

- [ ] Create project → setup → build → deploy workflow
- [ ] Switch adapters and rebuild
- [ ] Database migrations across adapters
- [ ] Custom adapter creation
- [ ] Template customization

---

## Phase 5: Polish & Release

### 5.1 Code Quality

- [ ] Run linter on all files
- [ ] Fix TypeScript errors
- [ ] Add JSDoc comments
- [ ] Remove console.logs (except intentional)
- [ ] Optimize bundle size

### 5.2 Documentation

- [ ] Proofread all docs
- [ ] Add screenshots
- [ ] Add video demos
- [ ] Create changelog
- [ ] Write migration guide

### 5.3 Publishing

- [ ] Publish @edge/* packages to npm
- [ ] Publish CLI to npm
- [ ] Push templates to GitHub
- [ ] Create releases
- [ ] Update package versions

---

## Phase 6: Advanced Features (Future)

### 6.1 Enhanced CLI

- [ ] `edge logs` - View deployment logs
- [ ] `edge rollback` - Rollback deployments
- [ ] `edge env` - Manage environment variables
- [ ] `edge test` - Run tests
- [ ] `edge doctor` - Diagnose issues
- [ ] `edge update` - Update templates

### 6.2 Template Marketplace

- [ ] Community templates
- [ ] Template versioning
- [ ] Template search
- [ ] Template ratings

### 6.3 Adapter Marketplace

- [ ] Community adapters
- [ ] Adapter validation
- [ ] Adapter testing framework
- [ ] Adapter documentation generator

### 6.4 Developer Tools

- [ ] VS Code extension
- [ ] Browser extension for debugging
- [ ] Performance monitoring
- [ ] Error tracking integration

---

## Immediate Next Steps (Priority Order)

### 🎯 Step 1: Create Fullstack Template
**Time Estimate**: 2-3 hours

**Tasks**:
1. Create directory structure
2. Write package.json with all scripts
3. Create basic React app (App.tsx, main.tsx)
4. Create basic Hono API (index.ts, routes)
5. Create adapter files (cloudflare, deno, vercel, node)
6. Write README with setup instructions
7. Create .cursorrules.starter
8. Create .edge-config.json
9. Test locally

**Files to Create** (15-20 files):
- Configuration files (5)
- Client files (5-7)
- Server files (5-7)
- Adapter files (4)
- Documentation (2)

### 🎯 Step 2: Create Server-Only Template
**Time Estimate**: 1-2 hours

**Tasks**:
1. Copy fullstack template
2. Remove client code
3. Remove Vite configuration
4. Update package.json
5. Update README
6. Update .cursorrules.starter
7. Test locally

### 🎯 Step 3: Create Client-Only Template
**Time Estimate**: 1-2 hours

**Tasks**:
1. Copy fullstack template
2. Remove server code
3. Remove database code
4. Update package.json
5. Update README
6. Update .cursorrules.starter
7. Test locally

### 🎯 Step 4: Create Next.js Template
**Time Estimate**: 2-3 hours

**Tasks**:
1. Initialize Next.js project
2. Configure for edge runtime
3. Integrate @edge/* packages
4. Create example pages and API routes
5. Configure adapters
6. Write documentation
7. Test locally

### 🎯 Step 5: Create Vite+React Template
**Time Estimate**: 1-2 hours

**Tasks**:
1. Copy client-only template
2. Add React Router
3. Add example state management
4. Add API integration examples
5. Add testing setup
6. Update documentation
7. Test locally

### 🎯 Step 6: Integrate Templates with CLI
**Time Estimate**: 1 hour

**Tasks**:
1. Copy templates to `packages/cli/templates/`
2. Update `create.ts` template path
3. Test `edge create` with each template
4. Fix any issues
5. Document template usage

### 🎯 Step 7: Write Documentation
**Time Estimate**: 2-3 hours

**Tasks**:
1. Write CLI guide
2. Write custom adapters guide
3. Update main README
4. Add examples and screenshots
5. Proofread and polish

### 🎯 Step 8: Final Testing
**Time Estimate**: 2-3 hours

**Tasks**:
1. Test all templates
2. Test all CLI commands
3. Test all adapters
4. Test error scenarios
5. Fix bugs
6. Document known issues

---

## Success Criteria

### Must Have ✅
- [ ] 5 starter templates created and working
- [ ] CLI can scaffold all templates
- [ ] All templates build successfully
- [ ] All templates work with all adapters
- [ ] Documentation complete
- [ ] No TypeScript errors
- [ ] All tests passing

### Should Have 🎯
- [ ] Templates include example code
- [ ] README files are comprehensive
- [ ] .cursorrules.starter files are helpful
- [ ] Error messages are clear
- [ ] CLI provides helpful feedback

### Nice to Have 💡
- [ ] Video demos
- [ ] Interactive tutorials
- [ ] Template previews
- [ ] Adapter comparison tool
- [ ] Migration guides

---

## Estimated Timeline

**Total Time**: 15-20 hours

- **Phase 1** (Templates): 8-12 hours
- **Phase 2** (CLI Integration): 1-2 hours
- **Phase 3** (Documentation): 2-3 hours
- **Phase 4** (Testing): 2-3 hours
- **Phase 5** (Polish): 2-3 hours

**Recommended Approach**:
- Day 1: Create fullstack and server-only templates (4-5 hours)
- Day 2: Create client-only, Next.js, Vite templates (4-5 hours)
- Day 3: CLI integration and documentation (3-4 hours)
- Day 4: Testing and polish (3-4 hours)

---

## Resources Needed

### Tools
- Node.js 18+
- npm 9+
- Git
- VS Code (recommended)
- Terminal

### Knowledge
- React 18
- Hono framework
- Vite
- Next.js (for Next.js template)
- TypeScript
- Drizzle ORM
- Edge computing concepts

### References
- Hono docs: https://hono.dev/
- Vite docs: https://vitejs.dev/
- Next.js docs: https://nextjs.org/docs
- Drizzle docs: https://orm.drizzle.team/
- Cloudflare Workers: https://developers.cloudflare.com/workers/
- Deno Deploy: https://deno.com/deploy
- Vercel: https://vercel.com/docs

---

## Questions to Resolve

1. **Template Naming**: Should we use `fullstack` or `full-stack`?
   - **Decision**: Use `fullstack` (no hyphen) for consistency

2. **Default Adapter**: Which adapter should be the default?
   - **Decision**: Cloudflare Workers (most popular, best edge support)

3. **Database**: Should templates include database by default?
   - **Decision**: Yes for fullstack/server-only, no for client-only

4. **Testing**: Should templates include testing setup?
   - **Decision**: Not initially, add in future iteration

5. **Styling**: Should templates include CSS framework?
   - **Decision**: Minimal CSS, let users choose their framework

---

## Contact & Support

- **Documentation**: `.edge-stack/` directory
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Discord**: (TBD)

---

**Last Updated**: 2025-01-XX
**Status**: 🎯 **READY TO START PHASE 1**
**Next Action**: Create fullstack template
