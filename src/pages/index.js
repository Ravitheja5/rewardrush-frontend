import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, CircleDot } from 'lucide-react';

export default function HomePage() {
  const [points] = useState(2450);
  const [pending] = useState(380);
  const [claimedStreak, setClaimedStreak] = useState(false);

  return (
    <div className="space-y-6">
      <Head>
        <title>Dashboard | RewardRush</title>
      </Head>

      {/* Welcome Banner */}
      <div>
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-[#F8FAFC]">
          Good evening, Member 👋
        </h1>
        <p className="text-xs text-[#A1A8B8] mt-0.5">Your earnings and redemption progress</p>
      </div>

      {/* Main Balance Card */}
      <div className="bg-[#101522] border border-[#252C3D] rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-medium text-[#727C91] uppercase tracking-wider">
              Available Balance
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl md:text-4xl font-semibold text-[#F8FAFC] tabular-nums">
                {points.toLocaleString()}
              </span>
              <span className="text-sm font-medium text-[#F5B942]">pts</span>
              <span className="text-xs text-[#A1A8B8] ml-2 font-mono">≈ ₹{points / 10}</span>
            </div>
            <div className="mt-2 text-xs text-[#727C91]">
              Pending clearance: <span className="text-[#A1A8B8] font-medium">{pending} pts</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              href="/store"
              className="px-5 py-2.5 bg-[#818CF8] hover:bg-[#6366F1] text-white text-xs font-medium rounded-xl transition"
            >
              Redeem Rewards
            </Link>
            <Link
              href="/tasks"
              className="px-5 py-2.5 bg-[#151B2B] hover:bg-[#1C2335] border border-[#252C3D] text-[#F8FAFC] text-xs font-medium rounded-xl transition"
            >
              Earn More
            </Link>
          </div>
        </div>
      </div>

      {/* 7-Day Daily Check-in */}
      <div className="bg-[#101522] border border-[#252C3D] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-[#F8FAFC]">Daily Check-in</h3>
            <p className="text-xs text-[#727C91]">Day 4 streak · Verified at 00:00 IST</p>
          </div>
          <button
            onClick={() => setClaimedStreak(true)}
            disabled={claimedStreak}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              claimedStreak
                ? 'bg-[#151B2B] text-[#727C91] border border-[#252C3D]'
                : 'bg-[#F5B942]/10 border border-[#F5B942]/20 text-[#F5B942] hover:bg-[#F5B942]/20'
            }`}
          >
            {claimedStreak ? 'Claimed Today' : 'Claim +10 pts'}
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1.5 text-center">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => {
            const isCompleted = idx < 3;
            const isToday = idx === 3;
            return (
              <div
                key={idx}
                className={`p-2 rounded-xl border text-xs flex flex-col items-center gap-1 ${
                  isToday
                    ? 'border-[#818CF8] bg-[#818CF8]/10 text-[#818CF8]'
                    : isCompleted
                    ? 'border-[#252C3D] bg-[#151B2B] text-[#34D399]'
                    : 'border-[#1C2231] bg-[#080B14] text-[#727C91]'
                }`}
              >
                <span className="text-[10px]">{day}</span>
                {isCompleted ? (
                  <CheckCircle2 size={13} />
                ) : isToday ? (
                  <CircleDot size={13} />
                ) : (
                  <span className="text-[10px]">+{idx === 6 ? 50 : 10}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Featured Tasks */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#F8FAFC]">Featured Tasks</h2>
          <Link href="/tasks" className="text-xs text-[#818CF8] hover:underline flex items-center gap-1">
            View all <ArrowRight size={12} />
          </Link>
        </div>

        <div className="space-y-2">
          {[
            { title: 'Tata Neu SuperApp', desc: 'Install and register mobile OTP', pts: 250, time: '4 min' },
            { title: 'PhonePe UPI Setup', desc: 'Link savings account and complete trial transaction', pts: 400, time: '6 min' },
          ].map((t, i) => (
            <div
              key={i}
              className="p-4 bg-[#101522] border border-[#252C3D] rounded-xl flex items-center justify-between hover:border-[#1C2335] transition"
            >
              <div>
                <h4 className="text-sm font-medium text-[#F8FAFC]">{t.title}</h4>
                <p className="text-xs text-[#727C91] mt-0.5">{t.desc}</p>
                <span className="text-[11px] text-[#A1A8B8] mt-1 block">⏱ {t.time}</span>
              </div>
              <div className="text-right flex flex-col items-end gap-2">
                <span className="text-xs font-semibold text-[#F5B942]">+{t.pts} pts</span>
                <Link
                  href="/tasks"
                  className="px-3 py-1 bg-[#151B2B] hover:bg-[#1C2335] border border-[#252C3D] text-[#F8FAFC] text-xs font-medium rounded-lg transition"
                >
                  Start
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
