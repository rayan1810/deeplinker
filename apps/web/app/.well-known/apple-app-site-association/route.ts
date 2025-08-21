import { NextResponse } from "next/server";

export async function GET() {
  // Get app IDs from environment variables
  const appIds: string[] = [];

  // Support up to 5 app IDs
  for (let i = 1; i <= 5; i++) {
    const appId = process.env[`AASA_APP_ID_${i}`];
    if (appId) {
      appIds.push(appId);
    }
  }

  // If no app IDs configured, return example placeholder
  if (appIds.length === 0) {
    appIds.push("ABCDE12345.com.your.bundle");
  }

  const aasa = {
    applinks: {
      apps: [],
      details: appIds.map((appId) => ({
        appID: appId,
        paths: ["/l/*", "/d/*"],
      })),
    },
  };

  // Return JSON without application/json content-type (required for AASA)
  return new NextResponse(JSON.stringify(aasa, null, 2), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
