import React from 'react';
import Link from 'next/link';

export default function AboutUs() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', color: '#cbd5e1', lineHeight: '1.7', fontFamily: 'sans-serif' }}>
      <Link href="/" style={{ color: '#f59e0b', textDecoration: 'none', display: 'inline-block', marginBottom: '20px' }}>&larr; Back to RewardRush</Link>
      <h1 style={{ color: '#ffffff', fontSize: '28px', marginBottom: '16px' }}>About RewardRush</h1>
      <p>RewardRush is an Indian micro-task engagement platform designed for college students, freelancers, and everyday smartphone users to discover genuine digital services and earn verified rewards.</p>
      
      <h2 style={{ color: '#ffffff', fontSize: '20px', marginTop: '24px' }}>Contact Details</h2>
      <p>Need support or partner inquiries? Write to us:</p>
      <ul style={{ paddingLeft: '20px' }}>
        <li>Email: support@rewardrush.com</li>
        <li>Location: Hyderabad, Telangana, India</li>
        <li>Operating Hours: Mon - Fri (9:00 AM - 6:00 PM IST)</li>
      </ul>
    </div>
  );
}
