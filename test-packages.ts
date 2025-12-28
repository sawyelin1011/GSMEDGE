// Test script to verify packages are importable as Node modules
// Run with: tsx test-packages.ts

console.log('🧪 Testing package imports...\n');

try {
  // Test @edge/core
  console.log('1️⃣ Testing @edge/core...');
  const core = await import('@edge/core');
  console.log('   ✅ @edge/core imported successfully');
  console.log('   📦 Exports:', Object.keys(core));
  
  // Test @edge/trpc-contracts
  console.log('\n2️⃣ Testing @edge/trpc-contracts...');
  const contracts = await import('@edge/trpc-contracts');
  console.log('   ✅ @edge/trpc-contracts imported successfully');
  console.log('   📦 Exports:', Object.keys(contracts));
  console.log('   📌 Version:', contracts.TRPC_CONTRACT_VERSION);
  
  // Test @edge/adapters
  console.log('\n3️⃣ Testing @edge/adapters...');
  const adapters = await import('@edge/adapters');
  console.log('   ✅ @edge/adapters imported successfully');
  console.log('   📦 Exports:', Object.keys(adapters));
  
  // Test @edge/api
  console.log('\n4️⃣ Testing @edge/api...');
  const api = await import('@edge/api');
  console.log('   ✅ @edge/api imported successfully');
  console.log('   📦 Type:', typeof api.default);
  
  console.log('\n✅ All packages are properly configured and importable!');
  console.log('🎉 Your monorepo is ready for development!\n');
  
} catch (error) {
  console.error('\n❌ Package import failed:');
  console.error(error);
  process.exit(1);
}
