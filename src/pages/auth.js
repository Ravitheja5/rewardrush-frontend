import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { saveAuthSession } from '../utils/auth';
import { ShieldCheck, Smartphone, Lock, User, AlertCircle } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const backendUrl = 'https://rewards-app-backend-lq2v.onrender.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    try {
      const res = await fetch(`${backendUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formData.phone.trim(),
          password: formData.password.trim(),
          ...(isLogin ? {} : { name: formData.name.trim(), device_id: 'web_client' })
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || (isLogin ? 'Login failed' : 'Registration failed'));
      }

      // ONLY save session reference in browser (Points remain purely in Database)
      saveAuthSession(formData.phone.trim());

      // Redirect directly to dashboard
      router.push('/');
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8">
      <Head>
        <title>{isLogin ? 'Login' : 'Create Account'} | RewardRush</title>
      </Head>

      <div className="w-full max-w-sm p-6 sm:p-8 bg-[#101522] border border-[#252C3D] rounded-3xl shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#6366F1]/10 text-[#6366F1] rounded-2xl mx-auto flex items-center justify-center border border-[#6366F1]/20">
            <ShieldCheck size={28} />
          </div>
          <h2 className="text-xl font-black text-white">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-xs text-[#94A3B8]">
            {isLogin ? 'Login to access your live database wallet' : 'Register to start earning daily rewards'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-1">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-3 text-[#94A3B8]" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                  className="w-full bg-[#0B0F17] border border-[#252C3D] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#6366F1]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-1">Mobile Number</label>
            <div className="relative">
              <Smartphone size={16} className="absolute left-3.5 top-3 text-[#94A3B8]" />
              <input
                type="tel"
                required
                maxLength={10}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                placeholder="10-digit mobile number"
                className="w-full bg-[#0B0F17] border border-[#252C3D] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#6366F1]"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-1">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-3 text-[#94A3B8]" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter password"
                className="w-full bg-[#0B0F17] border border-[#252C3D] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#6366F1]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold rounded-xl transition shadow-lg shadow-[#6366F1]/20 disabled:opacity-50"
          >
            {loading ? 'Connecting to DB...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[#252C3D]">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMsg('');
            }}
            className="text-xs text-[#818CF8] hover:underline"
          >
            {isLogin ? "Account ledha? Sign Up cheyandi" : "Already account undha? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}
