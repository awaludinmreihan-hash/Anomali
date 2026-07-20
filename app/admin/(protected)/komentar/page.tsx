"use client";

import { useEffect, useState } from "react";

interface CommentRow {
  id: string;
  author_name: string;
  content: string;
  status: string;
  created_at: string;
  stories: { title: string; slug: string } | null;
}

export default function KomentarPage() {
  const [tab, setTab] = useState<"pending" | "approved" | "spam">("pending");
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/admin/comments?status=${tab}`);
    const data = await res.json();
    setComments(data.comments || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  async function setStatus(id: string, status: string) {
    await fetch(`/api/admin/comments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  async function remove(id: string) {
    await fetch(`/api/admin/comments/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="max-w-4xl mx-auto px-5 py-10">
      <h1 className="font-display text-2xl font-bold text-arsip-ink mb-4">Moderasi Komentar</h1>

      <div className="flex gap-2 mb-6 font-mono text-xs uppercase tracking-widest">
        {(["pending", "approved", "spam"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-2 rounded border ${
              tab === t ? "bg-arsip-ink text-kraft-50 border-arsip-ink" : "border-arsip-line text-arsip-soft"
            }`}
          >
            {t === "pending" ? "Menunggu" : t === "approved" ? "Tayang" : "Spam"}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-arsip-soft">Memuat...</p>
      ) : comments.length === 0 ? (
        <p className="text-arsip-soft italic">Tidak ada komentar di kategori ini.</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((c) => (
            <li key={c.id} className="border border-arsip-line rounded p-4 bg-kraft-100">
              <div className="flex items-baseline justify-between text-sm mb-1">
                <span className="font-semibold text-arsip-ink">{c.author_name}</span>
                <span className="font-mono text-[11px] text-arsip-soft">
                  {c.stories?.title || "(berkas dihapus)"} &middot;{" "}
                  {new Date(c.created_at).toLocaleString("id-ID")}
                </span>
              </div>
              <p className="text-arsip-soft whitespace-pre-wrap mb-3">{c.content}</p>
              <div className="flex gap-3 font-mono text-xs uppercase tracking-widest">
                {c.status !== "approved" && (
                  <button onClick={() => setStatus(c.id, "approved")} className="text-emerald-800 hover:underline">
                    Tayangkan
                  </button>
                )}
                {c.status !== "spam" && (
                  <button onClick={() => setStatus(c.id, "spam")} className="text-darurat hover:underline">
                    Tandai spam
                  </button>
                )}
                <button onClick={() => remove(c.id)} className="text-stempel hover:underline">
                  Hapus permanen
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
