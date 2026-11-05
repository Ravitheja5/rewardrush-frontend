import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { registerUser, loginUser } from '../utils/auth';
import { Lock, ShieldCheck, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = isRegister
      ? await registerUser(phone, password)
      : await loginUser(phone, password);

    setLoading(false);

    if (res.success) {
      router.push('/tasks');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4">
      <Head>
        <title>{isRegister ? 'Register' : 'Login'} | Finora Rewards</title>
      </Head>

      <div className="w-full max-w-md bg-[#101522] border border-[#252C3D] p-6 sm:p-8 rounded-2xl shadow-2xl space-y-6">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center p-3 bg-[#818CF8]/10 text-[#818CF8] rounded-2xl mb-2">
            <ShieldCheck size={28} />
          </div>
          <h1 className="text-2xl font-bold text-[#F8FAFC]">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-xs text-[#A1A8B8]">
            Earn ₹49 Unlimited 1-Day Data Packs by completing tasks
          </p>
        </div>

        {error && (
          <div className="p-3 bg-[#FB7185]/10 border border-[#FB7185]/30 rounded-xl text-xs text-[#FB7185] flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#A1A8B8]">Mobile Number</label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-xs font-semibold text-[#727C91]">+91</span>
              <input
                type="tel"
                maxLength={10}
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                className="w-full pl-12 pr-4 py-2.5 bg-[#0B0E17] border border-[#252C3D] rounded-xl text-sm text-[#F8FAFC] placeholder-[#475569] focus:outline-none focus:border-[#818CF8]"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#A1A8B8]">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 text-[#727C91]" size={16} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#0B0E17] border border-[#252C3D] rounded-xl text-sm text-[#F8FAFC] placeholder-[#475569] focus:outline-none focus:border-[#818CF8]"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#818CF8] hover:bg-[#6366F1] disabled:bg-[#151B2B] text-white font-semibold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-[#818CF8]/20"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : isRegister ? (
              'Register & Claim ₹1.00 Bonus'
            ) : (
              'Login Securely'
            )}
            {!loading && <ArrowRight size={14} />}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[#1C2231]">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="text-xs text-[#818CF8] hover:underline"
          >
            {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
}
