#!/usr/bin/env tsx
/**
 * Package Verification Script
 * 
 * Verifies that all packages in the monorepo are properly configured and importable.
 * Run this script before committing changes to the package structure.
 * 
 * Usage: npx tsx scripts/verify-packages.ts
 */

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

interface PackageConfig {
  name: string;
  path: string;
  expectedExports: string[];
}

const PACKAGES: PackageConfig[] = [
  {
    name: '@edge/core',
    path: 'packages/core',
    expectedExports: ['.', './domain/*', './services/*', './policies/*']
  },
  {
    name: '@edge/trpc-contracts',
    path: 'packages/trpc-contracts',
    expectedExports: ['.']
  },
  {
    name: '@edge/adapters',
    path: 'packages/adapters',
    expectedExports: ['.']
  },
  {
    name: '@edge/api',
    path: 'apps/api',
    expectedExports: ['.', './deploy/*']
  }
];

interface VerificationResult {
  package: string;
  checks: {
    packageJsonExists: boolean;
    hasName: boolean;
    hasExports: boolean;
    hasTypeModule: boolean;
    exportsValid: boolean;
    symlinkExists: boolean;
    importable: boolean;
  };
  errors: string[];
}

async function verifyPackage(config: PackageConfig): Promise<VerificationResult> {
  const result: VerificationResult = {
    package: config.name,
    checks: {
      packageJsonExists: false,
      hasName: false,
      hasExports: false,
      hasTypeModule: false,
      exportsValid: false,
      symlinkExists: false,
      importable: false
    },
    errors: []
  };

  // Check 1: package.json exists
  const packageJsonPath = join(process.cwd(), config.path, 'package.json');
  result.checks.packageJsonExists = existsSync(packageJsonPath);
  
  if (!result.checks.packageJsonExists) {
    result.errors.push(`package.json not found at ${packageJsonPath}`);
    return result;
  }

  // Check 2: Parse package.json
  let packageJson: any;
  try {
    const content = readFileSync(packageJsonPath, 'utf-8');
    packageJson = JSON.parse(content);
  } catch (error) {
    result.errors.push(`Failed to parse package.json: ${error}`);
    return result;
  }

  // Check 3: Has correct name
  result.checks.hasName = packageJson.name === config.name;
  if (!result.checks.hasName) {
    result.errors.push(`Expected name "${config.name}", got "${packageJson.name}"`);
  }

  // Check 4: Has exports field
  result.checks.hasExports = !!packageJson.exports;
  if (!result.checks.hasExports) {
    result.errors.push('Missing "exports" field in package.json');
  }

  // Check 5: Has type: module
  result.checks.hasTypeModule = packageJson.type === 'module';
  if (!result.checks.hasTypeModule) {
    result.errors.push('Missing or incorrect "type" field (should be "module")');
  }

  // Check 6: Exports are valid
  if (result.checks.hasExports) {
    const exports = packageJson.exports;
    const hasAllExpectedExports = config.expectedExports.every(exp => 
      Object.keys(exports).some(key => key === exp)
    );
    result.checks.exportsValid = hasAllExpectedExports;
    
    if (!result.checks.exportsValid) {
      result.errors.push(`Missing expected exports. Expected: ${config.expectedExports.join(', ')}`);
    }
  }

  // Check 7: Symlink exists in node_modules
  // npm creates symlinks like node_modules/@edge/core (keeps the @)
  const symlinkPath = join(process.cwd(), 'node_modules', config.name);
  result.checks.symlinkExists = existsSync(symlinkPath);
  
  if (!result.checks.symlinkExists) {
    result.errors.push(`Symlink not found at ${symlinkPath}. Run "npm install" to create workspace links.`);
  }

  // Check 8: Package is importable
  try {
    await import(config.name);
    result.checks.importable = true;
  } catch (error) {
    result.errors.push(`Failed to import package: ${error}`);
  }

  return result;
}

async function verifyWorkspaceRoot(): Promise<{ valid: boolean; errors: string[] }> {
  const errors: string[] = [];
  const rootPackageJsonPath = join(process.cwd(), 'package.json');

  if (!existsSync(rootPackageJsonPath)) {
    errors.push('Root package.json not found');
    return { valid: false, errors };
  }

  const content = readFileSync(rootPackageJsonPath, 'utf-8');
  const packageJson = JSON.parse(content);

  // Check workspaces field
  if (!packageJson.workspaces) {
    errors.push('Root package.json missing "workspaces" field');
  } else {
    const expectedWorkspaces = ['apps/*', 'packages/*'];
    const hasAllWorkspaces = expectedWorkspaces.every(ws => 
      packageJson.workspaces.includes(ws)
    );
    
    if (!hasAllWorkspaces) {
      errors.push(`Workspaces should include: ${expectedWorkspaces.join(', ')}`);
    }
  }

  return { valid: errors.length === 0, errors };
}

async function main() {
  console.log('🔍 Verifying Edge Starter Kit Package System...\n');

  // Verify workspace root
  console.log('📦 Checking workspace root configuration...');
  const rootResult = await verifyWorkspaceRoot();
  
  if (rootResult.valid) {
    console.log('   ✅ Workspace root is properly configured\n');
  } else {
    console.log('   ❌ Workspace root has issues:');
    rootResult.errors.forEach(err => console.log(`      - ${err}`));
    console.log();
  }

  // Verify each package
  const results: VerificationResult[] = [];
  
  for (const packageConfig of PACKAGES) {
    console.log(`📦 Verifying ${packageConfig.name}...`);
    const result = await verifyPackage(packageConfig);
    results.push(result);

    // Print check results
    const checks = result.checks;
    console.log(`   ${checks.packageJsonExists ? '✅' : '❌'} package.json exists`);
    console.log(`   ${checks.hasName ? '✅' : '❌'} Correct package name`);
    console.log(`   ${checks.hasTypeModule ? '✅' : '❌'} Has "type": "module"`);
    console.log(`   ${checks.hasExports ? '✅' : '❌'} Has exports field`);
    console.log(`   ${checks.exportsValid ? '✅' : '❌'} Exports are valid`);
    console.log(`   ${checks.symlinkExists ? '✅' : '❌'} Symlink exists`);
    console.log(`   ${checks.importable ? '✅' : '❌'} Package is importable`);

    if (result.errors.length > 0) {
      console.log('   ⚠️  Issues found:');
      result.errors.forEach(err => console.log(`      - ${err}`));
    }
    
    console.log();
  }

  // Summary
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 VERIFICATION SUMMARY\n');

  const allPassed = results.every(r => 
    Object.values(r.checks).every(check => check === true)
  ) && rootResult.valid;

  if (allPassed) {
    console.log('✅ All packages are properly configured!');
    console.log('🎉 Your monorepo is ready for development!\n');
    process.exit(0);
  } else {
    console.log('❌ Some packages have issues. Please fix the errors above.\n');
    
    // Print summary of failed packages
    const failedPackages = results.filter(r => 
      Object.values(r.checks).some(check => check === false)
    );
    
    if (failedPackages.length > 0) {
      console.log('Failed packages:');
      failedPackages.forEach(pkg => {
        console.log(`  - ${pkg.package}`);
      });
      console.log();
    }

    console.log('💡 Suggested fixes:');
    console.log('  1. Run "npm install" to create workspace links');
    console.log('  2. Check that all package.json files have correct exports');
    console.log('  3. Ensure all packages have "type": "module"');
    console.log('  4. Verify package names match @edge/* namespace\n');
    
    process.exit(1);
  }
}

// Run verification
main().catch(error => {
  console.error('❌ Verification failed with error:', error);
  process.exit(1);
});
