/**
 * Development server command
 */

import { Command } from 'commander';
import { spawn } from 'child_process';
import chalk from 'chalk';

export function devCommand() {
  return new Command('dev')
    .description('Start development server')
    .option('-p, --port <port>', 'Port number', '3000')
    .option('-r, --runtime <runtime>', 'Runtime (node, cloudflare, deno)', 'node')
    .action(async (options) => {
      await startDev(options);
    });
}

async function startDev(options: { port: string; runtime: string }) {
  console.log(chalk.blue(`🚀 Starting YLSTACK development server...\n`));
  console.log(chalk.gray(`Runtime: ${options.runtime}`));
  console.log(chalk.gray(`Port: ${options.port}\n`));

  let command: string;
  let args: string[];

  switch (options.runtime) {
    case 'cloudflare':
      command = 'npx';
      args = ['wrangler', 'dev', '--port', options.port];
      break;
    
    case 'deno':
      command = 'deno';
      args = ['task', 'dev'];
      break;
    
    case 'node':
    default:
      command = 'tsx';
      args = ['watch', 'server/index.ts'];
      process.env.PORT = options.port;
      break;
  }

  const child = spawn(command, args, {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env },
  });

  child.on('error', (error) => {
    console.error(chalk.red('❌ Failed to start dev server:'), error.message);
    process.exit(1);
  });

  child.on('exit', (code) => {
    if (code !== 0) {
      console.error(chalk.red(`❌ Dev server exited with code ${code}`));
      process.exit(code || 1);
    }
  });

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log(chalk.yellow('\n\n👋 Shutting down dev server...'));
    child.kill('SIGINT');
    process.exit(0);
  });
}
