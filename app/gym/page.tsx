import { GymTracker } from "@/components/gym/GymTracker";
import { FadeIn } from "@/components/animations/MotionWrapper";

export const metadata = {
  title: "Gym & Fitness Progression — IronMind",
  description: "Track strength training, cardio, sets, reps, and build physical willpower.",
};

export default function GymPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <FadeIn yOffset={10}>
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
            Gym & Physical Mastery
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Log workouts, track progressive overload, and advance your Willpower attribute.
          </p>
        </div>
      </FadeIn>

      <GymTracker />
    </div>
  );
}
