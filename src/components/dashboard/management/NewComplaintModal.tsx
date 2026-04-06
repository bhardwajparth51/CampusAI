"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icons } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { CTAButton } from "@/components/ui/CTAButton";
import { api } from "@/lib/api";
import { account } from "@/lib/appwrite";

interface NewComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function NewComplaintModal({ isOpen, onClose, onSuccess }: NewComplaintModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Get User
      const currentUser = await account.get();
      
      // 2. Get Backend User ID
      const dbUser = await api.get(`/v1/users/me?email=${currentUser.email}`);
      
      // 3. Create Complaint
      const newComplaint = await api.post("/v1/complaints/", {
        title,
        description,
        student_id: dbUser.id,
      });

      // 4. Trigger AI Analysis (Background)
      // We don't necessarily need to wait for this to finish to show success,
      // but triggering it now ensures the user sees results quickly.
      try {
        await api.post(`/v1/agent/analyze/${newComplaint.id}`, {});
      } catch (aiErr) {
        console.warn("AI Analysis failed to trigger instantly:", aiErr);
      }

      onSuccess();
      onClose();
      setTitle("");
      setDescription("");
    } catch (err: any) {
      console.error("Submission failed:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md"
          />

          {/* Modal Content */}
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0B]/95 shadow-2xl backdrop-blur-2xl pointer-events-auto"
            >
              <div className="relative p-8 antialiased">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between border-b border-white/[0.05] pb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">New Case Report</h3>
                    <p className="mt-1 text-[13px] text-gray-400">Provide details for the AI Sentinel to investigate.</p>
                  </div>
                  <button 
                    onClick={onClose}
                    className="rounded-lg p-2 text-gray-500 transition-all hover:bg-white/5 hover:text-white"
                  >
                    <Icons.Plus className="h-5 w-5 rotate-45" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-8">
                  <Reveal delay="0.1s">
                    <div className="space-y-3">
                      <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
                        Subject
                      </label>
                      <input
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Water supply issue in Block C"
                        className="w-full rounded-lg border border-white/[0.05] bg-white/[0.02] px-4 py-3 text-sm text-gray-200 placeholder:text-white/10 transition-all focus:border-blue-500/30 focus:bg-white/[0.04] focus:outline-none"
                      />
                    </div>
                  </Reveal>

                  <Reveal delay="0.2s">
                    <div className="space-y-3">
                      <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
                        Detailed Description
                      </label>
                      <textarea
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        placeholder="Please explain the issue in detail..."
                        className="w-full resize-none rounded-lg border border-white/[0.05] bg-white/[0.02] px-4 py-3 text-[13px] leading-relaxed text-gray-300 placeholder:text-white/10 transition-all focus:border-blue-500/30 focus:bg-white/[0.04] focus:outline-none"
                      />
                    </div>
                  </Reveal>

                  {error && (
                    <p className="text-xs font-semibold text-rose-500 pb-2">{error}</p>
                  )}

                  <Reveal delay="0.3s" className="pt-2">
                    <CTAButton
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-3.5 text-[11px] font-bold uppercase tracking-widest !rounded-lg ${isSubmitting ? "opacity-50" : ""}`}
                    >
                      {isSubmitting ? "SYNCING..." : "Submit Case"}
                    </CTAButton>
                  </Reveal>
                </form>

                {/* Footer Decor */}
                <div className="mt-8 flex items-center justify-center gap-2 opacity-20">
                  <div className="h-1 w-1 rounded-full bg-white" />
                  <div className="h-1 w-1 rounded-full bg-white" />
                  <div className="h-1 w-1 rounded-full bg-white" />
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
