# DeepLinker Web App

The Next.js 14 web application for the DeepLinker service, deployable on Vercel.

## 🚀 Features

- **Edge Route Redirector**: High-performance deep link handling at `/l/[slug]`
- **Platform Detection**: Automatic iOS/Android/web platform detection
- **Query Parameter Preservation**: Maintains all incoming query params
- **Platform Override**: Manual platform selection via query parameter
- **Short URLs**: `/d/[slug]` rewrites to `/l/[slug]` via middleware
- **Universal Links**: Apple App Site Association (AASA) support
- **App Links**: Android Digital Asset Links support
- **Health Check**: `/healthz` endpoint for monitoring
- **Documentation**: Built-in docs page at `/docs`

## 🛠️ Local Development

### Prerequisites

- Node.js 18+
- pnpm
- Neon Postgres database

### Setup

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Environment configuration**

   ```bash
   cp ../../env.example .env.local
   ```

   Edit `.env.local` with your database and app configuration.

3. **Database setup**

   ```bash
   # Generate Prisma client
   pnpm prisma generate

   # Run migrations
   pnpm prisma migrate dev

   # Seed with example data
   pnpm seed
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

Visit `http://localhost:3000/docs` for documentation.

## 🗄️ Database Schema

```prisma
model Link {
  id          String   @id @default(cuid())
  slug        String   @unique
  iosUrl      String?
  androidUrl  String?
  webUrl      String?
  fallbackUrl String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("links")
}
```

## 🔗 API Endpoints

### Deep Link Redirector

**GET** `/l/[slug]`

Redirects users based on platform detection:

- **iOS**: Redirects to `iosUrl` if available
- **Android**: Redirects to `androidUrl` if available
- **Web**: Redirects to `webUrl` if available
- **Fallback**: Redirects to `fallbackUrl` if available
- **404**: Returns JSON error if no valid destination

**Query Parameters:**

- `platform=ios|android|web` - Override platform detection
- Any other params are preserved and appended to destination

**Response:**

- `302` redirect to appropriate destination
- Cache headers: `Cache-Control: public, max-age=60, s-maxage=300, stale-while-revalidate=600`

### Short URL Rewrite

**GET** `/d/[slug]`

Middleware automatically rewrites to `/l/[slug]` for shorter URLs.

### Health Check

**GET** `/healthz`

Returns `{ "ok": true }` for monitoring.

### Apple App Site Association

**GET** `/.well-known/apple-app-site-association`

Returns AASA JSON for Universal Links. Configured via environment variables:

- `AASA_APP_ID_1`, `AASA_APP_ID_2`, etc.

### Android Asset Links

**GET** `/.well-known/assetlinks.json`

Returns Digital Asset Links for Android App Links. Configured via environment variables:

- `ASSETLINKS_PACKAGE_NAME_1`, `ASSETLINKS_SHA256_CERT_1`, etc.

## 🧪 Testing

### Local Testing

```bash
# Start dev server
pnpm dev

# Test endpoints
curl "http://localhost:3000/healthz"
curl "http://localhost:3000/l/hello"
curl "http://localhost:3000/d/hello"
curl "http://localhost:3000/l/hello?platform=ios"
curl "http://localhost:3000/l/hello?source=email&utm_campaign=welcome"
```

### Database Testing

```bash
# Seed example data
pnpm seed

# Add custom links
pnpm add:link --slug test --ios "myapp://test" --web "https://example.com/test"

# View in Prisma Studio
pnpm prisma studio
```

## 🚀 Deployment

### Vercel Deployment

1. **Connect repository** to Vercel
2. **Set environment variables:**

   ```env
   DATABASE_URL="postgresql://..."
   AASA_APP_ID_1="com.your.bundle"
   ASSETLINKS_PACKAGE_NAME_1="com.your.app"
   ASSETLINKS_SHA256_CERT_1="AA:BB:CC:..."
   ```

3. **Set build command:**

   ```bash
   pnpm i && pnpm -w prisma migrate deploy
   ```

4. **Deploy!**

### Build Process

The build process:

1. Installs dependencies
2. Runs Prisma migrations
3. Generates Prisma client
4. Builds Next.js application

### Environment Variables

| Variable                    | Description                            | Required |
| --------------------------- | -------------------------------------- | -------- |
| `DATABASE_URL`              | Neon Postgres connection string        | ✅       |
| `AASA_APP_ID_1`             | iOS bundle ID for Universal Links      | ❌       |
| `ASSETLINKS_PACKAGE_NAME_1` | Android package name for App Links     | ❌       |
| `ASSETLINKS_SHA256_CERT_1`  | Android SHA256 certificate fingerprint | ❌       |

## 📁 File Structure

```
app/
├── (marketing)/
│   └── docs/                    # Documentation page
├── .well-known/
│   ├── apple-app-site-association/  # AASA endpoint
│   └── assetlinks.json/             # Asset Links endpoint
├── d/[slug]/                    # Short URL (empty, handled by middleware)
├── l/[slug]/                    # Main deep link redirector
├── healthz/                     # Health check endpoint
├── globals.css                  # Tailwind CSS
└── layout.tsx                   # Root layout

lib/
├── db.ts                        # Prisma client
└── platform.ts                  # Platform detection utilities

middleware.ts                    # URL rewriting
prisma/
└── schema.prisma               # Database schema
```

## 🔧 Development Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm prisma generate  # Generate Prisma client
pnpm prisma migrate dev # Run migrations
pnpm prisma studio    # Open database UI

# Linting & Formatting
pnpm lint             # Run ESLint
pnpm format           # Format with Prettier
```

## 🧪 Testing Checklist

After deployment, verify:

- [ ] `GET /healthz` returns `{ "ok": true }`
- [ ] `GET /.well-known/apple-app-site-association` returns valid AASA JSON
- [ ] `GET /.well-known/assetlinks.json` returns valid Asset Links array
- [ ] `GET /l/hello` redirects to expected destination
- [ ] `GET /d/hello` rewrites and redirects correctly
- [ ] Platform override works: `GET /l/hello?platform=ios`
- [ ] Query parameters are preserved in redirects

## 📱 Mobile Integration

### iOS Universal Links

1. Add domain to `Entitlements.plist`:

   ```xml
   <key>com.apple.developer.associated-domains</key>
   <array>
       <string>applinks:yourdomain.com</string>
   </array>
   ```

2. Handle incoming links in your app

### Android App Links

1. Add intent filter to `AndroidManifest.xml`:

   ```xml
   <intent-filter android:autoVerify="true">
       <action android:name="android.intent.action.VIEW" />
       <category android:name="android.intent.category.DEFAULT" />
       <category android:name="android.intent.category.BROWSABLE" />
       <data android:scheme="https" android:host="yourdomain.com" />
   </intent-filter>
   ```

2. Handle incoming links in your app

## 🆘 Troubleshooting

### Common Issues

1. **Database connection fails**
   - Verify `DATABASE_URL` is correct
   - Check Neon database is running
   - Ensure IP allowlist includes Vercel

2. **AASA/Asset Links not working**
   - Verify environment variables are set
   - Check Vercel headers configuration
   - Test with `curl` to verify JSON response

3. **Redirects not working**
   - Check database has active links
   - Verify slug exists and is active
   - Test with `pnpm seed` first

### Debug Mode

Enable debug logging by setting `DEBUG=1` in environment variables.

## 📚 Resources

- [Next.js 14 Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Neon Postgres](https://neon.tech/docs)
- [Apple Universal Links](https://developer.apple.com/ios/universal-links/)
- [Android App Links](https://developer.android.com/training/app-links)

---

Part of the DeepLinker project - a minimal, production-deployable deep-linking service.
