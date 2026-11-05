import React from 'react';

export default function RewardCard({ reward, currentPoints = 0, onSelect }) {
  const isAffordable = currentPoints >= reward.points;

  return (
    <div style={{ borderRadius: '20px', backgroundColor: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', opacity: reward.isOutOfStock ? 0.6 : 1 }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: reward.logoBg || '#1E293B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: '#FFF', fontSize: '11px', letterSpacing: '0.5px' }}>
            {reward.logoText}
          </div>
          <span style={{ fontSize: '9px', fontWeight: '800', padding: '2px 6px', borderRadius: '999px', backgroundColor: reward.isOutOfStock ? '#EF4444' : '#22C55E', color: '#000' }}>
            {reward.isOutOfStock ? 'OUT OF STOCK' : `${reward.stockCount} LEFT`}
          </span>
        </div>

        <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#F5F7FF', margin: '0 0 4px 0' }}>{reward.title}</h4>
        <p style={{ fontSize: '11px', color: '#A7B0C8', margin: '0 0 12px 0', lineHeight: 1.3 }}>{reward.desc}</p>
      </div>

      <div>
        <div style={{ fontSize: '14px', fontWeight: '900', color: '#FFB020', marginBottom: '10px' }}>
          🪙 {reward.points} PTS
        </div>

        <button
          onClick={() => onSelect(reward)}
          disabled={reward.isOutOfStock || !isAffordable}
          style={{
            width: '100%',
            padding: '10px 0',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: '900',
            border: 'none',
            cursor: reward.isOutOfStock || !isAffordable ? 'not-allowed' : 'pointer',
            background: isAffordable && !reward.isOutOfStock ? 'linear-gradient(90deg, #FFB020, #FF7A00)' : 'rgba(255, 255, 255, 0.08)',
            color: isAffordable && !reward.isOutOfStock ? '#000' : '#6B7490',
          }}
        >
          {reward.isOutOfStock ? 'OUT OF STOCK' : isAffordable ? 'REDEEM' : `${reward.points - currentPoints} PTS MORE`}
        </button>
      </div>
    </div>
  );
}
