import React from 'react';

export default function ProgressBar({ value, max, label, subLabel }) {
  const percentage = Math.min(100, Math.round((value / max) * 100));

  return (
    <div style={{ width: '100%' }}>
      {(label || subLabel) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', marginBottom: '6px' }}>
          <span style={{ fontWeight: '600', color: '#A7B0C8' }}>{label}</span>
          <span style={{ color: '#FFB020', fontWeight: '800' }}>{subLabel || `${value}/${max}`}</span>
        </div>
      )}
      <div style={{ width: '100%', height: '7px', borderRadius: '999px', backgroundColor: 'rgba(255, 255, 255, 0.1)', overflow: 'hidden' }}>
        <div
          style={{ width: `${percentage}%`, height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, #FFB020, #FF7A00)', transition: 'width 0.4s ease' }}
        />
      </div>
    </div>
  );
}
