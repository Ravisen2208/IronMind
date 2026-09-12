import { NextResponse } from "next/server";
import { generateQuestSuggestion, getRandomFallbackQuest } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const category = body.category === "willpower" ? "willpower" : "intellect";

    const quest = await generateQuestSuggestion(category);

    return NextResponse.json({
      success: true,
      category,
      quest,
    });
  } catch (error: any) {
    console.warn("AI Quest route encountered error, using fallback:", error);
    const fallbackQuest = getRandomFallbackQuest("intellect");
    return NextResponse.json({
      success: true,
      category: "intellect",
      quest: fallbackQuest,
    });
  }
}
