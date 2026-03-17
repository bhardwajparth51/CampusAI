"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { CTAButton } from "@/components/ui/CTAButton";
import { DashboardPreview } from "./DashboardPreview";
import { useCyclingWord } from "@/hooks/useCyclingWord";

// --- Constants & Variants ---

const CYCLING_WORDS = ["Classified.", "Prioritized.", "Resolved."] as const;
const WORD_INTERVAL_MS = 3000;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as any,
    },
  },
};

const wordVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
};

// --- Inlined Granular Components ---

/**
 * Animated background layer with SVG base and floating orbs
 */
const Background = () => (
  <div className="fixed inset-0 -z-50 pointer-events-none select-none" aria-hidden="true">
    <Image
      src="/bg-black.svg"
      alt=""
      fill
      priority
      className="object-cover opacity-80"
    />
    <motion.div
      animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      className="absolute top-[15%] left-[5%] w-[30rem] h-[30rem] bg-white/5 blur-[130px] rounded-full"
    />
    <motion.div
      animate={{ x: [0, -40, 0], y: [0, 50, 0] }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      className="absolute bottom-[25%] right-[5%] w-[35rem] h-[35rem] bg-zinc-500/5 blur-[160px] rounded-full"
    />
  </div>
);

/**
 * Animated decorative grid lines
 */
const GridLines = () => (
  <div className="absolute inset-x-0 -inset-y-48 -z-20 pointer-events-none overflow-hidden select-none" aria-hidden="true">
    {[10, 30, 50, 70, 90].map((left, idx) => (
      <motion.div
        key={left}
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "100%", opacity: 1 }}
        transition={{ duration: 1.8, delay: 0.15 * idx, ease: "circOut" }}
        className="absolute inset-y-0 w-px bg-gradient-to-b from-transparent via-white/[0.04] to-transparent"
        style={{ left: `${left}%` }}
      />
    ))}
  </div>
);

/**
 * Animated Headline component with cycling words
 */
const CyclingHeadline = () => {
  const { index } = useCyclingWord(CYCLING_WORDS, WORD_INTERVAL_MS);

  return (
    <motion.h1 
      variants={fadeUp}
      className="mx-auto mb-6 max-w-none text-3xl font-bold tracking-tighter text-white sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05]"
      style={{ letterSpacing: "-0.04em" }}
    >
      <span className="block mb-2 text-center opacity-95">Every complaint.</span>
      <div className="relative h-[1.12em] overflow-hidden flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={index}
            variants={wordVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bg-gradient-to-r from-[#0062FF] via-blue-400 to-cyan-400 bg-clip-text text-transparent sm:whitespace-nowrap inline-flex items-center justify-center leading-none"
          >
            {CYCLING_WORDS[index]}
          </motion.span>
        </AnimatePresence>
      </div>
      
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: 1 }}
        className="mx-auto mt-8 h-px w-[16rem]"
        style={{
          background: "linear-gradient(to right, transparent, rgba(147, 147, 147, 0.4) 50%, transparent)"
        }}
      />
    </motion.h1>
  );
};

// --- Main Components ---

/**
 * Hero section for the landing page.
 * Note: Includes background and grid animations for the main view.
 */
export const Hero = () => {
  return (
    <>
      <Background />
      <main className="relative z-10 flex flex-col items-center justify-center px-4 pt-40 pb-12 text-center">
        <motion.div 
          className="max-w-4xl w-full relative"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <GridLines />
          
          <div className="flex flex-col items-center">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-80 h-80 bg-white/5 blur-[120px] -z-10" aria-hidden="true" />
            
            <CyclingHeadline />
            
            <motion.p 
              variants={fadeUp}
              className="mx-auto mt-4 mb-10 max-w-lg text-lg text-white/50 sm:text-xl font-light leading-relaxed"
            >
              AI-driven analysis and prioritization for <br className="hidden sm:block" /> modern campus management.
            </motion.p>
            
            <motion.div 
              variants={fadeUp}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row mb-8"
            >
              <Link href="/signup" className="w-full sm:w-auto">
                <CTAButton className="w-full px-10 py-[1.125rem] text-base hover:scale-[1.02] cursor-pointer transition-transform duration-300">
                  Get Started for Free
                </CTAButton>
              </Link>
              <button 
                type="button"
                className="w-full cursor-pointer rounded-[0.625rem] border border-white/10 bg-white/5 px-8 py-[1.125rem] text-base font-medium text-white transition-all duration-300 hover:bg-white/10 hover:border-white/20 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] sm:w-auto hover:scale-[1.02]"
              >
                See it in Action 
              </button>
            </motion.div>

            <DashboardPreview />
          </div>
        </motion.div>
      </main>
    </>
  );
};
