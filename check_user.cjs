const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkUser() {
  const { data: { users }, error } = await supabase.auth.admin.listUsers();
  if (error) {
    console.error('Error fetching users:', error);
    return;
  }
  
  const user = users.find(u => u.email === 'mosalah@amsh.com');
  console.log('User found in auth.users:', user ? 'YES' : 'NO');
  if (user) {
      console.log('User details:', {
          id: user.id,
          email: user.email,
          role: user.role,
          email_confirmed_at: user.email_confirmed_at,
          identities: user.identities?.length
      });
  }

  const { data: profile } = await supabase.from('profiles').select('*').eq('email', 'mosalah@amsh.com').single();
  console.log('Profile found:', profile ? 'YES' : 'NO');
  if (profile) {
      console.log('Profile details:', profile);
  }
}

checkUser();
