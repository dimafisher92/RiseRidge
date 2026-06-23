'use client';

import { Printer } from 'lucide-react';

// Triggers the browser's native print dialog. The printable layout and the
// logo/watermark are handled by @media print styles in globals.css. Only shown
// after the report is unlocked.
export function PdfButton() {
  return (
    <button
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-ice transition-all duration-300 hover:border-electric hover:text-electric"
    >
      <Printer size={16} />
      Save as PDF
    </button>
  );
}
