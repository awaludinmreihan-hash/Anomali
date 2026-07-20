"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [tab, setTab] = useState<"tulis" | "pratinjau">("tulis");

  return (
    <div className="border border-arsip-line rounded overflow-hidden">
      <div className="flex border-b border-arsip-line font-mono text-xs uppercase tracking-widest">
        <button
          type="button"
          onClick={() => setTab("tulis")}
          className={`px-4 py-2 ${tab === "tulis" ? "bg-arsip-ink text-kraft-50" : "bg-kraft-100 text-arsip-soft"}`}
        >
          Tulis
        </button>
        <button
          type="button"
          onClick={() => setTab("pratinjau")}
          className={`px-4 py-2 ${tab === "pratinjau" ? "bg-arsip-ink text-kraft-50" : "bg-kraft-100 text-arsip-soft"}`}
        >
          Pratinjau
        </button>
        <span className="ml-auto px-4 py-2 text-arsip-soft normal-case tracking-normal">
          Mendukung Markdown: **tebal**, *miring*, # judul, &gt; kutipan, daftar, tabel
        </span>
      </div>

      {tab === "tulis" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={22}
          placeholder="Tulis isi berkas di sini menggunakan Markdown..."
          className="w-full p-4 font-mono text-sm bg-kraft-50 focus:outline-none resize-y"
        />
      ) : (
        <div className="p-4 prose prose-sm max-w-none min-h-[400px] bg-kraft-50">
          {value.trim() ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
          ) : (
            <p className="text-arsip-soft italic">Belum ada isi untuk dipratinjau.</p>
          )}
        </div>
      )}
    </div>
  );
}
