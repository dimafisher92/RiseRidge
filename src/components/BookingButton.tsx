'use client';

import { useAuditPopup } from './AuditPopup';

export function BookingButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { open } = useAuditPopup();
  return (
    <button onClick={open} className={className}>
      {children}
    </button>
  );
}
