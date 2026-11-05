import React, { useState } from 'react';

export default function LiveTicker({ items = [] }) {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      style={{ width: '100%', backgroundColor: '#0E1528', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', marginBottom: '16px' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', padding: '2px 6px', borderRadius: '999px', shrink: 0 }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E' }} />
        <span style={{ fontSize: '9px', fontWeight: '900', color: '#22C55E' }}>LIVE</span>
      </div>

      <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', width: '100%' }}>
        <marquee scrollamount={isPaused ? 0 : 5} style={{ fontSize: '11px', fontWeight: '600', color: '#A7B0C8' }}>
          {items.map((item) => (
            <span key={item.id} style={{ marginRight: '24px' }}>
              {item.text} <b style={{ color: '#6B7490', fontWeight: 'normal' }}>({item.time})</b>
            </span>
          ))}
        </marquee>
      </div>
    </div>
  );
}
