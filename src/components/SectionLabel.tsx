export function SectionLabel({ number, text }: { number: string; text: string }) {
  return (
    <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.22em] uppercase text-brass">
      <span>{number}</span>
      <span className="h-px w-8 bg-brass/40" aria-hidden="true" />
      <span className="text-subtle">{text}</span>
    </div>
  );
}
