import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

export function Modal({
  open, onClose, title, children, maxWidth = 'max-w-lg',
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${maxWidth} bg-surface-100 border border-surface-300/60 rounded-xl shadow-elevated animate-slide-up`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-300/50">
          <h2 className="text-base font-semibold text-surface-900">{title}</h2>
          <button onClick={onClose} className="text-surface-700 hover:text-surface-900 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 max-h-[70vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
