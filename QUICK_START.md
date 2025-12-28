# Edge Starter Kit - Quick Start Guide

## 🚀 TL;DR

**Status**: CLI tool complete ✅ | Templates needed 🎯

**Next Task**: Create 5 starter templates (start with fullstack)

**Time Estimate**: 8-12 hours for all templates

---

## 📋 What's Done

✅ **CLI Tool** (`packages/cli/`)
- 6 commands: create, build, deploy, migrate, setup, adapter
- Built successfully (42.84 KB)
- Ready to test (needs templates)

✅ **Package System** (`packages/`)
- @edge/core - Business logic
- @edge/adapters - Runtime adapters
- @edge/trpc-contracts - API contracts
- @edge/api - Main application

✅ **Documentation**
- CLI_IMPLEMENTATION_COMPLETE.md (464 lines)
- CONTINUATION_PLAN.md (680 lines)
- SESSION_SUMMARY.md (631 lines)

---

## 📋 What's Needed

❌ **Starter Templates** (`starters/`)
- fullstack - Hono API + React client
- server-only - Hono API only
- client-only - React SPA only
- nextjs - Next.js with edge runtime
- vite-react - Vite + React

❌ **CLI Integration**
- Copy templates to `packages/cli/templates/`
- Test `edge create` command

❌ **Documentation**
- CLI user guide
- Custom adapter guide
- README updates

---

## 🎯 Your First Task

### Create Fullstack Template

**Location**: `starters/fullstack/`

**Files Needed** (~15-20 files):

```
starters/fullstack/
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript config
├── .env.example              # Environment variables
├── README.md                 # Setup instructions
├── .cursorrules.starter      # AI assistant rules
├── .edge-config.json         # Template metadata
├── src/
│   ├── client/
│   │   ├── main.tsx         # React entry point
│   │   ├── App.tsx          # Main component
│   │   └── index.html       # HTML template
│   └── server/
│       ├── index.ts         # Hono app
│       └── routes/
│           └── hello.ts     # Example route
├── shared/
│   ├── schema.ts            # Database schema
│   └── routes.ts            # API contracts
└── adapters/
    ├── cloudflare/
    │   └── index.ts         # Cloudflare adapter
    ├── deno/
    │   └── index.ts         # Deno adapter
    ├── vercel/
    │   └── index.ts         # Vercel adapter
    └── node/
        └── index.ts         # Node adapter
```

**Time**: 2-3 hours

**Success Criteria**:
- ✅ `npm install` works
- ✅ `npm run dev` starts server
- ✅ All 4 adapters build successfully
- ✅ README is clear and complete

---

## 📖 Documentation to Read

**Priority Order**:

1. **This file** (QUICK_START.md) - You're here!
2. **CONTINUATION_PLAN.md** - Detailed implementation guide
3. **CLI_IMPLEMENTATION_COMPLETE.md** - CLI architecture
4. **.edge-stack/** - Edge compatibility rules

**Time**: 30-45 minutes reading

---

## 🛠️ Commands You'll Use

### Testing CLI

```bash
# Build CLI
cd packages/cli
npm run build

# Link CLI globally (for testing)
npm link

# Test create command (after templates exist)
edge create my-test-app --template fullstack

# Test build command
cd my-test-app
edge build --adapter cloudflare

# Test deploy command
edge deploy --adapter cloudflare --dry-run
```

### Working with Templates

```bash
# Create template directory
mkdir -p starters/fullstack

# Test template locally
cd starters/fullstack
npm install
npm run dev

# Copy to CLI
cp -r starters/fullstack packages/cli/templates/
```

---

## ⚠️ Critical Rules

### Edge Compatibility (NEVER VIOLATE)

❌ **Forbidden in server code**:
```typescript
import fs from 'fs';           // No file system
import path from 'path';       // No path module
import os from 'os';           // No OS module
process.env.VAR;               // No process.env
__dirname;                     // No __dirname
```

✅ **Allowed in server code**:
```typescript
fetch('https://...');          // Fetch API
crypto.randomUUID();           // Web Crypto
new Request();                 // Web Request
new Response();                // Web Response
c.env.VAR;                     // Hono context env
```

### File Organization

```
src/server/     → Edge-compatible only (Web Standards)
src/client/     → Browser APIs only
adapters/       → Runtime-specific code (Node.js OK here)
shared/         → Type contracts (platform-agnostic)
```

---

## 📝 Template Checklist

For each template, ensure:

- [ ] `package.json` with all scripts
- [ ] `tsconfig.json` configured
- [ ] `.env.example` with variables
- [ ] `README.md` with setup steps
- [ ] `.cursorrules.starter` for AI
- [ ] `.edge-config.json` metadata
- [ ] All 4 adapters configured
- [ ] Example code included
- [ ] Builds successfully
- [ ] Dev server works
- [ ] No TypeScript errors

---

## 🎨 Template Content Guidelines

### Keep It Simple

- ✅ Minimal example code
- ✅ One example route
- ✅ Basic styling (no framework)
- ✅ Clear comments
- ❌ No authentication (initially)
- ❌ No complex features
- ❌ No testing setup (initially)

### Make It Educational

- ✅ Comments explaining patterns
- ✅ README with clear steps
- ✅ Example .env variables
- ✅ Troubleshooting section
- ✅ Links to documentation

### Ensure Quality

- ✅ No TypeScript errors
- ✅ No console warnings
- ✅ Consistent formatting
- ✅ Working dev server
- ✅ All adapters build

---

## 🐛 Common Issues & Solutions

### Issue: Template doesn't build

**Solution**: Check for Node.js APIs in server code
```bash
# Search for forbidden imports
grep -r "import.*from 'fs'" src/server/
grep -r "import.*from 'path'" src/server/
```

### Issue: Adapter not found

**Solution**: Check adapter file exists and exports correctly
```typescript
// adapters/cloudflare/index.ts must export default
export default app;
```

### Issue: Dev server fails

**Solution**: Check environment variables
```bash
# Copy example env
cp .env.example .env

# Check required variables
cat .env
```

### Issue: TypeScript errors

**Solution**: Check tsconfig.json paths
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "~/*": ["./shared/*"]
    }
  }
}
```

---

## 📊 Progress Tracking

### Phase 1: Templates (8-12 hours)

- [ ] Fullstack template (2-3 hours)
- [ ] Server-only template (1-2 hours)
- [ ] Client-only template (1-2 hours)
- [ ] Next.js template (2-3 hours)
- [ ] Vite+React template (2-3 hours)

### Phase 2: Integration (1-2 hours)

- [ ] Copy templates to CLI
- [ ] Test `edge create`
- [ ] Fix integration issues

### Phase 3: Documentation (2-3 hours)

- [ ] CLI user guide
- [ ] Custom adapter guide
- [ ] README updates

### Phase 4: Testing (2-3 hours)

- [ ] Test all templates
- [ ] Test all CLI commands
- [ ] Fix bugs

---

## 🎯 Success Metrics

### Must Have (MVP)

- [ ] All 5 templates created
- [ ] All templates build successfully
- [ ] CLI `create` command works
- [ ] Basic documentation complete

### Should Have (Polish)

- [ ] All adapters tested
- [ ] Comprehensive documentation
- [ ] Error handling tested
- [ ] Examples provided

### Nice to Have (Future)

- [ ] Video tutorials
- [ ] Advanced examples
- [ ] Testing setup
- [ ] CI/CD configs

---

## 🔗 Quick Links

### Documentation

- [CLI Implementation](./CLI_IMPLEMENTATION_COMPLETE.md)
- [Continuation Plan](./CONTINUATION_PLAN.md)
- [Session Summary](./SESSION_SUMMARY.md)
- [Edge Stack Rules](./.edge-stack/)

### External Resources

- [Hono Documentation](https://hono.dev/)
- [Cloudflare Workers](https://workers.cloudflare.com/)
- [Deno Deploy](https://deno.com/deploy)
- [Vercel Edge](https://vercel.com/docs/functions/edge-functions)

---

## 💬 Need Help?

### Check These First

1. **CONTINUATION_PLAN.md** - Detailed implementation steps
2. **.edge-stack/requirements.md** - Edge compatibility rules
3. **CLI_IMPLEMENTATION_COMPLETE.md** - CLI architecture

### Common Questions

**Q: Which template should I create first?**
A: Fullstack - it's the most complete and tests all systems.

**Q: How do I test the CLI?**
A: Build it (`npm run build`), link it (`npm link`), then use `edge` commands.

**Q: What if a template doesn't work with an adapter?**
A: Check for Node.js APIs in server code. Use Web Standards only.

**Q: How minimal should templates be?**
A: Very minimal. One example route, basic styling, clear comments.

**Q: Should I include tests?**
A: Not initially. Focus on working templates first.

---

## 🚦 Getting Started (Step by Step)

### Step 1: Read Documentation (30 min)

```bash
# Read these files in order
cat QUICK_START.md          # This file
cat CONTINUATION_PLAN.md    # Detailed plan
cat CLI_IMPLEMENTATION_COMPLETE.md  # CLI details
```

### Step 2: Verify CLI Works (5 min)

```bash
cd packages/cli
npm run build
# Should see: ✓ Built successfully
```

### Step 3: Create Fullstack Template (2-3 hours)

```bash
mkdir -p starters/fullstack
cd starters/fullstack

# Follow CONTINUATION_PLAN.md Phase 1.1
# Create all files listed above
```

### Step 4: Test Template (15 min)

```bash
cd starters/fullstack
npm install
npm run dev
# Should see: Server running on http://localhost:5173

# Test builds
npm run build:cloudflare
npm run build:deno
npm run build:vercel
npm run build:node
```

### Step 5: Integrate with CLI (30 min)

```bash
# Copy template to CLI
cp -r starters/fullstack packages/cli/templates/

# Test CLI
cd ../..
edge create test-app --template fullstack
cd test-app
npm install
npm run dev
```

### Step 6: Repeat for Other Templates

- Server-only (simplify fullstack)
- Client-only (simplify fullstack)
- Next.js (new structure)
- Vite+React (enhance client-only)

---

## 📈 Timeline

### Realistic (15-20 hours)

- **Day 1-2**: Create all templates (8-12 hours)
- **Day 3**: Integration and testing (3-4 hours)
- **Day 4**: Documentation and polish (3-4 hours)

### Optimistic (10-15 hours)

- **Day 1**: Fullstack + server-only (4-5 hours)
- **Day 2**: Client-only + Next.js + Vite (4-5 hours)
- **Day 3**: Integration, docs, testing (2-3 hours)

### Conservative (20-25 hours)

- **Day 1**: Fullstack (3-4 hours)
- **Day 2**: Server-only + client-only (3-4 hours)
- **Day 3**: Next.js + Vite (3-4 hours)
- **Day 4**: Integration (2-3 hours)
- **Day 5**: Documentation (3-4 hours)
- **Day 6**: Testing and polish (3-4 hours)

---

## ✅ Ready to Start?

You have everything you need:

- ✅ Working CLI tool
- ✅ Complete package system
- ✅ Comprehensive documentation
- ✅ Clear implementation plan
- ✅ Success criteria defined

**Next Step**: Open `CONTINUATION_PLAN.md` and start Phase 1.1 (Fullstack Template)

**Good luck! 🚀**

---

**Last Updated**: 2025-01-XX
**Status**: Ready for template creation
**Estimated Time**: 15-20 hours total
