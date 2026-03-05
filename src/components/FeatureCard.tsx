'use client';

import { motion } from 'framer-motion';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index?: number;
}

export function FeatureCard({ icon, title, description, index = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      className="group rounded-xl border border-border bg-navy/60 p-6 transition-all duration-300 hover:border-electric/40 hover:-translate-y-1"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-electric/10 text-electric transition-colors duration-300 group-hover:bg-electric/20">
        {icon}
      </div>
      <h3 className="font-display font-bold text-lg text-ice">{title}</h3>
      <p className="mt-2 text-sm text-muted leading-relaxed">{description}</p>
    </motion.div>
  );
}
