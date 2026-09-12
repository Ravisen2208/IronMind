import { LoginForm } from "@/components/auth/LoginForm";
import { FadeIn } from "@/components/animations/MotionWrapper";

export const metadata = {
  title: "Sign In — IronMind",
  description: "Sign in to resume your IronMind character progression and active quests.",
};

export default function LoginPage() {
  return (
    <div className="py-12 sm:py-20 px-4 max-w-md mx-auto">
      <FadeIn yOffset={15} duration={0.6}>
        <LoginForm />
      </FadeIn>
    </div>
  );
}
