"use client";

import Link from "next/link";
import { ArrowLeft, UserX } from "lucide-react";

export default function UserNotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background px-6">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="flex justify-center">
          <UserX className="w-24 h-24 text-muted-foreground mb-6" />
        </div>

        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
          User Not Found
        </h2>

        {/* Description */}
        <p className="text-muted-foreground mb-6 text-sm md:text-base">
          Sorry, the user you are looking for doesn’t exist or may have been removed.
        </p>

        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl 
                     bg-primary text-primary-foreground 
                     hover:bg-primary/90 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </main>
  );
}
