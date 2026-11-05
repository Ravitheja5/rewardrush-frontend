import React from 'react';

export default function TaskCard({ task, onAction }) {
  return (
    <div style={{ borderRadius: '18px', backgroundColor: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: 'rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
          {task.icon || '⚡'}
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#F5F7FF', margin: 0 }}>{task.title}</h4>
            <span style={{ fontSize: '9px', fontWeight: '800', backgroundColor: '#7C5CFF', color: '#FFF', padding: '2px 5px', borderRadius: '4px' }}>{task.difficulty || 'Easy'}</span>
          </div>
          <p style={{ fontSize: '11px', color: '#A7B0C8', margin: '3px 0' }}>{task.desc}</p>
          <span style={{ fontSize: '10px', color: '#6B7490' }}>⏱️ {task.timeEst || '2m'}</span>
        </div>
      </div>

      <button
        onClick={() => onAction && onAction(task)}
        style={{
          padding: '8px 14px',
          borderRadius: '12px',
          fontSize: '11px',
          fontWeight: '900',
          border: 'none',
          cursor: 'pointer',
          background: 'linear-gradient(90deg, #FFB020, #FF7A00)',
          color: '#000',
          whiteSpace: 'nowrap',
        }}
      >
        +{task.points} PTS
      </button>
    </div>
  );
}
