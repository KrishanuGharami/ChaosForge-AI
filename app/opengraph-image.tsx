import { ImageResponse } from "next/og";

export const alt = "ChaosForge AI — Your chat. Their chaos. One legendary stream.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "72px", color: "#f7f4ff", background: "radial-gradient(ellipse at 78% 45%, #43276f 0%, #171020 36%, #09090d 75%)", fontFamily: "Arial, sans-serif", position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "14px", fontSize: 20, letterSpacing: "4px", color: "#d6c9ff", fontWeight: 700 }}>
        <div style={{ display: "flex", width: 36, height: 36, borderRadius: 10, background: "linear-gradient(140deg,#b399ff,#7548d2)", alignItems: "center", justifyContent: "center" }}><svg width="21" height="24" viewBox="0 0 24 28"><path d="M14 1 2 16h8l-1 11 13-17h-8z" fill="white"/></svg></div>
        CHAOSFORGE <span style={{ fontSize: 15, color: "#a98cff" }}>AI</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", marginTop: 54, fontSize: 71, lineHeight: 1.02, fontWeight: 700, letterSpacing: "-3px" }}>
        <span>Your chat.</span><span style={{ display: "flex", gap: 12 }}>Their <span style={{ color: "#b99aff" }}>chaos.</span></span>
      </div>
      <div style={{ marginTop: 24, fontSize: 24, color: "#b8b2c5" }}>One legendary stream.</div>
      <div style={{ position: "absolute", right: 85, bottom: 95, display: "flex", width: 225, height: 225, borderRadius: 120, border: "1px solid #a78bfa66", alignItems: "center", justifyContent: "center" }}><svg width="88" height="88" viewBox="0 0 88 88"><path d="M44 5v78M5 44h78M16.4 16.4l55.2 55.2m0-55.2L16.4 71.6" stroke="#c1a6ff" strokeWidth="2" opacity=".85"/><circle cx="44" cy="44" r="12" fill="#b399ff" opacity=".22"/></svg></div>
      <div style={{ position: "absolute", left: 72, bottom: 58, color: "#92899f", fontSize: 15, letterSpacing: "2px" }}>REAL-TIME TWITCH CHAT · AI-FORGED STREAM EVENTS</div>
    </div>,
    { ...size },
  );
}
