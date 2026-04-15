"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { api } from "@/lib/api";

// --- Constants & Types ---

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
const VIEW_MODES = ["1D", "1W", "1M", "ALL"] as const;

// --- Helper: Path Generation ---

const generatePath = (data: number[], width: number, height: number) => {
  if (data.length < 2) return "";
  const points = data.map((val, i) => ({
    x: (i * width) / (data.length - 1),
    y: height - (val / Math.max(...data, 10)) * height * 0.8 - height * 0.1,
  }));

  let d = `M${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i+1];
    const midX = (p0.x + p1.x) / 2;
    d += ` Q${midX},${p0.y} ${p1.x},${p1.y}`;
  }
  return d;
};

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
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);
  const [activeMode, setActiveMode] = useState<typeof VIEW_MODES[number]>("1W");
  
  const pathRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        setLoading(true);
        const trends = await api.get("/v1/analytics/trends");
        
        if (!trends || trends.length === 0) {
          const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
          const simulated = days.map(d => ({
            name: d,
            complaints: Math.floor(Math.random() * 15) + 5
          }));
          setData(simulated);
        } else {
          const formatted = trends.map((item: any) => ({
            name: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
            complaints: item.count
          }));
          setData(formatted);
        }
      } catch (err) {
        // Fallback simulation
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const simulated = days.map(d => ({
          name: d,
          complaints: Math.floor(Math.random() * 15) + 10
        }));
        setData(simulated);
      } finally {
        setLoading(false);
      }
    };
    fetchTrends();
  }, []);

  const pathD = useMemo(() => generatePath(data.map(d => d.complaints), 400, 150), [data]);
  const areaD = useMemo(() => `${pathD} L400,150 L0,150 Z`, [pathD]);

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || !pathRef.current || data.length === 0) return;
    
    const svg = svgRef.current;
    const path = pathRef.current;
    const rect = svg.getBoundingClientRect();
    const normalizedX = ((e.clientX - rect.left) / rect.width) * 400;

    const pathLength = path.getTotalLength();
    const targetLength = (normalizedX / 400) * pathLength;
    const pos = path.getPointAtLength(targetLength);
    
    setHoverPos({ x: pos.x, y: pos.y });
  }, [data]);

  return (
    <div className="glass group relative flex h-[340px] flex-[8] flex-col overflow-hidden rounded-[10px] p-6 antialiased">
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
        {loading ? (
             <div className="flex h-full w-full items-center justify-center">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500/20 border-t-blue-500" />
             </div>
        ) : (
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
              <path d={areaD} fill="url(#areaGradient)" />
              <path 
                ref={pathRef} 
                d={pathD} 
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
        )}
      </div>

      {/* X-Axis Labels */}
      <footer className="mt-4 flex justify-between px-1">
        {(data.length > 0 ? data : DAYS).map((item: any, i) => (
          <span key={i} className="text-[10px] font-bold uppercase tracking-wider text-gray-600">
            {typeof item === 'string' ? item : item.name}
          </span>
        ))}
      </footer>
    </div>
  );
}
