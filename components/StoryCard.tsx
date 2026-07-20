import Link from "next/link";
import { Story } from "@/lib/types";
import StempelBadge from "./StempelBadge";

function caseNumber(index: number) {
  return `BERKAS NO. ${String(index).padStart(4, "0")}`;
}

export default function StoryCard({ story, index }: { story: Story; index: number }) {
  const date = new Date(story.created_at).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <Link
      href={`/cerita/${story.slug}`}
      className="folder-clip group block bg-kraft-100 border border-arsip-line hover:border-arsip-ink transition-colors p-5 sm:p-6"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[11px] tracking-widest text-arsip-soft">
          {caseNumber(index)} &middot; {date}
        </span>
        <StempelBadge status={story.status_berkas} />
      </div>

      <h2 className="font-display text-2xl font-semibold text-arsip-ink leading-snug group-hover:text-stempel transition-colors">
        {story.title}
      </h2>

      <p className="mt-2 text-arsip-soft leading-relaxed line-clamp-3">{story.excerpt}</p>

      {story.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 font-mono text-[11px] text-arsip-soft">
          {story.tags.map((tag) => (
            <span key={tag} className="border border-arsip-line px-1.5 py-0.5 rounded">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
