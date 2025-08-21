"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SmartRedirectPage() {
  const searchParams = useSearchParams();
  const [isAttemptingDeepLink, setIsAttemptingDeepLink] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const platform = searchParams.get("platform");
  const appUrl = searchParams.get("appUrl");
  const storeUrl = searchParams.get("storeUrl");
  const accessCode = searchParams.get("access_code");
  const slug = searchParams.get("slug");

  useEffect(() => {
    if (!appUrl || !storeUrl) return;

    // Start countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Attempt deep link after a short delay
    const deepLinkTimer = setTimeout(() => {
      setIsAttemptingDeepLink(true);
      attemptDeepLink();
    }, 1000);

    return () => {
      clearInterval(timer);
      clearTimeout(deepLinkTimer);
    };
  }, [appUrl, storeUrl]);

  const attemptDeepLink = () => {
    if (!appUrl) return;

    // Try to open the app
    window.location.href = appUrl;
    
    // If the app doesn't open, redirect to store after a delay
    setTimeout(() => {
      redirectToStore();
    }, 2000);
  };

  const redirectToStore = () => {
    if (!storeUrl) return;
    
    // Store the access_code in localStorage for post-installation
    if (accessCode) {
      localStorage.setItem("deeplinker_access_code", accessCode);
      localStorage.setItem("deeplinker_slug", slug || "");
    }
    
    // Redirect to app store
    window.location.href = storeUrl;
  };

  const openAppNow = () => {
    if (appUrl) {
      window.location.href = appUrl;
    }
  };

  const openStoreNow = () => {
    redirectToStore();
  };

  if (!platform || !appUrl || !storeUrl) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Redirect</h1>
          <p className="text-gray-600">Missing required parameters for smart redirect.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
        <div className="mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Opening Your App
          </h1>
          <p className="text-gray-600">
            {platform === "ios" ? "Opening in iOS app..." : "Opening in Android app..."}
          </p>
        </div>

        {countdown > 0 && (
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-2">
              Redirecting to app store in {countdown} seconds...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${((3 - countdown) / 3) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {isAttemptingDeepLink && countdown === 0 && (
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-4">
              If the app didn't open, you may need to install it first.
            </p>
            <div className="space-y-3">
              <button
                onClick={openAppNow}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Opening App Again
              </button>
              <button
                onClick={openStoreNow}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Install from {platform === "ios" ? "App Store" : "Play Store"}
              </button>
            </div>
          </div>
        )}

        {accessCode && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Access Code:</strong> {accessCode}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              This code will be available after app installation.
            </p>
          </div>
        )}

        <div className="mt-6 text-xs text-gray-400">
          <p>DeepLinker - Smart App Detection</p>
        </div>
      </div>
    </div>
  );
}
