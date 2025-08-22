import React from 'react';
import Image from 'next/image';

export default function LoaderScreen() {
  return (
    <React.Fragment>
      <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 px-4">
        <div className="animate-spin-slow mb-6">
          <Image
            src="/icons/relink.svg" // Replace with your own logo or use default spinner
            alt="Loading..."
            width={64}
            height={64}
          />
        </div>
        <div className="flex space-x-2">
          <div className="h-3 w-3 bg-gray-800 dark:bg-gray-200 rounded-full animate-bounce delay-0" />
          <div className="h-3 w-3 bg-gray-800 dark:bg-gray-200 rounded-full animate-bounce delay-150" />
          <div className="h-3 w-3 bg-gray-800 dark:bg-gray-200 rounded-full animate-bounce delay-300" />
        </div>
        <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm">
          Loading, please wait...
        </p>
      </div>
    </React.Fragment>
  );
}
