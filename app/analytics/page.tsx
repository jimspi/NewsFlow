"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { FileText, Clock, TrendingUp, BarChart3 } from "lucide-react";
import { BEAT_OPTIONS, STATUS_OPTIONS } from "@/lib/utils";
import type { Story } from "@/lib/types";

export default function AnalyticsPage() {
  const { user } = useAuth();
  const supabase = createClient();
  const [stories, setStories] = useState<Story[]>([]);
  const [contentCount, setContentCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      if (!user) return;
      const [storiesRes, contentRes] = await Promise.all([
        supabase.from("stories").select("*").eq("user_id", user.id),
        supabase.from("generated_content").select("id", { count: "exact" }),
      ]);
      setStories(storiesRes.data || []);
      setContentCount(contentRes.count || 0);
      setLoading(false);
    }
    fetch();
  }, [user, supabase]);

  const statusCounts = STATUS_OPTIONS.map((s) => ({ ...s, count: stories.filter((st) => st.status === s.value).length }));
  const beatCounts = BEAT_OPTIONS.map((b) => ({ ...b, count: stories.filter((st) => st.beat === b.value).length })).filter((b) => b.count > 0).sort((a, b) => b.count - a.count);

  const timeSavedMinutes = contentCount * 25; // avg 25 min saved per generated piece
  const timeSavedHours = Math.round(timeSavedMinutes / 60);

  if (loading) return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Analytics</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => (<Card key={i}><CardContent className="p-6"><div className="animate-pulse"><div className="h-8 w-16 bg-muted rounded" /><div className="h-4 w-24 bg-muted rounded mt-2" /></div></CardContent></Card>))}</div>
    </div>
  );

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Analytics</h1>

      {/* Key metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardContent className="p-6"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center"><FileText className="h-5 w-5 text-blue-500" /></div><div><div className="text-2xl font-bold">{stories.length}</div><div className="text-xs text-muted-foreground">Total Stories</div></div></div></CardContent>
        </Card>
        <Card>
          <CardContent className="p-6"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center"><TrendingUp className="h-5 w-5 text-emerald-500" /></div><div><div className="text-2xl font-bold">{contentCount}</div><div className="text-xs text-muted-foreground">Formats Generated</div></div></div></CardContent>
        </Card>
        <Card>
          <CardContent className="p-6"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center"><Clock className="h-5 w-5 text-purple-500" /></div><div><div className="text-2xl font-bold">{timeSavedHours}h</div><div className="text-xs text-muted-foreground">Time Saved</div></div></div></CardContent>
        </Card>
        <Card>
          <CardContent className="p-6"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center"><BarChart3 className="h-5 w-5 text-amber-500" /></div><div><div className="text-2xl font-bold">{contentCount > 0 ? Math.round((contentCount / stories.length) * 10) / 10 : 0}</div><div className="text-xs text-muted-foreground">Avg Formats/Story</div></div></div></CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Status breakdown */}
        <Card>
          <CardHeader><CardTitle className="text-base">Stories by Status</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {statusCounts.filter((s) => s.count > 0).map((s) => (
                <div key={s.value} className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${s.color}`}>{s.label}</span></div>
                  <div className="flex items-center gap-3"><div className="w-32 h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${stories.length > 0 ? (s.count / stories.length) * 100 : 0}%` }} /></div><span className="text-sm font-medium w-8 text-right">{s.count}</span></div>
                </div>
              ))}
              {statusCounts.every((s) => s.count === 0) && <p className="text-sm text-muted-foreground">No stories yet.</p>}
            </div>
          </CardContent>
        </Card>

        {/* Beat breakdown */}
        <Card>
          <CardHeader><CardTitle className="text-base">Stories by Beat</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {beatCounts.slice(0, 8).map((b) => (
                <div key={b.value} className="flex items-center justify-between">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${b.color}`}>{b.label}</span>
                  <div className="flex items-center gap-3"><div className="w-32 h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${stories.length > 0 ? (b.count / stories.length) * 100 : 0}%` }} /></div><span className="text-sm font-medium w-8 text-right">{b.count}</span></div>
                </div>
              ))}
              {beatCounts.length === 0 && <p className="text-sm text-muted-foreground">No stories yet.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
