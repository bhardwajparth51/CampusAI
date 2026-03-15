"use client";

import React, { useState, useRef, useCallback } from "react";

// --- Constants & Types ---

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
const VIEW_MODES = ["1D", "1W", "1M", "ALL"] as const;

// --- Sub-components ---

const ChartGradients = () => (
  <defs>
    <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#06B6D4" stopOpacity={1} />
      <stop offset="50%" stopColor="#A855F7" stopOpacity={1} />
      <stop offset="100%" stopColor="#0062FF" stopOpacity={1} />
    </linearGradient>
    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.15} />
      <stop offset="100%" stopColor="#0062FF" stopOpacity={0} />
    </linearGradient>
  </defs>
);

const ChartGrid = () => (
  <g className="opacity-[0.03]">
    {[30, 60, 90, 120].map((y) => (
      <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="white" strokeWidth="1" />
    ))}
  </g>
);

// --- Main TrendChart Component ---

export default function TrendChart() {
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);
  const [activeMode, setActiveMode] = useState<typeof VIEW_MODES[number]>("1W");
  
  const pathRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || !pathRef.current) return;
    
    const svg = svgRef.current;
    const path = pathRef.current;
    const rect = svg.getBoundingClientRect();
    
    // Normalize mouse X to SVG coordinate space (400 width)
    const normalizedX = ((e.clientX - rect.left) / rect.width) * 400;

    // Binary search for the point on the path at normalizedX
    const pathLength = path.getTotalLength();
    let low = 0;
    let high = pathLength;
    let pos = path.getPointAtLength(0);

    // Iterative approach for better performance over binary search for this specific use case
    // Sampling the path based on normalizedX percentage
    const targetLength = (normalizedX / 400) * pathLength;
    pos = path.getPointAtLength(targetLength);
    
    setHoverPos({ x: pos.x, y: pos.y });
  }, []);

  return (
    <div className="glass group relative flex h-full flex-col overflow-hidden rounded-[10px] p-6 antialiased">
      {/* Border Shine */}
      <div 
        className="absolute top-0 left-0 h-px w-full" 
        style={{ background: "linear-gradient(to right, transparent, rgba(255, 255, 255, 0.1), transparent)" }} 
      />

      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h3 className="text-[15px] font-semibold text-white">Complaint Volume</h3>
          <p className="text-xs text-gray-500">Weekly monitoring of student reports</p>
        </div>
        <div className="flex gap-1.5 rounded-xl bg-white/[0.03] p-1">
          {VIEW_MODES.map((mode) => (
            <button
              key={mode}
              onClick={() => setActiveMode(mode)}
              className={`
                rounded-lg px-3 py-1.5 text-[10px] font-bold transition-all
                ${activeMode === mode 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                  : "text-gray-500 hover:text-gray-300"}
              `}
            >
              {mode}
            </button>
          ))}
        </div>
      </header>
      
      {/* SVG Chart Area */}
      <div className="relative min-h-[180px] w-full flex-1">
        <svg 
          ref={svgRef}
          width="100%" 
          height="100%" 
          viewBox="0 0 400 150" 
          preserveAspectRatio="none"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverPos(null)}
          className="cursor-crosshair overflow-visible"
        >
          <ChartGradients />
          <ChartGrid />
          
          {/* Main Area & Path */}
          <path 
            d="M0,120 Q50,40 100,80 T200,60 T300,100 T400,30 L400,150 L0,150 Z" 
            fill="url(#areaGradient)" 
          />
          <path 
            ref={pathRef} 
            d="M0,120 Q50,40 100,80 T200,60 T300,100 T400,30" 
            fill="none" 
            stroke="url(#pathGradient)" 
            strokeWidth="3.5" 
            strokeLinecap="round"
            className="drop-shadow-[0_0_10px_rgba(168,85,247,0.4)]"
          />
          
          {/* Interactive Tooltip Element */}
          {hoverPos && (
            <g className="pointer-events-none">
              <line 
                x1={hoverPos.x} y1="0" x2={hoverPos.x} y2="150" 
                stroke="rgba(6, 182, 212, 0.4)" 
                strokeWidth="1" 
                strokeDasharray="4 4"
              />
              {/* Glowing Dot */}
              <circle 
                cx={hoverPos.x} cy={hoverPos.y} r="10" 
                fill="rgba(6, 182, 212, 0.2)" 
                className="animate-pulse"
              />
              <circle 
                cx={hoverPos.x} cy={hoverPos.y} r="6" 
                fill="#06B6D4" 
                stroke="#0A0A0B" strokeWidth="2.5" 
                className="drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
              />
            </g>
          )}
        </svg>
      </div>

      {/* X-Axis Labels */}
      <footer className="mt-4 flex justify-between px-1">
        {DAYS.map((day) => (
          <span key={day} className="text-[10px] font-bold uppercase tracking-wider text-gray-600">
            {day}
          </span>
        ))}
      </footer>
    </div>
  );
}
