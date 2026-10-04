'use client';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0.2, filter: 'contrast(1.1) brightness(1.1)' }}
        animate={{ opacity: 1, filter: 'contrast(1) brightness(1)' }}
        exit={{ opacity: 0, filter: 'contrast(1.2) brightness(0.8)' }}
        transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
        className="relative"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
