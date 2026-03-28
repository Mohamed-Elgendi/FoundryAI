import { runRadar } from './radar.js';

/**
 * Entry point for manual execution
 * Run with: node src/index.js
 */
async function main() {
  console.log('='.repeat(50));
  console.log('  Opportunity Radar - Manual Run');
  console.log('='.repeat(50));
  
  const startTime = Date.now();
  const result = await runRadar();
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  
  console.log(`\n⏱️  Duration: ${duration}s`);
  
  if (result.success) {
    console.log('\n🎉 Radar completed successfully!');
    process.exit(0);
  } else {
    console.error('\n❌ Radar failed:', result.error);
    process.exit(1);
  }
}

main();
