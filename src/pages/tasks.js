import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AppBar from '../components/common/AppBar';
import BottomTabs from '../components/common/BottomTabs';
import TaskCard from '../components/tasks/TaskCard';
import { api } from '../lib/api';

export default function TasksPage() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [activeCategory, setActiveCategory] = useState('ALL');

  useEffect(() => {
    api.getUser().then(setUser).catch(() => setUser({ points: 350 }));
    api.getTasks().then(setTasks).catch(() => {});
  }, []);

  const categories = ['ALL', 'Easy', 'Medium', 'Instant'];

  const filteredTasks = activeCategory === 'ALL'
    ? tasks
    : tasks.filter(t => (t.difficulty || t.badge || '').toLowerCase().includes(activeCategory.toLowerCase()));

  return (
    <>
      <Head>
        <title>Tasks | RewardRush</title>
      </Head>

      <div style={{ minHeight: '100vh', backgroundColor: '#0a0b16', color: '#fff', paddingBottom: '90px' }}>
        <AppBar user={user} />

        <main style={{ maxWidth: '480px', margin: '0 auto', padding: '16px' }}>
          {/* Header Title Banner */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>Earn Points</h1>
              <p style={{ fontSize: '12px', color: '#8f95b2', margin: 0 }}>Complete partner tasks for instant coins</p>
            </div>
            <span style={{ fontSize: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '4px 8px', borderRadius: '20px', fontWeight: '600' }}>
              ● S2S Active
            </span>
          </div>

          {/* Category Filter Chips */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '14px' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  fontSize: '12px',
                  fontWeight: activeCategory === cat ? '700' : '500',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: activeCategory === cat ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.08)',
                  backgroundColor: activeCategory === cat ? '#f59e0b' : 'rgba(255,255,255,0.04)',
                  color: activeCategory === cat ? '#000' : '#8f95b2',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: '0.2s all'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Native Task Cards List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredTasks && filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '30px', color: '#6b7280', fontSize: '13px' }}>
                No tasks available in this category
              </div>
            )}
          </div>
        </main>

        <BottomTabs activeTab="tasks" />
      </div>
    </>
  );
}
