import OpenAI from "openai";

let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  }
  return _openai;
}

export interface StoryMaterials {
  headline: string;
  beat: string;
  audience: string;
  tone: string;
  priority: string;
  notes: string[];
  facts: Array<{ statement: string; source: string; verification_status: string; importance: string }>;
  quotes: Array<{ text: string; speaker_name: string; speaker_title: string; context: string; quality_rating: string }>;
  context: string;
  guidelines: string[];
}

export interface GenerationOptions {
  formatType: "breaking" | "web" | "feature" | "twitter" | "linkedin" | "facebook" | "instagram" | "video" | "newsletter" | "audio" | "press";
  temperature?: number;
  maxTokens?: number;
  customInstructions?: string;
}

const formatPrompts: Record<string, string> = {
  breaking: "You specialize in ultra-concise breaking news alerts that lead with the most newsworthy element.",
  web: "You write web articles with inverted pyramid structure, strong SEO, and scannable formatting.",
  feature: "You craft compelling narrative features with strong leads, rich detail, and natural quote integration.",
  twitter: "You write punchy, news-forward Twitter posts that maximize engagement within 280 characters.",
  linkedin: "You create professional LinkedIn posts with analysis and context for industry audiences.",
  facebook: "You write conversational Facebook posts that encourage engagement while maintaining journalistic integrity.",
  instagram: "You craft visual-first Instagram captions that complement imagery and use strategic hashtags.",
  video: "You write engaging video scripts with strong hooks, scene direction, and clear pacing.",
  newsletter: "You create personal, engaging newsletter content that builds reader relationships.",
  audio: "You write natural-sounding audio scripts optimized for spoken delivery.",
  press: "You write formal press statements in organizational voice with quote-ready paragraphs.",
};

const formatInstructions: Record<string, string> = {
  breaking: "Create a breaking news alert of 50-75 words. Lead with the most newsworthy element. Be urgent but accurate.",
  web: "Write a 400-600 word web article with strong headline, compelling lead, inverted pyramid structure, 2-3 subheadings, natural quote integration, and SEO optimization.",
  feature: "Write a 1000-1500 word feature with compelling narrative lead, nut graph, multiple sections, rich detail, quotes woven throughout, analysis, and engaging conclusion.",
  twitter: "Create a Twitter/X post of 240-280 characters. Lead with the news. Be punchy and shareable. Use 1-2 relevant hashtags.",
  linkedin: "Create a LinkedIn post of 125-175 words. Open with a hook, provide professional analysis, end with a thought-provoking question. Use 2-3 hashtags.",
  facebook: "Create a Facebook post of 80-120 words. Use conversational but professional tone. Encourage engagement. Use 1-2 hashtags.",
  instagram: "Create an Instagram caption of 100-150 words. Start with a strong hook. Break into short paragraphs. Include 5-8 relevant hashtags.",
  video: "Create a 2-3 minute video script with HOOK (5 seconds), scene-by-scene breakdown with voice-over, B-roll suggestions, and strong conclusion.",
  newsletter: "Create newsletter content with 3-5 subject lines, preview text, personal greeting, body (175-225 words), key takeaways, and call to action.",
  audio: "Create a 60-90 second audio script with natural conversational language, short sentences, pronunciation guides, timing markers, and emphasis cues.",
  press: "Create a formal press statement with headline, dateline, opening paragraph, 2-3 body paragraphs, official quote, background, and boilerplate.",
};

const maxTokens: Record<string, number> = {
  breaking: 150, web: 1000, feature: 2500, twitter: 100, linkedin: 300, facebook: 250,
  instagram: 350, video: 1000, newsletter: 500, audio: 400, press: 800,
};

export async function generateContent(materials: StoryMaterials, options: GenerationOptions): Promise<string> {
  const systemPrompt = `You are an expert journalist and content creator. You write in AP style with exceptional clarity, accuracy, and engagement.\n\n${formatPrompts[options.formatType] || ""}\n\nTarget Tone: ${materials.tone}\nTarget Audience: ${materials.audience}`;

  let prompt = `Create a ${options.formatType} piece based on these materials:\n\nHEADLINE: ${materials.headline}\n\n`;
  if (materials.notes.length > 0) prompt += `SOURCE MATERIALS:\n${materials.notes.join("\n\n")}\n\n`;
  if (materials.facts.length > 0) {
    prompt += "KEY FACTS:\n";
    materials.facts.forEach((f, i) => { prompt += `${i + 1}. ${f.statement} (Source: ${f.source}, ${f.verification_status})\n`; });
    prompt += "\n";
  }
  if (materials.quotes.length > 0) {
    prompt += "QUOTES:\n";
    materials.quotes.forEach((q, i) => { prompt += `${i + 1}. "${q.text}" - ${q.speaker_name}, ${q.speaker_title}\n`; });
    prompt += "\n";
  }
  if (materials.context) prompt += `BACKGROUND CONTEXT:\n${materials.context}\n\n`;
  if (materials.guidelines.length > 0) prompt += `EDITORIAL GUIDELINES:\n${materials.guidelines.join("\n")}\n\n`;
  prompt += formatInstructions[options.formatType] || "";
  if (options.customInstructions) prompt += `\n\nADDITIONAL INSTRUCTIONS:\n${options.customInstructions}`;

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "system", content: systemPrompt }, { role: "user", content: prompt }],
    temperature: options.temperature || 0.7,
    max_tokens: options.maxTokens || maxTokens[options.formatType] || 1000,
  });

  return response.choices[0].message.content || "";
}

export async function verifyContentConsistency(formats: Array<{ formatType: string; content: string }>): Promise<{ consistent: boolean; issues: string[] }> {
  try {
    const response = await getOpenAI().chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a meticulous fact-checker. Identify any factual inconsistencies between different versions of the same story." },
        { role: "user", content: `Review these format variations and identify factual inconsistencies:\n\n${formats.map((f) => `${f.formatType.toUpperCase()}:\n${f.content}`).join("\n\n---\n\n")}\n\nIf consistent, respond with "CONSISTENT".` },
      ],
      temperature: 0.3,
      max_tokens: 500,
    });
    const result = response.choices[0].message.content || "";
    const consistent = result.trim().toUpperCase() === "CONSISTENT";
    return { consistent, issues: consistent ? [] : result.split("\n").filter((l) => l.trim()) };
  } catch {
    return { consistent: true, issues: [] };
  }
}

export async function suggestImprovements(content: string, formatType: string): Promise<string[]> {
  try {
    const response = await getOpenAI().chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an expert editor. Provide 3-5 specific improvement suggestions." },
        { role: "user", content: `Review this ${formatType} content and suggest improvements:\n\n${content}` },
      ],
      temperature: 0.7,
      max_tokens: 400,
    });
    return (response.choices[0].message.content || "").split("\n").filter((l) => l.trim() && /^\d+\./.test(l.trim()));
  } catch {
    return [];
  }
}
