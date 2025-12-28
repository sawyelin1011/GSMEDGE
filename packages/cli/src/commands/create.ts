/**
 * Create Command
 * 
 * Scaffolds a new Edge Starter Kit project from templates.
 * Supports multiple starter templates and adapter configurations.
 */

import { Command } from 'commander';
import prompts from 'prompts';
import chalk from 'chalk';
import ora from 'ora';
import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'path';
import degit from 'degit';

interface CreateOptions {
  template?: string;
  adapter?: string;
  skipInstall?: boolean;
  skipGit?: boolean;
}

const TEMPLATES = [
  { value: 'fullstack', title: 'Fullstack (Hono API + React Client)', description: 'Complete application with backend and frontend' },
  { value: 'server-only', title: 'Server Only (Hono API)', description: 'Backend API without frontend' },
  { value: 'client-only', title: 'Client Only (React SPA)', description: 'Frontend SPA calling external API' },
  { value: 'nextjs', title: 'Next.js (App Router)', description: 'Full-stack Next.js with edge runtime' },
  { value: 'vite-react', title: 'Vite + React', description: 'Modern React SPA with Vite' }
];

const ADAPTERS = [
  { value: 'cloudflare', title: 'Cloudflare Workers', description: 'Deploy to Cloudflare Workers' },
  { value: 'deno', title: 'Deno Deploy', description: 'Deploy to Deno Deploy' },
  { value: 'vercel', title: 'Vercel Edge Functions', description: 'Deploy to Vercel Edge' },
  { value: 'node', title: 'Node.js', description: 'Traditional Node.js server' }
];

export const createCommand = () => {
  return new Command('create')
    .description('Create a new edge application from a starter template')
    .argument('[app-name]', 'Name of your application')
    .option('-t, --template <template>', 'Template: fullstack|server-only|client-only|nextjs|vite-react')
    .option('-a, --adapter <adapter>', 'Adapter: cloudflare|deno|vercel|node')
    .option('--skip-install', 'Skip npm install')
    .option('--skip-git', 'Skip git initialization')
    .action(async (appName: string | undefined, options: CreateOptions) => {
      console.log(chalk.bold.cyan('\n🚀 Edge Starter Kit - Project Creator\n'));

      try {
        // Step 1: Get app name
        let projectName = appName;
        if (!projectName) {
          const nameResponse = await prompts({
            type: 'text' as const,
            name: 'name',
            message: 'What is your project name?',
            initial: 'my-edge-app',
            validate: (value: string) => {
              if (!value) return 'Project name is required';
              if (!/^[a-z0-9-]+$/.test(value)) return 'Project name must be lowercase alphanumeric with hyphens';
              return true;
            }
          });

          if (!nameResponse.name) {
            console.log(chalk.red('\n❌ Project creation cancelled'));
            process.exit(1);
          }

          projectName = nameResponse.name;
        }

        const projectPath = path.resolve(process.cwd(), projectName!);

        // Check if directory exists
        if (await fs.pathExists(projectPath)) {
          console.log(chalk.red(`\n❌ Directory "${projectName}" already exists`));
          process.exit(1);
        }

        // Step 2: Select template
        let template = options.template;
        if (!template) {
          const templateResponse = await prompts({
            type: 'select' as const,
            name: 'template',
            message: 'Which starter template would you like to use?',
            choices: TEMPLATES,
            initial: 0
          });

          if (!templateResponse.template) {
            console.log(chalk.red('\n❌ Template selection cancelled'));
            process.exit(1);
          }

          template = templateResponse.template;
        }

        // Validate template
        if (!TEMPLATES.find(t => t.value === template)) {
          console.log(chalk.red(`\n❌ Invalid template: ${template}`));
          console.log(chalk.yellow(`Valid templates: ${TEMPLATES.map(t => t.value).join(', ')}`));
          process.exit(1);
        }

        // Step 3: Select adapter
        let adapter = options.adapter;
        if (!adapter) {
          const adapterResponse = await prompts({
            type: 'select' as const,
            name: 'adapter',
            message: 'Which runtime adapter would you like to use?',
            choices: ADAPTERS,
            initial: 0
          });

          if (!adapterResponse.adapter) {
            console.log(chalk.red('\n❌ Adapter selection cancelled'));
            process.exit(1);
          }

          adapter = adapterResponse.adapter;
        }

        // Validate adapter
        if (!ADAPTERS.find(a => a.value === adapter)) {
          console.log(chalk.red(`\n❌ Invalid adapter: ${adapter}`));
          console.log(chalk.yellow(`Valid adapters: ${ADAPTERS.map(a => a.value).join(', ')}`));
          process.exit(1);
        }

        // Step 4: Clone template
        const spinner = ora('Cloning template...').start();
        
        try {
          // In production, this would clone from GitHub
          // For now, copy from local starters directory
          const templatePath = path.resolve(__dirname, '../../templates', template!);
          
          if (await fs.pathExists(templatePath)) {
            await fs.copy(templatePath, projectPath);
          } else {
            // Fallback: use degit to clone from GitHub (when templates are published)
            // const emitter = degit(`edge-starter-kit/starters/${template}`, { cache: false });
            // await emitter.clone(projectPath);
            
            spinner.fail(`Template not found: ${template}`);
            console.log(chalk.yellow('\n⚠️  Templates are not yet available. Please run from the monorepo root.'));
            process.exit(1);
          }

          spinner.succeed('Template cloned');
        } catch (error) {
          spinner.fail('Failed to clone template');
          throw error;
        }

        // Step 5: Update package.json with project name
        const pkgJsonPath = path.join(projectPath, 'package.json');
        if (await fs.pathExists(pkgJsonPath)) {
          const pkgJson = await fs.readJson(pkgJsonPath);
          pkgJson.name = projectName;
          await fs.writeJson(pkgJsonPath, pkgJson, { spaces: 2 });
        }

        // Step 6: Configure adapter
        spinner.start('Configuring adapter...');
        await configureAdapter(projectPath, adapter!);
        spinner.succeed(`Configured for ${adapter}`);

        // Step 7: Install dependencies
        if (!options.skipInstall) {
          spinner.start('Installing dependencies...');
          try {
            await execa('npm', ['install'], { cwd: projectPath });
            spinner.succeed('Dependencies installed');
          } catch (error) {
            spinner.fail('Failed to install dependencies');
            console.log(chalk.yellow('\n⚠️  You can install them manually by running: npm install'));
          }
        }

        // Step 8: Initialize git
        if (!options.skipGit) {
          spinner.start('Initializing git repository...');
          try {
            await execa('git', ['init'], { cwd: projectPath });
            await execa('git', ['add', '.'], { cwd: projectPath });
            await execa('git', ['commit', '-m', 'Initial commit from Edge Starter Kit'], { cwd: projectPath });
            spinner.succeed('Git repository initialized');
          } catch (error) {
            spinner.warn('Git initialization skipped');
          }
        }

        // Success message
        console.log(chalk.bold.green(`\n✅ Project created successfully!\n`));
        console.log(chalk.cyan(`📁 Project: ${projectName}`));
        console.log(chalk.cyan(`📦 Template: ${template}`));
        console.log(chalk.cyan(`⚡ Adapter: ${adapter}\n`));

        console.log(chalk.bold('Next steps:\n'));
        console.log(chalk.gray(`  cd ${projectName}`));
        console.log(chalk.gray(`  npm run dev`));
        console.log(chalk.gray(`  npm run build:${adapter}`));
        console.log(chalk.gray(`  npm run deploy:${adapter}\n`));

        console.log(chalk.dim('For more information, see the README.md in your project directory.\n'));

      } catch (error) {
        console.error(chalk.red('\n❌ Error creating project:'), error);
        process.exit(1);
      }
    });
};

/**
 * Configure the project for a specific adapter
 */
async function configureAdapter(projectPath: string, adapter: string): Promise<void> {
  // Create adapter-specific config files
  const adapterConfigPath = path.join(projectPath, '.adapter');
  await fs.ensureDir(adapterConfigPath);
  await fs.writeFile(
    path.join(adapterConfigPath, 'current'),
    adapter,
    'utf-8'
  );

  // Copy adapter-specific configuration if it exists
  const adapterTemplatePath = path.join(projectPath, 'adapters', adapter);
  if (await fs.pathExists(adapterTemplatePath)) {
    const files = await fs.readdir(adapterTemplatePath);
    for (const file of files) {
      await fs.copy(
        path.join(adapterTemplatePath, file),
        path.join(projectPath, file)
      );
    }
  }
}
