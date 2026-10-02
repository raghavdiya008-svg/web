'use client';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0.2, filter: 'contrast(1.2) brightness(1.3)' }}
        animate={{ opacity: 1, filter: 'contrast(1) brightness(1)' }}
        exit={{ opacity: 0, filter: 'contrast(1.5) brightness(0.7)' }}
        transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
        className="relative"
      >
        {/* SCANLINE TRANSITION OVERLAY */}
        <motion.div
          initial={{ translateY: '-100%' }}
          animate={{ translateY: '100%' }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="fixed inset-0 pointer-events-none z-[9990] bg-gradient-to-b from-transparent via-[#00FF41]/10 to-transparent"
        />

        {children}
      </motion.div>
    </AnimatePresence>
  );
}
