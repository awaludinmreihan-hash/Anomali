"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Gagal masuk.");
    }
  }

  return (
    <div className="max-w-sm mx-auto px-5 py-24">
      <h1 className="font-display text-2xl font-bold text-arsip-ink mb-1">Masuk Arsip</h1>
      <p className="text-arsip-soft text-sm mb-6">Akses terbatas untuk penyusun berkas.</p>
      <form onSubmit={submit} className="space-y-3">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          required
          className="w-full px-4 py-3 border border-arsip-line rounded bg-kraft-100 focus:outline-none focus:ring-2 focus:ring-stempel"
        />
        {error && <p className="text-stempel text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full font-mono text-xs uppercase tracking-widest bg-arsip-ink text-kraft-50 py-3 rounded hover:bg-stempel transition-colors disabled:opacity-50"
        >
          {loading ? "Memeriksa..." : "Masuk"}
        </button>
      </form>
    </div>
  );
}
