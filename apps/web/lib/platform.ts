export type Platform = "ios" | "android" | "web" | "other";

/**
 * Detect platform from User-Agent string
 */
export function detectPlatform(userAgent: string): Platform {
  const ua = userAgent.toLowerCase();

  if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod")) {
    return "ios";
  }

  if (ua.includes("android")) {
    return "android";
  }

  return "other";
}

/**
 * Merge query parameters from source URL to destination URL
 * Handles both URLs with existing query params and without
 */
export function mergeQueryParams(
  destinationUrl: string,
  sourceUrl: string
): string {
  try {
    const destUrl = new URL(destinationUrl);
    const sourceUrlObj = new URL(sourceUrl);

    // Copy all query parameters from source to destination
    const entries = Array.from(sourceUrlObj.searchParams.entries());
    for (const [key, value] of entries) {
      destUrl.searchParams.set(key, value);
    }

    return destUrl.toString();
  } catch (error) {
    // If URL parsing fails, return original destination
    return destinationUrl;
  }
}

/**
 * Validate platform override from query parameter
 */
export function validatePlatformOverride(
  platform: string | null
): Platform | null {
  if (!platform) return null;

  const validPlatforms: Platform[] = ["ios", "android", "web"];
  return validPlatforms.includes(platform as Platform)
    ? (platform as Platform)
    : null;
}
