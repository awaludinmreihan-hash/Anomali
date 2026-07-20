import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { supabasePublic, supabaseAdmin } from "@/lib/supabase";
import { Story, Comment } from "@/lib/types";
import RatingWidget from "@/components/RatingWidget";
import CommentSection from "@/components/CommentSection";
import { SITE } from "@/lib/site";

export const revalidate = 60;

async function getStory(slug: string): Promise<Story | null> {
  const db = supabasePublic();
  const { data } = await db
    .from("stories")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  return data as Story | null;
}

async function getApprovedComments(storyId: string): Promise<Comment[]> {
  const db = supabasePublic();
  const { data } = await db
    .from("comments")
    .select("*")
    .eq("story_id", storyId)
    .eq("status", "approved")
    .order("created_at", { ascending: false });
  return (data as Comment[]) || [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStory(slug);
  if (!story) return {};

  const url = `${SITE.url}/cerita/${story.slug}`;
  return {
    title: story.title,
    description: story.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: story.title,
      description: story.excerpt,
      url,
      type: "article",
      images: story.cover_image_url ? [story.cover_image_url] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: story.title,
      description: story.excerpt,
    },
  };
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = await getStory(slug);
  if (!story) notFound();

  const comments = await getApprovedComments(story.id);

  // Tambah hitungan kunjungan, tidak menghambat render kalau gagal
  void (async () => {
    try {
      await supabaseAdmin()
        .from("stories")
        .update({ views: story.views + 1 })
        .eq("id", story.id);
    } catch {
      // abaikan, tidak kritis
    }
  })();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: story.title,
    description: story.excerpt,
    datePublished: story.created_at,
    dateModified: story.updated_at,
    author: { "@type": "Organization", name: SITE.name },
    publisher: { "@type": "Organization", name: SITE.name },
    mainEntityOfPage: `${SITE.url}/cerita/${story.slug}`,
  };

  const date = new Date(story.created_at).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <article className="max-w-3xl mx-auto px-5 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mb-4 font-mono text-xs text-arsip-soft">
        <span>{date} &middot; {story.views + 1}x dibuka</span>
      </div>

      <h1 className="font-display text-3xl sm:text-4xl font-bold text-arsip-ink leading-tight">
        {story.title}
      </h1>

      {story.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2 font-mono text-[11px] text-arsip-soft">
          {story.tags.map((tag) => (
            <span key={tag} className="border border-arsip-line px-1.5 py-0.5 rounded">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="prose prose-lg max-w-none mt-8 prose-headings:font-display prose-headings:text-arsip-ink prose-p:text-arsip-ink/90 prose-p:leading-relaxed prose-a:text-stempel prose-blockquote:border-stempel prose-blockquote:text-arsip-soft">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{story.content_md}</ReactMarkdown>
      </div>

      <div className="mt-10">
        <RatingWidget storyId={story.id} />
      </div>

      <CommentSection storyId={story.id} initialComments={comments} />
    </article>
  );
}
