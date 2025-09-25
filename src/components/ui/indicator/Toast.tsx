'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  message: string;
  duration?: number;
  onClose?: () => void;
}

export default function Toast({ message, duration = 3000, onClose }: ToastProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          onAnimationComplete={() => {
            if (!show) onClose?.();
          }}
          className="fixed top-5 right-5 z-50 px-4 py-2 rounded-lg shadow-lg bg-black text-white"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
