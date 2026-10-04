export function GrainOverlay({ className }: { className?: string; opacity?: number }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-50 transform-gpu bg-grain opacity-[0.06] ${className || ''}`}
    />
  );
}