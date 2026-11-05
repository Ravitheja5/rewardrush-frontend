import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Home, CheckSquare, Gift, ShieldCheck, User } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';

export default function BottomTabs() {
  const router = useRouter();
  const { t } = useTranslation();

  const tabs = [
    { label: t('nav.home'), path: '/', icon: Home },
    { label: t('nav.tasks'), path: '/tasks', icon: CheckSquare },
    { label: t('nav.store'), path: '/store', icon: Gift },
    { label: t('nav.vault'), path: '/vault', icon: ShieldCheck },
    { label: t('nav.profile'), path: '/profile', icon: User },
  ];

  return (
    <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, maxWidth: '430px', margin: '0 auto', backgroundColor: 'rgba(11, 15, 26, 0.95)', borderTop: '1px solid rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(20px)', zIndex: 40, display: 'flex', justifyContent: 'space-around', padding: '8px 0' }}>
      {tabs.map((tab) => {
        const isActive = router.pathname === tab.path;
        const Icon = tab.icon;
        return (
          <Link
            key={tab.path}
            href={tab.path}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: '56px', position: 'relative', textDecoration: 'none' }}
          >
            <Icon size={18} color={isActive ? '#FFB020' : '#6B7490'} />
            <span style={{ fontSize: '10px', fontWeight: isActive ? '800' : '600', color: isActive ? '#F5F7FF' : '#6B7490', marginTop: '4px' }}>
              {tab.label}
            </span>
            {isActive && (
              <span style={{ position: 'absolute', bottom: '-4px', width: '28px', height: '2px', borderRadius: '999px', background: 'linear-gradient(90deg, #FFB020, #FF7A00)' }} />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
