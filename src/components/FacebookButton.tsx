import React from 'react';
import { motion } from 'motion/react';

export function FacebookButton() {
  const facebookUrl = 'https://web.facebook.com/search/top/?q=phhipros';

  return (
    <motion.a
      href={facebookUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.5, x: -20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-24 left-8 z-[60] flex items-center justify-center w-14 h-14 bg-[#1877F2] text-white rounded-full shadow-2xl hover:bg-[#166fe5] transition-colors group"
      aria-label="Follow us on Facebook"
    >
      <svg
        viewBox="0 0 24 24"
        className="w-8 h-8 fill-current"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
      
      {/* Tooltip */}
      <span className="absolute left-full ml-4 px-3 py-1.5 bg-[#00384d] text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl border border-white/10">
        Follow PHHIPROS on Facebook
      </span>
    </motion.a>
  );
}
