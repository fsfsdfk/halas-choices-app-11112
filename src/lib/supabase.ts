// ============================================
// Supabase client helpers
// ============================================
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Browser / RSC client (anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client with service role (for admin writes)
export function createServiceClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });
}
