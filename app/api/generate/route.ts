import { generateContent, verifyContentConsistency } from "@/lib/openai";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { storyId, materials, formats } = await request.json();

  const { data: story } = await supabase.from("stories").select("*").eq("id", storyId).single();
  if (!story || story.user_id !== user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const results = await Promise.all(
      formats.map(async (formatType: string) => {
        const content = await generateContent(materials, { formatType: formatType as "web" | "twitter" | "linkedin" | "facebook" | "instagram" | "video" | "newsletter" | "audio" | "press" | "breaking" | "feature", temperature: 0.7 });
        const wordCount = content.split(/\s+/).length;

        const { data } = await supabase.from("generated_content").insert({
          story_id: storyId,
          format_type: formatType,
          content,
          generation_params: { model: "gpt-4o", temperature: 0.7 },
          quality_scores: { word_count: wordCount, char_count: content.length, readability_score: 70, seo_score: formatType === "web" ? 75 : null, estimated_read_time: Math.ceil(wordCount / 200) },
          created_by: user.id,
        }).select().single();

        return data;
      })
    );

    // Consistency check
    const consistencyCheck = await verifyContentConsistency(
      results.filter(Boolean).map((r: { format_type: string; content: string }) => ({ formatType: r.format_type, content: r.content }))
    );

    await supabase.from("quality_checks").insert({
      story_id: storyId,
      check_type: "fact_consistency",
      status: consistencyCheck.consistent ? "pass" : "warning",
      details: { issues: consistencyCheck.issues },
    });

    await supabase.from("stories").update({ status: "in_progress" }).eq("id", storyId);

    return NextResponse.json({ success: true, results, consistencyCheck });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
  }
}
