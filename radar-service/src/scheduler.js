import cron from 'node-cron';
import { runRadar } from './radar.js';
import { testConnection } from './db/supabaseClient.js';

/**
 * Scheduler - runs radar automatically
 * Default: Every day at 2:00 AM
 * 
 * Cron format: * * * * *
 *              | | | | |
 *              | | | | +-- Day of week (0-7, Sunday = 0 or 7)
 *              | | | +---- Month (1-12)
 *              | | +------ Day of month (1-31)
 *              | +-------- Hour (0-23)
 *              +---------- Minute (0-59)
 */

const CRON_SCHEDULE = process.env.RADAR_CRON || '0 2 * * *'; // 2 AM daily

async function startScheduler() {
  console.log('='.repeat(60));
  console.log('  Opportunity Radar - Scheduler');
  console.log('='.repeat(60));
  console.log(`\n📅 Schedule: ${CRON_SCHEDULE}`);
  console.log('   (Daily at 2:00 AM UTC)\n');
  
  // Test database connection
  console.log('Testing database connection...');
  const connected = await testConnection();
  if (!connected) {
    console.error('Failed to connect to database. Exiting.');
    process.exit(1);
  }
  
  // Run once on startup for testing
  console.log('\n🚀 Running initial scan...\n');
  await runRadar();
  
  // Schedule regular runs
  console.log('\n⏰ Starting scheduler...\n');
  
  cron.schedule(CRON_SCHEDULE, async () => {
    console.log('\n' + '='.repeat(60));
    console.log(`  Scheduled run at ${new Date().toISOString()}`);
    console.log('='.repeat(60));
    await runRadar();
  });
  
  console.log('✓ Scheduler is running. Press Ctrl+C to stop.\n');
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n👋 Shutting down gracefully...');
  process.exit(0);
});

startScheduler().catch(error => {
  console.error('Scheduler error:', error);
  process.exit(1);
});
