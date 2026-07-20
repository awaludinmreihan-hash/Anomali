"use client";

import { useEffect, useState } from "react";

function getVoterHash(): string {
  const key = "anomali_voter_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

export default function RatingWidget({ storyId }: { storyId: string }) {
  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);
  const [myVote, setMyVote] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/rating?story_id=${storyId}`)
      .then((r) => r.json())
      .then((d) => {
        setAverage(d.average || 0);
        setCount(d.count || 0);
      });
    const saved = localStorage.getItem(`anomali_vote_${storyId}`);
    if (saved) setMyVote(Number(saved));
  }, [storyId]);

  async function vote(value: number) {
    if (loading) return;
    setLoading(true);
    const voter_hash = getVoterHash();
    try {
      const res = await fetch("/api/rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ story_id: storyId, value, voter_hash }),
      });
      const data = await res.json();
      if (res.ok) {
        setAverage(data.average);
        setCount(data.count);
        setMyVote(value);
        localStorage.setItem(`anomali_vote_${storyId}`, String(value));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border border-arsip-line rounded p-4 bg-kraft-100">
      <p className="font-mono text-xs uppercase tracking-widest text-arsip-soft mb-2">
        Tingkat kengerian menurut pembaca
      </p>
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => vote(n)}
              disabled={loading}
              aria-label={`Beri ${n} dari 5`}
              className={`w-8 h-8 rounded-full border-2 font-mono text-sm flex items-center justify-center transition-colors disabled:opacity-50 ${
                (myVote ?? Math.round(average)) >= n
                  ? "bg-stempel border-stempel text-kraft-50"
                  : "border-arsip-line text-arsip-soft hover:border-stempel hover:text-stempel"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <span className="font-mono text-sm text-arsip-soft ml-2">
          {average.toFixed(1)} / 5 &middot; {count} suara
        </span>
      </div>
      {myVote && (
        <p className="mt-2 text-xs text-arsip-soft italic">Terima kasih, suaramu tercatat.</p>
      )}
    </div>
  );
}
