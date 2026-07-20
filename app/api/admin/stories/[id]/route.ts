import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAdminAuthed } from "@/lib/auth";
import slugify from "slugify";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const db = supabaseAdmin();
  const { data, error } = await db.from("stories").select("*").eq("id", params.id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ story: data });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Data tidak valid." }, { status: 400 });

  const db = supabaseAdmin();

  const update: Record<string, unknown> = {
    title: body.title,
    excerpt: body.excerpt,
    content_md: body.content_md,
    status_berkas: body.status_berkas,
    tags: Array.isArray(body.tags) ? body.tags : [],
    cover_image_url: body.cover_image_url || null,
    published: !!body.published,
  };

  if (body.slug) {
    update.slug = slugify(body.slug, { lower: true, strict: true, locale: "id" });
  }

  const { data, error } = await db
    .from("stories")
    .update(update)
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ story: data });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const db = supabaseAdmin();
  const { error } = await db.from("stories").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
