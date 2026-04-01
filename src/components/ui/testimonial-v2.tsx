'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from "framer-motion";
import { SectionLabel } from '@/components/SectionLabel';
import { ScrollReveal } from '@/components/ScrollReveal';

// --- Types ---
interface Testimonial {
  text: string;
  image: string;
  name: string;
  role: string;
}

// --- Data ---
const testimonials: Testimonial[] = [
  {
    text: "ArcWave's AI-driven SEO completely transformed our organic presence. We went from page 3 to dominating the top 3 positions in under 4 months.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Briana Patton",
    role: "VP of Marketing",
  },
  {
    text: "The technical audit uncovered issues we'd missed for years. Their AI automation fixed everything overnight — our Core Web Vitals scores skyrocketed.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Bilal Ahmed",
    role: "CTO",
  },
  {
    text: "Their content intelligence engine helped us build topical authority fast. Our blog traffic grew 280% and we're now the go-to resource in our niche.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Saman Malik",
    role: "Content Director",
  },
  {
    text: "We replaced three SEO tools with ArcWave. The real-time rank tracking and automated optimizations saved us 20+ hours per week.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Omar Raza",
    role: "CEO",
  },
  {
    text: "The AI-powered keyword clustering identified opportunities our previous agency completely missed. Revenue from organic search tripled in 6 months.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Zainab Hussain",
    role: "Growth Lead",
  },
  {
    text: "ArcWave's approach to technical SEO is next-level. Automated schema markup, internal linking fixes, and crawl optimization — all handled by their AI.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Aliza Khan",
    role: "Digital Strategist",
  },
  {
    text: "Our e-commerce store saw a 340% increase in organic traffic after switching to ArcWave. The ROI speaks for itself.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Farhan Siddiqui",
    role: "E-commerce Director",
  },
  {
    text: "The onboarding was seamless and results came fast. Within weeks, we saw measurable improvements in rankings and click-through rates.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Sana Sheikh",
    role: "Operations Manager",
  },
  {
    text: "ArcWave helped us dominate local search results across 15 locations. Their AI handles what used to take our entire marketing team.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Hassan Ali",
    role: "Head of Acquisition",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

// --- Sub-Components ---
const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.ul
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6 bg-transparent list-none m-0 p-0"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <motion.li
                  key={`${index}-${i}`}
                  aria-hidden={index === 1 ? "true" : "false"}
                  tabIndex={index === 1 ? -1 : 0}
                  whileHover={{
                    scale: 1.03,
                    y: -8,
                    transition: { type: "spring", stiffness: 400, damping: 17 }
                  }}
                  whileFocus={{
                    scale: 1.03,
                    y: -8,
                    transition: { type: "spring", stiffness: 400, damping: 17 }
                  }}
                  className="p-8 rounded-xl border border-border bg-navy/60 max-w-xs w-full transition-all duration-300 cursor-default select-none group focus:outline-none focus:ring-2 focus:ring-electric/30 hover:border-electric/40"
                >
                  <blockquote className="m-0 p-0">
                    <p className="text-muted leading-relaxed font-normal text-sm m-0">
                      {text}
                    </p>
                    <footer className="flex items-center gap-3 mt-5">
                      <Image
                        width={40}
                        height={40}
                        src={image}
                        alt={`Avatar of ${name}`}
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-border group-hover:ring-electric/30 transition-all duration-300 ease-in-out"
                      />
                      <div className="flex flex-col">
                        <cite className="font-display font-semibold not-italic tracking-tight leading-5 text-ice">
                          {name}
                        </cite>
                        <span className="text-xs leading-5 tracking-tight text-muted mt-0.5">
                          {role}
                        </span>
                      </div>
                    </footer>
                  </blockquote>
                </motion.li>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.ul>
    </div>
  );
};

const TestimonialsSection = () => {
  return (
    <section
      aria-labelledby="testimonials-heading"
      className="border-t border-border bg-surface/30 py-24 relative overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: 50, rotate: -2 }}
        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{
          duration: 1.2,
          ease: [0.16, 1, 0.3, 1],
          opacity: { duration: 0.8 }
        }}
        className="mx-auto max-w-7xl px-6 z-10"
      >
        <div className="flex flex-col items-center justify-center max-w-[540px] mx-auto mb-16">
          <ScrollReveal>
            <SectionLabel number="04" text="Testimonials" />
            <h2 id="testimonials-heading" className="mt-4 font-display font-[800] text-3xl md:text-4xl text-ice">
              What Our Clients Say
            </h2>
            <p className="mt-4 text-muted max-w-sm text-center">
              Discover how growth-stage brands scale their organic presence with AI-powered SEO.
            </p>
          </ScrollReveal>
        </div>

        <div
          className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] max-h-[740px] overflow-hidden"
          role="region"
          aria-label="Scrolling Testimonials"
        >
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </motion.div>
    </section>
  );
};

export default TestimonialsSection;
