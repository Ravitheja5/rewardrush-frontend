import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ShieldCheck, Smartphone, Lock, User, ArrowRight } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const backendUrl = 'https://rewards-app-backend-lq2v.onrender.com';

    try {
      const res = await fetch(`${backendUrl}${endpoint}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(
          isLogin 
            ? { phone: cleanPhone, password } 
            : { name, phone: cleanPhone, password, deviceId: 'web_' + Date.now() }
        )
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Authentication failed');
      }

      // Database nundi vachina live data ni direct ga store chesthunnam
      localStorage.setItem('rr_user', JSON.stringify(data.user));
      window.location.href = '/';
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message === 'Failed to fetch' 
        ? 'Backend server connect avvatledhu. Render awake avthondi, 10 seconds lo malli try cheyandi.' 
        : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Head>
        <title>{isLogin ? 'Login' : 'Sign Up'} | RewardRush</title>
      </Head>

      <div className="max-w-md w-full bg-[#101522] border border-[#252C3D] p-8 rounded-3xl shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-[#6366F1]/10 rounded-2xl text-[#818CF8]">
            <ShieldCheck size={28} />
          </div>
          <h2 className="text-xl font-black text-white">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-xs text-[#94A3B8]">
            {isLogin ? 'Enter your credentials to access your wallet' : 'Start earning rewards on every task'}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-1">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-3.5 text-[#94A3B8]" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ravitheja"
                  className="w-full bg-[#0B0F17] border border-[#252C3D] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#6366F1]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-1">Mobile Number</label>
            <div className="relative">
              <Smartphone size={16} className="absolute left-3.5 top-3.5 text-[#94A3B8]" />
              <input
                type="tel"
                required
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full bg-[#0B0F17] border border-[#252C3D] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#6366F1]"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-1">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-3.5 text-[#94A3B8]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-[#0B0F17] border border-[#252C3D] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#6366F1]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2"
          >
            {loading ? 'Connecting...' : (isLogin ? 'Login to Dashboard' : 'Register Now')}
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-xs text-[#818CF8] hover:underline"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
