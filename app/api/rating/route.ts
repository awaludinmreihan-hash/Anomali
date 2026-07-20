import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Data tidak valid." }, { status: 400 });

  const { story_id, value, voter_hash } = body;

  if (!story_id || !voter_hash || typeof value !== "number" || value < 1 || value > 5) {
    return NextResponse.json({ error: "Rating tidak valid." }, { status: 400 });
  }

  const db = supabaseAdmin();

  const { error } = await db
    .from("ratings")
    .upsert(
      { story_id, value, voter_hash },
      { onConflict: "story_id,voter_hash" }
    );

  if (error) {
    return NextResponse.json({ error: "Gagal menyimpan rating." }, { status: 500 });
  }

  const { data: rows } = await db.from("ratings").select("value").eq("story_id", story_id);
  const avg = rows && rows.length ? rows.reduce((s, r) => s + r.value, 0) / rows.length : 0;

  return NextResponse.json({ ok: true, average: avg, count: rows?.length ?? 0 });
}

export async function GET(req: NextRequest) {
  const storyId = req.nextUrl.searchParams.get("story_id");
  if (!storyId) return NextResponse.json({ error: "story_id wajib diisi." }, { status: 400 });

  const db = supabaseAdmin();
  const { data: rows } = await db.from("ratings").select("value").eq("story_id", storyId);
  const avg = rows && rows.length ? rows.reduce((s, r) => s + r.value, 0) / rows.length : 0;

  return NextResponse.json({ average: avg, count: rows?.length ?? 0 });
}
