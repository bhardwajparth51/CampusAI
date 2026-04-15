import { CTAButton } from "@/components/ui/CTAButton";

export default function AlertBanner() {
  return (
    <div
      className="glass mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between relative overflow-hidden gap-4 rounded-[10px] p-4 md:p-[14px_24px] shadow-2xl border border-white/5"
    >
      <div className="flex items-center gap-4 md:gap-6 relative z-10">
        <div 
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-[10px] font-bold uppercase tracking-[0.1em] shrink-0 border border-white/10"
          style={{ 
            background: 'linear-gradient(135deg, rgba(0, 98, 255, 0.25) 0%, rgba(0, 98, 255, 0.1) 100%)',
            boxShadow: '0 0 20px rgba(0, 98, 255, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.15)'
          }}
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500 animate-pulse-soft"></span>
          </span>
          AI Sentinel
        </div>
        <div className="text-gray-300 text-xs md:text-sm font-medium leading-relaxed">
          <span className="text-blue-500 font-bold">High Alert:</span> 
          <span className="ml-2 text-white/90">14 student reports filed regarding "Water Supply" in block D.</span>
        </div>
      </div>
      
      <CTAButton className="px-5 py-2 text-xs font-bold tracking-wide shadow-[0_0_25px_rgba(0,98,255,0.4)] border-white/20">
        Auto-Respond
      </CTAButton>
    </div>
  );
}
