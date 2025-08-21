export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            DeepLinker Documentation
          </h1>

          <div className="space-y-8">
            {/* Setup Section */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Setup & Deployment
              </h2>

              <div className="bg-gray-100 p-4 rounded-md mb-4">
                <h3 className="font-medium text-gray-800 mb-2">
                  1. Create Neon Postgres Database
                </h3>
                <p className="text-gray-600 mb-2">
                  Go to{" "}
                  <a
                    href="https://neon.tech"
                    className="text-blue-600 hover:underline"
                  >
                    neon.tech
                  </a>{" "}
                  and create a new project. Copy the DATABASE_URL from your
                  project settings.
                </p>
              </div>

              <div className="bg-gray-100 p-4 rounded-md mb-4">
                <h3 className="font-medium text-gray-800 mb-2">
                  2. Deploy to Vercel
                </h3>
                <p className="text-gray-600 mb-2">
                  Connect your repository to Vercel and set the following
                  environment variables:
                </p>
                <ul className="list-disc list-inside text-gray-600 ml-4">
                  <li>DATABASE_URL (from Neon)</li>
                  <li>AASA_APP_ID_1 (your iOS bundle ID)</li>
                  <li>ASSETLINKS_PACKAGE_NAME_1 (your Android package name)</li>
                  <li>
                    ASSETLINKS_SHA256_CERT_1 (your Android SHA256 certificate
                    fingerprint)
                  </li>
                </ul>
              </div>

              <div className="bg-gray-100 p-4 rounded-md">
                <h3 className="font-medium text-gray-800 mb-2">
                  3. Build Command
                </h3>
                <p className="text-gray-600 mb-2">
                  Set Vercel build command to:{" "}
                  <code className="bg-gray-200 px-2 py-1 rounded">
                    pnpm i && pnpm -w prisma migrate deploy
                  </code>
                </p>
              </div>
            </section>

            {/* Adding Links Section */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Adding Deep Links
              </h2>

              <div className="bg-gray-100 p-4 rounded-md">
                <h3 className="font-medium text-gray-800 mb-2">
                  Using the CLI
                </h3>
                <p className="text-gray-600 mb-2">
                  Add a new deep link using the CLI script:
                </p>
                <pre className="bg-gray-200 p-3 rounded text-sm overflow-x-auto">
                  {`pnpm add:link --slug welcome \\
  --ios "myapp://welcome" \\
  --android "myapp://welcome" \\
  --web "https://example.com/welcome" \\
  --fallback "https://example.com/fallback"`}
                </pre>
              </div>

              <div className="bg-gray-100 p-4 rounded-md">
                <h3 className="font-medium text-gray-800 mb-2">
                  Seeding Example Data
                </h3>
                <p className="text-gray-600 mb-2">
                  Run the seed script to add example links:
                </p>
                <pre className="bg-gray-200 p-3 rounded text-sm">pnpm seed</pre>
              </div>
            </section>

            {/* iOS Universal Links Section */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                iOS Universal Links
              </h2>

              <div className="bg-gray-100 p-4 rounded-md mb-4">
                <h3 className="font-medium text-gray-800 mb-2">
                  Entitlements.plist
                </h3>
                <p className="text-gray-600 mb-2">
                  Add this to your iOS app's entitlements:
                </p>
                <pre className="bg-gray-200 p-3 rounded text-sm overflow-x-auto">
                  {`<key>com.apple.developer.associated-domains</key>
<array>
    <string>applinks:yourdomain.com</string>
</array>`}
                </pre>
              </div>

              <div className="bg-gray-100 p-4 rounded-md">
                <h3 className="font-medium text-gray-800 mb-2">Info.plist</h3>
                <p className="text-gray-600 mb-2">Add URL scheme handling:</p>
                <pre className="bg-gray-200 p-3 rounded text-sm overflow-x-auto">
                  {`<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLName</key>
        <string>com.your.app</string>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>myapp</string>
        </array>
    </dict>
</array>`}
                </pre>
              </div>
            </section>

            {/* Android App Links Section */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Android App Links
              </h2>

              <div className="bg-gray-100 p-4 rounded-md">
                <h3 className="font-medium text-gray-800 mb-2">
                  AndroidManifest.xml
                </h3>
                <p className="text-gray-600 mb-2">
                  Add intent filter for your domain:
                </p>
                <pre className="bg-gray-200 p-3 rounded text-sm overflow-x-auto">
                  {`<activity android:name=".MainActivity">
    <intent-filter android:autoVerify="true">
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="https" android:host="yourdomain.com" />
    </intent-filter>
</activity>`}
                </pre>
              </div>
            </section>

            {/* Testing Section */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Testing
              </h2>

              <div className="bg-gray-100 p-4 rounded-md">
                <h3 className="font-medium text-gray-800 mb-2">Test URLs</h3>
                <p className="text-gray-600 mb-2">Test your deep links:</p>
                <ul className="list-disc list-inside text-gray-600 ml-4">
                  <li>
                    Health check:{" "}
                    <code className="bg-gray-200 px-2 py-1 rounded">
                      GET /healthz
                    </code>
                  </li>
                  <li>
                    Deep link:{" "}
                    <code className="bg-gray-200 px-2 py-1 rounded">
                      GET /l/hello
                    </code>
                  </li>
                  <li>
                    Short link:{" "}
                    <code className="bg-gray-200 px-2 py-1 rounded">
                      GET /d/hello
                    </code>
                  </li>
                  <li>
                    Platform override:{" "}
                    <code className="bg-gray-200 px-2 py-1 rounded">
                      GET /l/hello?platform=ios
                    </code>
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
