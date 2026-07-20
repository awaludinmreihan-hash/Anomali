"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Story } from "@/lib/types";

export default function AdminDashboard() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/stories");
    const data = await res.json();
    setStories(data.stories || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function togglePublish(story: Story) {
    await fetch(`/api/admin/stories/${story.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...story, published: !story.published }),
    });
    load();
  }

  async function remove(story: Story) {
    if (!confirm(`Hapus berkas "${story.title}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    await fetch(`/api/admin/stories/${story.id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="max-w-5xl mx-auto px-5 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-arsip-ink">Semua Berkas</h1>
        <Link
          href="/admin/tulis"
          className="font-mono text-xs uppercase tracking-widest bg-stempel text-kraft-50 px-4 py-2 rounded hover:bg-stempel-dark transition-colors"
        >
          + Berkas baru
        </Link>
      </div>

      {loading ? (
        <p className="text-arsip-soft">Memuat...</p>
      ) : stories.length === 0 ? (
        <p className="text-arsip-soft italic">Belum ada berkas. Mulai tulis yang pertama.</p>
      ) : (
        <table className="w-full text-sm border border-arsip-line">
          <thead className="bg-kraft-200 font-mono text-xs uppercase tracking-widest text-left">
            <tr>
              <th className="p-3">Judul</th>
              <th className="p-3">Status berkas</th>
              <th className="p-3">Publikasi</th>
              <th className="p-3">Dilihat</th>
              <th className="p-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {stories.map((s) => (
              <tr key={s.id} className="border-t border-arsip-line">
                <td className="p-3 font-medium text-arsip-ink">{s.title}</td>
                <td className="p-3 font-mono text-xs">{s.status_berkas}</td>
                <td className="p-3">
                  <button
                    onClick={() => togglePublish(s)}
                    className={`font-mono text-[11px] px-2 py-1 rounded border ${
                      s.published
                        ? "border-emerald-700 text-emerald-800"
                        : "border-arsip-line text-arsip-soft"
                    }`}
                  >
                    {s.published ? "Terbit" : "Draf"}
                  </button>
                </td>
                <td className="p-3 font-mono text-xs">{s.views}</td>
                <td className="p-3 flex gap-3">
                  <Link href={`/admin/edit/${s.id}`} className="text-stempel hover:underline">
                    Edit
                  </Link>
                  <button onClick={() => remove(s)} className="text-arsip-soft hover:text-stempel">
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
