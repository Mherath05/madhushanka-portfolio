import { createBrowserClient } from '@supabase/ssr';

const FALLBACK_SUPABASE_URL = "https://xriorhrhqolktjyzrymy.supabase.co";
const FALLBACK_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyaW9yaHJocW9sa3RqeXpyeW15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3Njg0NzEsImV4cCI6MjEwMDM0NDQ3MX0.A--o5r1WOjuLk5v8hNGFP1XcexmgQdSWrPM13aUG42Y";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY;

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
