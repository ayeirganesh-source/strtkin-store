// Supabase Configuration
const SUPABASE_URL = "https://rkroxmhxokohupziguba.supabase.co";
const SUPABASE_KEY = "sb_publishable_uykpzHQ3sL3BWMBqQRkkHQ_pUrNS2g4"; 

// Initialize Supabase client via CDN script loaded in HTML
const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY);