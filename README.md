# DeepLinker

A minimal, production-deployable deep-linking service built with Next.js 14, Prisma, and Neon Postgres.

## 🚀 Features

- **Platform Detection**: Automatically detects iOS, Android, or web platforms
- **Smart Redirects**: Routes users to the appropriate destination based on platform
- **Query Parameter Preservation**: Maintains all incoming query params in redirects
- **Platform Override**: Manual platform selection via `?platform=ios|android|web`
- **Short URLs**: `/d/[slug]` rewrites to `/l/[slug]` for convenience
- **Universal Links**: Apple App Site Association (AASA) support
- **App Links**: Android Digital Asset Links support
- **CLI Management**: Add links via command line without building admin UI
- **React Native SDK**: Tiny SDK for consuming deep links in mobile apps

## 🏗️ Architecture

```
apps/web/                 # Next.js 14 web app (deployable on Vercel)
├── app/                  # App Router structure
│   ├── l/[slug]/        # Main deep link redirector (Edge Route)
│   ├── d/[slug]/        # Short URL (handled by middleware)
│   ├── .well-known/     # AASA & Asset Links
│   ├── docs/            # Documentation page
│   └── healthz/         # Health check endpoint
├── lib/                  # Utilities (platform detection, DB)
├── prisma/              # Database schema & migrations
└── middleware.ts        # URL rewriting

packages/sdk-react-native/ # React Native SDK
└── src/                 # TypeScript SDK implementation

scripts/                 # CLI tools
├── seed.ts             # Database seeding
└── add-link.ts         # Add/update deep links
```

## 🛠️ Quick Start

### 1. Clone & Install

```bash
git clone <your-repo>
cd deeplinker
pnpm install
```

### 2. Environment Setup

Copy the example environment file and configure:

```bash
cp env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# Apple Universal Links
AASA_APP_ID_1="ABCDE12345.com.your.bundle"

# Android App Links
ASSETLINKS_PACKAGE_NAME_1="com.your.app"
ASSETLINKS_SHA256_CERT_1="AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99"
```

### 3. Database Setup

```bash
# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Seed with example data
pnpm seed
```

### 4. Local Development

```bash
# Start Next.js dev server
pnpm dev
```

Visit `http://localhost:3000/docs` for documentation.

## 🔗 Adding Deep Links

### Via CLI

```bash
# Add a complete deep link
pnpm add:link --slug welcome \
  --ios "myapp://welcome" \
  --android "myapp://welcome" \
  --web "https://example.com/welcome" \
  --fallback "https://example.com/fallback"

# Add iOS-only link
pnpm add:link --slug settings --ios "myapp://settings" --web "https://example.com/settings"

# Add Android-only link
pnpm add:link --slug profile --android "myapp://profile" --web "https://example.com/profile"
```

### Via API

```bash
# Test your deep links
curl "http://localhost:3000/l/hello"
curl "http://localhost:3000/d/hello"  # Short URL
curl "http://localhost:3000/l/hello?platform=ios"
curl "http://localhost:3000/l/hello?source=email&utm_campaign=welcome"
```

## 🚀 Deployment

### 1. Create Neon Database

1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the `DATABASE_URL` from project settings

### 2. Deploy to Vercel

1. Connect your repository to Vercel
2. Set environment variables:
   - `DATABASE_URL` (from Neon)
   - `AASA_APP_ID_1` (your iOS bundle ID)
   - `ASSETLINKS_PACKAGE_NAME_1` (your Android package name)
   - `ASSETLINKS_SHA256_CERT_1` (your Android SHA256 certificate)

3. Set build command: `pnpm i && pnpm -w prisma migrate deploy`

4. Deploy!

### 3. Verify Deployment

```bash
# Health check
curl "https://yourdomain.com/healthz"

# Apple App Site Association
curl "https://yourdomain.com/.well-known/apple-app-site-association"

# Android Asset Links
curl "https://yourdomain.com/.well-known/assetlinks.json"

# Test deep link
curl "https://yourdomain.com/l/hello"
```

## 📱 Mobile App Integration

### iOS Universal Links

Add to your `Entitlements.plist`:

```xml
<key>com.apple.developer.associated-domains</key>
<array>
    <string>applinks:yourdomain.com</string>
</array>
```

### Android App Links

Add to your `AndroidManifest.xml`:

```xml
<activity android:name=".MainActivity">
    <intent-filter android:autoVerify="true">
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="https" android:host="yourdomain.com" />
    </intent-filter>
</activity>
```

## 📚 React Native SDK

Install the SDK:

```bash
npm install @deeplinker/sdk-react-native
```

Usage:

```typescript
import {
  buildDeeplink,
  parseDeeplink,
  openDeeplink,
} from "@deeplinker/sdk-react-native";

// Build a deep link
const url = buildDeeplink({
  baseUrl: "https://yourdomain.com",
  slug: "welcome",
  params: { source: "app" },
});

// Parse incoming deep link
const { slug, params } = parseDeeplink(
  "https://yourdomain.com/l/welcome?source=email"
);

// Open a deep link
await openDeeplink(url);
```

## 🧪 Testing

### Local Testing

```bash
# Start dev server
pnpm dev

# Seed database
pnpm seed

# Test endpoints
curl "http://localhost:3000/healthz"
curl "http://localhost:3000/l/hello"
curl "http://localhost:3000/d/hello"
curl "http://localhost:3000/l/hello?platform=ios"
```

### Mobile Testing

- **iOS Simulator**: Open Safari, navigate to `https://yourdomain.com/l/hello`
- **Android**: Use ADB: `adb shell am start -a android.intent.action.VIEW -d "https://yourdomain.com/l/hello"`

## 📁 Project Structure

```
deeplinker/
├── apps/web/                    # Next.js web app
│   ├── app/                     # App Router pages
│   ├── lib/                     # Utilities
│   ├── prisma/                  # Database schema
│   └── middleware.ts            # URL rewriting
├── packages/sdk-react-native/    # React Native SDK
├── scripts/                     # CLI tools
├── package.json                 # Root package.json
└── turbo.json                   # Monorepo build config
```

## 🔧 Development

```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Start development
pnpm dev

# Build all packages
pnpm build

# Lint code
pnpm lint

# Format code
pnpm format
```

## 📖 API Reference

### Deep Link Redirector

- **GET** `/l/[slug]` - Main deep link endpoint
- **GET** `/d/[slug]` - Short URL (rewrites to `/l/[slug]`)

### Well-Known Endpoints

- **GET** `/.well-known/apple-app-site-association` - Apple Universal Links
- **GET** `/.well-known/assetlinks.json` - Android App Links

### Utility Endpoints

- **GET** `/healthz` - Health check
- **GET** `/docs` - Documentation

### Query Parameters

- `platform=ios|android|web` - Override platform detection
- Any other query params are preserved and appended to destination URLs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

- Check the `/docs` page for detailed setup instructions
- Review the example configuration in `env.example`
- Test with the provided seed data using `pnpm seed`

---

Built with ❤️ using Next.js 14, Prisma, and Neon Postgres.
