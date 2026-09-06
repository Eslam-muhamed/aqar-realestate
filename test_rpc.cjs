const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function testAuth() {
  console.log('Trying to log in with mosalah@amsh.com...');
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'mosalah@amsh.com',
    password: '123132Dd'
  });
  
  if (error) {
    console.error('Login failed:', error.message);
  } else {
    console.log('Login success!', data.user.id);
  }
}

testAuth();
