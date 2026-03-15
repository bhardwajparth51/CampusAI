"use client";

import React from "react";

interface CTAButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const CTAButton = ({ children, className = "", ...props }: CTAButtonProps) => {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-1.5 px-6 py-2.5 relative 
        rounded-[10px] border border-white/10 bg-[#0062FF] text-white text-sm font-medium
        transition-all hover:opacity-90 active:scale-95 cursor-pointer
        shadow-[0_0_20px_rgba(0,98,255,0.4)]
        shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] group
        before:content-[''] before:absolute before:inset-0 before:p-px before:rounded-[10px] 
        before:[background:linear-gradient(180deg,rgba(255,255,255,0.19)_0%,rgba(255,255,255,0)_100%)] 
        before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] 
        before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] 
        before:z-[1] before:pointer-events-none ${className}
      `}
      {...props}
    >
      <span className="relative z-[2] flex items-center gap-1.5">
        {children}
      </span>
    </button>
  );
};
