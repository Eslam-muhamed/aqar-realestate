import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testInsertNoSelect() {
    console.log("Attempting to insert a lead without select...");
    const { data, error } = await supabase
        .from("leads")
        .insert([
            {
                client_name: "Test User No Select",
                client_phone: "123456789",
                client_email: "test2@example.com",
                message: "This is a test message from script without select",
                source: "website",
                status: "new",
            },
        ]);

    if (error) {
        console.error("Insert Error (No Select):", error);
    } else {
        console.log("Insert Success (No Select):", data);
    }
}

testInsertNoSelect();
