'use client';

import { Printer } from 'lucide-react';

// Native print → PDF. The printable layout, logo, and watermark come from the
// @media print rules in globals.css (portal shell is hidden there).
export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium text-body transition-colors hover:border-brass hover:text-brass"
    >
      <Printer size={16} />
      Save as PDF
    </button>
  );
}
