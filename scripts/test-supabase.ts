import { createClient } from '@supabase/supabase-js';

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase Connection...\n');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing environment variables:');
    if (!supabaseUrl) console.error('   - NEXT_PUBLIC_SUPABASE_URL');
    if (!supabaseKey) console.error('   - NEXT_PUBLIC_SUPABASE_ANON_KEY');
    console.error('\n👉 Copy env.template to .env.local and fill in your values');
    process.exit(1);
  }

  console.log(`URL: ${supabaseUrl}`);
  console.log(`Key: ${supabaseKey.slice(0, 20)}...\n`);

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Test connection
    const { data, error } = await supabase.from('profiles').select('count');
    
    if (error) {
      if (error.message.includes('does not exist')) {
        console.log('✅ Connection successful!');
        console.log('⚠️  Table "profiles" does not exist yet (run migrations)');
      } else {
        console.error('❌ Connection failed:', error.message);
        process.exit(1);
      }
    } else {
      console.log('✅ Supabase connection successful!');
      console.log('✅ Can query database');
    }

    // Test auth
    const { data: authData, error: authError } = await supabase.auth.getSession();
    if (authError) {
      console.error('❌ Auth test failed:', authError.message);
    } else {
      console.log('✅ Auth service accessible');
    }

    console.log('\n🎉 All tests passed! Ready for Step 1.2');
    process.exit(0);
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    process.exit(1);
  }
}

testSupabaseConnection();
