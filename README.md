# Anomali Nusantara (ganti nama sesukamu)

Arsip cerita anomali/mitos/ghaib bergaya "berkas negara" dengan sarkasme sosial-politik Indonesia. Dibangun pakai Next.js + Supabase, gratis untuk hosting skala personal.

Fitur: tulis & baca cerita (markdown), pencarian full-text, rating "tingkat kengerian", komentar anonim dengan moderasi (honeypot, rate limit, blocklist kata spam/judi online), SEO (sitemap, meta tags, structured data).

---

## 0. Yang kamu butuhkan (semua gratis)

- Akun [GitHub](https://github.com)
- Akun [Vercel](https://vercel.com) (bisa daftar pakai akun GitHub)
- Akun [Supabase](https://supabase.com) (bisa daftar pakai akun GitHub)
- Node.js versi 18+ terpasang di komputer (untuk coba jalan lokal dulu — opsional tapi disarankan)

---

## 1. Setup database (Supabase)

1. Buka [supabase.com](https://supabase.com) → **New Project**.
2. Kasih nama project bebas, bikin password database (simpan baik-baik), pilih region terdekat (Singapore paling deket ke Indonesia).
3. Tunggu project selesai dibuat (±2 menit).
4. Di sidebar kiri, buka **SQL Editor** → **New query**.
5. Buka file `supabase/schema.sql` di project ini, copy semua isinya, paste ke SQL Editor, klik **Run**.
   - Ini bakal bikin tabel `stories`, `comments`, `ratings`, plus aturan keamanan (Row Level Security) dan full-text search.
6. Buka **Project Settings** (ikon gear) → **API**. Catat 3 nilai ini, nanti dipakai di langkah 3:
   - `Project URL` → jadi `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → jadi `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key (klik "Reveal") → jadi `SUPABASE_SERVICE_ROLE_KEY`. **Rahasiakan key ini, jangan pernah taruh di kode frontend atau commit ke GitHub publik.**

---

## 2. Coba jalan di komputer sendiri dulu (opsional tapi disarankan)

```bash
npm install
cp .env.example .env.local
```

Buka `.env.local`, isi semua variabel:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` dari langkah 1.
- `ADMIN_PASSWORD` → password buat login ke `/admin`, bikin yang kuat.
- `AUTH_SECRET` → string acak panjang. Generate dengan `openssl rand -hex 32` di terminal, atau random string apapun min. 32 karakter.
- `NEXT_PUBLIC_SITE_NAME` dan `NEXT_PUBLIC_SITE_DESCRIPTION` → nama & tagline situsmu.
- `NEXT_PUBLIC_SITE_URL` → biarkan `http://localhost:3000` untuk sekarang.

Jalankan:
```bash
npm run dev
```
Buka `http://localhost:3000` — beranda situs. Buka `http://localhost:3000/admin` — login pakai `ADMIN_PASSWORD` tadi, lalu coba tulis cerita pertamamu.

---

## 3. Deploy online (Vercel)

1. Push folder project ini ke repo GitHub baru (bisa lewat GitHub Desktop atau:
   ```bash
   git init
   git add .
   git commit -m "init"
   git remote add origin <url-repo-github-kamu>
   git push -u origin main
   ```
   ).
2. Buka [vercel.com](https://vercel.com) → **Add New Project** → pilih repo GitHub tadi → **Import**.
3. Di bagian **Environment Variables**, masukkan semua variabel yang sama seperti di `.env.local` (langkah 2), termasuk `NEXT_PUBLIC_SITE_URL` — tapi kali ini isi dengan URL Vercel kamu nanti, misalnya `https://anomali-nusantara.vercel.app` (bisa disesuaikan lagi setelah deploy pertama).
4. Klik **Deploy**. Tunggu ±2 menit.
5. Setelah selesai, kamu dapat URL publik. Kalau URL beda dari yang kamu isi di `NEXT_PUBLIC_SITE_URL`, update env var itu di **Project Settings → Environment Variables**, lalu **Redeploy**.
6. (Opsional) Pasang domain sendiri di **Project Settings → Domains** kalau kamu beli domain custom.

Situsmu sekarang online. Buka `https://domainmu.com/admin` untuk mulai nulis cerita.

---

## 4. Biar muncul di Google

1. Buka [Google Search Console](https://search.google.com/search-console) → tambah properti pakai URL situsmu → verifikasi kepemilikan (Vercel biasanya kasih opsi verifikasi lewat DNS atau meta tag).
2. Di Search Console, submit sitemap: `https://domainmu.com/sitemap.xml` (sudah otomatis dibuat oleh situs ini).
3. Tulis cerita dengan judul & isi yang natural menyebut istilah yang orang cari, misalnya "anomali indonesia", nama daerah, nama mitos lokal, dll — jangan dipaksa berulang-ulang (Google malah menghukum keyword stuffing).
4. Tiap cerita otomatis punya meta description (dari kolom "Ringkasan" saat nulis) dan structured data `Article` — ini membantu Google memahami & menampilkan halamanmu dengan baik.
5. Butuh waktu beberapa hari–minggu sampai Google meng-index & cerita mulai muncul di hasil pencarian. Makin sering ada cerita baru & makin banyak yang share link-nya, makin cepat naik.
6. Bagikan link cerita ke media sosial/forum — backlink dari luar juga bantu SEO.

---

## Struktur & cara kerja penting

- **Menulis cerita**: lewat `/admin/tulis`, ada tab "Tulis" (markdown) dan "Pratinjau". Cerita berstatus **Draf** sampai kamu centang "Terbitkan".
- **Status berkas**: klasifikasi custom (bukan istilah SCP) — `AMAN`, `DIAWASI`, `DIKARANTINA`, `DIMUSNAHKAN` — tampil sebagai stempel merah di tiap cerita. Bisa kamu ganti maknanya sesuka hati di `lib/types.ts`.
- **Komentar**: publik bisa komentar anonim tanpa akun. Semua komentar masuk status "pending" dulu (kecuali kena filter spam otomatis → langsung ke folder "spam"), kamu approve manual di `/admin/komentar`. ada 3 lapis anti-spam: honeypot field, rate limit 3 komentar/10 menit per IP, dan filter kata kunci judi online/spam (bisa ditambah di `lib/moderation.ts`).
- **Rating**: pembaca kasih 1-5 "tingkat kengerian" tanpa akun, dibatasi satu vote per browser (disimpan lewat `localStorage`, bukan sistem keamanan ketat tapi cukup untuk mencegah spam vote kasual).
- **Pencarian**: full-text search bawaan Postgres, mendukung bahasa Indonesia (stemming kata dasar).

## Kalau mau ganti desain/warna

Semua token warna & font ada di `tailwind.config.js` dan `app/globals.css`. Fontnya: **Zilla Slab** (judul), **PT Serif** (isi), **Courier Prime** (label/stempel/meta) — bisa diganti font Google Fonts lain di `app/layout.tsx`.

## Biaya

Semua di atas gratis untuk skala blog personal:
- Vercel Hobby plan: gratis, cukup untuk trafik menengah.
- Supabase Free plan: gratis, database sampai 500MB + 50rb monthly active users — jauh lebih dari cukup untuk awal.

Kalau nanti situsnya makin rame dan kena limit, baru perlu upgrade (mulai ~$20/bulan Supabase Pro, atau Vercel Pro) — tapi itu tanda bagus (banyak pembaca).
