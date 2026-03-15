export default function StatusDonut() {
  return (
    <div 
      className="glass flex-[3] rounded-[10px] p-6 flex flex-col relative overflow-hidden"
    >
      <div 
        className="absolute top-0 left-0 w-full h-[1px]" 
        style={{ background: 'var(--border-shine)' }}
      />
      <h3 style={{ color: '#fff', fontSize: '15px', fontWeight: '600', marginBottom: '4px' }}>Status Breakdown</h3>
      <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '24px' }}>Resolution efficiency</p>
           <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <svg width="160" height="160" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="resolvedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#06B6D4', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#0062FF', stopOpacity: 1 }} />
            </linearGradient>
            <linearGradient id="pendingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#A855F7', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
            </linearGradient>
            <linearGradient id="newGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#F9FAFB', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#D1D5DB', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          
          <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="7" />
          
          {/* Resolved Segment */}
          <circle 
            cx="50" cy="50" r="40" fill="none" 
            stroke="url(#resolvedGradient)" strokeWidth="8" 
            strokeDasharray="180 251" strokeDashoffset="0" 
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 5px rgba(6, 182, 212, 0.4))' }}
          />
          
          {/* Pending Segment */}
          <circle 
            cx="50" cy="50" r="40" fill="none" 
            stroke="url(#pendingGradient)" strokeWidth="8" 
            strokeDasharray="50 251" strokeDashoffset="-185" 
            strokeLinecap="round" 
          />

          {/* New Segment - Solid Gray for Legibility */}
          <circle 
            cx="50" cy="50" r="40" fill="none" 
            stroke="#6b7280" strokeWidth="8" 
            strokeDasharray="15 251" strokeDashoffset="-240" 
            strokeLinecap="round" 
          />
        </svg>
        <div style={{ position: 'absolute', textAlign: 'center' }}>
          <div style={{ color: '#fff', fontSize: '24px', fontWeight: '800', letterSpacing: '-0.5px' }}>82%</div>
          <div style={{ color: '#06B6D4', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Resolved</div>
        </div>
      </div>

      <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {[
          { label: 'Resolved', color: '#06B6D4', value: '82%' },
          { label: 'Pending', color: '#A855F7', value: '12%' },
          { label: 'New', color: '#6b7280', value: '6%' },
        ].map((item) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div 
                style={{ 
                  width: '10px', height: '10px', borderRadius: '3px', background: item.color,
                  boxShadow: item.label === 'New' ? '0 0 4px rgba(255, 255, 255, 0.2)' : `0 0 8px ${item.color}44`
                }} 
              />
              <span style={{ color: '#9ca3af', fontSize: '12px', fontWeight: '500' }}>{item.label}</span>
            </div>
            <span style={{ color: '#fff', fontSize: '12px', fontWeight: '600' }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
