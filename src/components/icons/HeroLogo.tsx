"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Logo from "@/../public/icons/relink.svg";

const taglines = [
  "Connect, share, and relink with your world.",
  "A new way to discover and stay connected.",
  "Relink brings people closer, one connection at a time.",
];

export default function HeroLogo() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % taglines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hidden relative w-full md:w-1/2 min-h-[28rem] md:min-h-[80vh] md:flex flex-col items-center justify-center rounded-2xl overflow-hidden bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100 dark:from-indigo-950 dark:via-purple-900 dark:to-purple-800 shadow-xl p-4 md:p-0">
      {/* Glow background blobs */}
      <div className="absolute -top-16 -left-16 w-56 h-56 md:w-72 md:h-72 bg-purple-400/30 dark:bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-20 -right-20 w-56 h-56 md:w-72 md:h-72 bg-indigo-300/30 dark:bg-indigo-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Floating 3D logo */}
      <motion.div
        animate={{ y: [0, -12, 0], rotateY: [0, 15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="z-10 drop-shadow-[0_0_20px_rgba(99,102,241,0.5)]"
      >
        <Logo className="w-24 h-24 sm:w-28 sm:h-28 md:w-40 md:h-40 text-indigo-600 dark:text-purple-300" />
      </motion.div>

      {/* Brand text */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mt-4 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-wide bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 dark:from-indigo-300 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent drop-shadow-lg text-center px-2"
      >
        Relink
      </motion.h1>

      {/* Rotating Taglines */}
      <div className="relative mt-2 h-6 sm:h-7 md:h-8 flex items-center justify-center w-full">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6 }}
            aria-live="polite"
            className="absolute text-center text-gray-600 dark:text-gray-300 text-sm sm:text-base md:text-lg px-4"
          >
            {taglines[index]}
          </motion.p>
        </AnimatePresence>
      </div>
    </section>
  );
}
