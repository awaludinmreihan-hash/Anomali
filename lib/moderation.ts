import crypto from "crypto";

// Kata/pola yang sering dipakai spam judi online & sejenisnya.
// Komentar yang match salah satu ini otomatis ditandai status "spam"
// (tetap tersimpan, tapi tidak pernah tampil ke publik & tidak masuk antrean
// moderasi utama, biar kamu gak capek scroll spam).
const BLOCKLIST_PATTERNS: RegExp[] = [
  /\bslot\s?(gacor|online|maxwin|deposit)\b/i,
  /\bjudi\s?(online|bola)\b/i,
  /\btogel\b/i,
  /\bmaxwin\b/i,
  /\brtp\s?\d/i,
  /\bwin\s?rate\b/i,
  /\bdaftar\s?(sekarang|via|link)\b/i,
  /\bcuan\s?(instan|cepat)\b/i,
  /(https?:\/\/|www\.)\S+/i, // link mentah di komentar publik -> anggap mencurigakan
  /\bwa\.me\/\d+/i,
  /\bt\.me\/\S+/i,
];

export function looksLikeSpam(text: string): boolean {
  return BLOCKLIST_PATTERNS.some((re) => re.test(text));
}

// Field honeypot: form publik punya input tersembunyi bernama "website"
// yang cuma keisi kalau diisi bot otomatis. Manusia gak pernah lihat/isi field ini.
export function honeypotTriggered(honeypotValue: unknown): boolean {
  return typeof honeypotValue === "string" && honeypotValue.trim().length > 0;
}

// Hash IP + salt rahasia, jadi kita gak simpan IP mentah tapi masih bisa
// dipakai buat rate-limit & cegah spam-vote rating dari sumber yang sama.
export function hashIp(ip: string): string {
  const salt = process.env.AUTH_SECRET || "fallback-salt";
  return crypto.createHash("sha256").update(ip + salt).digest("hex");
}

export function getClientIp(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return headers.get("x-real-ip") || "0.0.0.0";
}
