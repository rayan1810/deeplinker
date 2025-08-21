import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  detectPlatform,
  mergeQueryParams,
  validatePlatformOverride,
} from "@/lib/platform";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    // Fetch link from database
    const link = await prisma.link.findUnique({
      where: { slug, isActive: true },
    });

    if (!link) {
      return NextResponse.json(
        { error: "Link not found" },
        { status: 404 }
      );
    }

    // Get platform from query override or detect from User-Agent
    const platformOverride = request.nextUrl.searchParams.get("platform");
    const validatedOverride = validatePlatformOverride(platformOverride);

    let platform: string;
    if (validatedOverride) {
      platform = validatedOverride;
    } else {
      const userAgent = request.headers.get("user-agent") || "";
      platform = detectPlatform(userAgent);
    }

    // Get access_code from query parameters
    const accessCode = request.nextUrl.searchParams.get("access_code");
    
    // Choose destination URL based on platform priority
    let destinationUrl: string | null = null;
    let appStoreUrl: string | null = null;

    if (platform === "ios") {
      if (link.iosUrl) {
        destinationUrl = link.iosUrl;
        appStoreUrl = process.env.APP_STORE_URL || "https://apps.apple.com/app/your-app-id";
      }
    } else if (platform === "android") {
      if (link.androidUrl) {
        destinationUrl = link.androidUrl;
        appStoreUrl = process.env.PLAY_STORE_URL || "https://play.google.com/store/apps/details?id=com.your.app";
      }
    } else if (link.webUrl) {
      destinationUrl = link.webUrl;
    } else if (link.fallbackUrl) {
      destinationUrl = link.fallbackUrl;
    }

    if (!destinationUrl && !appStoreUrl) {
      return NextResponse.json(
        { error: "No valid destination URL found" },
        { status: 404 }
      );
    }

    // If we have a mobile platform and app store URL, implement smart workflow
    if ((platform === "ios" || platform === "android") && appStoreUrl) {
      // Create a smart redirect page that handles app detection
      const smartRedirectUrl = new URL("/smart-redirect", request.url);
      smartRedirectUrl.searchParams.set("platform", platform);
      smartRedirectUrl.searchParams.set("appUrl", destinationUrl || "");
      smartRedirectUrl.searchParams.set("storeUrl", appStoreUrl);
      smartRedirectUrl.searchParams.set("access_code", accessCode || "");
      smartRedirectUrl.searchParams.set("slug", slug);
      
      return NextResponse.redirect(smartRedirectUrl, 302);
    }

    // For web or fallback, use the original logic
    const finalUrl = mergeQueryParams(destinationUrl!, request.url);

    // Return redirect with cache headers
    const response = NextResponse.redirect(finalUrl, 302);
    response.headers.set(
      "Cache-Control",
      "public, max-age=60, s-maxage=300, stale-while-revalidate=600"
    );

    return response;
  } catch (error) {
    console.error("Error processing deep link:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
