import React, { useState, useEffect } from 'react';
import AppBar from '../components/common/AppBar';
import BottomTabs from '../components/common/BottomTabs';
import BalanceHeroCard from '../components/home/BalanceHeroCard';
import LiveTicker from '../components/home/LiveTicker';
import StreakCalendar from '../components/home/StreakCalendar';
import ScratchCard from '../components/home/ScratchCard';
import TaskCard from '../components/tasks/TaskCard';
import Link from 'next/link';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';

export default function Home() {
  const [user, setUser] = useState(null);
  const [ticker, setTicker] = useState([]);
  const [tasks, setTasks] = useState([]);
  const { showToast } = useToast();

  useEffect(() => {
    api.getUser().then(setUser);
    api.getTicker().then(setTicker);
    api.getTasks().then((res) => setTasks(res.slice(0, 2)));
  }, []);

  const handleStreakClaim = async () => {
    const res = await api.claimStreak();
    if (res.success) {
      setUser((prev) => ({ ...prev, points: prev.points + res.pointsAwarded, streakClaimedToday: true }));
      showToast(`Earned +${res.pointsAwarded} Streak Points!`, 'success');
    }
  };

  const handleScratchReveal = async () => {
    const res = await api.scratchCard();
    if (res.success) {
      setUser((prev) => ({ ...prev, points: prev.points + res.pointsAwarded, mysteryScratchedToday: true }));
      showToast(`Mystery Reward: +${res.pointsAwarded} Points!`, 'success');
    }
  };

  return (
    <div>
      <AppBar points={user ? user.points : 0} />
      <LiveTicker items={ticker} />

      <main style={{ padding: '0 16px 85px 16px' }}>
        {user && (
          <BalanceHeroCard
            points={user.points}
            pendingPoints={user.pendingPoints}
            lifetimeEarned={user.lifetimeEarned}
          />
        )}

        <StreakCalendar
          currentStreak={user ? user.streakDays : 1}
          isClaimedToday={user ? user.streakClaimedToday : false}
          onClaim={handleStreakClaim}
        />

        <ScratchCard onReveal={handleScratchReveal} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0 10px 0' }}>
          <h3 style={{ fontSize: '13px', fontWeight: '900', color: '#A7B0C8', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
            Featured High-Yield Tasks
          </h3>
          <Link href="/tasks" style={{ fontSize: '11px', color: '#FFB020', fontWeight: '800', textDecoration: 'none' }}>
            See All →
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onAction={() => window.location.href = '/tasks'} />
          ))}
        </div>
      </main>

      <BottomTabs />
    </div>
  );
}
