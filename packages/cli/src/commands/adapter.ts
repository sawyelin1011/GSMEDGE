/**
 * Adapter Command
 * 
 * Manages runtime adapters and helps create custom adapters.
 * Provides guidance for integrating new edge runtimes.
 */

import { Command } from 'commander';
import prompts from 'prompts';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';

interface AdapterInfo {
  name: string;
  description: string;
  runtime: string;
  webStandards: boolean;
}

const BUILTIN_ADAPTERS: AdapterInfo[] = [
  {
    name: 'cloudflare',
    description: 'Cloudflare Workers - Global edge network',
    runtime: 'V8 Isolates',
    webStandards: true
  },
  {
    name: 'deno',
    description: 'Deno Deploy - Secure TypeScript runtime',
    runtime: 'Deno',
    webStandards: true
  },
  {
    name: 'vercel',
    description: 'Vercel Edge Functions - Vercel edge network',
    runtime: 'V8 Isolates',
    webStandards: true
  },
  {
    name: 'node',
    description: 'Node.js - Traditional server runtime',
    runtime: 'Node.js',
    webStandards: false
  }
];

export const adapterCommand = () => {
  const command = new Command('adapter')
    .description('Manage runtime adapters');

  // List adapters
  command
    .command('list')
    .description('List available adapters')
    .action(async () => {
      console.log(chalk.bold.cyan('\n📦 Available Adapters\n'));

      for (const adapter of BUILTIN_ADAPTERS) {
        console.log(chalk.bold(adapter.name));
        console.log(chalk.dim(`  ${adapter.description}`));
        console.log(chalk.gray(`  Runtime: ${adapter.runtime}`));
        console.log(chalk.gray(`  Web Standards: ${adapter.webStandards ? '✓' : '✗'}`));
        console.log();
      }

      // Check for custom adapters
      const customAdaptersPath = path.join(process.cwd(), 'src', 'adapters');
      if (await fs.pathExists(customAdaptersPath)) {
        const dirs = await fs.readdir(customAdaptersPath);
        const customAdapters = dirs.filter(d => 
          !BUILTIN_ADAPTERS.find(a => a.name === d)
        );

        if (customAdapters.length > 0) {
          console.log(chalk.bold.cyan('Custom Adapters:\n'));
          for (const adapter of customAdapters) {
            console.log(chalk.bold(adapter));
            console.log(chalk.dim('  Custom adapter'));
            console.log();
          }
        }
      }
    });

  // Switch adapter
  command
    .command('use <adapter>')
    .description('Switch to a different adapter')
    .action(async (adapterName: string) => {
      console.log(chalk.bold.cyan(`\n🔄 Switching to ${adapterName}...\n`));

      const adapter = BUILTIN_ADAPTERS.find(a => a.name === adapterName);
      if (!adapter) {
        console.log(chalk.red(`❌ Unknown adapter: ${adapterName}`));
        console.log(chalk.yellow(`\nAvailable adapters: ${BUILTIN_ADAPTERS.map(a => a.name).join(', ')}`));
        process.exit(1);
      }

      const spinner = ora('Updating configuration...').start();

      try {
        const cwd = process.cwd();
        const adapterPath = path.join(cwd, '.adapter');
        
        await fs.ensureDir(adapterPath);
        await fs.writeFile(
          path.join(adapterPath, 'current'),
          adapterName,
          'utf-8'
        );

        spinner.succeed(`Switched to ${adapterName}`);
        
        console.log(chalk.green('\n✅ Adapter updated!\n'));
        console.log(chalk.cyan('Next steps:\n'));
        console.log(chalk.gray(`  npm run build:${adapterName}`));
        console.log(chalk.gray(`  npm run deploy:${adapterName}\n`));

      } catch (error) {
        spinner.fail('Failed to switch adapter');
        throw error;
      }
    });

  // Create custom adapter
  command
    .command('create')
    .description('Create a custom adapter')
    .action(async () => {
      console.log(chalk.bold.cyan('\n🔧 Create Custom Adapter\n'));

      // Get adapter details
      const answers = await prompts([
        {
          type: 'text' as const,
          name: 'name',
          message: 'Adapter name (lowercase, no spaces):',
          validate: (value: string) => {
            if (!value) return 'Name is required';
            if (!/^[a-z0-9-]+$/.test(value)) return 'Name must be lowercase alphanumeric with hyphens';
            if (BUILTIN_ADAPTERS.find(a => a.name === value)) return 'Name conflicts with built-in adapter';
            return true;
          }
        },
        {
          type: 'text' as const,
          name: 'description',
          message: 'Description:',
          initial: 'Custom edge runtime adapter'
        },
        {
          type: 'select' as const,
          name: 'template',
          message: 'Base template:',
          choices: [
            { title: 'Web Standards (Cloudflare-like)', value: 'web-standards' },
            { title: 'Deno Runtime', value: 'deno' },
            { title: 'Node.js Compatible', value: 'node' },
            { title: 'Minimal (start from scratch)', value: 'minimal' }
          ]
        }
      ]);

      if (!answers.name) {
        console.log(chalk.yellow('\n⚠️  Cancelled'));
        return;
      }

      const spinner = ora('Creating adapter...').start();

      try {
        await createCustomAdapter(answers.name, answers.template, answers.description);
        spinner.succeed('Adapter created');

        console.log(chalk.green('\n✅ Custom adapter created!\n'));
        console.log(chalk.cyan(`📁 Location: src/adapters/${answers.name}/\n`));
        console.log(chalk.bold('Next steps:\n'));
        console.log(chalk.gray(`  1. Implement the adapter in src/adapters/${answers.name}/server.ts`));
        console.log(chalk.gray(`  2. Add build script to package.json: "build:${answers.name}"`));
        console.log(chalk.gray(`  3. Test locally: npm run dev`));
        console.log(chalk.gray(`  4. Deploy: edge deploy ${answers.name}\n`));

        // Show adapter guide
        console.log(chalk.dim('See .edge-stack/custom-adapters.md for detailed guide\n'));

      } catch (error) {
        spinner.fail('Failed to create adapter');
        throw error;
      }
    });

  // Show adapter info
  command
    .command('info [adapter]')
    .description('Show detailed information about an adapter')
    .action(async (adapterName?: string) => {
      let adapter: string;

      if (!adapterName) {
        // Get current adapter
        const adapterPath = path.join(process.cwd(), '.adapter', 'current');
        if (await fs.pathExists(adapterPath)) {
          adapter = (await fs.readFile(adapterPath, 'utf-8')).trim();
        } else {
          console.log(chalk.red('❌ No adapter specified and no current adapter found'));
          return;
        }
      } else {
        adapter = adapterName;
      }

      const adapterInfo = BUILTIN_ADAPTERS.find(a => a.name === adapter);
      
      if (!adapterInfo) {
        console.log(chalk.red(`❌ Unknown adapter: ${adapter}`));
        return;
      }

      console.log(chalk.bold.cyan(`\n📦 ${adapterInfo.name}\n`));
      console.log(chalk.white(adapterInfo.description));
      console.log();
      console.log(chalk.gray(`Runtime:       ${adapterInfo.runtime}`));
      console.log(chalk.gray(`Web Standards: ${adapterInfo.webStandards ? 'Yes' : 'No'}`));
      console.log();

      // Show adapter-specific info
      showAdapterDetails(adapter);
    });

  return command;
};

/**
 * Create a custom adapter from template
 */
async function createCustomAdapter(
  name: string,
  template: string,
  description: string
): Promise<void> {
  const cwd = process.cwd();
  const adapterPath = path.join(cwd, 'src', 'adapters', name);

  // Create adapter directory
  await fs.ensureDir(adapterPath);

  // Generate adapter files based on template
  const serverCode = generateAdapterCode(name, template);
  await fs.writeFile(path.join(adapterPath, 'server.ts'), serverCode, 'utf-8');

  // Create README
  const readme = generateAdapterReadme(name, description, template);
  await fs.writeFile(path.join(adapterPath, 'README.md'), readme, 'utf-8');

  // Create config file (if needed)
  if (template !== 'minimal') {
    const config = generateAdapterConfig(name, template);
    const configFile = template === 'deno' ? 'deno.json' : 'config.json';
    await fs.writeFile(path.join(adapterPath, configFile), config, 'utf-8');
  }
}

/**
 * Generate adapter server code
 */
function generateAdapterCode(name: string, template: string): string {
  const baseImports = `import { Hono } from 'hono';
import app from '../../index.js';

`;

  switch (template) {
    case 'web-standards':
      return baseImports + `// Web Standards adapter (Cloudflare Workers-like)
export default {
  async fetch(request: Request, env: any, ctx: any): Promise<Response> {
    return app.fetch(request, env, ctx);
  }
};
`;

    case 'deno':
      return baseImports + `// Deno Deploy adapter
Deno.serve((request: Request) => {
  return app.fetch(request, {});
});
`;

    case 'node':
      return baseImports + `// Node.js adapter
import { serve } from '@hono/node-server';

const port = parseInt(process.env.PORT || '3000');

console.log(\`Server is running on http://localhost:\${port}\`);

serve({
  fetch: app.fetch,
  port
});
`;

    case 'minimal':
    default:
      return baseImports + `// Minimal adapter - implement your runtime integration here

// TODO: Implement adapter for ${name}
// 1. Import your runtime's server API
// 2. Create request handler that calls app.fetch()
// 3. Start server/export handler

export default {
  async fetch(request: Request): Promise<Response> {
    return app.fetch(request, {});
  }
};
`;
  }
}

/**
 * Generate adapter README
 */
function generateAdapterReadme(name: string, description: string, template: string): string {
  return `# ${name.charAt(0).toUpperCase() + name.slice(1)} Adapter

${description}

## Template

Based on: **${template}**

## Setup

1. Install dependencies (if any)
2. Configure environment variables
3. Implement adapter logic in \`server.ts\`

## Build

\`\`\`bash
npm run build:${name}
\`\`\`

## Deploy

\`\`\`bash
edge deploy ${name}
\`\`\`

## Development

\`\`\`bash
npm run dev
\`\`\`

## Documentation

See [Custom Adapters Guide](.edge-stack/custom-adapters.md) for detailed information.
`;
}

/**
 * Generate adapter config
 */
function generateAdapterConfig(name: string, template: string): string {
  if (template === 'deno') {
    return JSON.stringify({
      name,
      version: '1.0.0',
      exports: './server.ts',
      tasks: {
        dev: 'deno run --allow-net --allow-read --allow-env --watch server.ts'
      }
    }, null, 2);
  }

  return JSON.stringify({
    name,
    version: '1.0.0',
    adapter: template
  }, null, 2);
}

/**
 * Show adapter-specific details
 */
function showAdapterDetails(adapter: string): void {
  const details: Record<string, string[]> = {
    cloudflare: [
      'Build:  npm run build:cloudflare',
      'Deploy: wrangler deploy',
      'Docs:   https://developers.cloudflare.com/workers/',
      '',
      'Features:',
      '  • Global edge network (200+ locations)',
      '  • KV storage, R2, D1 database',
      '  • 0ms cold starts',
      '  • Free tier: 100k requests/day'
    ],
    deno: [
      'Build:  No build required',
      'Deploy: deployctl deploy',
      'Docs:   https://deno.com/deploy',
      '',
      'Features:',
      '  • TypeScript-first runtime',
      '  • Web Standards APIs',
      '  • Built-in testing',
      '  • Free tier: 100k requests/day'
    ],
    vercel: [
      'Build:  npm run build:vercel',
      'Deploy: vercel deploy',
      'Docs:   https://vercel.com/docs/functions',
      '',
      'Features:',
      '  • Global edge network',
      '  • Integrated with Vercel platform',
      '  • Automatic HTTPS',
      '  • Free tier: 100k requests/month'
    ],
    node: [
      'Build:  npm run build:node',
      'Deploy: Manual (PM2, Docker, etc.)',
      'Docs:   https://nodejs.org/docs',
      '',
      'Features:',
      '  • Full Node.js ecosystem',
      '  • Traditional server deployment',
      '  • Self-hosted or cloud platforms',
      '  • No edge-specific constraints'
    ]
  };

  const info = details[adapter];
  if (info) {
    console.log(chalk.bold('Commands:\n'));
    for (const line of info) {
      console.log(chalk.dim(`  ${line}`));
    }
    console.log();
  }
}
