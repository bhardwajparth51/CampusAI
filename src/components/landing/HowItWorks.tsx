"use client";

import React from "react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { 
  UserPlus,
  Brain, 
  Zap, 
  CheckCircle2 
} from "lucide-react";

const STEPS = [
  {
    title: "Student submits",
    description: "complaint",
    icon: <UserPlus className="w-6 h-6 text-blue-400" />,
    color: "from-blue-500/20 to-transparent"
  },
  {
    title: "ML classifies",
    description: "it instantly",
    icon: <Brain className="w-6 h-6 text-purple-400" />,
    color: "from-purple-500/20 to-transparent"
  },
  {
    title: "Auto-prioritized",
    description: "by severity",
    icon: <Zap className="w-6 h-6 text-amber-400" />,
    color: "from-amber-500/20 to-transparent"
  },
  {
    title: "Admin resolves",
    description: "with data",
    icon: <CheckCircle2 className="w-6 h-6 text-emerald-400" />,
    color: "from-emerald-500/20 to-transparent"
  }
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 px-6 md:px-12 relative">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 px-4">
          <Reveal delay="0.1s">
            <span className="text-blue-400 font-mono text-sm tracking-widest uppercase mb-4 block">Process</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              How it works
            </h2>
            <p className="text-white/40 text-lg max-w-2xl mx-auto font-light">
              From submission to resolution in four effortless steps.
            </p>
          </Reveal>
        </div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative"
        >
          {STEPS.map((step, idx) => (
            <div key={idx} className="relative group">
              {/* Individual Connector Segment (Desktop) */}
              {idx < STEPS.length - 1 && (
                <motion.div 
                  initial={{ scaleX: 0, opacity: 0 }}
                  whileInView={{ scaleX: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.6 + idx * 0.8, // Draws after Card idx finishes
                    ease: "easeInOut" 
                  }}
                  className="hidden lg:block absolute top-8 left-[calc(50%+40px)] w-[calc(100%-80px)] h-px bg-gradient-to-r from-white/20 via-white/10 to-transparent -z-10 origin-left" 
                />
              )}

              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ 
                  duration: 0.4, 
                  delay: 0.2 + idx * 0.8 // Card appears, then line follows
                }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative mb-6">
                  {/* Glow background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.color} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  <motion.div 
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center relative backdrop-blur-xl group-hover:scale-110 group-hover:border-white/20 transition-all duration-500 shadow-[0_0_20px_-5px_rgba(255,255,255,0.05)]"
                  >
                    <motion.div
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: idx * 0.5 }}
                    >
                      {step.icon}
                    </motion.div>
                    
                    {/* Step Number Badge */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-black border border-white/10 flex items-center justify-center text-[10px] font-bold text-white/40 group-hover:text-blue-400 group-hover:border-blue-400/50 transition-colors duration-300">
                      {idx + 1}
                    </div>
                  </motion.div>
                </div>

                <h3 className="text-lg font-bold text-white mb-1 tracking-tight group-hover:text-white/90">
                  {step.title}
                </h3>
                <p className="text-white/30 text-sm font-mono lowercase">
                  {step.description}
                </p>
              </motion.div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
