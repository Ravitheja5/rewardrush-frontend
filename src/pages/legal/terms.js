import React from 'react';
import Link from 'next/link';

export default function TermsOfService() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', color: '#cbd5e1', lineHeight: '1.7', fontFamily: 'sans-serif' }}>
      <Link href="/" style={{ color: '#f59e0b', textDecoration: 'none', display: 'inline-block', marginBottom: '20px' }}>&larr; Back to RewardRush</Link>
      <h1 style={{ color: '#ffffff', fontSize: '28px', marginBottom: '16px' }}>Terms of Service</h1>
      <p>Last updated: November 2026</p>

      <h2 style={{ color: '#ffffff', fontSize: '20px', marginTop: '24px' }}>1. Platform Usage & Account Rules</h2>
      <p>RewardRush offers digital rewards for verified engagement tasks. Each individual user is strictly permitted a maximum of two registered accounts per physical device. Emulators, bots, automated scripts, and multiple identity abuse will result in an immediate account ban.</p>

      <h2 style={{ color: '#ffffff', fontSize: '20px', marginTop: '24px' }}>2. Reward Points & Redemption</h2>
      <p>Reward points carry no monetary value outside the RewardRush platform until converted through supported redemption channels. Reward criteria and conversion values are subject to change.</p>

      <h2 style={{ color: '#ffffff', fontSize: '20px', marginTop: '24px' }}>3. Ad Interaction Rules</h2>
      <p>Users are strictly prohibited from generating artificial impressions, repeatedly clicking on third-party advertisements, or utilizing automated bot traffic. Violation results in permanent blacklist.</p>
    </div>
  );
}
