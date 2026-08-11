/**
 * Minimal classnames helper — avoids pulling in a dependency for
 * something this simple.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
