import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function testFetchAdmin() {
    console.log("Fetching leads with admin key...");
    const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(2);
    if (error) {
        console.error("Fetch Error:", error);
    } else {
        console.log("Fetched Leads:", data.map(d => d.client_name));
    }
}

testFetchAdmin();
