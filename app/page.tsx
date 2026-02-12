import Link from "next/link";
import { Logo } from "@/components/logo/Logo";
import { Layers, ShieldCheck, Users, Sparkles, FolderSearch, BarChart3, Zap, Globe, BookOpen, Video, Mail, Mic, FileText, ArrowRight, Check, ChevronDown, Star } from "lucide-react";

const formats = [
  { icon: Zap, name: "Breaking Alert", desc: "50-75 words" },
  { icon: Globe, name: "Web Article", desc: "400-600 words" },
  { icon: BookOpen, name: "Feature Story", desc: "1000-1500 words" },
  { icon: Video, name: "Video Script", desc: "2-3 minutes" },
  { icon: Mail, name: "Newsletter", desc: "175-225 words" },
  { icon: Mic, name: "Audio Brief", desc: "60-90 seconds" },
  { icon: FileText, name: "Press Release", desc: "300-500 words" },
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
  { num: "01", title: "Input Your Materials", desc: "Add notes, quotes, facts, files. NewsFlow organizes everything.", items: ["Paste press releases & transcripts", "Upload documents & audio", "Add verified facts & quotes", "Include background context"] },
  { num: "02", title: "AI Generates All Formats", desc: "Our AI creates optimized content for every platform simultaneously.", items: ["AP style compliance", "Platform-specific optimization", "SEO and readability analysis", "Fact consistency verification"] },
  { num: "03", title: "Edit, Approve, Publish", desc: "Review, refine, and publish. Maintain full editorial control.", items: ["Inline editing tools", "Version history", "Team collaboration", "Quality checks"] },
];

const testimonials = [
  { quote: "Cut our production time by 60%. Our reporters love it.", name: "David Park", title: "Editor-in-Chief, The Daily Tribune" },
  { quote: "The quality checks alone are worth it. We've caught errors before they go live.", name: "Maria Santos", title: "Copy Chief, Metro News Network" },
  { quote: "Finally, a tool that understands journalism. Not just another AI toy.", name: "James Mitchell", title: "Senior Reporter, Investigative Times" },
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
            <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">Log in</Link>
            <Link href="/signup" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">Start Free Trial</Link>
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
              AI-powered editorial assistant that generates multi-format content from your raw materials in seconds.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup" className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90 transition-colors w-full sm:w-auto">
                Start Free Trial<ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <a href="#how-it-works" className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-base font-medium hover:bg-accent transition-colors w-full sm:w-auto">See How It Works</a>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">No credit card required. 14-day free trial.</p>
          </div>
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {[{ v: "500+", l: "Newsrooms" }, { v: "1M+", l: "Stories Generated" }, { v: "10M+", l: "Hours Saved" }, { v: "98%", l: "Satisfaction" }].map((s) => (
              <div key={s.l} className="text-center"><div className="text-3xl font-bold">{s.v}</div><div className="text-sm text-muted-foreground mt-1">{s.l}</div></div>
            ))}
          </div>
          <div className="mt-16 flex justify-center"><a href="#formats" className="animate-bounce"><ChevronDown className="h-6 w-6 text-muted-foreground" /></a></div>
        </div>
      </section>

      {/* Formats */}
      <section id="formats" className="py-20 bg-muted/50">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Enter Your Materials Once. Get Every Format Instantly.</h2>
            <p className="mt-4 text-lg text-muted-foreground">One story becomes perfectly optimized content for every platform.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {formats.map((f) => { const Icon = f.icon; return (
              <div key={f.name} className="group rounded-lg border bg-card p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <Icon className="h-8 w-8 text-primary mb-3" /><h3 className="font-semibold text-sm">{f.name}</h3><p className="text-xs text-muted-foreground mt-1">{f.desc}</p>
              </div>
            ); })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-16"><h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Generate Professional Content in Three Steps</h2></div>
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
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-muted/50">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-16"><h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything You Need for Modern News Production</h2></div>
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

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-16"><h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Trusted by Newsrooms Everywhere</h2></div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-lg border bg-card p-6">
                <div className="flex gap-1 mb-4">{Array.from({ length: 5 }).map((_, i) => (<Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />))}</div>
                <blockquote className="text-foreground mb-4">&ldquo;{t.quote}&rdquo;</blockquote>
                <div className="font-semibold text-sm">{t.name}</div><div className="text-xs text-muted-foreground">{t.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-muted/50">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-16"><h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Plans for Every Newsroom</h2></div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: "Solo Journalist", price: "$29", desc: "For freelancers", features: ["50 stories/month", "All formats", "Quality checks", "Email support"], cta: "Start Free Trial", popular: false },
              { name: "Small Newsroom", price: "$99", desc: "For teams of 5-10", features: ["Unlimited stories", "Up to 5 members", "Team collaboration", "Priority support", "Custom style guide"], cta: "Start Free Trial", popular: true },
              { name: "Enterprise", price: "Custom", desc: "For large orgs", features: ["Everything in Small", "Unlimited members", "API access", "Dedicated support", "Custom integrations"], cta: "Contact Sales", popular: false },
            ].map((plan) => (
              <div key={plan.name} className={`rounded-lg border bg-card p-6 relative ${plan.popular ? "border-primary shadow-lg ring-1 ring-primary" : ""}`}>
                {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2"><span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">Most Popular</span></div>}
                <h3 className="text-lg font-bold">{plan.name}</h3>
                <div className="mt-2"><span className="text-3xl font-bold">{plan.price}</span>{plan.price !== "Custom" && <span className="text-muted-foreground">/month</span>}</div>
                <p className="text-sm text-muted-foreground mt-2">{plan.desc}</p>
                <ul className="mt-6 space-y-3">{plan.features.map((f) => (<li key={f} className="flex items-start gap-2 text-sm"><Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />{f}</li>))}</ul>
                <Link href="/signup" className={`mt-6 block text-center rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${plan.popular ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border border-input hover:bg-accent"}`}>{plan.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-500">
        <div className="container mx-auto max-w-7xl px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Ready to Transform Your Newsroom?</h2>
          <p className="mt-4 text-lg text-white/80 max-w-xl mx-auto">Join hundreds of newsrooms saving time and improving quality.</p>
          <Link href="/signup" className="mt-8 inline-flex items-center justify-center rounded-md bg-white px-8 py-3 text-base font-medium text-blue-600 hover:bg-white/90 transition-colors">Start Free Trial<ArrowRight className="ml-2 h-4 w-4" /></Link>
          <p className="mt-4 text-sm text-white/60">No credit card required. Cancel anytime.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1"><Logo size="md" /><p className="mt-4 text-sm text-muted-foreground">AI-powered editorial assistant for modern newsrooms.</p></div>
            <div><h4 className="font-semibold text-sm mb-3">Product</h4><ul className="space-y-2 text-sm text-muted-foreground"><li><a href="#features" className="hover:text-foreground">Features</a></li><li><a href="#pricing" className="hover:text-foreground">Pricing</a></li></ul></div>
            <div><h4 className="font-semibold text-sm mb-3">Company</h4><ul className="space-y-2 text-sm text-muted-foreground"><li><a href="#" className="hover:text-foreground">About</a></li><li><a href="#" className="hover:text-foreground">Contact</a></li></ul></div>
            <div><h4 className="font-semibold text-sm mb-3">Legal</h4><ul className="space-y-2 text-sm text-muted-foreground"><li><a href="#" className="hover:text-foreground">Privacy</a></li><li><a href="#" className="hover:text-foreground">Terms</a></li></ul></div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">&copy; 2025 NewsFlow. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
