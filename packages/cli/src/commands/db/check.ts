/**
 * Check database connection and configuration
 */

import chalk from 'chalk';
import { createDatabaseFromEnv, detectRuntime } from '@ylstack/database';
import { parseDatabaseConfig } from '@ylstack/database/adapters';
import dotenv from 'dotenv';

export async function checkDatabase() {
  console.log(chalk.blue('🔍 Checking database configuration...\n'));

  // Load environment variables (override system env vars)
  dotenv.config({ override: true });

  // Detect runtime
  const runtime = detectRuntime();
  console.log(chalk.gray(`Runtime: ${runtime}`));

  // Parse database configuration
  const dbConfig = parseDatabaseConfig(process.env);
  
  console.log(chalk.gray(`Database type: ${dbConfig.type}`));
  
  if (dbConfig.url) {
    // Mask sensitive parts of URL
    const maskedUrl = dbConfig.url.replace(/:\/\/([^:]+):([^@]+)@/, '://***:***@');
    console.log(chalk.gray(`Database URL: ${maskedUrl}`));
  }
  
  if (dbConfig.authToken) {
    console.log(chalk.gray(`Auth token: ${dbConfig.authToken.substring(0, 10)}...`));
  }

  console.log(chalk.gray('\nAttempting connection...'));

  try {
    // Try to create database connection
    const db = await createDatabaseFromEnv(process.env);
    
    console.log(chalk.green('\n✅ Database connection successful!'));
    
    // Additional checks based on database type
    if (dbConfig.type === 'sqlite') {
      console.log(chalk.yellow('\n⚠️  SQLite is for development only'));
      console.log(chalk.gray('For production, use: turso, d1, or postgres'));
    }
    
    if (dbConfig.type === 'd1' && runtime !== 'cloudflare') {
      console.log(chalk.yellow('\n⚠️  D1 requires Cloudflare Workers runtime'));
    }
    
  } catch (error) {
    console.error(chalk.red('\n❌ Database connection failed'));
    if (error instanceof Error) {
      console.error(chalk.red(error.message));
    }
    
    console.log(chalk.gray('\nTroubleshooting:'));
    console.log(chalk.gray('  1. Check DATABASE_URL in .env file'));
    console.log(chalk.gray('  2. Verify DATABASE_TYPE is set correctly'));
    console.log(chalk.gray('  3. For Turso, ensure TURSO_AUTH_TOKEN is set'));
    console.log(chalk.gray('  4. For D1, ensure you\'re in Cloudflare Workers runtime'));
    
    process.exit(1);
  }
}
