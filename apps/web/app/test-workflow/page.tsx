export default function TestWorkflowPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Smart Workflow Test
          </h1>
          
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                🎯 How It Works
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-blue-800">
                <li>User visits: <code className="bg-blue-100 px-2 py-1 rounded">/l/hello?access_code=1234</code></li>
                <li>System detects platform (iOS/Android)</li>
                <li>Attempts to open app: <code className="bg-blue-100 px-2 py-1 rounded">myapp://hello?access_code=1234</code></li>
                <li>If app opens → Success! Access code is passed to app</li>
                <li>If app not installed → Redirects to App Store/Play Store</li>
                <li>After installation → User returns to <code className="bg-blue-100 px-2 py-1 rounded">/post-install</code></li>
                <li>Access code is retrieved and app opens with the code</li>
              </ol>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-900 mb-3">
                  🧪 Test Links
                </h3>
                <div className="space-y-3">
                  <a 
                    href="/l/hello?access_code=1234"
                    className="block bg-green-600 text-white py-3 px-4 rounded-lg text-center hover:bg-green-700 transition-colors"
                  >
                    Test Hello Link
                  </a>
                  <a 
                    href="/l/welcome?access_code=5678"
                    className="block bg-green-600 text-white py-3 px-4 rounded-lg text-center hover:bg-green-700 transition-colors"
                  >
                    Test Welcome Link
                  </a>
                  <a 
                    href="/l/product?access_code=9999"
                    className="block bg-green-600 text-white py-3 px-4 rounded-lg text-center hover:bg-green-700 transition-colors"
                  >
                    Test Product Link
                  </a>
                </div>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-900 mb-3">
                  🔧 Development Tools
                </h3>
                <div className="space-y-3">
                  <a 
                    href="/smart-redirect?platform=ios&appUrl=myapp://test&storeUrl=https://apps.apple.com&access_code=1234&slug=test"
                    className="block bg-purple-600 text-white py-3 px-4 rounded-lg text-center hover:bg-purple-700 transition-colors"
                  >
                    Test Smart Redirect
                  </a>
                  <a 
                    href="/post-install"
                    className="block bg-purple-600 text-white py-3 px-4 rounded-lg text-center hover:bg-purple-700 transition-colors"
                  >
                    Test Post-Install
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-900 mb-3">
                📱 Mobile App Setup
              </h3>
              <p className="text-yellow-800 mb-3">
                To complete the workflow, your mobile app needs to:
              </p>
              <ul className="list-disc list-inside space-y-1 text-yellow-800">
                <li>Handle incoming deep links with <code className="bg-yellow-100 px-2 py-1 rounded">access_code</code> parameter</li>
                <li>Register for Universal Links (iOS) and App Links (Android)</li>
                <li>Handle the <code className="bg-yellow-100 px-2 py-1 rounded">myapp://</code> URL scheme</li>
                <li>Process the access code when the app opens</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                🚀 Production URLs
              </h3>
              <p className="text-gray-600 mb-3">
                Replace these placeholder URLs in your environment variables:
              </p>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>APP_STORE_URL:</strong> <code className="bg-gray-200 px-2 py-1 rounded">https://apps.apple.com/app/YOUR_ACTUAL_APP_ID</code>
                </div>
                <div>
                  <strong>PLAY_STORE_URL:</strong> <code className="bg-gray-200 px-2 py-1 rounded">https://play.google.com/store/apps/details?id=YOUR_ACTUAL_PACKAGE_NAME</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
