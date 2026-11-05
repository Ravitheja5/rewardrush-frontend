import React from 'react';
import confetti from 'canvas-confetti';
import { Flame, Check } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';

export default function StreakCalendar({ currentStreak = 4, isClaimedToday = false, onClaim }) {
  const { t } = useTranslation();
  const days = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'];

  const triggerClaim = () => {
    if (!isClaimedToday) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      onClaim();
    }
  };

  return (
    <div style={{ borderRadius: '20px', backgroundColor: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '16px', marginBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Flame size={18} color="#EF4444" />
          </div>
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#F5F7FF', margin: 0 }}>{t('home.streakTitle')}</h4>
            <span style={{ fontSize: '10px', color: '#6B7490' }}>{t('home.streakReset')}</span>
          </div>
        </div>

        <button
          onClick={triggerClaim}
          disabled={isClaimedToday}
          style={{
            padding: '8px 14px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: '800',
            border: 'none',
            cursor: isClaimedToday ? 'default' : 'pointer',
            background: isClaimedToday ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(90deg, #FFB020, #FF7A00)',
            color: isClaimedToday ? '#6B7490' : '#000',
          }}
        >
          {isClaimedToday ? t('home.streakClaimed') : t('home.claimStreak')}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
        {days.map((day, idx) => {
          const isDone = idx < currentStreak;
          const isCurrent = idx === currentStreak - 1;
          return (
            <div
              key={day}
              style={{
                borderRadius: '10px',
                padding: '8px 0',
                textAlign: 'center',
                backgroundColor: isDone ? 'rgba(255, 176, 32, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                border: isCurrent ? '1px solid #FFB020' : '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <span style={{ fontSize: '10px', fontWeight: '800', color: isDone ? '#FFB020' : '#6B7490', display: 'block' }}>
                {day}
              </span>
              <div style={{ marginTop: '4px', display: 'flex', justifyContent: 'center' }}>
                {isDone ? <Check size={12} color="#FFB020" /> : <span style={{ fontSize: '9px', color: '#6B7490' }}>+15</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
