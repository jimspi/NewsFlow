"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Copy, Archive, Trash2, Clock } from "lucide-react";
import { formatRelativeTime, BEAT_OPTIONS, STATUS_OPTIONS, PRIORITY_OPTIONS } from "@/lib/utils";
import type { Story } from "@/lib/types";

interface StoryCardProps { story: Story; view: "grid" | "list"; onArchive?: (id: string) => void; onDelete?: (id: string) => void; onDuplicate?: (id: string) => void; }

export function StoryCard({ story, view, onArchive, onDelete, onDuplicate }: StoryCardProps) {
  const beat = BEAT_OPTIONS.find((b) => b.value === story.beat);
  const status = STATUS_OPTIONS.find((s) => s.value === story.status);
  const priority = PRIORITY_OPTIONS.find((p) => p.value === story.priority);

  if (view === "list") {
    return (
      <div className="flex items-center gap-4 p-4 border-b hover:bg-muted/50 transition-colors group">
        <div className="flex-1 min-w-0">
          <Link href={`/story/${story.id}`} className="font-medium text-sm hover:text-primary transition-colors line-clamp-1">{story.headline}</Link>
          <div className="flex items-center gap-2 mt-1">
            {beat && <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${beat.color}`}>{beat.label}</span>}
            <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{formatRelativeTime(story.updated_at)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {status && <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${status.color}`}>{status.label}</span>}
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild><Link href={`/story/${story.id}`}><Edit className="mr-2 h-4 w-4" />Edit</Link></DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate?.(story.id)}><Copy className="mr-2 h-4 w-4" />Duplicate</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onArchive?.(story.id)}><Archive className="mr-2 h-4 w-4" />Archive</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete?.(story.id)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  }

  return (
    <Link href={`/story/${story.id}`} className="group block rounded-lg border bg-card p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-center gap-2 flex-wrap">
        {beat && <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${beat.color}`}>{beat.label}</span>}
        {priority && <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${priority.color}`}>{priority.label}</span>}
      </div>
      <h3 className="mt-3 font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">{story.headline}</h3>
      <div className="mt-4 flex items-center justify-between">
        {status && <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${status.color}`}>{status.label}</span>}
        <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{formatRelativeTime(story.updated_at)}</span>
      </div>
    </Link>
  );
}
