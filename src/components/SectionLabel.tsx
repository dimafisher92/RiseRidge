export function SectionLabel({ number, text }: { number: string; text: string }) {
  return (
    <div className="flex items-center gap-3 font-mono text-[11px] tracking-[3px] uppercase text-electric">
      <span>{number}</span>
      <span className="h-px w-8 bg-border" aria-hidden="true" />
      <span className="text-muted">{text}</span>
    </div>
  );
}
