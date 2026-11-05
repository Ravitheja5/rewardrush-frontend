import React from 'react';
import { Info } from 'lucide-react';
import ProgressBar from '../common/ProgressBar';
import { useTranslation } from '../../context/LanguageContext';

export default function BalanceHeroCard({ points = 0, pendingPoints = 0, lifetimeEarned = 0 }) {
  const { t } = useTranslation();

  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '22px', background: 'linear-gradient(180deg, #182138 0%, #0E1526 100%)', border: '1px solid rgba(255, 255, 255, 0.12)', padding: '20px', boxShadow: '0 12px 36px rgba(0,0,0,0.4)', marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <span style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', color: '#A7B0C8', display: 'block', marginBottom: '4px' }}>
            {t('home.walletBalance')}
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <h2 style={{ fontSize: '38px', fontWeight: '900', color: '#FFF', margin: 0, letterSpacing: '-0.5px' }}>{points}</h2>
            <span style={{ fontSize: '13px', fontWeight: '800', color: '#FFB020', textTransform: 'uppercase' }}>PTS</span>
          </div>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#22C55E', marginTop: '4px', display: 'inline-block' }}>
            ≈ ₹{(points / 10).toFixed(1)} Real Redemption Value
          </span>
        </div>

        <div style={{ backgroundColor: 'rgba(11, 15, 26, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '10px 12px', textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', fontSize: '10px', fontWeight: '800', color: '#6B7490', textTransform: 'uppercase' }}>
            <span>{t('home.pendingVerification')}</span>
            <Info size={12} color="#6B7490" />
          </div>
          <p style={{ fontSize: '14px', fontWeight: '800', color: '#F59E0B', margin: '4px 0 0 0' }}>+{pendingPoints} pts</p>
        </div>
      </div>

      <div style={{ paddingTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <ProgressBar
          value={points}
          max={200}
          label="Next Goal: 1GB Data Booster"
          subLabel={`${points}/200 pts`}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: '#6B7490', marginTop: '8px' }}>
          <span>{t('home.lifetimeEarned')}: <b style={{ color: '#F5F7FF' }}>{lifetimeEarned} pts</b></span>
          <span style={{ color: '#22C55E', fontWeight: '700' }}>100 Pts = ₹10</span>
        </div>
      </div>
    </div>
  );
}
