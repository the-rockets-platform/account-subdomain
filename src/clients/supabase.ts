import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL || "";
const anonPublicKey = process.env.SUPABASE_ANON_PUBLIC_KEY || "";

export default createClient(url, anonPublicKey);
