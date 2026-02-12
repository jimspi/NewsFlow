"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, Plus, Trash2, GripVertical, FileText, Quote, CheckCircle, BookOpen, Settings2 } from "lucide-react";
import { slugify, BEAT_OPTIONS, TONE_OPTIONS, AUDIENCE_OPTIONS, PRIORITY_OPTIONS, FORMAT_OPTIONS } from "@/lib/utils";

interface Fact { statement: string; source: string; verification_status: string; importance: string; }
interface QuoteItem { text: string; speaker_name: string; speaker_title: string; context: string; quality_rating: string; }

export default function NewStoryPage() {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Basic details
  const [headline, setHeadline] = useState("");
  const [beat, setBeat] = useState("technology");
  const [audience, setAudience] = useState("general_public");
  const [tone, setTone] = useState("neutral");
  const [priority, setPriority] = useState("medium");

  // Materials
  const [notes, setNotes] = useState<string[]>([""]);
  const [facts, setFacts] = useState<Fact[]>([]);
  const [quotes, setQuotes] = useState<QuoteItem[]>([]);
  const [context, setContext] = useState("");
  const [guidelines, setGuidelines] = useState("");

  // Formats to generate
  const [selectedFormats, setSelectedFormats] = useState<string[]>(["web", "twitter", "linkedin"]);

  const addNote = () => setNotes([...notes, ""]);
  const updateNote = (i: number, v: string) => { const n = [...notes]; n[i] = v; setNotes(n); };
  const removeNote = (i: number) => setNotes(notes.filter((_, idx) => idx !== i));

  const addFact = () => setFacts([...facts, { statement: "", source: "", verification_status: "unverified", importance: "important" }]);
  const updateFact = (i: number, field: keyof Fact, v: string) => { const f = [...facts]; f[i] = { ...f[i], [field]: v }; setFacts(f); };
  const removeFact = (i: number) => setFacts(facts.filter((_, idx) => idx !== i));

  const addQuote = () => setQuotes([...quotes, { text: "", speaker_name: "", speaker_title: "", context: "", quality_rating: "supporting" }]);
  const updateQuote = (i: number, field: keyof QuoteItem, v: string) => { const q = [...quotes]; q[i] = { ...q[i], [field]: v }; setQuotes(q); };
  const removeQuote = (i: number) => setQuotes(quotes.filter((_, idx) => idx !== i));

  const toggleFormat = (f: string) => {
    setSelectedFormats((prev) => prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]);
  };

  const canGenerate = headline.trim() && (notes.some((n) => n.trim()) || facts.length > 0 || quotes.length > 0) && selectedFormats.length > 0;

  const handleSaveDraft = async () => {
    if (!user || !headline.trim()) return;
    setLoading(true);
    const { data, error } = await supabase.from("stories").insert({
      user_id: user.id, headline, slug: slugify(headline), beat, audience, tone, priority, status: "draft",
    }).select().single();
    if (error) { toast({ title: "Error saving draft", description: error.message, variant: "destructive" }); setLoading(false); return; }
    // Save materials
    const materials = [];
    for (const note of notes.filter((n) => n.trim())) materials.push({ story_id: data.id, material_type: "note", content: note, order_index: materials.length });
    for (const fact of facts) materials.push({ story_id: data.id, material_type: "fact", content: fact.statement, metadata: fact, order_index: materials.length });
    for (const quote of quotes) materials.push({ story_id: data.id, material_type: "quote", content: quote.text, metadata: quote, order_index: materials.length });
    if (context.trim()) materials.push({ story_id: data.id, material_type: "context", content: context, order_index: materials.length });
    if (materials.length > 0) await supabase.from("story_materials").insert(materials);
    toast({ title: "Draft saved!" });
    setLoading(false);
    return data.id;
  };

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setGenerating(true);
    const storyId = await handleSaveDraft();
    if (!storyId) { setGenerating(false); return; }

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storyId,
          materials: {
            headline, beat, audience, tone, priority,
            notes: notes.filter((n) => n.trim()),
            facts, quotes, context,
            guidelines: guidelines ? guidelines.split("\n").filter((g) => g.trim()) : [],
          },
          formats: selectedFormats,
        }),
      });
      if (!res.ok) throw new Error("Generation failed");
      toast({ title: "Content generated successfully!" });
      router.push(`/story/${storyId}`);
    } catch {
      toast({ title: "Generation failed", description: "Please try again.", variant: "destructive" });
    }
    setGenerating(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">New Story</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSaveDraft} disabled={loading || !headline.trim()}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save Draft
            </Button>
            <Button onClick={handleGenerate} disabled={!canGenerate || generating}>
              {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Generate Content
            </Button>
          </div>
        </div>

        <Tabs defaultValue="basics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="basics" className="gap-1"><FileText className="h-3.5 w-3.5 hidden sm:block" />Basics</TabsTrigger>
            <TabsTrigger value="materials" className="gap-1"><BookOpen className="h-3.5 w-3.5 hidden sm:block" />Materials</TabsTrigger>
            <TabsTrigger value="facts" className="gap-1"><CheckCircle className="h-3.5 w-3.5 hidden sm:block" />Facts</TabsTrigger>
            <TabsTrigger value="quotes" className="gap-1"><Quote className="h-3.5 w-3.5 hidden sm:block" />Quotes</TabsTrigger>
            <TabsTrigger value="context" className="gap-1"><BookOpen className="h-3.5 w-3.5 hidden sm:block" />Context</TabsTrigger>
            <TabsTrigger value="settings" className="gap-1"><Settings2 className="h-3.5 w-3.5 hidden sm:block" />Generate</TabsTrigger>
          </TabsList>

          <TabsContent value="basics">
            <Card>
              <CardHeader><CardTitle>Basic Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="headline">Headline *</Label>
                  <Input id="headline" placeholder="Enter story headline..." value={headline} onChange={(e) => setHeadline(e.target.value)} className="text-lg font-medium" maxLength={200} />
                  <p className="text-xs text-muted-foreground text-right">{headline.length}/200</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Beat/Category</Label><Select value={beat} onValueChange={setBeat}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{BEAT_OPTIONS.map((b) => (<SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>))}</SelectContent></Select></div>
                  <div className="space-y-2"><Label>Target Audience</Label><Select value={audience} onValueChange={setAudience}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{AUDIENCE_OPTIONS.map((a) => (<SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>))}</SelectContent></Select></div>
                  <div className="space-y-2"><Label>Tone</Label><Select value={tone} onValueChange={setTone}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{TONE_OPTIONS.map((t) => (<SelectItem key={t.value} value={t.value}>{t.label} - {t.description}</SelectItem>))}</SelectContent></Select></div>
                  <div className="space-y-2"><Label>Priority</Label><Select value={priority} onValueChange={setPriority}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{PRIORITY_OPTIONS.map((p) => (<SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>))}</SelectContent></Select></div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="materials">
            <Card>
              <CardHeader><CardTitle>Source Materials</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {notes.map((note, i) => (
                  <div key={i} className="flex gap-2">
                    <Textarea placeholder="Paste notes, transcripts, press releases..." value={note} onChange={(e) => updateNote(i, e.target.value)} className="flex-1" rows={4} />
                    {notes.length > 1 && <Button variant="ghost" size="icon" onClick={() => removeNote(i)} className="shrink-0 mt-1"><Trash2 className="h-4 w-4 text-muted-foreground" /></Button>}
                  </div>
                ))}
                <Button variant="outline" onClick={addNote} className="w-full"><Plus className="mr-2 h-4 w-4" />Add Another Note</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="facts">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between"><CardTitle>Key Facts</CardTitle><Badge variant="secondary">{facts.length} facts</Badge></CardHeader>
              <CardContent className="space-y-4">
                {facts.map((fact, i) => (
                  <div key={i} className="rounded-lg border p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2"><GripVertical className="h-4 w-4 text-muted-foreground" /><span className="text-sm font-medium">Fact {i + 1}</span></div>
                      <Button variant="ghost" size="icon" onClick={() => removeFact(i)} className="h-8 w-8"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                    <Textarea placeholder="State the fact clearly..." value={fact.statement} onChange={(e) => updateFact(i, "statement", e.target.value)} rows={2} />
                    <Input placeholder="Source attribution" value={fact.source} onChange={(e) => updateFact(i, "source", e.target.value)} />
                    <div className="grid grid-cols-2 gap-2">
                      <Select value={fact.verification_status} onValueChange={(v) => updateFact(i, "verification_status", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="verified">Verified</SelectItem><SelectItem value="checking">Checking</SelectItem><SelectItem value="unverified">Unverified</SelectItem><SelectItem value="disputed">Disputed</SelectItem></SelectContent></Select>
                      <Select value={fact.importance} onValueChange={(v) => updateFact(i, "importance", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="critical">Critical</SelectItem><SelectItem value="important">Important</SelectItem><SelectItem value="supporting">Supporting</SelectItem></SelectContent></Select>
                    </div>
                  </div>
                ))}
                <Button variant="outline" onClick={addFact} className="w-full"><Plus className="mr-2 h-4 w-4" />Add Fact</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quotes">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between"><CardTitle>Quotes & Soundbites</CardTitle><Badge variant="secondary">{quotes.length} quotes</Badge></CardHeader>
              <CardContent className="space-y-4">
                {quotes.map((quote, i) => (
                  <div key={i} className="rounded-lg border p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium">Quote {i + 1}</span>
                      <Button variant="ghost" size="icon" onClick={() => removeQuote(i)} className="h-8 w-8"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                    <Textarea placeholder="Enter the quote..." value={quote.text} onChange={(e) => updateQuote(i, "text", e.target.value)} rows={2} />
                    <div className="grid grid-cols-2 gap-2">
                      <Input placeholder="Speaker name" value={quote.speaker_name} onChange={(e) => updateQuote(i, "speaker_name", e.target.value)} />
                      <Input placeholder="Speaker title/role" value={quote.speaker_title} onChange={(e) => updateQuote(i, "speaker_title", e.target.value)} />
                    </div>
                    <Input placeholder="Context (when/where said)" value={quote.context} onChange={(e) => updateQuote(i, "context", e.target.value)} />
                    <Select value={quote.quality_rating} onValueChange={(v) => updateQuote(i, "quality_rating", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="pull_quote">Pull Quote Worthy</SelectItem><SelectItem value="supporting">Supporting</SelectItem><SelectItem value="background">Background</SelectItem></SelectContent></Select>
                  </div>
                ))}
                <Button variant="outline" onClick={addQuote} className="w-full"><Plus className="mr-2 h-4 w-4" />Add Quote</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="context">
            <Card>
              <CardHeader><CardTitle>Background & Context</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Historical Context & Background</Label>
                  <Textarea placeholder="What led to this story? What's the history?" value={context} onChange={(e) => setContext(e.target.value)} rows={6} />
                </div>
                <div className="space-y-2">
                  <Label>Editorial Guidelines & Notes</Label>
                  <Textarea placeholder="Special instructions for tone, framing, sensitivities..." value={guidelines} onChange={(e) => setGuidelines(e.target.value)} rows={4} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader><CardTitle>Select Formats to Generate</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {FORMAT_OPTIONS.map((f) => (
                    <button key={f.value} onClick={() => toggleFormat(f.value)} className={`flex items-center gap-2 rounded-lg border p-3 text-left text-sm transition-all ${selectedFormats.includes(f.value) ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:border-primary/50"}`}>
                      <Checkbox checked={selectedFormats.includes(f.value)} className="pointer-events-none" />
                      <span className="font-medium">{f.label}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-6 p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground"><strong>{selectedFormats.length}</strong> formats selected. Click &quot;Generate Content&quot; to create all formats simultaneously.</p>
                </div>
                <Button onClick={handleGenerate} disabled={!canGenerate || generating} className="w-full mt-4" size="lg">
                  {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  Generate {selectedFormats.length} Format{selectedFormats.length !== 1 ? "s" : ""}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
