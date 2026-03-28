#!/usr/bin/env node

/**
 * VibeBuilder AI Setup Checker
 * Run this to verify your environment is properly configured
 */

const fs = require('fs');
const path = require('path');

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

function checkEnvFile() {
  const envPath = path.join(__dirname, '.env.local');
  const examplePath = path.join(__dirname, 'env.example');

  console.log(`${colors.blue}🔍 Checking environment configuration...${colors.reset}\n`);

  if (!fs.existsSync(envPath)) {
    console.log(`${colors.red}❌ .env.local file not found${colors.reset}`);
    console.log(`${colors.yellow}   Run: cp env.example .env.local${colors.reset}\n`);
    return false;
  }

  console.log(`${colors.green}✓ .env.local file exists${colors.reset}`);

  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'GROQ_API_KEY',
  ];

  const missing = [];
  const configured = [];

  for (const variable of requiredVars) {
    const regex = new RegExp(`${variable}=.+`);
    if (envContent.match(regex) && !envContent.match(`${variable}=your_`)) {
      configured.push(variable);
    } else {
      missing.push(variable);
    }
  }

  if (configured.length > 0) {
    console.log(`${colors.green}✓ Configured:${colors.reset}`);
    configured.forEach(v => console.log(`   ${colors.green}•${colors.reset} ${v}`));
  }

  if (missing.length > 0) {
    console.log(`\n${colors.red}❌ Missing or placeholder values:${colors.reset}`);
    missing.forEach(v => console.log(`   ${colors.red}•${colors.reset} ${v}`));
    console.log(`\n${colors.yellow}ℹ Get your API keys:${colors.reset}`);
    console.log(`   • Groq: https://console.groq.com (FREE - llama-3.3-70b)`);
    console.log(`   • Supabase: https://app.supabase.com (FREE tier)`);
    console.log(`   • OpenRouter: https://openrouter.ai (optional backup)`);
    return false;
  }

  console.log(`\n${colors.green}✓ All required environment variables configured${colors.reset}\n`);
  return true;
}

function printNextSteps() {
  console.log(`${colors.blue}📋 Next Steps:${colors.reset}\n`);
  console.log(`1. ${colors.yellow}Set up Supabase database:${colors.reset}`);
  console.log(`   - Go to https://app.supabase.com`);
  console.log(`   - Create a new project`);
  console.log(`   - Open SQL Editor and run: supabase/schema.sql`);
  console.log(`   - Copy Project URL and Anon Key to .env.local\n`);
  
  console.log(`2. ${colors.yellow}Get Groq API Key:${colors.reset}`);
  console.log(`   - Go to https://console.groq.com`);
  console.log(`   - Create free account`);
  console.log(`   - Generate API key and add to .env.local\n`);
  
  console.log(`3. ${colors.yellow}Run the app:${colors.reset}`);
  console.log(`   npm run dev`);
  console.log(`   Then open http://localhost:3000\n`);
}

function main() {
  console.log(`${colors.blue}`);
  console.log('╔════════════════════════════════════════╗');
  console.log('║     VibeBuilder AI Setup Checker       ║');
  console.log('╚════════════════════════════════════════╝');
  console.log(`${colors.reset}\n`);

  const envOk = checkEnvFile();

  if (!envOk) {
    printNextSteps();
    process.exit(1);
  }

  console.log(`${colors.green}🎉 Your environment is ready!${colors.reset}\n`);
  console.log(`${colors.blue}🚀 Start the app:${colors.reset} npm run dev`);
  console.log(`${colors.blue}🌐 Open:${colors.reset} http://localhost:3000\n`);
}

main();
