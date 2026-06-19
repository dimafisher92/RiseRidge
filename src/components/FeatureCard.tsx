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
      className="group rounded-[6px] border border-line bg-white p-7 shadow-[0_10px_34px_rgba(21,20,15,0.05)] transition-all duration-[400ms] ease-[cubic-bezier(.2,.7,.2,1)] hover:-translate-y-1 hover:shadow-[0_16px_44px_rgba(21,20,15,0.10)]"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-forest/10 text-forest transition-colors duration-300 group-hover:bg-forest/15">
        {icon}
      </div>
      <h3 className="font-display font-semibold text-2xl text-ink">{title}</h3>
      <p className="mt-2 text-sm text-body leading-relaxed">{description}</p>
    </motion.div>
  );
}
