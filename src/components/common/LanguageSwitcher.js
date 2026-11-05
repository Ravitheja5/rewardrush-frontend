import React from 'react';
import { useTranslation } from '../../context/LanguageContext';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'te', label: 'తెలుగు' },
    { code: 'hi', label: 'हिन्दी' },
  ];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px', background: 'rgba(0, 0, 0, 0.4)', borderRadius: '999px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
      {languages.map((l) => (
        <button
          key={l.code}
          onClick={() => setLocale(l.code)}
          style={{
            padding: '6px 12px',
            borderRadius: '999px',
            fontSize: '11px',
            fontWeight: '800',
            border: 'none',
            cursor: 'pointer',
            background: locale === l.code ? 'linear-gradient(90deg, #7C5CFF, #4F46E5)' : 'transparent',
            color: locale === l.code ? '#FFFFFF' : '#6B7490',
          }}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
