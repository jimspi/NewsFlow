import Link from "next/link";
import { Logo } from "@/components/logo/Logo";
import { Layers, ShieldCheck, Users, Sparkles, FolderSearch, BarChart3, Zap, Globe, BookOpen, Video, Mail, Mic, FileText, ArrowRight, Check } from "lucide-react";

const formats = [
  { icon: Zap, name: "Breaking Alert" },
  { icon: Globe, name: "Web Article" },
  { icon: BookOpen, name: "Feature Story" },
  { icon: Video, name: "Video Script" },
  { icon: Mail, name: "Newsletter" },
  { icon: Mic, name: "Audio Brief" },
  { icon: FileText, name: "Press Release" },
];

const features = [
  { icon: Layers, title: "Multi-Format Generation", desc: "One story, eleven formats. Web, social, video, audio, and more." },
  { icon: ShieldCheck, title: "Quality Assurance", desc: "Automated fact-checking, bias detection, and readability analysis." },
  { icon: Users, title: "Team Collaboration", desc: "Assign stories, add comments, track changes. Work together seamlessly." },
  { icon: Sparkles, title: "Smart Editing", desc: "Regenerate with natural language instructions. Get exactly what you need." },
  { icon: FolderSearch, title: "Archive & Search", desc: "Find any story instantly. Full history and version control." },
  { icon: BarChart3, title: "Analytics & Insights", desc: "Track productivity, quality scores, and time saved." },
];

const steps = [
  { num: "01", title: "Input Your Materials", desc: "Add notes, quotes, facts, and files. NewsFlow organizes everything.", items: ["Paste press releases & transcripts", "Upload documents & audio", "Add verified facts & quotes"] },
  { num: "02", title: "AI Generates All Formats", desc: "Our AI creates optimized content for every platform simultaneously.", items: ["AP style compliance", "Platform-specific optimization", "Fact consistency verification"] },
  { num: "03", title: "Edit, Approve, Publish", desc: "Review, refine, and publish. Maintain full editorial control.", items: ["Inline editing tools", "Version history", "Team collaboration"] },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-4">
          <Logo size="lg" interactive />
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">Log in</Link>
            <Link href="/signup" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">Get Started</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto max-w-7xl px-4 py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl" style={{ lineHeight: 1.1 }}>
              Transform Story Materials Into{" "}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Polished Content</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
              AI-powered editorial assistant that generates multi-format content from your raw materials.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup" className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90 transition-colors w-full sm:w-auto">
                Get Started<ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <a href="#how-it-works" className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-base font-medium hover:bg-accent transition-colors w-full sm:w-auto">See How It Works</a>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-muted/50">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Generate Professional Content in Three Steps</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.num}>
                <div className="text-6xl font-bold text-primary/10 mb-4">{step.num}</div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground mb-4">{step.desc}</p>
                <ul className="space-y-2">{step.items.map((item) => (<li key={item} className="flex items-start gap-2 text-sm"><Check className="h-4 w-4 text-primary mt-0.5 shrink-0" /><span>{item}</span></li>))}</ul>
              </div>
            ))}
          </div>
          {/* Format pills */}
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {formats.map((f) => { const Icon = f.icon; return (
              <span key={f.name} className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-sm">
                <Icon className="h-3.5 w-3.5 text-primary" />{f.name}
              </span>
            ); })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12"><h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything You Need for Modern News Production</h2></div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => { const Icon = f.icon; return (
              <div key={f.title} className="rounded-lg border bg-card p-6 hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4"><Icon className="h-6 w-6 text-primary" /></div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3><p className="text-muted-foreground text-sm">{f.desc}</p>
              </div>
            ); })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-500">
        <div className="container mx-auto max-w-7xl px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Ready to Streamline Your Newsroom?</h2>
          <p className="mt-4 text-lg text-white/80 max-w-xl mx-auto">Turn raw materials into publish-ready content across every format.</p>
          <Link href="/signup" className="mt-8 inline-flex items-center justify-center rounded-md bg-white px-8 py-3 text-base font-medium text-blue-600 hover:bg-white/90 transition-colors">Get Started<ArrowRight className="ml-2 h-4 w-4" /></Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Logo size="sm" />
              <span className="text-sm text-muted-foreground">AI-powered editorial assistant</span>
            </div>
            <nav className="flex items-center gap-4 text-sm text-muted-foreground">
              <a href="#features" className="hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
              <Link href="/login" className="hover:text-foreground transition-colors">Log in</Link>
            </nav>
          </div>
          <div className="mt-6 text-center text-sm text-muted-foreground">&copy; 2026 NewsFlow. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
