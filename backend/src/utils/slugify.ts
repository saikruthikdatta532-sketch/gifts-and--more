export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Ensures uniqueness by appending a short random suffix if the base slug
 * is already taken. Caller passes a check function against the DB.
 */
export async function generateUniqueSlug(
  base: string,
  exists: (slug: string) => Promise<boolean>
): Promise<string> {
  let slug = slugify(base);
  let attempt = 0;

  while (await exists(slug)) {
    attempt += 1;
    const suffix = Math.random().toString(36).substring(2, 6);
    slug = `${slugify(base)}-${suffix}`;
    if (attempt > 5) break; // safety valve
  }

  return slug;
}
