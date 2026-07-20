import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAdminAuthed } from "@/lib/auth";
import slugify from "slugify";

export async function GET() {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("stories")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ stories: data });
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  if (!body?.title) {
    return NextResponse.json({ error: "Judul wajib diisi." }, { status: 400 });
  }

  const db = supabaseAdmin();

  let baseSlug = slugify(body.slug || body.title, { lower: true, strict: true, locale: "id" });
  let slug = baseSlug;
  let n = 1;
  while (true) {
    const { data: existing } = await db.from("stories").select("id").eq("slug", slug).maybeSingle();
    if (!existing) break;
    n += 1;
    slug = `${baseSlug}-${n}`;
  }

  const { data, error } = await db
    .from("stories")
    .insert({
      slug,
      title: body.title,
      excerpt: body.excerpt || "",
      content_md: body.content_md || "",
      status_berkas: body.status_berkas || "AMAN",
      tags: Array.isArray(body.tags) ? body.tags : [],
      cover_image_url: body.cover_image_url || null,
      published: !!body.published,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ story: data });
}
