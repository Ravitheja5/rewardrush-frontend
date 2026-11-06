import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { registerUser, loginUser } from '../utils/auth';
import { Shield, Lock, Phone, User, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    if (!isLogin) {
      if (!name.trim()) {
        setError('Please enter your full name');
        return;
      }
      const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,16}$/;
      if (!passRegex.test(password)) {
        setError('Password must be 8-16 chars with at least 1 uppercase, 1 lowercase, 1 number, and 1 special char (@$!%*?&#)');
        return;
      }
    }

    setLoading(true);
    let res;
    if (isLogin) {
      res = await loginUser(phone, password);
    } else {
      res = await registerUser(name, phone, password);
    }

    if (res.success) {
      router.push('/tasks');
    } else {
      setError(res.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-[#101522] border border-[#252C3D] rounded-2xl shadow-2xl space-y-5">
      <Head>
        <title>{isLogin ? 'Login' : 'Create Account'} | RewardRush</title>
      </Head>

      <div className="text-center space-y-1">
        <div className="w-12 h-12 mx-auto bg-[#6366F1]/10 text-[#818CF8] rounded-xl flex items-center justify-center">
          <Shield size={24} />
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="text-xs text-[#94A3B8]">
          {isLogin ? 'Login to continue earning and redeeming data packs' : 'Earn ₹49 Unlimited 1-Day Data Packs daily'}
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 flex items-start gap-2">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div className="space-y-1">
            <label className="text-xs font-medium text-[#94A3B8]">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-3 text-[#64748B]" />
              <input
                type="text"
                placeholder="Ravi Theja"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#0B0E17] border border-[#252C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#818CF8]"
                required
              />
            </div>
          </div>
        )}

        <div className="space-y-1">
          <label className="text-xs font-medium text-[#94A3B8]">Mobile Number</label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-xs font-bold text-[#64748B]">+91</span>
            <input
              type="tel"
              maxLength={10}
              placeholder="9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              className="w-full pl-12 pr-3.5 py-2.5 bg-[#0B0E17] border border-[#252C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#818CF8]"
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-[#94A3B8]">Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-3 text-[#64748B]" />
            <input
              type={showPass ? 'text' : 'password'}
              maxLength={16}
              placeholder="Min 8 - Max 16 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-[#0B0E17] border border-[#252C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#818CF8]"
              required
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3.5 top-3 text-[#64748B] hover:text-white"
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {!isLogin && (
            <p className="text-[10px] text-[#64748B]">
              Must include 8-16 chars: uppercase, lowercase, number & special char (@$!%*?&#)
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#6366F1] hover:bg-[#4F46E5] disabled:opacity-50 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-[#6366F1]/25"
        >
          {loading ? 'Processing...' : isLogin ? 'Login Securely →' : 'Register & Claim ₹1.00 Bonus →'}
        </button>
      </form>

      <div className="text-center pt-2">
        <button
          type="button"
          onClick={() => { setIsLogin(!isLogin); setError(''); }}
          className="text-xs text-[#818CF8] hover:underline"
        >
          {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
}
