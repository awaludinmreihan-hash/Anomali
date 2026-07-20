import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { looksLikeSpam, honeypotTriggered, hashIp, getClientIp } from "@/lib/moderation";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Data tidak valid." }, { status: 400 });
  }

  const { story_id, author_name, content, website } = body;

  if (!story_id || !content || typeof content !== "string" || content.trim().length < 2) {
    return NextResponse.json({ error: "Komentar tidak boleh kosong." }, { status: 400 });
  }
  if (content.length > 2000) {
    return NextResponse.json({ error: "Komentar terlalu panjang." }, { status: 400 });
  }

  // Honeypot: bot ngisi field tersembunyi ini -> tolak diam-diam (pura-pura sukses)
  if (honeypotTriggered(website)) {
    return NextResponse.json({ ok: true });
  }

  const ip = getClientIp(req.headers);
  const ipHash = hashIp(ip);
  const db = supabaseAdmin();

  // Rate limit: maksimal 3 komentar per 10 menit dari IP yang sama
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const { count } = await db
    .from("comments")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", tenMinutesAgo);

  if ((count ?? 0) >= 3) {
    return NextResponse.json(
      { error: "Terlalu banyak komentar dalam waktu singkat. Coba lagi nanti." },
      { status: 429 }
    );
  }

  const cleanName = (author_name || "Anonim").toString().trim().slice(0, 60) || "Anonim";
  const status = looksLikeSpam(content) ? "spam" : "pending";

  const { error } = await db.from("comments").insert({
    story_id,
    author_name: cleanName,
    content: content.trim(),
    status,
    ip_hash: ipHash,
  });

  if (error) {
    return NextResponse.json({ error: "Gagal menyimpan komentar." }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    message:
      status === "spam"
        ? "Komentar diterima."
        : "Komentar diterima dan menunggu moderasi sebelum tampil.",
  });
}
