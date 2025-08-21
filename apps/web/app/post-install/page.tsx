"use client";

import { useEffect, useState } from "react";

export default function PostInstallPage() {
  const [accessCode, setAccessCode] = useState<string | null>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Retrieve stored access code and slug
    const storedAccessCode = localStorage.getItem("deeplinker_access_code");
    const storedSlug = localStorage.getItem("deeplinker_slug");

    if (storedAccessCode && storedSlug) {
      setAccessCode(storedAccessCode);
      setSlug(storedSlug);
      
      // Clear stored data
      localStorage.removeItem("deeplinker_access_code");
      localStorage.removeItem("deeplinker_slug");
      
      // Attempt to open the app with the access code
      setTimeout(() => {
        attemptDeepLink(storedSlug, storedAccessCode);
      }, 1000);
    }
  }, []);

  const attemptDeepLink = (deepLinkSlug: string, code: string) => {
    setIsRedirecting(true);
    
    // Detect platform
    const platform = /iPad|iPhone|iPod/.test(navigator.userAgent) ? "ios" : "android";
    
    // Construct deep link URL with access code
    const deepLinkUrl = `myapp://${deepLinkSlug}?access_code=${code}`;
    
    // Try to open the app
    window.location.href = deepLinkUrl;
    
    // Fallback: redirect to the main deep link page
    setTimeout(() => {
      window.location.href = `https://deeplinker-web.vercel.app/l/${deepLinkSlug}?access_code=${code}`;
    }, 2000);
  };

  const retryDeepLink = () => {
    if (slug && accessCode) {
      attemptDeepLink(slug, accessCode);
    }
  };

  if (!accessCode || !slug) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome Back!</h1>
          <p className="text-gray-600 mb-4">
            It looks like you've just installed the app.
          </p>
          <p className="text-gray-500 text-sm">
            No pending deep links found. You can now use the app normally.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            App Installed Successfully!
          </h1>
          <p className="text-gray-600">
            Opening your app with the access code...
          </p>
        </div>

        <div className="mb-6 p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-800">
            <strong>Access Code:</strong> {accessCode}
          </p>
          <p className="text-xs text-green-600 mt-1">
            This code will be passed to your app.
          </p>
        </div>

        {isRedirecting && (
          <div className="mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Opening app...</p>
          </div>
        )}

        <button
          onClick={retryDeepLink}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
        >
          Open App Again
        </button>

        <div className="mt-6 text-xs text-gray-400">
          <p>DeepLinker - Post-Installation Handler</p>
        </div>
      </div>
    </div>
  );
}
