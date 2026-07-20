import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Dipakai untuk baca data publik (cerita published, komentar approved).
// Aman dipakai di client maupun server karena dibatasi Row Level Security.
export function supabasePublic() {
  return createClient(url, anonKey, {
    auth: { persistSession: false },
  });
}

// HANYA dipakai di server (route handlers / server components), tidak pernah
// diekspos ke browser. Bypass RLS, dipakai untuk insert komentar/rating,
// dan semua operasi admin (tulis/edit/hapus cerita, moderasi komentar).
export function supabaseAdmin() {
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}
