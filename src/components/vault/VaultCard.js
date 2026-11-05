import React, { useState } from 'react';
import { Eye, EyeOff, Copy, Check } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function VaultCard({ item }) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (showToast) showToast("Voucher details copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleReveal = () => {
    setRevealed(true);
    setTimeout(() => setRevealed(false), 10000);
  };

  return (
    <div style={{ borderRadius: '18px', backgroundColor: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '16px', marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div>
          <span style={{ fontSize: '13px', fontWeight: '900', color: '#F5F7FF' }}>{item.title}</span>
          <p style={{ margin: '2px 0 0 0', fontSize: '10px', color: '#6B7490' }}>Claimed on: {item.claimedAt}</p>
        </div>
        <span style={{ fontSize: '9px', fontWeight: '800', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#22C55E', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
          {(item.status || 'Delivered').toUpperCase()}
        </span>
      </div>

      {item.type === 'voucher' ? (
        <div style={{ backgroundColor: '#090D16', borderRadius: '12px', padding: '12px', border: '1px dashed rgba(255, 255, 255, 0.15)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '10px', color: '#6B7490', fontWeight: '800' }}>CARD NUMBER</span>
            <button onClick={toggleReveal} style={{ background: 'transparent', border: 'none', color: '#A7B0C8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px' }}>
              {revealed ? <EyeOff size={12} /> : <Eye size={12} />}
              {revealed ? 'Hide' : 'Reveal (10s)'}
            </button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ margin: 0, fontFamily: 'monospace', fontSize: '14px', fontWeight: '800', color: '#F5F7FF', letterSpacing: '1px' }}>
              {revealed ? item.cardNumber : '•••• •••• •••• ' + (item.cardNumber ? item.cardNumber.slice(-4) : '••••')}
            </p>
            <button onClick={() => handleCopy(item.cardNumber)} style={{ background: 'transparent', border: 'none', color: '#FFB020', cursor: 'pointer' }}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>

          <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', color: '#6B7490' }}>PIN: <b style={{ color: '#FFB020' }}>{revealed ? item.pin : '••••'}</b></span>
            <span style={{ fontSize: '10px', color: '#6B7490' }}>Exp: {item.expiresAt || '31 Dec 2027'}</span>
          </div>
        </div>
      ) : (
        <div style={{ backgroundColor: '#090D16', borderRadius: '12px', padding: '12px' }}>
          <p style={{ margin: 0, fontSize: '12px', color: '#F5F7FF' }}>Mobile: <b>{item.mobileNumber}</b> ({item.operator})</p>
          <p style={{ margin: '4px 0 0 0', fontSize: '10px', color: '#22C55E' }}>Ref: {item.rechargeRef}</p>
        </div>
      )}
    </div>
  );
}
