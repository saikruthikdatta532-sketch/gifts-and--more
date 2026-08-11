import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";

export function NotFound() {
  return (
    <div className="max-w-md mx-auto px-5 py-32 text-center">
      <h1 className="font-display text-6xl mb-4 text-brand-pink-dark">404</h1>
      <p className="text-brand-black/60 dark:text-white/60 mb-8">
        The page you're looking for doesn't exist.
      </p>
      <Link to="/">
        <Button>Back to Home</Button>
      </Link>
    </div>
  );
}
