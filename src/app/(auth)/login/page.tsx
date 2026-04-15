"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
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
 * Login Page (Email/Password).
 */
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("signup") === "success") {
      setSuccess("Account created successfully! Please sign in.");
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Clear any existing session
      try {
        await account.deleteSession("current");
      } catch (e) {}

      // Create session with email and password
      const session = await account.createEmailPasswordSession(formData.email, formData.password);
      console.log("LoginPage: Session created successfully:", session);
      console.log("LoginPage: document.cookie after login:", document.cookie);
      
      // Redirect to unified dashboard
      console.log("LoginPage: Redirecting to dashboard...");
      window.location.href = "/dashboard";
    } catch (err: any) {
      console.error("LoginPage: Login failed", err);
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
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
              <h1 className="text-2xl font-bold mb-6 text-center">Welcome Back</h1>
            </Reveal>
        
        {success && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-500 px-4 py-2 rounded-lg mb-4 text-sm text-center">
            {success}
          </div>
        )}
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-2 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4" autoComplete="off">
          {/* Dummy fields to bait aggressive browser autofill */}
          <input type="email" name="email" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" />
          <input type="password" name="password" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" />
          
          <input 
            type="email" 
            name="email"
            placeholder="Email" 
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
            placeholder="Password" 
            required
            autoComplete="off"
            spellCheck="false"
            value={formData.password}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-blue-500/50 transition-colors placeholder:text-gray-500 [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:white]"
          />
          <CTAButton 
            type="submit" 
            disabled={loading}
            className="w-full py-3 mt-2"
          >
            {loading ? "Signing In..." : "Sign In"}
          </CTAButton>
          <p className="text-center text-sm text-gray-400 mt-4">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-400 hover:text-blue-300 transition-colors">
              Sign Up
            </Link>
          </p>
        </form>
        </div>
        </Reveal>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <LoginContent />
    </Suspense>
  );
}
