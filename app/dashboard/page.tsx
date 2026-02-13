"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { StoryCard } from "@/components/library/StoryCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PenSquare, Search, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Story } from "@/lib/types";

const STATUS_TABS = [
  { value: "all", label: "All" },
  { value: "draft", label: "Drafts" },
  { value: "in_progress", label: "In Progress" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const supabase = createClient();
  const { toast } = useToast();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Debounce search input by 300ms
  useEffect(() => {
    debounceRef.current = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  const fetchStories = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    let query = supabase.from("stories").select("*").eq("user_id", user.id).order("updated_at", { ascending: false });
    if (statusFilter !== "all") query = query.eq("status", statusFilter);
    if (debouncedSearch) query = query.ilike("headline", `%${debouncedSearch}%`);
    const { data, error } = await query;
    if (error) toast({ title: "Error loading stories", description: error.message, variant: "destructive" });
    else setStories(data || []);
    setLoading(false);
  }, [user, supabase, statusFilter, debouncedSearch, toast]);

  useEffect(() => { fetchStories(); }, [fetchStories]);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div><h1 className="text-2xl font-bold">Stories</h1><p className="text-sm text-muted-foreground mt-1">{stories.length} {stories.length === 1 ? "story" : "stories"}</p></div>
        <Link href="/story/new"><Button><PenSquare className="mr-2 h-4 w-4" />New Story</Button></Link>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search stories..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {STATUS_TABS.map((tab) => (
          <Button key={tab.value} variant={statusFilter === tab.value ? "secondary" : "ghost"} size="sm" onClick={() => setStatusFilter(tab.value)}>
            {tab.label}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => (<div key={i} className="rounded-lg border bg-card p-5 animate-pulse"><div className="h-3 w-16 bg-muted rounded" /><div className="h-5 w-full bg-muted rounded mt-3" /><div className="h-5 w-2/3 bg-muted rounded mt-2" /><div className="flex justify-between mt-4"><div className="h-5 w-20 bg-muted rounded-full" /><div className="h-4 w-16 bg-muted rounded" /></div></div>))}</div>
      ) : stories.length === 0 ? (
        <div className="text-center py-20">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No stories found</h3>
          <p className="mt-2 text-sm text-muted-foreground">{debouncedSearch || statusFilter !== "all" ? "Try adjusting your search or filters." : "Create your first story to get started."}</p>
          {!debouncedSearch && statusFilter === "all" && <Link href="/story/new"><Button className="mt-6"><PenSquare className="mr-2 h-4 w-4" />Create New Story</Button></Link>}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{stories.map((s) => (<StoryCard key={s.id} story={s} />))}</div>
      )}
    </div>
  );
}
