import Link from "next/link";
import { useRouter } from "next/router";

export default function Layout({ children, points = 0, streak = 1 }) {
  const router = useRouter();

  const navItems = [
    { label: "Missions", path: "/", icon: "⚡" },
    { label: "Store", path: "/redeem", icon: "💎" },
    { label: "Vault", path: "/history", icon: "🎟️" },
  ];

  return (
    <div style={{ maxWidth: "440px", margin: "0 auto", minHeight: "100vh", backgroundColor: "#06080F", color: "#F8FAFC", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', Inter, sans-serif", display: "flex", flexDirection: "column", position: "relative", borderLeft: "1px solid #131B2E", borderRight: "1px solid #131B2E" }}>
      
      {/* Top Ticker - Real-Time Payouts */}
      <div style={{ backgroundColor: "#0B1120", borderBottom: "1px solid #172554", padding: "6px 14px", display: "flex", alignItems: "center", gap: "8px", overflow: "hidden" }}>
        <span style={{ fontSize: "10px", background: "#10B981", color: "#000", fontWeight: "900", padding: "2px 6px", borderRadius: "4px" }}>LIVE</span>
        <marquee style={{ fontSize: "11px", color: "#94A3B8", fontWeight: "500" }}>
          🔥 Ravi (Vizag) claimed 1GB Jio Booster • Sandeep (Hyd) claimed ₹50 Swiggy • Anusha claimed ₹50 Zomato • Instant Payouts Active!
        </marquee>
      </div>

      {/* App Bar */}
      <header style={{ padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #131B2E", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 40, backgroundColor: "rgba(6, 8, 15, 0.92)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", color: "#000", fontSize: "18px", boxShadow: "0 0 16px rgba(245,158,11,0.3)" }}>R</div>
          <div>
            <h1 style={{ fontSize: "16px", fontWeight: "900", letterSpacing: "0.5px", margin: 0, color: "#FFF" }}>REWARD HUB</h1>
            <p style={{ margin: 0, fontSize: "10px", color: "#10B981", fontWeight: "700" }}>VERIFIED PLATFORM</p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ background: "#0F172A", border: "1px solid #1E293B", padding: "6px 10px", borderRadius: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "12px" }}>🔥</span>
            <span style={{ fontSize: "12px", fontWeight: "800", color: "#EF4444" }}>{streak}D</span>
          </div>
          <div style={{ background: "#0F172A", border: "1px solid #1E293B", padding: "6px 12px", borderRadius: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "12px" }}>🪙</span>
            <span style={{ fontSize: "13px", fontWeight: "900", color: "#F59E0B" }}>{points}</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ flex: 1, padding: "16px 16px 85px 16px" }}>
        {children}
      </main>

      {/* High-End Bottom Nav */}
      <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, maxWidth: "440px", margin: "0 auto", backgroundColor: "rgba(6, 8, 15, 0.95)", borderTop: "1px solid #131B2E", display: "flex", justifyContent: "space-around", padding: "10px 0", backdropFilter: "blur(20px)", zIndex: 50 }}>
        {navItems.map((item) => {
          const active = router.pathname === item.path;
          return (
            <Link key={item.path} href={item.path} style={{ textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
              <span style={{ fontSize: "20px", filter: active ? "none" : "grayscale(100%)", opacity: active ? 1 : 0.4 }}>{item.icon}</span>
              <span style={{ fontSize: "11px", fontWeight: active ? "800" : "600", color: active ? "#F59E0B" : "#64748B" }}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
