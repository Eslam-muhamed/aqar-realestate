import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("Seeding admin and supervisors...");
  
  // 1. Create Admin
  const { data: adminData, error: adminErr } = await supabase.auth.admin.createUser({
    email: 'admin@aqar.com',
    password: 'password123',
    email_confirm: true,
    user_metadata: { role: 'admin', full_name: 'مدير النظام' }
  });
  if (adminErr) {
    console.error("Admin error (may already exist):", adminErr.message);
  } else {
    console.log("Admin created:", adminData.user.id);
  }

  // 2. Create Supervisor 1
  const { data: sup1Data, error: sup1Err } = await supabase.auth.admin.createUser({
    email: 'ahmed@aqar.com',
    password: 'password123',
    email_confirm: true,
    user_metadata: { role: 'supervisor', full_name: 'أحمد المشرف' }
  });
  if (sup1Err) {
    console.error("Sup1 error (may already exist):", sup1Err.message);
  } else {
    console.log("Sup1 created:", sup1Data.user.id);
  }

  // 3. Create Supervisor 2
  const { data: sup2Data, error: sup2Err } = await supabase.auth.admin.createUser({
    email: 'sarah@aqar.com',
    password: 'password123',
    email_confirm: true,
    user_metadata: { role: 'supervisor', full_name: 'سارة المشرفة' }
  });
  if (sup2Err) {
    console.error("Sup2 error (may already exist):", sup2Err.message);
  } else {
    console.log("Sup2 created:", sup2Data.user.id);
  }

  // Allow trigger time to create profiles
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Get users
  const { data: usersData } = await supabase.auth.admin.listUsers();
  const users = usersData.users;
  const adminUser = users.find(u => u.email === 'admin@aqar.com');
  const sup1User = users.find(u => u.email === 'ahmed@aqar.com');
  const sup2User = users.find(u => u.email === 'sarah@aqar.com');

  if (sup1User && sup2User && adminUser) {
    console.log("Inserting leads...");
    const { error: leadsErr } = await supabase.from('leads').insert([
        {
            client_name: 'خالد عبد الله',
            client_phone: '0501234567',
            message: 'مهتم بفيلا في الرياض',
            status: 'new',
            assigned_to: sup1User.id,
            assigned_by: adminUser.id,
            assigned_at: new Date().toISOString(),
            source: 'website'
        },
        {
            client_name: 'محمد سعيد',
            client_phone: '0507654321',
            message: 'أبحث عن شقة قريبة من المركز',
            status: 'contacted',
            assigned_to: sup1User.id,
            assigned_by: adminUser.id,
            assigned_at: new Date().toISOString(),
            source: 'website'
        },
        {
            client_name: 'نورة الدوسري',
            client_phone: '0551122334',
            message: 'كم سعر الدوبلكس في جدة؟',
            status: 'new',
            assigned_to: sup2User.id,
            assigned_by: adminUser.id,
            assigned_at: new Date().toISOString(),
            source: 'website'
        }
    ]);
    if (leadsErr) console.error("Leads insert error:", leadsErr.message);
    else console.log("Leads inserted successfully.");
  } else {
    console.log("Could not find users to assign leads to.");
  }
}

seed();
