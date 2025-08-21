import { NextResponse } from "next/server";

export async function GET() {
  const assetLinks: Array<{
    relation: string[];
    target: {
      namespace: string;
      package_name: string;
      sha256_cert_fingerprints: string[];
    };
  }> = [];

  // Support up to 5 Android apps
  for (let i = 1; i <= 5; i++) {
    const packageName = process.env[`ASSETLINKS_PACKAGE_NAME_${i}`];
    const sha256Cert = process.env[`ASSETLINKS_SHA256_CERT_${i}`];

    if (packageName && sha256Cert) {
      assetLinks.push({
        relation: ["delegate_permission/common.handle_all_urls"],
        target: {
          namespace: "android_app",
          package_name: packageName,
          sha256_cert_fingerprints: [sha256Cert],
        },
      });
    }
  }

  // If no asset links configured, return example placeholder
  if (assetLinks.length === 0) {
    assetLinks.push({
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: "com.your.app",
        sha256_cert_fingerprints: [
          "AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99",
        ],
      },
    });
  }

  return NextResponse.json(assetLinks);
}
