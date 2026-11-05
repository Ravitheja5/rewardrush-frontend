import React, { useRef, useState } from 'react';

export default function OTPInput({ length = 6, onComplete }) {
  const [digits, setDigits] = useState(Array(length).fill(''));
  const inputsRef = useRef([]);

  const handleChange = (val, index) => {
    const clean = val.replace(/\D/g, '').slice(-1);
    const copy = [...digits];
    copy[index] = clean;
    setDigits(copy);

    if (clean && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    const merged = copy.join('');
    if (merged.length === length) {
      onComplete(merged);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', maxWidth: '340px', margin: '16px auto' }}>
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e.target.value, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          style={{ width: '45px', height: '50px', borderRadius: '12px', backgroundColor: '#151D2E', border: '1px solid rgba(255, 255, 255, 0.15)', textAlign: 'center', fontSize: '20px', fontWeight: '900', color: '#FFB020', outline: 'none' }}
        />
      ))}
    </div>
  );
}
