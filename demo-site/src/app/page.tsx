'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check for verification status from URL params (when returning from app)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const verified = urlParams.get('verified');
    const proof = urlParams.get('proof');
    
    if (verified === 'true' && proof) {
      setIsVerified(true);
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleVerifyAge = () => {
    setLoading(true);
    
    // Create deeplink to ZeroSurf app
    const currentUrl = encodeURIComponent(window.location.origin);
    const deeplink = `zerosurf://verify?returnUrl=${currentUrl}&challenge=age-verification-demo`;
    
    // Try to open the app
    window.location.href = deeplink;
    
    // Fallback: If app doesn't open in 3 seconds, show instructions
    setTimeout(() => {
      setLoading(false);
      alert('Please install ZeroSurf app to verify your age. Opening app store...');
      // In real implementation, redirect to app store
    }, 3000);
  };

  const resetVerification = () => {
    setIsVerified(false);
  };

  if (isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            🎉 Welcome to AdultSite Demo!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Your age has been successfully verified using zero-knowledge proof. 
            You can now access age-restricted content.
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-green-800 mb-2">✓ Verified Features:</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Age 18+ confirmed via Aadhaar</li>
              <li>• Zero personal data shared</li>
              <li>• Cryptographic proof verified</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all">
              🔞 Access Premium Content
            </button>
            
            <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all">
              🎮 Enter Gaming Zone
            </button>
            
            <button 
              onClick={resetVerification}
              className="w-full bg-gray-100 text-gray-700 font-semibold py-2 px-6 rounded-lg hover:bg-gray-200 transition-all"
            >
              Reset Demo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          🔞 Adult Content Warning
        </h1>
        
        <div className="mb-6">
          <img 
            src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExdTIwdGltNnhmdmgzcmRrdzU1bnc3ajdqaXBsbnZsa2wxaTF2MG1taSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/GCSIwtwqAMBTq/giphy.gif"
            alt="Age verification required"
            className="w-64 mx-auto rounded-lg mb-4"
            style={{ aspectRatio: 'auto' }}
          />
          <p className="text-gray-600">
            This site contains age-restricted content. You must be 18+ to continue.
          </p>
        </div>
        
        <button 
          onClick={handleVerifyAge}
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all mb-4"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Opening ZeroSurf...
            </div>
          ) : (
            '🙋‍♂️ I swear I am 18+ years old'
          )}
        </button>
        
        <p className="text-xs text-gray-500">
          By continuing, you confirm you are 18+ and agree to privacy-first verification
        </p>
      </div>
    </div>
  );
}