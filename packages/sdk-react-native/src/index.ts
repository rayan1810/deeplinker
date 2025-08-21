import { Linking } from "react-native";

export type BuildDeeplinkArgs = {
  baseUrl: string; // e.g. https://yourdomain.com
  slug: string; // e.g. "welcome"
  params?: Record<string, string | number | boolean | undefined | null>;
};

/**
 * Build a deep link URL with optional query parameters
 */
export function buildDeeplink(args: BuildDeeplinkArgs): string {
  const { baseUrl, slug, params } = args;

  // Ensure baseUrl doesn't end with slash
  const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

  // Build the base deep link URL
  let url = `${cleanBaseUrl}/l/${slug}`;

  // Add query parameters if provided
  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
      if (value !== null && value !== undefined) {
        searchParams.append(key, String(value));
      }
    }

    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  return url;
}

/**
 * Parse a deep link URL to extract slug and parameters
 */
export function parseDeeplink(url: string): {
  slug: string;
  params: Record<string, string>;
} {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");

    // Extract slug from path (expecting /l/[slug] or /d/[slug])
    let slug = "";
    if (pathParts.includes("l") || pathParts.includes("d")) {
      const lIndex = pathParts.indexOf("l");
      const dIndex = pathParts.indexOf("d");
      const index = lIndex !== -1 ? lIndex : dIndex;
      slug = pathParts[index + 1] || "";
    }

    // Extract query parameters
    const params: Record<string, string> = {};
    for (const [key, value] of urlObj.searchParams.entries()) {
      params[key] = value;
    }

    return { slug, params };
  } catch (error) {
    // Return empty result if URL parsing fails
    return { slug: "", params: {} };
  }
}

/**
 * Open a deep link URL using React Native's Linking API
 */
export async function openDeeplink(url: string): Promise<void> {
  try {
    // Basic validation - ensure it's a valid URL
    if (!url || typeof url !== "string") {
      throw new Error("Invalid URL provided");
    }

    // Check if the URL can be opened
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      throw new Error(`Cannot open URL: ${url}`);
    }

    // Open the URL
    await Linking.openURL(url);
  } catch (error) {
    console.error("Error opening deep link:", error);
    throw error;
  }
}
