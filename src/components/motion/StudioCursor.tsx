'use client';
import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export function StudioCursor() {
  const [mounted, setMounted] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 26, stiffness: 400, mass: 0.4 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Only mount on devices with a fine pointer (mouse/trackpad)
    if (!window.matchMedia('(pointer: fine)').matches) return;
    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = Boolean(
          target.closest('button, a, [role="slider"], input, select, textarea, .cursor-pointer, [data-interactive]')
        );
        setIsHoveringInteractive(isClickable);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [cursorX, cursorY]);

  if (!mounted) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Outer Studio Reticle */}
      <motion.div
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center"
        style={{
          x: smoothX,
          y: smoothY,
          width: isHoveringInteractive ? 42 : 24,
          height: isHoveringInteractive ? 42 : 24,
          transition: 'width 0.18s cubic-bezier(0.16, 1, 0.3, 1), height 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Reticle Corner Brackets */}
        <div
          className="absolute inset-0 border transition-colors duration-200"
          style={{
            borderColor: isHoveringInteractive ? '#00FF41' : 'rgba(138, 138, 142, 0.4)',
            boxShadow: isHoveringInteractive ? '0 0 12px rgba(0, 255, 65, 0.45)' : 'none',
          }}
        />

        {/* Crosshair Horizontal & Vertical Hairlines */}
        <div
          className="absolute w-full h-[1px] transition-colors duration-200"
          style={{
            backgroundColor: isHoveringInteractive ? 'rgba(0, 255, 65, 0.5)' : 'rgba(138, 138, 142, 0.25)',
          }}
        />
        <div
          className="absolute h-full w-[1px] transition-colors duration-200"
          style={{
            backgroundColor: isHoveringInteractive ? 'rgba(0, 255, 65, 0.5)' : 'rgba(138, 138, 142, 0.25)',
          }}
        />

        {/* Optical center laser point */}
        <div
          className="w-1.5 h-1.5 rounded-none transition-colors duration-200"
          style={{
            backgroundColor: isHoveringInteractive ? '#00FF41' : '#F5F5F5',
            boxShadow: isHoveringInteractive ? '0 0 8px #00FF41' : 'none',
          }}
        />

        {/* Technical telemetry lock label */}
        {isHoveringInteractive && (
          <span className="absolute -top-3.5 font-mono text-[7px] text-[#00FF41] font-bold tracking-[0.15em] leading-none uppercase select-none">
            [FOCUS]
          </span>
        )}
      </motion.div>
    </div>
  );
}
