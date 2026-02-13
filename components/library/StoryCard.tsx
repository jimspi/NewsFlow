"use client";

import Link from "next/link";
import { Clock } from "lucide-react";
import { formatRelativeTime, BEAT_OPTIONS, STATUS_OPTIONS } from "@/lib/utils";
import type { Story } from "@/lib/types";

interface StoryCardProps { story: Story; }

export function StoryCard({ story }: StoryCardProps) {
  const beat = BEAT_OPTIONS.find((b) => b.value === story.beat);
  const status = STATUS_OPTIONS.find((s) => s.value === story.status);

  return (
    <Link href={`/story/${story.id}`} className="group block rounded-lg border bg-card p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      {beat && <p className="text-xs text-muted-foreground">{beat.label}</p>}
      <h3 className="mt-2 font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">{story.headline}</h3>
      <div className="mt-4 flex items-center justify-between">
        {status && <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${status.color}`}>{status.label}</span>}
        <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{formatRelativeTime(story.updated_at)}</span>
      </div>
    </Link>
  );
}
