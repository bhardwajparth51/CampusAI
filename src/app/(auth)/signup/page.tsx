"use client";

import React from "react";
import { CTAButton } from "@/components/ui/CTAButton";

/**
 * Placeholder Signup Page.
 */
export default function SignupPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden text-white bg-black">
      <div className="glass relative z-10 w-full max-w-md rounded-2xl p-8 border border-white/5">
        <h1 className="text-2xl font-bold mb-6 text-center">Join CampusAI</h1>
        <div className="flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="Full Name" 
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-blue-500/50 transition-colors"
          />
          <input 
            type="email" 
            placeholder="Email" 
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-blue-500/50 transition-colors"
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-blue-500/50 transition-colors"
          />
          <CTAButton className="w-full py-3 mt-2">Create Account</CTAButton>
        </div>
      </div>
    </div>
  );
}
