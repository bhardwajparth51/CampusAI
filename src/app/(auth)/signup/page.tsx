"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { account, ID } from "@/lib/appwrite";
import { CTAButton } from "@/components/ui/CTAButton";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Decorative background components
 */
const Background = () => (
  <div className="fixed inset-0 -z-50 pointer-events-none select-none" aria-hidden="true">
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
 * Signup Page (Email OTP).
 */
export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    collegeId: "",
    email: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: Info, 2: OTP
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const domain = process.env.NEXT_PUBLIC_COLLEGE_EMAIL_DOMAIN?.replace('@', '') || "krmu.edu.in";

  useEffect(() => {
    // Restore state from sessionStorage
    const savedUserId = sessionStorage.getItem("signup_userId");
    const savedData = sessionStorage.getItem("signup_formData");
    if (savedUserId && savedData && step === 1) {
      setUserId(savedUserId);
      setFormData(JSON.parse(savedData));
      setStep(2);
    }
  }, []);

  const getSanitizedId = (email: string) => {
    return email.toLowerCase()
      .replace(/@/g, '_')
      .replace(/\./g, '_')
      .replace(/[^a-z0-9_-]/g, '');
  };

  const startResendTimer = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.email.endsWith(`@${domain}`)) {
      setError(`Only ${domain} emails are allowed.`);
      setLoading(false);
      return;
    }

    const customId = getSanitizedId(formData.email);

    try {
      // 1. Try to create the account first
      try {
        console.log("SignupPage: Creating account for", formData.email);
        await account.create(customId, formData.email, formData.password, formData.name);
        console.log("SignupPage: Account created.");
      } catch (err: any) {
        // If user already exists, we just proceed to send OTP for verification
        if (err.code === 409) {
          console.log("SignupPage: User already exists, proceeding to OTP.");
        } else {
          throw err;
        }
      }

      // 2. Send OTP
      console.log("SignupPage: Sending OTP to", formData.email, "with userId:", customId);
      const token = await account.createEmailToken(
        customId,
        formData.email
      );
      setUserId(token.userId);
      setStep(2);
      
      // Persist state
      sessionStorage.setItem("signup_userId", token.userId);
      sessionStorage.setItem("signup_formData", JSON.stringify(formData));
      
      startResendTimer();
    } catch (err: any) {
      console.error("SignupPage: Flow failed", err);
      setError(err.message || "Failed to proceed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const cleanOtp = otp.trim();
    const currentUserId = userId || sessionStorage.getItem("signup_userId");

    if (!currentUserId) {
      setError("Session expired. Please request a new code.");
      setStep(1);
      setLoading(false);
      return;
    }

    try {
      console.log("SignupPage: Verifying OTP for userId:", currentUserId);
      // Clear any existing session first to avoid "session already active" error
      try {
        await account.deleteSession("current");
      } catch (e) {
        // Ignore if no session exists
      }

      // Create session with OTP
      await account.createSession(currentUserId, cleanOtp);
      console.log("SignupPage: Session created successfully.");
      
      // Update metadata
      await account.updateName(formData.name);
      await account.updatePrefs({
        collegeId: formData.collegeId,
        role: "student",
      });

      // Clear persistence
      sessionStorage.removeItem("signup_userId");
      sessionStorage.removeItem("signup_formData");

      console.log("SignupPage: Redirecting to dashboard...");
      // Force a hard redirect to ensure cookies are picked up by middleware
      window.location.href = "/dashboard";
    } catch (err: any) {
      console.error("SignupPage: Verification failed", err);
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchEmail = () => {
    sessionStorage.removeItem("signup_userId");
    sessionStorage.removeItem("signup_formData");
    setStep(1);
    setOtp("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div 
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden text-white bg-[#000000]"
      style={{ 
        fontFamily: "'Geist', 'Inter', sans-serif",
        backgroundImage: 'url(/bg-black.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Background />
      
      <div className="relative z-10 w-full max-w-md px-4">
        <Reveal delay="0.1s">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-80 h-80 bg-white/5 blur-[120px] -z-10" aria-hidden="true" />
          
          <div className="glass backdrop-blur-3xl bg-white/[0.05] rounded-2xl p-8 border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] relative overflow-hidden">
            <GridLines />
            
            <Reveal delay="0.2s">
              <h1 className="text-2xl font-bold mb-6 text-center">Join CampusAI</h1>
            </Reveal>
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-2 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-4" autoComplete="off">
            {/* Dummy fields to bait aggressive browser autofill */}
            <input type="text" name="name" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" />
            <input type="email" name="email" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" />
            <input type="password" name="password" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" />
            
            <input 
              type="text" 
              name="name"
              placeholder="Full Name" 
              required
              autoComplete="one-time-code"
              spellCheck="false"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-blue-500/50 transition-colors placeholder:text-gray-500 [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:white]"
            />
            <input 
              type="text" 
              name="collegeId"
              placeholder="College ID" 
              required
              autoComplete="one-time-code"
              spellCheck="false"
              value={formData.collegeId}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-blue-500/50 transition-colors placeholder:text-gray-500 [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:white]"
            />
            <input 
              type="email" 
              name="email"
              placeholder={`Email (@${domain})`} 
              required
              autoComplete="one-time-code"
              spellCheck="false"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-blue-500/50 transition-colors placeholder:text-gray-500 [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:white]"
            />
            <input 
              type="password" 
              name="password"
              placeholder="Create Password" 
              required
              minLength={8}
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-blue-500/50 transition-colors placeholder:text-gray-500 [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:white]"
            />
            <CTAButton 
              type="submit" 
              disabled={loading}
              className="w-full py-3 mt-2"
            >
              {loading ? "Processing..." : "Continue to Verification"}
            </CTAButton>
            <p className="text-center text-sm text-gray-400 mt-4">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
                Sign In
              </Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4 text-center">
            <p className="text-sm text-gray-400 mb-2">
              We've sent a code to <br/>
              <span className="text-white font-medium">{formData.email}</span>
            </p>
            <input 
              type="text" 
              placeholder="xxxxxx" 
              maxLength={6}
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-blue-500/50 transition-colors text-center text-2xl tracking-[0.5em] font-mono [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:white]"
            />
            <CTAButton 
              type="submit" 
              disabled={loading}
              className="w-full py-3 mt-2"
            >
              {loading ? "Verifying..." : "Verify & Sign Up"}
            </CTAButton>
            
            <div className="flex flex-col gap-2 mt-4">
              <button 
                type="button"
                disabled={loading || resendTimer > 0}
                onClick={() => handleSendOtp()}
                className="text-sm text-blue-400 hover:text-blue-300 disabled:text-gray-500 transition-colors"
              >
                {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
              </button>
              <button 
                type="button"
                onClick={handleSwitchEmail}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                ← Use a different email
              </button>
            </div>
          </form>
        )}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
