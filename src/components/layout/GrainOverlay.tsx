export function GrainOverlay({ className, opacity = 0.06 }: { className?: string; opacity?: number }) {
  return (
    <div
      className={`pointer-events-none fixed inset-0 z-50 transform-gpu ${className}`}
      style={{
        opacity,
        backgroundImage: 'url(/grain.svg)',
        backgroundRepeat: 'repeat',
        transform: 'translateZ(0)',
      }}
    />
  );
}