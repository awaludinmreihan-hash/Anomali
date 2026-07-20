import { supabasePublic } from "@/lib/supabase";
import { Story } from "@/lib/types";
import StoryCard from "@/components/StoryCard";
import { SITE } from "@/lib/site";

export const revalidate = 60;

export default async function HomePage() {
  const db = supabasePublic();
  const { data: stories } = await db
    .from("stories")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .returns<Story[]>();

  const list = stories || [];

  return (
    <div className="max-w-5xl mx-auto px-5 py-10">
      <section className="mb-12 border-b-4 border-arsip-ink pb-8">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-stempel mb-3">
          Dokumen tidak resmi &middot; sirkulasi terbatas
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-arsip-ink leading-tight max-w-3xl">
          Arsip anomali, mitos, dan keanehan yang katanya cuma ada di sini.
        </h1>
        <p className="mt-4 text-arsip-soft text-lg max-w-2xl leading-relaxed">
          {SITE.description} Setiap berkas berisi laporan investigasi fiksi
          tentang kejadian ganjil di penjuru negeri — dan sesekali, tentang
          keganjilan yang jauh lebih dekat: keadaan sehari-hari.
        </p>
      </section>

      {list.length === 0 ? (
        <div className="border border-dashed border-arsip-line rounded p-10 text-center text-arsip-soft">
          <p className="font-mono text-sm">Arsip masih kosong.</p>
          <p className="text-sm mt-1">Berkas pertama sedang disusun.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {list.map((story, i) => (
            <StoryCard key={story.id} story={story} index={list.length - i} />
          ))}
        </div>
      )}
    </div>
  );
}
