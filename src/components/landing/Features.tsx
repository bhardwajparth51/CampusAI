"use client";

import React from "react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { 
  Bot, 
  ArrowBigUp, 
  BarChart3, 
  Lock, 
  FileText, 
  Target 
} from "lucide-react";

const FEATURES = [
  {
    title: "Intelligent complaint agent",
    subtitle: "AI AGENT",
    description: "Every complaint is analyzed by an AI agent that classifies the category, scores priority, generates a summary, and suggests a resolution action — all before an admin even opens the dashboard.",
    icon: <Bot className="w-6 h-6 text-purple-400" />,
    tags: ["Groq LLM", "FastAPI", "Auto-classification", "Priority scoring"],
    span: "md:col-span-8",
    color: "from-purple-500/10 to-transparent",
    visual: (
      <div className="mt-6 bg-black/40 rounded-xl p-4 border border-white/5 font-mono text-[10px] md:text-xs text-blue-300 leading-relaxed overflow-hidden">
        <div className="flex flex-col gap-1">
          <span className="text-gray-500">{"{"}</span>
          <div className="pl-4">
            <span className="text-blue-400">"category"</span>: <span className="text-emerald-400">"network"</span>,
          </div>
          <div className="pl-4">
            <span className="text-blue-400">"priority"</span>: <span className="text-rose-400">"critical"</span>,
          </div>
          <div className="pl-4">
            <span className="text-blue-400">"priority_score"</span>: <span className="text-orange-400">94</span>,
          </div>
          <div className="pl-4">
            <span className="text-blue-400">"summary"</span>: <span className="text-emerald-400">"WiFi outage affecting 200+ students"</span>,
          </div>
          <div className="pl-4">
            <span className="text-blue-400">"suggested_action"</span>: <span className="text-emerald-400">"Escalate to IT – ISP bandwidth check"</span>,
          </div>
          <div className="pl-4">
            <span className="text-blue-400">"resolution_eta"</span>: <span className="text-orange-400">4</span>
          </div>
          <span className="text-gray-500">{"}"}</span>
        </div>
      </div>
    )
  },
  {
    title: "Community upvoting",
    subtitle: "COMMUNITY",
    description: "Verified students upvote complaints. The AI agent re-evaluates priority when upvote thresholds are crossed.",
    icon: <ArrowBigUp className="w-6 h-6 text-indigo-400" />,
    tags: ["1 vote per student", "College ID verified"],
    span: "md:col-span-4",
    color: "from-indigo-500/10 to-transparent",
    visual: (
      <div className="mt-8 flex justify-center">
        <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
          <ArrowBigUp className="w-6 h-6 text-white" />
        </div>
      </div>
    )
  },
  {
    title: "Real-time admin dashboard",
    subtitle: "ANALYTICS",
    description: "Live charts, category breakdowns, resolution KPIs, and AI anomaly alerts. Admins see what's trending before it becomes a crisis.",
    icon: <BarChart3 className="w-6 h-6 text-blue-400" />,
    tags: ["Trend detection", "Heatmaps", "Weekly reports"],
    span: "md:col-span-6",
    color: "from-blue-500/10 to-transparent",
    visual: (
      <div className="mt-6 flex gap-2 items-end h-20 px-4">
        {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${h}%` }}
            transition={{ duration: 1, delay: i * 0.1 }}
            className="flex-1 bg-blue-500/20 rounded-t-sm border-t border-blue-500/40"
          />
        ))}
      </div>
    )
  },
  {
    title: "College ID verification",
    subtitle: "AUTH",
    description: "Only verified students with a college email can sign in via Appwrite Auth. No anonymous abuse — full accountability.",
    icon: <Lock className="w-6 h-6 text-amber-400" />,
    tags: ["Appwrite Auth", "@krmu.edu.in only", "Role-based access"],
    span: "md:col-span-6",
    color: "from-amber-500/10 to-transparent",
    visual: (
      <div className="mt-6 flex justify-center">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Lock className="w-8 h-8 text-amber-500" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-black" />
        </div>
      </div>
    )
  },
  {
    title: "Automated weekly reports",
    subtitle: "AUTOMATION",
    description: "Python scripts generate PDF reports every week — complaint trends, resolution rates, department performance — sent directly to management.",
    icon: <FileText className="w-6 h-6 text-emerald-400" />,
    tags: ["ReportLab", "Auto-scheduled", "PDF export"],
    span: "md:col-span-6",
    color: "from-emerald-500/10 to-transparent",
    visual: (
      <div className="mt-6 flex flex-col gap-2">
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2 }}
            className="h-full bg-emerald-500/40" 
          />
        </div>
        <div className="h-2 w-2/3 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, delay: 0.5 }}
            className="h-full bg-emerald-500/40" 
          />
        </div>
      </div>
    )
  },
  {
    title: "Next-week predictions",
    subtitle: "PREDICTIVE",
    description: "The AI agent analyzes historical complaint patterns and predicts which categories will spike next week — giving admins time to act proactively.",
    icon: <Target className="w-6 h-6 text-rose-400" />,
    tags: ["Pattern analysis", "Category forecasting", "Proactive alerts"],
    span: "md:col-span-6",
    color: "from-rose-500/10 to-transparent",
    visual: (
      <div className="mt-6 flex flex-col items-center">
        <div className="relative w-16 h-16">
          <svg className="w-full h-full rotate-[-90deg]">
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="4"
              className="text-white/5"
            />
            <motion.circle
              cx="32"
              cy="32"
              r="28"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="4"
              strokeDasharray="175.9"
              initial={{ strokeDashoffset: 175.9 }}
              animate={{ strokeDashoffset: 175.9 * 0.3 }}
              transition={{ duration: 2 }}
              className="text-rose-500/50"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] font-bold text-rose-400">+72%</span>
          </div>
        </div>
      </div>
    )
  }
];

export const Features = () => {
  return (
    <section id="features" className="py-24 px-6 md:px-12 relative overflow-hidden">
      {/* Background Decorative orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-zinc-500/5 blur-[160px] -z-10 rounded-full" />
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 px-4">
          <Reveal delay="0.1s">
            <span className="text-blue-400 font-mono text-sm tracking-widest uppercase mb-4 block">Features</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Everything your campus needs
            </h2>
            <p className="text-white/40 text-lg max-w-2xl mx-auto">
              From submission to resolution — fully automated, AI-driven.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {FEATURES.map((feature, idx) => (
            <div 
              key={idx} 
              className={`${feature.span} group`}
            >
              <Reveal delay={`${0.2 + idx * 0.1}s`} className="h-full">
                <div className="glass backdrop-blur-3xl bg-white/[0.02] border border-white/5 rounded-3xl p-8 h-full flex flex-col transition-all duration-500 hover:bg-white/[0.04] hover:border-white/10 hover:-translate-y-1 overflow-hidden relative">
                  {/* Subtle hover gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />
                  
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      {feature.icon}
                    </div>
                    <span className="text-[10px] md:text-xs font-mono tracking-widest text-white/30 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                      {feature.subtitle}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed mb-6">
                    {feature.description}
                  </p>

                  <div className="mt-auto">
                    {feature.visual}
                    
                    <div className="mt-6 flex flex-wrap gap-2">
                      {feature.tags.map((tag, tIdx) => (
                        <span 
                          key={tIdx} 
                          className="text-[9px] md:text-[10px] font-mono text-white/20 bg-white/[0.02] px-2 py-1 rounded-md border border-white/[0.04]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
