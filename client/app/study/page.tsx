import { StudyTracker } from "@/components/study/StudyTracker";
import { FadeIn } from "@/components/animations/MotionWrapper";

export const metadata = {
  title: "Study & Focus Directives — IronMind",
  description: "Track deep study sessions, algorithm practice, system design, and expand your Intellect attribute.",
};

export default function StudyPage() {
  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-8 space-y-6">
      <FadeIn yOffset={10}>
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-serif tracking-tight text-text-primary">
            Study & Cognitive Mastery
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Log deep work sessions, master technical subjects, and amplify your Intellect attribute.
          </p>
        </div>
      </FadeIn>

      <StudyTracker />
    </div>
  );
}
