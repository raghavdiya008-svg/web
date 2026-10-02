'use client';
import { useRef, useState, cloneElement, isValidElement } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { playMechanicalClick, playHoverTick } from '@/lib/audio/soundFx';

interface MagneticButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  asChild?: boolean;
}

export function MagneticButton({
  children,
  className = '',
  strength = 0.25,
  asChild = false,
  onClick,
  onMouseEnter,
  ...props
}: MagneticButtonProps) {
  const btnRef = useRef<any>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!btnRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = btnRef.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * strength;
    const y = (clientY - (top + height / 2)) * strength;
    setPosition({ x, y });
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    playHoverTick();
    if (onMouseEnter) (onMouseEnter as any)(e);
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    playMechanicalClick();
    if (onClick) (onClick as any)(e);
  };

  if (asChild && isValidElement(children)) {
    return (
      <motion.div
        ref={btnRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        animate={{ x: position.x, y: position.y }}
        transition={{ type: 'spring', stiffness: 250, damping: 20, mass: 0.5 }}
        className="inline-block"
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.button
      ref={btnRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 250, damping: 20, mass: 0.5 }}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
}
