'use client'

import React, { useState } from "react";
import Image from "next/image";

export default function PostImage({ src }: { src: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full mb-4 rounded-md overflow-hidden">
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gray-300 dark:bg-gray-700 rounded-md z-0" />
      )}
      <Image
        src={src}
        alt="Post image"
        width={0}
        height={0}
        sizes="100vw"
        unoptimized
        style={{ width: "100%", height: "auto", objectFit: "cover" }}
        onLoad={() => setLoaded(true)}
        className={`rounded-md transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
