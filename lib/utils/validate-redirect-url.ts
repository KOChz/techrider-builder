/**
 * Validates and sanitizes redirect URLs to prevent open redirect vulnerabilities
 * Only allows internal paths that start with "/" and don't contain protocol schemes
 *
 * @param redirectPath - The path to validate (from query params or user input)
 * @param fallbackPath - Safe fallback path if validation fails
 * @returns A safe, validated internal path
 */
export function validateRedirectUrl(
  redirectPath: string | null,
  fallbackPath: string = "/"
): string {
  if (!redirectPath) {
    return fallbackPath;
  }

  // Remove any whitespace
  const trimmed = redirectPath.trim();

  // Block protocol-relative URLs (//example.com) and absolute URLs
  if (
    trimmed.startsWith("//") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://")
  ) {
    return fallbackPath;
  }

  // Must start with "/" to be an internal path
  if (!trimmed.startsWith("/")) {
    return `/${trimmed}`;
  }

  // Block common XSS attempts in redirects
  if (
    trimmed.includes("javascript:") ||
    trimmed.includes("data:") ||
    trimmed.includes("vbscript:")
  ) {
    return fallbackPath;
  }

  return trimmed;
}
