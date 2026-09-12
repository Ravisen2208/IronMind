import { Router } from "express";
import { requireAuth, AuthenticatedRequest } from "../lib/auth.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = Router();

const FALLBACK_SUGGESTIONS = [
  { title: "Review binary search tree invariants", type: "study", category: "Study", priority: "medium" },
  { title: "Perform 4 sets of weighted pull-ups", type: "gym", category: "Gym", priority: "high" },
  { title: "Read 15 pages on system design caching", type: "study", category: "Study", priority: "medium" },
  { title: "Practice touch typing or speed reading drills", type: "study", category: "Study", priority: "low" },
  { title: "Active recovery: 20 min dynamic stretching", type: "gym", category: "Gym", priority: "low" },
];

router.post("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      const randomFallback =
        FALLBACK_SUGGESTIONS[Math.floor(Math.random() * FALLBACK_SUGGESTIONS.length)];
      return res.status(200).json({
        success: true,
        suggestion: randomFallback,
        source: "fallback",
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Generate a single concise RPG micro-quest for a gamified productivity application.
Return ONLY a valid JSON object matching this exact TypeScript structure:
{
  "title": "string (actionable, max 60 chars)",
  "type": "general" | "gym" | "study",
  "category": "Study" | "Gym" | "Work" | "Personal",
  "priority": "low" | "medium" | "high"
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return res.status(200).json({
        success: true,
        suggestion: parsed,
        source: "gemini-ai",
      });
    }

    throw new Error("Invalid AI JSON payload format");
  } catch (error) {
    const randomFallback =
      FALLBACK_SUGGESTIONS[Math.floor(Math.random() * FALLBACK_SUGGESTIONS.length)];
    return res.status(200).json({
      success: true,
      suggestion: randomFallback,
      source: "fallback",
    });
  }
});

export default router;
