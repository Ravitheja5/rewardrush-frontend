import React, { useEffect } from 'react';

export default function AdBanner({ slotId = '1234567890', format = 'auto', responsive = 'true' }) {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <div style={{ margin: '16px 0', textAlign: 'center', minHeight: '90px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', padding: '8px', border: '1px dashed #23284d' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
      <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '4px' }}>Sponsored Advertisement</div>
    </div>
  );
}
