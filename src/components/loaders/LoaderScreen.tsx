import React from 'react';
import Image from 'next/image';

export default function LoaderScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <div className="animate-spin-slow mb-6">
        <Image
          src="/icons/relink.svg" // Replace with your own logo or use default spinner
          alt="Loading..."
          width={64}
          height={64}
        />
      </div>
      <div className="flex space-x-2">
        <div className="h-3 w-3 bg-gray-800 rounded-full animate-bounce delay-0" />
        <div className="h-3 w-3 bg-gray-800 rounded-full animate-bounce delay-150" />
        <div className="h-3 w-3 bg-gray-800 rounded-full animate-bounce delay-300" />
      </div>
      <p className="mt-4 text-gray-600 text-sm">Loading, please wait...</p>
    </div>
  );
}
