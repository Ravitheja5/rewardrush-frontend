import React, { useState } from 'react';
import { Smartphone, KeyRound, X, ShieldAlert, CheckCircle } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [step, setStep] = useState('PHONE'); // PHONE | OTP
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [hint, setHint] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = async () => {
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      const data = await res.json();
      if (res.ok) {
        setStep('OTP');
        if (data.otpPreview) {
          setHint(`Verification code: ${data.otpPreview}`);
          setOtp(data.otpPreview); // auto-fill for testing convenience
        }
      } else {
        setError(data.error || 'Failed to send verification code');
      }
    } catch {
      setError('Cannot connect to backend server (port 5000)');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError('');
    setLoading(true);
    try {
      const deviceId = typeof window !== 'undefined'
        ? btoa((navigator.userAgent || '').slice(0, 25) + screen.width).slice(0, 16)
        : 'web_client';

      const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp, deviceId })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('rewardrush_user', JSON.stringify(data.user));
        onLoginSuccess(data.user);
        onClose();
      } else {
        setError(data.error || 'Verification failed');
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ backgroundColor: '#111427', border: '1px solid #23284d', borderRadius: '20px', width: '100%', maxWidth: '360px', padding: '24px', position: 'relative' }}>
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', right: '16px', top: '16px', color: '#8f95b2', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>
          {step === 'PHONE' ? 'Login with Mobile' : 'Verify Code'}
        </h3>
        <p style={{ fontSize: '12px', color: '#8f95b2', marginBottom: '16px' }}>
          {step === 'PHONE' ? 'Enter phone to earn and claim rewards' : `Code sent for +91 ${phone}`}
        </p>

        {hint && (
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', color: '#10b981', fontSize: '11px', padding: '8px 12px', borderRadius: '10px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle size={14} /> {hint}
          </div>
        )}

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', fontSize: '11px', padding: '8px 12px', borderRadius: '10px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldAlert size={14} /> {error}
          </div>
        )}

        {step === 'PHONE' ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', background: '#0a0b16', border: '1px solid #23284d', borderRadius: '12px', padding: '10px 14px', gap: '10px', marginBottom: '16px' }}>
              <Smartphone size={18} color="#8f95b2" />
              <span style={{ fontSize: '14px', color: '#8f95b2', fontWeight: 'bold' }}>+91</span>
              <input
                type="tel"
                maxLength={10}
                placeholder="Enter mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '14px', width: '100%' }}
              />
            </div>
            <button
              onClick={handleSendOtp}
              disabled={loading}
              style={{ width: '100%', padding: '12px', background: '#f59e0b', color: '#000', fontWeight: '700', borderRadius: '12px', border: 'none', cursor: 'pointer' }}
            >
              {loading ? 'Sending...' : 'Get OTP'}
            </button>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', background: '#0a0b16', border: '1px solid #23284d', borderRadius: '12px', padding: '10px 14px', gap: '10px', marginBottom: '16px' }}>
              <KeyRound size={18} color="#8f95b2" />
              <input
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '14px', width: '100%', letterSpacing: '4px' }}
              />
            </div>
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              style={{ width: '100%', padding: '12px', background: '#f59e0b', color: '#000', fontWeight: '700', borderRadius: '12px', border: 'none', cursor: 'pointer' }}
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
