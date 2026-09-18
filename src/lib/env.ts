export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
export const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Copy .env.example to .env (locally) or set them in your Vercel project env (Production + Preview), then rebuild.',
  );
}

export const TABLES = {
  works: 'portofolio_kolin_works',
  skills: 'portofolio_kolin_skills',
  experience: 'portofolio_kolin_experience',
  recognition: 'portofolio_kolin_recognition',
  education: 'portofolio_kolin_education',
} as const;
