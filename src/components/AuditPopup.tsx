'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const BOOKING_URL =
  'https://crm.iultelesalesmastery.com/widget/booking/h9zSv2nhRFUiNJZkzvrW';

interface AuditPopupContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const AuditPopupContext = createContext<AuditPopupContextType | null>(null);

export function useAuditPopup() {
  const ctx = useContext(AuditPopupContext);
  if (!ctx) throw new Error('useAuditPopup must be used within AuditPopupProvider');
  return ctx;
}

export function AuditPopupProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, close]);

  return (
    <AuditPopupContext.Provider value={{ isOpen, open, close }}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label="Book a free audit"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-2xl rounded-2xl border border-border bg-surface overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={close}
                className="absolute top-3 right-3 z-10 rounded-full p-2 text-muted transition-colors hover:text-ice hover:bg-white/10"
                aria-label="Close"
              >
                <X size={20} />
              </button>
              <iframe
                src={BOOKING_URL}
                title="Book a free audit"
                className="w-full h-[80vh] md:h-[700px]"
                allow="camera; microphone"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuditPopupContext.Provider>
  );
}
