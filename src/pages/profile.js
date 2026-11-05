import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AppBar from '../components/common/AppBar';
import BottomTabs from '../components/common/BottomTabs';
import { User, Phone, Zap, LogOut, ShieldCheck, Award } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('rewardrush_user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('rewardrush_user');
    setUser(null);
    router.push('/');
  };

  return (
    <>
      <Head>
        <title>Account Profile | RewardRush</title>
      </Head>

      <div style={{ minHeight: '100vh', backgroundColor: '#0a0b16', color: '#fff', paddingBottom: '90px' }}>
        <AppBar user={user} />

        <main style={{ maxWidth: '480px', margin: '0 auto', padding: '16px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '16px' }}>My Account</h1>

          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Account Card */}
              <div style={{ backgroundColor: '#111427', border: '1px solid #1f2442', borderRadius: '16px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#f59e0b', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px' }}>
                    {user.phone ? user.phone.slice(-2) : 'U'}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700' }}>Active Member</h3>
                    <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#8f95b2' }}>+91 {user.phone}</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingTop: '10px', borderTop: '1px solid #1f2442' }}>
                  <div style={{ background: '#0a0b16', padding: '10px', borderRadius: '12px' }}>
                    <p style={{ margin: 0, fontSize: '11px', color: '#8f95b2' }}>Balance</p>
                    <p style={{ margin: '4px 0 0 0', fontSize: '16px', fontWeight: '800', color: '#f59e0b' }}>{user.points || 0} Pts</p>
                  </div>
                  <div style={{ background: '#0a0b16', padding: '10px', borderRadius: '12px' }}>
                    <p style={{ margin: 0, fontSize: '11px', color: '#8f95b2' }}>Anti-Fraud</p>
                    <p style={{ margin: '4px 0 0 0', fontSize: '12px', fontWeight: '700', color: '#10b981' }}>Verified Device</p>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#ef4444',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  marginTop: '12px'
                }}
              >
                <LogOut size={16} /> Log Out from RewardRush
              </button>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 16px', backgroundColor: '#111427', borderRadius: '16px', border: '1px solid #1f2442' }}>
              <User size={40} color="#8f95b2" style={{ marginBottom: '10px' }} />
              <h3 style={{ fontSize: '16px', margin: '0 0 6px 0' }}>Not Logged In</h3>
              <p style={{ fontSize: '12px', color: '#8f95b2', marginBottom: '16px' }}>Log in with your phone to view points and claim rewards.</p>
              <button
                onClick={() => {
                  const btn = document.querySelector('header button');
                  if (btn) btn.click();
                }}
                style={{ padding: '10px 20px', background: '#f59e0b', color: '#000', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}
              >
                Login Now
              </button>
            </div>
          )}
        </main>

        <BottomTabs activeTab="profile" />
      </div>
    </>
  );
}
