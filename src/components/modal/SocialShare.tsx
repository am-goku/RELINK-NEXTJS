"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  X as CloseIcon,
} from "lucide-react";
import React, { useState } from "react";
import Toast from "../ui/indicator/Toast";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  text?: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, url, text }) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text || "");

  const [toast, setToast] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setToast(true);
  };

  return (
    <React.Fragment>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-neutral-900 rounded-xl p-6 w-80 space-y-4 relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <button
                onClick={onClose}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                <CloseIcon size={20} />
              </button>

              <h2 className="text-lg font-semibold text-center">Share this post</h2>

              <div className="flex gap-3 justify-center">
                {/* Social Buttons */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-2 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                >
                  <Facebook size={20} />
                </a>

                <a
                  href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-2 py-2 bg-sky-400 text-white rounded-full hover:bg-sky-500 transition"
                >
                  <Twitter size={20} />
                </a>

                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-2 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                >
                  <Linkedin size={20} />
                </a>

                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-2 py-2 bg-gray-400 text-white rounded-full hover:bg-gray-500 transition"
                >
                  <Copy size={20} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {toast && (
        <Toast
          message="Link copied to clipboard!"
          onClose={() => setToast(false)}
        />
      )}

    </React.Fragment>
  );
};

export default ShareModal;
