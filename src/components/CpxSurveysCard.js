import React, { useState } from 'react';
import { Award, ExternalLink, ShieldCheck } from 'lucide-react';

export default function CpxSurveysCard({ user }) {
  const [loading, setLoading] = useState(false);
  const CPX_APP_ID = '37964';

  const handleOpenSurveys = () => {
    if (!user || !user.id) {
      alert('Please sign in to access surveys.');
      return;
    }

    setLoading(true);
    const targetUrl = `https://offers.cpx-research.com/index.php?app_id=${CPX_APP_ID}&ext_user_id=${encodeURIComponent(user.id)}&subid_1=${encodeURIComponent(user.id)}&subid_2=${encodeURIComponent(user.phone || '')}`;

    const newTab = window.open(targetUrl, '_blank', 'noopener,noreferrer');
    if (!newTab) {
      window.location.href = targetUrl;
    }

    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="p-5 bg-[#101522] border border-[#252C3D] rounded-2xl shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
            <Award size={22} />
          </div>
          <div>
            <h2 className="text-sm font-black text-white flex items-center gap-2">
              CPX Research Surveys
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Partner
              </span>
            </h2>
            <p className="text-xs text-[#94A3B8]">
              Complete market research surveys to earn RewardRush points.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="p-3 bg-[#0B0F17] border border-[#252C3D] rounded-xl">
          <span className="text-[10px] font-bold text-[#94A3B8] uppercase block">Rate</span>
          <span className="text-xs font-bold text-white">4,900 Pts / $1.00</span>
        </div>
        <div className="p-3 bg-[#0B0F17] border border-[#252C3D] rounded-xl">
          <span className="text-[10px] font-bold text-[#94A3B8] uppercase block">Credit Policy</span>
          <span className="text-xs font-bold text-[#94A3B8]">Credited on confirmation</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5 text-[11px] text-[#94A3B8]">
          <ShieldCheck size={14} className="text-indigo-400" />
          <span>Automated Postback Ledger</span>
        </div>
        <button
          onClick={handleOpenSurveys}
          disabled={loading}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? 'Opening...' : 'Browse Surveys'} <ExternalLink size={14} />
        </button>
      </div>
    </div>
  );
}
