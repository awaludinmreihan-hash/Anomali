"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MarkdownEditor from "./MarkdownEditor";
import { Story, StatusBerkas } from "@/lib/types";

const STATUS_OPTIONS: StatusBerkas[] = ["AMAN", "DIAWASI", "DIKARANTINA", "DIMUSNAHKAN"];

export default function StoryForm({ initial }: { initial?: Story }) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt || "");
  const [content, setContent] = useState(initial?.content_md || "");
  const [statusBerkas, setStatusBerkas] = useState<StatusBerkas>(initial?.status_berkas || "AMAN");
  const [tags, setTags] = useState(initial?.tags.join(", ") || "");
  const [coverUrl, setCoverUrl] = useState(initial?.cover_image_url || "");
  const [published, setPublished] = useState(initial?.published || false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title,
      slug,
      excerpt,
      content_md: content,
      status_berkas: statusBerkas,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      cover_image_url: coverUrl || null,
      published,
    };

    const url = initial ? `/api/admin/stories/${initial.id}` : "/api/admin/stories";
    const method = initial ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Gagal menyimpan.");
    }
  }

  return (
    <form onSubmit={save} className="max-w-3xl mx-auto px-5 py-10 space-y-4">
      <h1 className="font-display text-2xl font-bold text-arsip-ink mb-4">
        {initial ? "Sunting berkas" : "Berkas baru"}
      </h1>

      <div>
        <label className="block font-mono text-xs uppercase tracking-widest text-arsip-soft mb-1">
          Judul
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-3 py-2 border border-arsip-line rounded bg-kraft-50 focus:outline-none focus:ring-2 focus:ring-stempel"
        />
      </div>

      <div>
        <label className="block font-mono text-xs uppercase tracking-widest text-arsip-soft mb-1">
          Slug URL (kosongkan untuk otomatis dari judul)
        </label>
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="contoh: kuntilanak-di-jalan-tol-cipularang"
          className="w-full px-3 py-2 border border-arsip-line rounded bg-kraft-50 focus:outline-none focus:ring-2 focus:ring-stempel font-mono text-sm"
        />
      </div>

      <div>
        <label className="block font-mono text-xs uppercase tracking-widest text-arsip-soft mb-1">
          Ringkasan (tampil di kartu & meta deskripsi Google)
        </label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          maxLength={300}
          className="w-full px-3 py-2 border border-arsip-line rounded bg-kraft-50 focus:outline-none focus:ring-2 focus:ring-stempel"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-mono text-xs uppercase tracking-widest text-arsip-soft mb-1">
            Status berkas
          </label>
          <select
            value={statusBerkas}
            onChange={(e) => setStatusBerkas(e.target.value as StatusBerkas)}
            className="w-full px-3 py-2 border border-arsip-line rounded bg-kraft-50"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-mono text-xs uppercase tracking-widest text-arsip-soft mb-1">
            Tag (pisah koma)
          </label>
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="jawa barat, jalan tol, transportasi"
            className="w-full px-3 py-2 border border-arsip-line rounded bg-kraft-50"
          />
        </div>
      </div>

      <div>
        <label className="block font-mono text-xs uppercase tracking-widest text-arsip-soft mb-1">
          URL gambar sampul (opsional)
        </label>
        <input
          value={coverUrl}
          onChange={(e) => setCoverUrl(e.target.value)}
          placeholder="https://..."
          className="w-full px-3 py-2 border border-arsip-line rounded bg-kraft-50"
        />
      </div>

      <div>
        <label className="block font-mono text-xs uppercase tracking-widest text-arsip-soft mb-1">
          Isi cerita
        </label>
        <MarkdownEditor value={content} onChange={setContent} />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
        Terbitkan (tampil ke publik)
      </label>

      {error && <p className="text-stempel text-sm">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="font-mono text-xs uppercase tracking-widest bg-arsip-ink text-kraft-50 px-6 py-3 rounded hover:bg-stempel transition-colors disabled:opacity-50"
      >
        {saving ? "Menyimpan..." : "Simpan berkas"}
      </button>
    </form>
  );
}
