#!/usr/bin/env tsx

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database with example links...");

  try {
    // Example link 1: Hello
    await prisma.link.upsert({
      where: { slug: "hello" },
      update: {},
      create: {
        slug: "hello",
        iosUrl: "myapp://hello",
        androidUrl: "myapp://hello",
        webUrl: "https://example.com/hello",
        fallbackUrl: "https://example.com/fallback",
        isActive: true,
      },
    });

    // Example link 2: Welcome
    await prisma.link.upsert({
      where: { slug: "welcome" },
      update: {},
      create: {
        slug: "welcome",
        iosUrl: "myapp://welcome",
        androidUrl: "myapp://welcome",
        webUrl: "https://example.com/welcome",
        fallbackUrl: "https://example.com/fallback",
        isActive: true,
      },
    });

    // Example link 3: Product
    await prisma.link.upsert({
      where: { slug: "product" },
      update: {},
      create: {
        slug: "product",
        iosUrl: "myapp://product",
        androidUrl: "myapp://product",
        webUrl: "https://example.com/product",
        fallbackUrl: "https://example.com/fallback",
        isActive: true,
      },
    });

    // Example link 4: Settings (iOS only)
    await prisma.link.upsert({
      where: { slug: "settings" },
      update: {},
      create: {
        slug: "settings",
        iosUrl: "myapp://settings",
        webUrl: "https://example.com/settings",
        fallbackUrl: "https://example.com/fallback",
        isActive: true,
      },
    });

    // Example link 5: Profile (Android only)
    await prisma.link.upsert({
      where: { slug: "profile" },
      update: {},
      create: {
        slug: "profile",
        androidUrl: "myapp://profile",
        webUrl: "https://example.com/profile",
        fallbackUrl: "https://example.com/fallback",
        isActive: true,
      },
    });

    console.log("✅ Database seeded successfully!");
    console.log("\nExample links created:");
    console.log(
      "- /l/hello → myapp://hello (iOS/Android) or https://example.com/hello (web)"
    );
    console.log(
      "- /l/welcome → myapp://welcome (iOS/Android) or https://example.com/welcome (web)"
    );
    console.log(
      "- /l/product → myapp://product (iOS/Android) or https://example.com/product (web)"
    );
    console.log(
      "- /l/settings → myapp://settings (iOS only) or https://example.com/settings (web)"
    );
    console.log(
      "- /l/profile → myapp://profile (Android only) or https://example.com/profile (web)"
    );
    console.log("\nTest with:");
    console.log("  GET /l/hello");
    console.log("  GET /d/hello (shorter URL)");
    console.log("  GET /l/hello?platform=ios");
    console.log("  GET /l/hello?source=email&utm_campaign=welcome");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
