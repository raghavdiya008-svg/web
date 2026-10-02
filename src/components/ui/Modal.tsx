'use client';
export function Modal({ isOpen, onClose, title, description, children }: any) {
  if (!isOpen) return null;
  return <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
    <div className="bg-surface p-6 rounded-lg max-w-md w-full border border-border">
      {title && <h2 className="text-xl text-white mb-2">{title}</h2>}
      {description && <p className="text-text-secondary mb-4">{description}</p>}
      {children}
    </div>
  </div>;
}