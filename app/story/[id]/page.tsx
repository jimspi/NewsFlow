"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Copy, RefreshCw, Sparkles, ArrowLeft, CheckCircle, AlertTriangle, Clock, FileText } from "lucide-react";
import { FORMAT_OPTIONS, STATUS_OPTIONS, countWords } from "@/lib/utils";
import type { Story, GeneratedContent, QualityCheck } from "@/lib/types";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

export default function StoryPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClient();
  const { toast } = useToast();

  const [story, setStory] = useState<Story | null>(null);
  const [contents, setContents] = useState<GeneratedContent[]>([]);
  const [qualityChecks, setQualityChecks] = useState<QualityCheck[]>([]);
  const [activeFormat, setActiveFormat] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [regenerateOpen, setRegenerateOpen] = useState(false);
  const [regenerateInstructions, setRegenerateInstructions] = useState("");
  const [regenerating, setRegenerating] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchStory = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    const [storyRes, contentRes, checksRes] = await Promise.all([
      supabase.from("stories").select("*").eq("id", id).single(),
      supabase.from("generated_content").select("*").eq("story_id", id).eq("is_current", true).order("created_at"),
      supabase.from("quality_checks").select("*").eq("story_id", id).order("checked_at", { ascending: false }),
    ]);
    if (storyRes.data) setStory(storyRes.data);
    if (contentRes.data) {
      setContents(contentRes.data);
      if (contentRes.data.length > 0 && !activeFormat) {
        setActiveFormat(contentRes.data[0].format_type);
        setEditContent(contentRes.data[0].edited_content || contentRes.data[0].content);
      }
    }
    if (checksRes.data) setQualityChecks(checksRes.data);
    setLoading(false);
  }, [id, supabase, activeFormat]);

  useEffect(() => { fetchStory(); }, [fetchStory]);

  const activeContent = contents.find((c) => c.format_type === activeFormat);

  const handleTabChange = (format: string) => {
    setActiveFormat(format);
    const c = contents.find((x) => x.format_type === format);
    if (c) setEditContent(c.edited_content || c.content);
    setEditing(false);
  };

  const handleSave = async () => {
    if (!activeContent) return;
    setSaving(true);
    await supabase.from("generated_content").update({ edited_content: editContent, edited_by: user?.id }).eq("id", activeContent.id);
    toast({ title: "Changes saved" });
    setSaving(false);
    setEditing(false);
    fetchStory();
  };

  const handleCopy = () => {
    const text = activeContent?.edited_content || activeContent?.content || "";
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard" });
  };

  const handleRegenerate = async () => {
    if (!story || !activeFormat) return;
    setRegenerating(true);
    try {
      // Fetch materials
      const { data: materials } = await supabase.from("story_materials").select("*").eq("story_id", story.id);
      const noteMaterials = materials?.filter((m) => m.material_type === "note").map((m) => m.content || "") || [];
      const factMaterials = materials?.filter((m) => m.material_type === "fact").map((m) => m.metadata as { statement: string; source: string; verification_status: string; importance: string }) || [];
      const quoteMaterials = materials?.filter((m) => m.material_type === "quote").map((m) => m.metadata as { text: string; speaker_name: string; speaker_title: string; context: string; quality_rating: string }) || [];
      const contextMaterial = materials?.find((m) => m.material_type === "context")?.content || "";

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storyId: story.id,
          materials: { headline: story.headline, beat: story.beat, audience: story.audience, tone: story.tone, priority: story.priority, notes: noteMaterials, facts: factMaterials, quotes: quoteMaterials, context: contextMaterial, guidelines: [] },
          formats: [activeFormat],
          customInstructions: regenerateInstructions,
        }),
      });
      if (res.ok) { toast({ title: "Content regenerated!" }); fetchStory(); }
    } catch { toast({ title: "Regeneration failed", variant: "destructive" }); }
    setRegenerating(false);
    setRegenerateOpen(false);
    setRegenerateInstructions("");
  };

  if (loading) return (
    <div className="min-h-screen bg-background"><Navbar />
      <div className="container mx-auto max-w-6xl px-4 py-8"><div className="animate-pulse space-y-4"><div className="h-8 w-1/3 bg-muted rounded" /><div className="h-64 bg-muted rounded" /></div></div>
    </div>
  );

  if (!story) return (
    <div className="min-h-screen bg-background"><Navbar />
      <div className="container mx-auto max-w-6xl px-4 py-20 text-center"><FileText className="mx-auto h-12 w-12 text-muted-foreground/50" /><h2 className="mt-4 text-lg font-semibold">Story not found</h2><Link href="/dashboard"><Button className="mt-4">Back to Dashboard</Button></Link></div>
    </div>
  );

  const status = STATUS_OPTIONS.find((s) => s.value === story.status);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}><ArrowLeft className="h-4 w-4" /></Button>
            <div>
              <h1 className="text-xl font-bold line-clamp-1">{story.headline}</h1>
              <div className="flex items-center gap-2 mt-1">
                {status && <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${status.color}`}>{status.label}</span>}
                <span className="text-xs text-muted-foreground">{story.beat}</span>
              </div>
            </div>
          </div>
        </div>

        {contents.length === 0 ? (
          <Card className="text-center py-12"><CardContent><Sparkles className="mx-auto h-12 w-12 text-muted-foreground/50" /><h3 className="mt-4 text-lg font-semibold">No content generated yet</h3><p className="mt-2 text-sm text-muted-foreground">Go back and generate content for this story.</p></CardContent></Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main content */}
            <div className="lg:col-span-3">
              <Tabs value={activeFormat} onValueChange={handleTabChange}>
                <TabsList className="w-full justify-start overflow-x-auto flex-nowrap">
                  {contents.map((c) => {
                    const fmt = FORMAT_OPTIONS.find((f) => f.value === c.format_type);
                    return <TabsTrigger key={c.format_type} value={c.format_type} className="shrink-0">{fmt?.label || c.format_type}{c.edited_content && <Badge variant="secondary" className="ml-1.5 h-4 px-1 text-[10px]">edited</Badge>}</TabsTrigger>;
                  })}
                </TabsList>

                {contents.map((c) => (
                  <TabsContent key={c.format_type} value={c.format_type}>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-base">{FORMAT_OPTIONS.find((f) => f.value === c.format_type)?.label}</CardTitle>
                          {c.quality_scores && <Badge variant="secondary" className="text-xs">{c.quality_scores.word_count} words</Badge>}
                          {c.quality_scores && <Badge variant="secondary" className="text-xs"><Clock className="h-3 w-3 mr-1" />{c.quality_scores.estimated_read_time}m read</Badge>}
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={handleCopy}><Copy className="h-3.5 w-3.5 mr-1" />Copy</Button>
                          <Button variant="ghost" size="sm" onClick={() => setRegenerateOpen(true)}><RefreshCw className="h-3.5 w-3.5 mr-1" />Regenerate</Button>
                          {!editing ? (
                            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>Edit</Button>
                          ) : (
                            <Button size="sm" onClick={handleSave} disabled={saving}>{saving && <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />}Save</Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        {editing ? (
                          <Textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="min-h-[400px] font-mono text-sm" />
                        ) : (
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <ReactMarkdown>{c.edited_content || c.content}</ReactMarkdown>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-sm">Quality Checks</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {qualityChecks.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No checks run yet.</p>
                  ) : qualityChecks.map((check) => (
                    <div key={check.id} className="flex items-center gap-2 text-sm">
                      {check.status === "pass" ? <CheckCircle className="h-4 w-4 text-green-500" /> : <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                      <span className="capitalize">{check.check_type.replace("_", " ")}</span>
                      <Badge variant={check.status === "pass" ? "secondary" : "outline"} className="ml-auto text-xs">{check.status}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-sm">Content Stats</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Formats</span><span className="font-medium">{contents.length}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Total words</span><span className="font-medium">{contents.reduce((sum, c) => sum + countWords(c.edited_content || c.content), 0)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Edited</span><span className="font-medium">{contents.filter((c) => c.edited_content).length}/{contents.length}</span></div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Regenerate dialog */}
      <Dialog open={regenerateOpen} onOpenChange={setRegenerateOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Regenerate with Instructions</DialogTitle></DialogHeader>
          <Textarea placeholder="How should the content be modified? e.g., 'Make it more urgent', 'Shorten by 30%'" value={regenerateInstructions} onChange={(e) => setRegenerateInstructions(e.target.value)} rows={4} />
          <div className="flex flex-wrap gap-2">
            {["Make it more urgent", "Shorten by 30%", "Simplify language", "Add more quotes"].map((chip) => (
              <button key={chip} onClick={() => setRegenerateInstructions(chip)} className="text-xs px-2.5 py-1 rounded-full border hover:bg-accent transition-colors">{chip}</button>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRegenerateOpen(false)}>Cancel</Button>
            <Button onClick={handleRegenerate} disabled={regenerating}>{regenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Regenerate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
