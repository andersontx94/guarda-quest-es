/**
 * Sanitize text from database: convert escaped newlines to real ones,
 * trim whitespace, etc.
 */
export function sanitizeText(text: string | null | undefined): string {
  if (!text) return "";
  return text
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "")
    .replace(/\\t/g, "  ")
    .trim();
}
