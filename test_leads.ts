import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testInsert() {
    console.log("Attempting to insert a lead...");
    const { data, error } = await supabase
        .from("leads")
        .insert([
            {
                client_name: "Test User",
                client_phone: "123456789",
                client_email: "test@example.com",
                message: "This is a test message from script",
                source: "website",
                status: "new",
            },
        ])
        .select()
        .single();

    if (error) {
        console.error("Insert Error:", error);
    } else {
        console.log("Insert Success:", data);
    }
    
    console.log("Attempting to fetch leads...");
    const { data: fetch_data, error: fetch_error } = await supabase.from('leads').select('*').limit(5);
    if (fetch_error) {
        console.error("Fetch Error:", fetch_error);
    } else {
        console.log("Fetched Leads:", fetch_data);
    }
}

testInsert();
