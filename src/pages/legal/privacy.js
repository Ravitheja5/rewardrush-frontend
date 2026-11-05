import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', color: '#cbd5e1', lineHeight: '1.7', fontFamily: 'sans-serif' }}>
      <Link href="/" style={{ color: '#f59e0b', textDecoration: 'none', display: 'inline-block', marginBottom: '20px' }}>&larr; Back to RewardRush</Link>
      <h1 style={{ color: '#ffffff', fontSize: '28px', marginBottom: '16px' }}>Privacy Policy</h1>
      <p>Last updated: November 2026</p>
      
      <h2 style={{ color: '#ffffff', fontSize: '20px', marginTop: '24px' }}>1. Information We Collect</h2>
      <p>RewardRush collects mobile phone numbers solely for account authentication, task reward tracking, and fraud prevention. We also track basic device identifiers to prevent multi-accounting abuse.</p>
      
      <h2 style={{ color: '#ffffff', fontSize: '20px', marginTop: '24px' }}>2. Third-Party Advertising and Cookies</h2>
      <p>We use third-party advertising companies such as Google AdSense to serve ads when you visit our website. Google uses cookies (including the DoubleClick cookie) to serve ads based on your visits to this and other websites.</p>
      
      <h2 style={{ color: '#ffffff', fontSize: '20px', marginTop: '24px' }}>3. How We Protect Your Data</h2>
      <p>All sensitive authentication tokens and transactions are securely transmitted. We do not sell or rent personal information to external marketers.</p>
      
      <h2 style={{ color: '#ffffff', fontSize: '20px', marginTop: '24px' }}>4. Contact Us</h2>
      <p>For any questions or concerns regarding our privacy practices, reach out to us at <strong>support@rewardrush.com</strong>.</p>
    </div>
  );
}
