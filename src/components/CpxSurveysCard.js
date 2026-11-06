import React, { useState } from 'react';
import { Award, ExternalLink, ShieldCheck } from 'lucide-react';

export default function CpxSurveysCard({ user }) {
  const [opening, setOpening] = useState(false);
  const CPX_APP_ID = '37964';
  const cleanPhone = String(user?.phone || '').replace(/\D/g, '').slice(-10);

  const openCpxSurvey = () => {
    if (!cleanPhone) {
      alert('Please log in first.');
      return;
    }
    setOpening(true);
    const cpxUrl = `https://offers.cpx-research.com/index.php?app_id=${CPX_APP_ID}&ext_user_id=${cleanPhone}&subid_1=${cleanPhone}`;
    const win = window.open(cpxUrl, '_blank');
    if (!win) window.location.href = cpxUrl;
    setTimeout(() => setOpening(false), 2000);
  };

  return (
    <div className="p-5 bg-gradient-to-br from-[#101522] to-[#151c2e] border border-[#252C3D] rounded-2xl shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
            <Award size={22} />
          </div>
          <div>
            <h2 className="text-sm font-black text-white flex items-center gap-2">
              CPX Research Surveys
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                High Rewards
              </span>
            </h2>
            <p className="text-xs text-[#94A3B8]">
              Complete high-paying surveys. 4,900 Points = ₹49 Unlimited Data Pack.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="p-3 bg-[#0B0F17] border border-[#252C3D] rounded-xl">
          <span className="text-[10px] font-bold text-[#94A3B8] uppercase block">Full Survey</span>
          <span className="text-xs font-bold text-white">Up to 4,900+ Pts</span>
        </div>
        <div className="p-3 bg-[#0B0F17] border border-[#252C3D] rounded-xl">
          <span className="text-[10px] font-bold text-[#94A3B8] uppercase block">Screen-out Bonus</span>
          <span className="text-xs font-bold text-emerald-400">100% Guaranteed Pts</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5 text-[11px] text-[#94A3B8]">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>Verified Instant Credit</span>
        </div>
        <button
          onClick={openCpxSurvey}
          disabled={opening}
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-lg shadow-indigo-500/20 disabled:opacity-50"
        >
          {opening ? 'Opening...' : 'Start CPX Surveys'} <ExternalLink size={14} />
        </button>
      </div>
    </div>
  );
}
