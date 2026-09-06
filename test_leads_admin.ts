import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function testInsertAdmin() {
    console.log("Attempting to insert a lead with service_role...");
    const { data, error } = await supabase
        .from("leads")
        .insert([
            {
                client_name: "Admin Test User",
                client_phone: "987654321",
                client_email: "admin@example.com",
                message: "This is an admin test message",
                source: "website",
                status: "new",
            },
        ])
        .select()
        .single();

    if (error) {
        console.error("Insert Error (admin):", error);
    } else {
        console.log("Insert Success (admin):", data);
    }
}

testInsertAdmin();
