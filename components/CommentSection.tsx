"use client";

import { useState } from "react";
import { Comment } from "@/lib/types";

export default function CommentSection({
  storyId,
  initialComments,
}: {
  storyId: string;
  initialComments: Comment[];
}) {
  const [comments, setComments] = useState(initialComments);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [website, setWebsite] = useState(""); // honeypot, harus tetap kosong
  const [status, setStatus] = useState<null | { ok: boolean; message: string }>(null);
  const [sending, setSending] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setSending(true);
    setStatus(null);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          story_id: storyId,
          author_name: name,
          content,
          website,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ ok: true, message: data.message || "Komentar terkirim." });
        setContent("");
        setName("");
      } else {
        setStatus({ ok: false, message: data.error || "Gagal mengirim komentar." });
      }
    } catch {
      setStatus({ ok: false, message: "Gagal mengirim komentar. Coba lagi." });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mt-10">
      <h3 className="font-display text-xl font-semibold text-arsip-ink mb-4">
        Kesaksian pembaca ({comments.length})
      </h3>

      <form onSubmit={submit} className="border border-arsip-line rounded p-4 bg-kraft-100 mb-6">
        {/* Honeypot: field tersembunyi untuk bot, jangan tampil ke manusia */}
        <input
          type="text"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
        <input
          type="text"
          placeholder="Nama (opsional, boleh anonim)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={60}
          className="w-full mb-2 px-3 py-2 border border-arsip-line rounded bg-kraft-50 text-sm focus:outline-none focus:ring-2 focus:ring-stempel"
        />
        <textarea
          placeholder="Tulis kesaksian atau tanggapanmu tentang berkas ini..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={2000}
          rows={4}
          required
          className="w-full mb-2 px-3 py-2 border border-arsip-line rounded bg-kraft-50 text-sm focus:outline-none focus:ring-2 focus:ring-stempel"
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-arsip-soft">Komentar ditinjau dulu sebelum tampil publik.</p>
          <button
            type="submit"
            disabled={sending}
            className="font-mono text-xs uppercase tracking-widest bg-arsip-ink text-kraft-50 px-4 py-2 rounded hover:bg-stempel transition-colors disabled:opacity-50"
          >
            {sending ? "Mengirim..." : "Kirim"}
          </button>
        </div>
        {status && (
          <p className={`mt-2 text-sm ${status.ok ? "text-emerald-800" : "text-stempel"}`}>
            {status.message}
          </p>
        )}
      </form>

      {comments.length === 0 ? (
        <p className="text-arsip-soft italic text-sm">Belum ada kesaksian. Jadilah yang pertama.</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((c) => (
            <li key={c.id} className="border-b hairline pb-4">
              <div className="flex items-baseline justify-between">
                <span className="font-semibold text-arsip-ink">{c.author_name}</span>
                <span className="font-mono text-[11px] text-arsip-soft">
                  {new Date(c.created_at).toLocaleDateString("id-ID")}
                </span>
              </div>
              <p className="mt-1 text-arsip-soft leading-relaxed whitespace-pre-wrap">{c.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
