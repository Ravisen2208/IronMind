import { SignupForm } from "@/components/auth/SignupForm";
import { FadeIn } from "@/components/animations/MotionWrapper";

export const metadata = {
  title: "Join IronMind — Begin Your Progression",
  description: "Create your IronMind account and initialize your RPG productivity character.",
};

export default function SignupPage() {
  return (
    <div className="py-12 sm:py-20 px-4">
      <FadeIn yOffset={15} duration={0.6}>
        <SignupForm />
      </FadeIn>
    </div>
  );
}
