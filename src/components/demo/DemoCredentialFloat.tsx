"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, X } from "lucide-react";

export default function DemoCredentialsFloat() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50" key="demo-credentials">
      {/* Floating Button */}
      {!open && (
        <motion.button
          onClick={() => setOpen(true)}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className="rounded-full bg-blue-600 p-3 text-white shadow-lg hover:bg-blue-700"
        >
          <Info className="h-6 w-6" />
        </motion.button>
      )}

      {/* Popup Card */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="relative w-72 rounded-2xl bg-white p-4 shadow-2xl dark:bg-neutral-900"
          >
            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute right-2 top-2 rounded-full p-1 hover:bg-black/10 dark:hover:bg-white/10"
            >
              <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>

            <h2 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-100">
              Demo Credentials
            </h2>

            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium text-gray-600 dark:text-gray-300">
                  Email:
                </span>{" "}
                demo@example.com
              </p>
              <p>
                <span className="font-medium text-gray-600 dark:text-gray-300">
                  Username:
                </span>{" "}
                demo_user
              </p>
              <p>
                <span className="font-medium text-gray-600 dark:text-gray-300">
                  Password:
                </span>{" "}
                password123
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
