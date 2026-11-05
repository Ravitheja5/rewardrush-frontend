import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zap, Bell, LogIn, LogOut, User } from 'lucide-react';
import AuthModal from './AuthModal';

export default function AppBar({ user: propUser }) {
  const [currentUser, setCurrentUser] = useState(propUser || null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('rewardrush_user');
    if (saved) {
      try {
        setCurrentUser(JSON.parse(saved));
      } catch (e) {}
    } else if (propUser) {
      setCurrentUser(propUser);
    }
  }, [propUser]);

  const handleLogout = () => {
    localStorage.removeItem('rewardrush_user');
    setCurrentUser(null);
    setShowDropdown(false);
    window.location.reload();
  };

  return (
    <>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        backgroundColor: '#0c0e1e',
        borderBottom: '1px solid #1f2442',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '900',
            color: '#000',
            fontSize: '14px'
          }}>
            R
          </div>
          <div>
            <span style={{ fontSize: '13px', fontWeight: '800', letterSpacing: '0.05em', color: '#fff', display: 'block', lineHeight: 1 }}>
              REWARDRUSH
            </span>
            <span style={{ fontSize: '9px', color: '#10b981', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Verified Platform
            </span>
          </div>
        </Link>

        {/* Right Actions: Balance / Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
          {currentUser ? (
            <>
              {/* Points Pill */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                backgroundColor: '#14172e',
                border: '1px solid #282e56',
                padding: '5px 10px',
                borderRadius: '20px'
              }}>
                <Zap size={14} color="#f59e0b" fill="#f59e0b" />
                <span style={{ fontSize: '13px', fontWeight: '800', color: '#fbbf24' }}>
                  {currentUser.points ?? 0}
                </span>
                <span style={{ fontSize: '9px', color: '#8f95b2', fontWeight: '600' }}>PTS</span>
              </div>

              {/* User Dropdown Button */}
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: '#1b1f3b',
                  border: '1px solid #282e56',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <User size={16} />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '42px',
                  backgroundColor: '#111427',
                  border: '1px solid #282e56',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  minWidth: '160px',
                  padding: '8px',
                  zIndex: 50
                }}>
                  <div style={{ padding: '6px 10px', borderBottom: '1px solid #1f2442', marginBottom: '6px' }}>
                    <p style={{ margin: 0, fontSize: '10px', color: '#8f95b2' }}>Mobile</p>
                    <p style={{ margin: 0, fontSize: '12px', fontWeight: '700', color: '#fff' }}>
                      +91 {currentUser.phone || '9999999999'}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 10px',
                      background: 'none',
                      border: 'none',
                      color: '#ef4444',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      textAlign: 'left'
                    }}
                  >
                    <LogOut size={14} /> Log Out
                  </button>
                </div>
              )}
            </>
          ) : (
            <button
              onClick={() => setIsAuthOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#f59e0b',
                color: '#000',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              <LogIn size={14} /> Login
            </button>
          )}
        </div>
      </header>

      {/* Mobile OTP Login Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsAuthOpen(false);
          window.location.reload();
        }}
      />
    </>
  );
}
