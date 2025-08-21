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
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
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

    // Choose destination URL based on platform priority
    let destinationUrl: string | null = null;

    if (platform === "ios" && link.iosUrl) {
      destinationUrl = link.iosUrl;
    } else if (platform === "android" && link.androidUrl) {
      destinationUrl = link.androidUrl;
    } else if (link.webUrl) {
      destinationUrl = link.webUrl;
    } else if (link.fallbackUrl) {
      destinationUrl = link.fallbackUrl;
    }

    if (!destinationUrl) {
      return NextResponse.json(
        { error: "No valid destination URL found" },
        { status: 404 }
      );
    }

    // Merge query parameters from incoming request to destination
    const finalUrl = mergeQueryParams(destinationUrl, request.url);

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
