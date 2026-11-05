import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { auth, db } from "../lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export default function Redeem() {
  const [points, setPoints] = useState(0);
  const [voucher, setVoucher] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("all");

  useEffect(() => {
    if (auth.currentUser) {
      const unsub = onSnapshot(doc(db, "users", auth.currentUser.uid), (docSnap) => {
        if (docSnap.exists()) setPoints(docSnap.data().points || 0);
      });
      return () => unsub();
    }
  }, []);

  const handleClaim = async (brand, costPoints) => {
    if (!auth.currentUser) return alert("Please Login First");
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/redeem-voucher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: auth.currentUser.uid, brand, costPoints }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setVoucher(data.voucher);
    } catch (err) {
      setError(err.message === "OUT_OF_STOCK" ? "Stock Out! New inventory arriving in 2 hours." : err.message);
    } finally {
      setLoading(false);
    }
  };

  const catalog = [
    { brand: "Jio", category: "data", title: "1GB High-Speed 4G/5G Pack", desc: "Instant recharge on Jio number", pts: 200, icon: "📶", tag: "INSTANT" },
    { brand: "Airtel", category: "data", title: "1GB Data Booster", desc: "Instant recharge on Airtel number", pts: 200, icon: "⚡", tag: "INSTANT" },
    { brand: "Swiggy", category: "food", title: "₹50 Swiggy Voucher", desc: "Valid on Food & Instamart", pts: 500, icon: "🍔", tag: "HOT" },
    { brand: "Zomato", category: "food", title: "₹50 Zomato Pro Card", desc: "Instant code for dining & delivery", pts: 500, icon: "🍕", tag: "POPULAR" },
  ];

  const filteredCatalog = tab === "all" ? catalog : catalog.filter((c) => c.category === tab);

  return (
    <Layout points={points}>
      <div style={{ marginBottom: "16px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: "900", color: "#FFF", margin: 0 }}>Reward Store</h2>
        <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: "#64748B" }}>Select your data pack or restaurant voucher</p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        {[
          { id: "all", label: "All Items" },
          { id: "data", label: "Data Packs (1GB)" },
          { id: "food", label: "Food Cards (₹50)" },
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ background: tab === t.id ? "#F59E0B" : "#0F172A", color: tab === t.id ? "#000" : "#94A3B8", border: "1px solid #1E293B", borderRadius: "8px", padding: "6px 12px", fontSize: "11px", fontWeight: "800", cursor: "pointer" }}>
            {t.label}
          </button>
        ))}
      </div>

      {error && (
        <div style={{ backgroundColor: "#450A0A", border: "1px solid #DC2626", color: "#FCA5A5", padding: "10px 14px", borderRadius: "10px", fontSize: "11px", marginBottom: "16px" }}>
          ⚠️ {error}
        </div>
      )}

      {/* Catalog Grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {filteredCatalog.map((item) => (
          <div key={item.brand + item.title} style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: "16px", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "#1E293B", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
                {item.icon}
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <p style={{ margin: 0, fontSize: "13px", fontWeight: "800", color: "#FFF" }}>{item.title}</p>
                  <span style={{ fontSize: "9px", background: "#F59E0B", color: "#000", fontWeight: "900", padding: "2px 5px", borderRadius: "4px" }}>{item.tag}</span>
                </div>
                <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: "#64748B" }}>{item.desc}</p>
                <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#F59E0B", fontWeight: "900" }}>🪙 {item.pts} PTS</p>
              </div>
            </div>

            <button onClick={() => handleClaim(item.brand, item.pts)} disabled={loading} style={{ background: points >= item.pts ? "linear-gradient(90deg, #F59E0B, #D97706)" : "#1E293B", color: points >= item.pts ? "#000" : "#64748B", border: "none", borderRadius: "10px", padding: "10px 16px", fontSize: "11px", fontWeight: "900", cursor: points >= item.pts ? "pointer" : "not-allowed" }}>
              {loading ? "..." : "CLAIM"}
            </button>
          </div>
        ))}
      </div>

      {/* Claim Modal */}
      {voucher && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "16px" }}>
          <div style={{ backgroundColor: "#0F172A", border: "1px solid #10B981", borderRadius: "20px", padding: "24px", maxWidth: "360px", width: "100%", textAlign: "center" }}>
            <span style={{ fontSize: "36px" }}>🎉</span>
            <h3 style={{ fontSize: "18px", fontWeight: "900", color: "#34D399", margin: "10px 0 4px 0" }}>VOUCHER UNLOCKED!</h3>
            <p style={{ margin: "0 0 16px 0", fontSize: "11px", color: "#94A3B8" }}>Ready to use immediately in app</p>

            <div style={{ backgroundColor: "#06080F", padding: "14px", borderRadius: "12px", border: "1px dashed #334155", marginBottom: "14px" }}>
              <p style={{ margin: 0, fontSize: "10px", color: "#64748B", fontWeight: "800" }}>CARD NUMBER</p>
              <p style={{ margin: "4px 0 8px 0", fontFamily: "monospace", fontSize: "15px", fontWeight: "900", color: "#FFF" }}>{voucher.cardNumber}</p>
              
              <p style={{ margin: 0, fontSize: "10px", color: "#64748B", fontWeight: "800" }}>SECURITY PIN</p>
              <p style={{ margin: "2px 0 0 0", fontFamily: "monospace", fontSize: "15px", fontWeight: "900", color: "#F59E0B" }}>{voucher.pin}</p>
            </div>

            <button onClick={() => { navigator.clipboard.writeText(voucher.cardNumber); alert("Card Number Copied!"); }} style={{ width: "100%", background: "#10B981", color: "#000", border: "none", borderRadius: "10px", padding: "10px", fontSize: "12px", fontWeight: "900", cursor: "pointer", marginBottom: "8px" }}>
              COPY CARD NUMBER
            </button>
            <button onClick={() => setVoucher(null)} style={{ width: "100%", background: "transparent", color: "#94A3B8", border: "none", fontSize: "11px", fontWeight: "700", cursor: "pointer" }}>
              CLOSE
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}
