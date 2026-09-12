/**
 * Gemini AI Quest Generation Service & Resilient Fallback Engine
 */

const FALLBACK_QUESTS: Record<"intellect" | "willpower", string[]> = {
  intellect: [
    "Read 15 pages of a non-fiction book",
    "Review and refactor one messy code module",
    "Solve one complex algorithmic logic puzzle",
    "Write a concise one-page technical architecture summary",
    "Study system design concepts for 25 minutes",
    "Practice touch typing or speed reading drills",
    "Analyze three open source GitHub pull requests",
    "Learn 5 new vocabulary terms in target language",
    "Outline next week goals with prioritized milestones",
    "Complete one lesson on mathematical reasoning",
  ],
  willpower: [
    "Execute 25 minutes of deep undistracted focus",
    "Complete 30 consecutive pushups with strict form",
    "Take an intentional 2-minute cold recovery shower",
    "Avoid social media feeds for 3 consecutive hours",
    "Drink 500ml cold water and stretch for 10 minutes",
    "Clear your physical work desk of all clutter",
    "Complete high-intensity sprint intervals for 15 minutes",
    "Fast from refined sugars and sweets for the day",
    "Do 3 minutes of box breathing meditation",
    "Wake up immediately at the sound of first alarm",
  ],
};

export async function generateQuestSuggestion(
  category: "intellect" | "willpower"
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === "" || apiKey === "your_gemini_api_key") {
    return getRandomFallbackQuest(category);
  }

  try {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Generate a single short, concrete real-world quest for self-improvement under the category of ${category}.
Rules:
1. Maximum 10 words.
2. Must be highly actionable, crisp, and motivating.
3. Absolutely NO quotation marks, NO markdown, NO explanations, NO introductory text.
4. Examples:
- Intellect: "Read 10 pages of a technical book"
- Willpower: "Do 25 pushups and 5 minutes stretching"`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim().replace(/^["']|["']$/g, "").replace(/\n.*/g, "");

    if (text && text.split(" ").length <= 15 && text.length > 5) {
      return text;
    }
    return getRandomFallbackQuest(category);
  } catch (error) {
    console.warn("Gemini AI quest generation fallback triggered:", error);
    return getRandomFallbackQuest(category);
  }
}

export function getRandomFallbackQuest(category: "intellect" | "willpower"): string {
  const list = FALLBACK_QUESTS[category];
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}
