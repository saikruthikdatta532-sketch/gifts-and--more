import { authService } from "@/services/authService";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function Login() {
  return (
    <div className="max-w-md mx-auto px-5 py-24 text-center">
      <SectionLabel>Account</SectionLabel>
      <h1 className="font-display text-3xl mb-3">Sign In</h1>
      <p className="text-brand-black/60 dark:text-white/60 mb-8">
        Sign in with Google for a personalized experience. Browsing and WhatsApp enquiries don't
        require an account.
      </p>
      <Button size="lg" className="w-full" onClick={() => authService.loginWithGoogle()}>
        Continue with Google
      </Button>
    </div>
  );
}
