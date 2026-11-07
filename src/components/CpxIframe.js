import React, { useState } from 'react';
import { Award, RefreshCw, ExternalLink } from 'lucide-react';

export default function CpxIframe({ user }) {
  const [loading, setLoading] = useState(true);

  const APP_ID = '37964';
  const cleanPhone = String(user?.phone || '').replace(/\D/g, '').slice(-10);
  const userId = user?.id || cleanPhone || 'guest';
  const username = encodeURIComponent(user?.phone || 'User');

  const iframeUrl = `https://offers.cpx-research.com/index.php?app_id=${APP_ID}&ext_user_id=${userId}&username=${username}&subid_1=${userId}&subid_2=${cleanPhone}`;

  return (
    <div className="w-full bg-[#101522] border border-[#252C3D] rounded-2xl p-4 shadow-2xl space-y-4">
      <div className="flex items-center justify-between border-b border-[#252C3D] pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
            <Award size={22} />
          </div>
          <div>
            <h2 className="text-sm font-black text-white flex items-center gap-2">
              CPX Research Surveys
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Live
              </span>
            </h2>
            <p className="text-[11px] text-[#94A3B8]">
              Surveys complete chesi direct ga wallet points pondandi.
            </p>
          </div>
        </div>

        <button
          onClick={() => window.open(iframeUrl, '_blank')}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1.5 transition"
        >
          Full Screen <ExternalLink size={13} />
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-10 gap-2 text-xs text-[#94A3B8]">
          <RefreshCw className="animate-spin text-indigo-500" size={16} />
          Connecting to CPX survey inventory...
        </div>
      )}

      <div className="w-full overflow-hidden rounded-xl bg-[#0B0F17] border border-[#252C3D]">
        <iframe
          src={iframeUrl}
          width="100%"
          height="800px"
          frameBorder="0"
          onLoad={() => setLoading(false)}
          className="w-full min-h-[650px] border-none"
          title="CPX Research Surveys"
        />
      </div>
    </div>
  );
}
