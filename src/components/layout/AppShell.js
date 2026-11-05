import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Home, CheckSquare, Gift, Wallet, UserRound, Bell } from 'lucide-react';

export default function AppShell({ children }) {
  const router = useRouter();

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Earn', href: '/tasks', icon: CheckSquare },
    { label: 'Rewards', href: '/store', icon: Gift },
    { label: 'Wallet', href: '/wallet', icon: Wallet },
    { label: 'Profile', href: '/profile', icon: UserRound },
  ];

  return (
    <div className="min-h-screen bg-[#080B14] text-[#F8FAFC] flex">
      {/* Desktop Sidebar (Fixed Left) */}
      <aside className="hidden md:flex flex-col w-60 border-r border-[#1C2231] p-5 justify-between fixed h-full bg-[#080B14] z-20">
        <div>
          <div className="flex items-center gap-2 mb-8 px-2">
            <div className="w-7 h-7 rounded-lg bg-[#818CF8] flex items-center justify-center font-bold text-slate-950 text-sm">
              R
            </div>
            <span className="font-semibold text-base tracking-tight">RewardRush</span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = router.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? 'bg-[#818CF8]/10 text-[#818CF8]'
                      : 'text-[#A1A8B8] hover:bg-[#151B2B] hover:text-[#F8FAFC]'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="px-2 text-xs text-[#727C91]">
          <span>IST Verified Platform</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:pl-60 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-16 border-b border-[#1C2231] px-5 flex items-center justify-between sticky top-0 bg-[#080B14]/80 backdrop-blur-md z-10">
          <div className="md:hidden flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#818CF8] flex items-center justify-center font-bold text-slate-950 text-xs">
              R
            </div>
            <span className="font-semibold text-sm">RewardRush</span>
          </div>
          <div className="hidden md:block">
            <span className="text-xs text-[#727C91]">Fintech Rewards Ecosystem</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-xl border border-[#252C3D] bg-[#101522] flex items-center justify-center text-[#A1A8B8] hover:text-white transition">
              <Bell size={16} />
            </button>
            <Link
              href="/profile"
              className="w-9 h-9 rounded-xl border border-[#252C3D] bg-[#101522] flex items-center justify-center text-xs font-semibold text-[#818CF8]"
            >
              U
            </Link>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8 pb-24 md:pb-8">
          {children}
        </main>

        {/* Mobile Bottom Navigation (Fixed Bottom) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#080B14]/95 border-t border-[#1C2231] backdrop-blur-lg flex items-center justify-around px-2 z-20">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = router.pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 py-1 px-3 ${
                  isActive ? 'text-[#818CF8]' : 'text-[#727C91]'
                }`}
              >
                <Icon size={19} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
