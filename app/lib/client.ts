import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
const projectId = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID!
const publicAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
export const supabaseUrl = `https://${projectId}.supabase.co`
export const supabaseKey = publicAnonKey
export const supabase = createPagesBrowserClient({
    supabaseUrl, supabaseKey
});
