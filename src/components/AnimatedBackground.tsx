export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="animated-grid-bg absolute inset-0 opacity-40" style={{
        maskImage: 'radial-gradient(ellipse 80% 80% at 50% 30%, black, transparent)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 30%, black, transparent)',
      }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-electric/15 blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-cyan/8 blur-[100px]" />
    </div>
  );
}
