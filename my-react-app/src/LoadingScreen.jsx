import React from "react";

export default function LoadingScreen() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">

      {/* Glowing spinner */}
      <div className="relative w-24 h-24 mb-6">
        {/* Outer ring */}
        <div className="absolute inset-0 border-4 border-green-300 rounded-full"></div>
        {/* Inner animated ring */}
        <div className="absolute inset-0 border-4 border-teal-500 rounded-full border-t-transparent animate-spin"></div>
      </div>

      {/* Text */}
      <h1 className="text-3xl font-bold text-green-700 animate-pulse">
        Logging you in...
      </h1>

      <p className="mt-2 text-sm text-green-600 italic">
        Please wait a moment
      </p>
    </div>
  );
}
