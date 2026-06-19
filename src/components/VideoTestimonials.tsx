'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { SectionLabel } from '@/components/SectionLabel';
import { ScrollReveal } from '@/components/ScrollReveal';

const VIDEOS = [
  { src: '/2355555478410335139.MP4', label: 'Client Review 1' },
  { src: '/6c49bbda-14f5-4ffe-acec-aef113c3769a.MP4', label: 'Client Review 2' },
  { src: '/IMG_3091.MP4', label: 'Client Review 3' },
];

function VideoCard({ src, label, index }: { src: string; label: string; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: '-60px' }}
      className="relative rounded-[6px] border border-line bg-white overflow-hidden group shadow-[0_10px_34px_rgba(21,20,15,0.05)] hover:shadow-[0_16px_44px_rgba(21,20,15,0.10)] transition-all duration-[400ms]"
    >
      <div className="relative aspect-[9/16] w-full bg-panel">
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-cover"
          playsInline
          onEnded={() => setPlaying(false)}
          aria-label={label}
        />

        {/* Play / Pause overlay */}
        <button
          onClick={toggle}
          aria-label={playing ? `Pause ${label}` : `Play ${label}`}
          className="absolute inset-0 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-brass/60"
        >
          <motion.div
            animate={{ opacity: playing ? 0 : 1, scale: playing ? 0.8 : 1 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center w-16 h-16 rounded-full bg-forest/95 shadow-lg group-hover:bg-forest transition-colors duration-200"
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="white"
              className="ml-1"
              aria-hidden="true"
            >
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </motion.div>
        </button>

        {/* Pause button shown while playing */}
        {playing && (
          <button
            onClick={toggle}
            aria-label={`Pause ${label}`}
            className="absolute bottom-4 right-4 flex items-center justify-center w-9 h-9 rounded-full bg-ink/80 hover:bg-ink transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass/60"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white" aria-hidden="true">
              <rect x="5" y="3" width="4" height="18" rx="1" />
              <rect x="15" y="3" width="4" height="18" rx="1" />
            </svg>
          </button>
        )}
      </div>
    </motion.div>
  );
}

export function VideoTestimonials() {
  return (
    <section
      aria-labelledby="video-reviews-heading"
      className="border-t border-line bg-canvas py-24"
    >
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <SectionLabel number="05" text="Video Reviews" />
          <h2
            id="video-reviews-heading"
            className="mt-4 font-display font-semibold text-4xl md:text-5xl text-ink"
          >
            Hear it from our clients
          </h2>
          <p className="mt-4 text-body max-w-2xl">
            Real results, real voices. Watch our clients share their experience working with RiseRidge.
          </p>
        </ScrollReveal>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {VIDEOS.map((v, i) => (
            <VideoCard key={v.src} {...v} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
