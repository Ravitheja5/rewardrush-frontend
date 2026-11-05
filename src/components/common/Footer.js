import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid #1e2238', marginTop: '40px', padding: '24px 16px', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '12px', flexWrap: 'wrap' }}>
        <Link href="/legal/privacy" style={{ color: '#94a3b8', textDecoration: 'none' }}>Privacy Policy</Link>
        <Link href="/legal/terms" style={{ color: '#94a3b8', textDecoration: 'none' }}>Terms of Service</Link>
        <Link href="/legal/about" style={{ color: '#94a3b8', textDecoration: 'none' }}>About & Contact</Link>
      </div>
      <div>&copy; {new Date().getFullYear()} RewardRush Platform. All rights reserved.</div>
    </footer>
  );
}
