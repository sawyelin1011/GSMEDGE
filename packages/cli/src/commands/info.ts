/**
 * Display project information
 */

import { Command } from 'commander';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import chalk from 'chalk';
import { detectRuntime } from '@ylstack/database';

export function infoCommand() {
  return new Command('info')
    .description('Display project information')
    .action(async () => {
      await showInfo();
    });
}

async function showInfo() {
  console.log(chalk.blue.bold('\n📊 YLSTACK Project Information\n'));

  // Read package.json
  const pkgPath = resolve(process.cwd(), 'package.json');
  if (existsSync(pkgPath)) {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    console.log(chalk.gray('Project:'), chalk.white(pkg.name || 'Unknown'));
    console.log(chalk.gray('Version:'), chalk.white(pkg.version || '0.0.0'));
    if (pkg.description) {
      console.log(chalk.gray('Description:'), chalk.white(pkg.description));
    }
  }

  // Runtime information
  console.log(chalk.gray('\nRuntime:'), chalk.white(detectRuntime()));
  console.log(chalk.gray('Node version:'), chalk.white(process.version));

  // Environment
  console.log(chalk.gray('Environment:'), chalk.white(process.env.NODE_ENV || 'development'));

  // Database configuration
  if (process.env.DATABASE_TYPE) {
    console.log(chalk.gray('\nDatabase type:'), chalk.white(process.env.DATABASE_TYPE));
  }
  if (process.env.DATABASE_URL) {
    const maskedUrl = process.env.DATABASE_URL.replace(/:\/\/([^:]+):([^@]+)@/, '://***:***@');
    console.log(chalk.gray('Database URL:'), chalk.white(maskedUrl));
  }

  // Check for configuration files
  console.log(chalk.gray('\nConfiguration files:'));
  const configFiles = [
    'wrangler.toml',
    'vercel.json',
    'deno.json',
    '.env',
    'drizzle.config.ts',
    'tsconfig.json',
  ];

  for (const file of configFiles) {
    const exists = existsSync(resolve(process.cwd(), file));
    const icon = exists ? chalk.green('✓') : chalk.gray('✗');
    console.log(`  ${icon} ${file}`);
  }

  console.log(chalk.gray('\nFor more information, visit:'), chalk.cyan('https://ylstack.dev'));
  console.log();
}
