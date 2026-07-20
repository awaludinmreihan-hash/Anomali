import { supabasePublic } from "@/lib/supabase";
import { Story } from "@/lib/types";
import StoryCard from "@/components/StoryCard";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Cari" };

export default async function CariPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = (searchParams.q || "").trim();
  let results: Story[] = [];

  if (q) {
    const db = supabasePublic();
    const { data } = await db
      .from("stories")
      .select("*")
      .eq("published", true)
      .textSearch("search_vector", q, { type: "websearch", config: "indonesian" })
      .order("created_at", { ascending: false })
      .returns<Story[]>();
    results = data || [];
  }

  return (
    <div className="max-w-5xl mx-auto px-5 py-10">
      <h1 className="font-display text-3xl font-bold text-arsip-ink mb-6">Cari berkas</h1>

      <form action="/cari" method="GET" className="mb-8 flex gap-2">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Cari judul, tag, atau isi cerita..."
          className="flex-1 px-4 py-3 border border-arsip-line rounded bg-kraft-100 focus:outline-none focus:ring-2 focus:ring-stempel"
          autoFocus
        />
        <button
          type="submit"
          className="font-mono text-xs uppercase tracking-widest bg-arsip-ink text-kraft-50 px-5 rounded hover:bg-stempel transition-colors"
        >
          Cari
        </button>
      </form>

      {q && (
        <p className="font-mono text-xs text-arsip-soft mb-4">
          {results.length} hasil untuk &ldquo;{q}&rdquo;
        </p>
      )}

      {q && results.length === 0 && (
        <p className="text-arsip-soft italic">Tidak ada berkas yang cocok. Coba kata kunci lain.</p>
      )}

      <div className="grid sm:grid-cols-2 gap-5">
        {results.map((story, i) => (
          <StoryCard key={story.id} story={story} index={results.length - i} />
        ))}
      </div>
    </div>
  );
}
