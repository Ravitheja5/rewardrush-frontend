import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { auth, db } from "../lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export default function History() {
  const [claims, setClaims] = useState([]);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    if (auth.currentUser) {
      const q = query(collection(db, "redemptions"), where("userId", "==", auth.currentUser.uid));
      const unsub = onSnapshot(q, (snapshot) => {
        setClaims(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      });
      return () => unsub();
    }
  }, []);

  return (
    <Layout points={points}>
      <div style={{ marginBottom: "16px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: "900", color: "#FFF", margin: 0 }}>Encrypted Vault</h2>
        <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: "#64748B" }}>Your claimed voucher codes and lifetime top-ups</p>
      </div>

      {claims.length === 0 ? (
        <div style={{ padding: "40px 20px", textAlign: "center", background: "#0F172A", borderRadius: "16px", border: "1px dashed #1E293B" }}>
          <span style={{ fontSize: "32px", opacity: 0.4 }}>🎟️</span>
          <p style={{ fontSize: "13px", fontWeight: "800", color: "#94A3B8", margin: "10px 0 2px 0" }}>Vault Is Empty</p>
          <p style={{ fontSize: "11px", color: "#64748B", margin: 0 }}>Complete missions to store your digital reward cards here.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {claims.map((claim) => (
            <div key={claim.id} style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: "14px", padding: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "12px", fontWeight: "900", color: "#F59E0B" }}>{claim.brand} Voucher</span>
                <span style={{ fontSize: "9px", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#34D399", fontWeight: "800", padding: "2px 6px", borderRadius: "4px" }}>ACTIVE</span>
              </div>
              <div style={{ background: "#06080F", padding: "10px", borderRadius: "8px", fontFamily: "monospace", fontSize: "12px" }}>
                <p style={{ margin: 0, color: "#FFF" }}>Card: {claim.cardNumber}</p>
                <p style={{ margin: "4px 0 0 0", color: "#F59E0B" }}>PIN: {claim.pin}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
