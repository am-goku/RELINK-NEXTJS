import React from "react";

export default function CoverImage() {
  return (
    <React.Fragment>
      <div
        className="w-full h-48 md:h-64 bg-cover bg-center relative"
        style={{
          backgroundImage: 'url(/images/default-cover.png)',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Overlay for better contrast */}
        <div className="absolute inset-0 bg-black/30 dark:bg-black/50 transition-colors"></div>
      </div>
    </React.Fragment>
  );
}