#!/usr/bin/env node

/**
 * YLSTACK CLI
 * 
 * Multi-runtime edge-first development toolkit that helps developers:
 * - Scaffold new projects from starter templates
 * - Build applications for specific runtimes (Cloudflare, Deno, Vercel, Node)
 * - Deploy to edge platforms without vendor CLI dependencies
 * - Manage multi-runtime database migrations (SQLite, Turso, D1, PostgreSQL)
 * - Set up development environments with runtime detection
 */

import { Command } from 'commander';
import { createCommand } from './commands/create.js';
import { buildCommand } from './commands/build.js';
import { deployCommand } from './commands/deploy.js';
import { dbCommand } from './commands/db/index.js';
import { setupCommand } from './commands/setup.js';
import { devCommand } from './commands/dev.js';
import { infoCommand } from './commands/info.js';

const program = new Command();

program
  .name('ylstack')
  .description('YLSTACK - Multi-runtime edge-first development toolkit')
  .version('1.0.0');

// Register all commands
program.addCommand(createCommand());
program.addCommand(buildCommand());
program.addCommand(deployCommand());
program.addCommand(dbCommand());
program.addCommand(setupCommand());
program.addCommand(devCommand());
program.addCommand(infoCommand());

// Parse CLI arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
