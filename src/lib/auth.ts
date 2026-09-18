import { supabase } from './supabase';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL ?? 'admin@portfolio.local';

export async function login(password: string): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase.auth.signInWithPassword({ email: ADMIN_EMAIL, password });
  if (!error) return { ok: true };
  const wrongPassword = /invalid login credentials/i.test(error.message);
  return { ok: false, error: wrongPassword ? 'Incorrect password.' : error.message };
}

export async function isAuthed(): Promise<boolean> {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
}

export async function logout(): Promise<void> {
  await supabase.auth.signOut();
}
