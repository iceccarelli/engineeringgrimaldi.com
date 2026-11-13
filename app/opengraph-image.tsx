import { ImageResponse } from "next/og";
export const runtime = "nodejs";
export const alt = "Grimaldi Engineering — Time to Power & NeuralBridge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Og() {
  return new ImageResponse((<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0E1116", color: "#F6F7F4", padding: 72, borderTop: "12px solid #FF8A00", fontFamily: "sans-serif" }}>
    <div style={{ display: "flex", flexDirection: "column" }}><div style={{ fontSize: 22, color: "#FF8A00" }}>PILOT-STAGE · FOUNDER-LED</div><div style={{ fontSize: 64, fontWeight: 700, marginTop: 16 }}>Grimaldi Engineering</div><div style={{ fontSize: 30, color: "#B8C4D2", marginTop: 20 }}>Time to Power (Gridforge) · NeuralBridge</div></div>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#8FA0B3" }}><div>timetopower.ai · neuralbridge.io</div><div>engineeringgrimaldi.com</div></div>
  </div>), { ...size });
}
