import React, { useRef, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { useTranslation } from '../../context/LanguageContext';

export default function ScratchCard({ onReveal }) {
  const { t } = useTranslation();
  const canvasRef = useRef(null);
  const [scratched, setScratched] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || scratched) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#263352';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#A7B0C8';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SCRATCH HERE', canvas.width / 2, canvas.height / 2 + 4);

    const scratch = (x, y) => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 16, 0, Math.PI * 2, false);
      ctx.fill();

      if (!scratched) {
        setScratched(true);
        try {
          confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
        } catch (e) {}
        if (onReveal) onReveal();
      }
    };

    const handleTouch = (e) => {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      scratch(touch.clientX - rect.left, touch.clientY - rect.top);
    };

    const handleMouse = (e) => {
      if (e.buttons === 1) {
        const rect = canvas.getBoundingClientRect();
        scratch(e.clientX - rect.left, e.clientY - rect.top);
      }
    };

    canvas.addEventListener('touchmove', handleTouch);
    canvas.addEventListener('mousemove', handleMouse);
    return () => {
      canvas.removeEventListener('touchmove', handleTouch);
      canvas.removeEventListener('mousemove', handleMouse);
    };
  }, [scratched, onReveal]);

  return (
    <div style={{ borderRadius: '20px', background: 'linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%)', border: '1px solid #4F46E5', padding: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <span style={{ fontSize: '9px', fontWeight: '900', background: '#4F46E5', color: '#FFF', padding: '2px 6px', borderRadius: '4px' }}>MYSTERY DROP</span>
        <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#FFF', margin: '6px 0 2px 0' }}>{t('home.mysteryTitle')}</h4>
        <p style={{ fontSize: '11px', color: '#A7B0C8', margin: 0 }}>{scratched ? "Unlocked +25 Points!" : t('home.scratchPrompt')}</p>
      </div>

      <div style={{ position: 'relative', width: '130px', height: '65px', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundColor: '#0B0F1A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: '#FFB020', fontSize: '14px' }}>
          +25 PTS
        </div>
        {!scratched && (
          <canvas
            ref={canvasRef}
            width={130}
            height={65}
            style={{ position: 'absolute', inset: 0, cursor: 'pointer' }}
          />
        )}
      </div>
    </div>
  );
}
