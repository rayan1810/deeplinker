#!/usr/bin/env tsx

import { PrismaClient } from "@prisma/client";
import { parseArgs } from "node:util";

const prisma = new PrismaClient();

interface AddLinkArgs {
  slug: string;
  ios?: string;
  android?: string;
  web?: string;
  fallback?: string;
}

async function main() {
  const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    options: {
      slug: { type: "string", short: "s" },
      ios: { type: "string" },
      android: { type: "string" },
      web: { type: "string" },
      fallback: { type: "string" },
      help: { type: "boolean", short: "h" },
    },
    allowPositionals: true,
  });

  if (values.help) {
    console.log(`
Usage: pnpm add:link [options]

Options:
  -s, --slug <slug>        The slug for the deep link (required)
  --ios <url>              iOS deep link URL (e.g., myapp://path)
  --android <url>          Android deep link URL (e.g., myapp://path)
  --web <url>              Web fallback URL (e.g., https://example.com/path)
  --fallback <url>         Ultimate fallback URL if others fail
  -h, --help               Show this help message

Examples:
  pnpm add:link --slug welcome --ios "myapp://welcome" --android "myapp://welcome" --web "https://example.com/welcome"
  pnpm add:link --slug product --ios "myapp://product/123" --web "https://example.com/product/123"
  pnpm add:link --slug settings --ios "myapp://settings" --fallback "https://example.com/settings"
`);
    process.exit(0);
  }

  const slug = values.slug || positionals[0];

  if (!slug) {
    console.error("❌ Error: Slug is required");
    console.error("Use --help for usage information");
    process.exit(1);
  }

  // Validate slug format
  if (!/^[a-zA-Z0-9-_]+$/.test(slug)) {
    console.error(
      "❌ Error: Slug must contain only letters, numbers, hyphens, and underscores"
    );
    process.exit(1);
  }

  try {
    console.log(`🔗 Adding/updating deep link: ${slug}`);

    const linkData: any = {
      slug,
      isActive: true,
    };

    if (values.ios) {
      linkData.iosUrl = values.ios;
      console.log(`  iOS: ${values.ios}`);
    }

    if (values.android) {
      linkData.androidUrl = values.android;
      console.log(`  Android: ${values.android}`);
    }

    if (values.web) {
      linkData.webUrl = values.web;
      console.log(`  Web: ${values.web}`);
    }

    if (values.fallback) {
      linkData.fallbackUrl = values.fallback;
      console.log(`  Fallback: ${values.fallback}`);
    }

    // Check if at least one destination URL is provided
    const hasDestination =
      values.ios || values.android || values.web || values.fallback;
    if (!hasDestination) {
      console.error("❌ Error: At least one destination URL must be provided");
      process.exit(1);
    }

    // Upsert the link
    const link = await prisma.link.upsert({
      where: { slug },
      update: linkData,
      create: linkData,
    });

    console.log(
      `✅ Deep link "${slug}" ${link.createdAt === link.updatedAt ? "created" : "updated"} successfully!`
    );
    console.log(`\nTest with:`);
    console.log(`  GET /l/${slug}`);
    console.log(`  GET /d/${slug} (shorter URL)`);

    if (values.ios) {
      console.log(`  GET /l/${slug}?platform=ios`);
    }
    if (values.android) {
      console.log(`  GET /l/${slug}?platform=android`);
    }
    if (values.web) {
      console.log(`  GET /l/${slug}?platform=web`);
    }
  } catch (error) {
    console.error("❌ Error adding/updating deep link:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
