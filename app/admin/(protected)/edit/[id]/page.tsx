"use client";

import { useEffect, useState } from "react";
import StoryForm from "@/components/StoryForm";
import { Story } from "@/lib/types";

export default function EditPage({ params }: { params: { id: string } }) {
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/stories/${params.id}`)
      .then((r) => r.json())
      .then((d) => setStory(d.story))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <p className="max-w-3xl mx-auto px-5 py-10 text-arsip-soft">Memuat...</p>;
  if (!story) return <p className="max-w-3xl mx-auto px-5 py-10 text-stempel">Berkas tidak ditemukan.</p>;

  return <StoryForm initial={story} />;
}
