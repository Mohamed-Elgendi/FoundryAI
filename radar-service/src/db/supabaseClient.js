import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env from project root (3 levels up from src/db)
const envLocalPath = join(__dirname, '../../../.env.local');
const envPath = join(__dirname, '../../../.env');
const envRadarPath = join(__dirname, '../.env');

console.log('Loading env from:', envLocalPath);
const result1 = dotenv.config({ path: envLocalPath });
if (result1.error) console.log('  .env.local not found or error:', result1.error.message);

console.log('Loading env from:', envPath);
const result2 = dotenv.config({ path: envPath });
if (result2.error) console.log('  .env not found or error:', result2.error.message);

console.log('Loading env from:', envRadarPath);
const result3 = dotenv.config({ path: envRadarPath });
if (result3.error) console.log('  radar .env not found or error:', result3.error.message);

console.log('SUPABASE_URL exists:', !!process.env.SUPABASE_URL);
console.log('NEXT_PUBLIC_SUPABASE_URL exists:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('SUPABASE_SERVICE_ROLE_KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Check your .env file.');
  console.error('SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '✓' : '✗');
  process.exit(1);
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function testConnection() {
  try {
    const { data, error } = await supabase.from('opportunities').select('count').single();
    if (error) throw error;
    console.log('✓ Supabase connection successful');
    return true;
  } catch (err) {
    console.error('✗ Supabase connection failed:', err.message);
    return false;
  }
}
