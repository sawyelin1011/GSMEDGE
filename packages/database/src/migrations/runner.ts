/**
 * YLSTACK Migration Runner
 * Runtime-agnostic database migration system
 */

import { migrate as migrateSQLite } from 'drizzle-orm/better-sqlite3/migrator';
import { migrate as migrateLibSQL } from 'drizzle-orm/libsql/migrator';
import { migrate as migrateD1 } from 'drizzle-orm/d1/migrator';
import { migrate as migratePostgres } from 'drizzle-orm/postgres-js/migrator';
import type { DatabaseInstance, DatabaseConfig } from '../adapters';

export interface MigrationConfig {
  migrationsFolder: string;
  migrationsTable?: string;
}

/**
 * Run migrations for any database type
 */
export async function runMigrations(
  db: DatabaseInstance,
  config: MigrationConfig,
  dbType: DatabaseConfig['type']
): Promise<void> {
  const { migrationsFolder, migrationsTable = 'migrations' } = config;
  
  console.log(`🔄 Running migrations from ${migrationsFolder}...`);
  
  try {
    switch (dbType) {
      case 'sqlite':
        await migrateSQLite(db as any, {
          migrationsFolder,
          migrationsTable,
        });
        break;
        
      case 'turso':
        await migrateLibSQL(db as any, {
          migrationsFolder,
          migrationsTable,
        });
        break;
        
      case 'd1':
        await migrateD1(db as any, {
          migrationsFolder,
          migrationsTable,
        });
        break;
        
      case 'postgres':
      case 'neon':
        await migratePostgres(db as any, {
          migrationsFolder,
          migrationsTable,
        });
        break;
        
      default:
        throw new Error(`Unsupported database type for migrations: ${dbType}`);
    }
    
    console.log('✅ Migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

/**
 * Generate migration files using drizzle-kit
 */
export async function generateMigrations(
  schemaPath: string,
  outFolder: string,
  dbType: DatabaseConfig['type']
): Promise<void> {
  console.log(`📝 Generating migrations for ${dbType}...`);
  
  // Map database types to Drizzle dialects
  const dialectMap: Record<DatabaseConfig['type'], string> = {
    sqlite: 'sqlite',
    turso: 'sqlite',
    d1: 'sqlite',
    postgres: 'postgresql',
    neon: 'postgresql',
  };
  
  const dialect = dialectMap[dbType];
  
  // This would typically call drizzle-kit programmatically
  // For now, we'll provide instructions
  console.log(`
  To generate migrations, run:
  
  npx drizzle-kit generate \\
    --schema=${schemaPath} \\
    --out=${outFolder} \\
    --dialect=${dialect}
  `);
}
