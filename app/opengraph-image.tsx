import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Padel Tracker — Track your padel matches live";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: 22,
            background: "#ffffff",
            color: "#1e293b",
            fontSize: 60,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 28,
          }}
        >
          P
        </div>

        <div
          style={{
            fontSize: 68,
            fontWeight: 700,
            color: "#ffffff",
            display: "flex",
          }}
        >
          Padel Tracker
        </div>

        <div
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.7)",
            marginTop: 16,
            display: "flex",
          }}
        >
          Track your padel matches live
        </div>

        <div style={{ display: "flex", gap: 24, marginTop: 44 }}>
          {[
            { label: "Live scoring", color: "#3b82f6" },
            { label: "Player stats", color: "#f97316" },
            { label: "Shareable results", color: "#10b981" },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                fontSize: 20,
                color: "#ffffff",
                background: item.color,
                padding: "10px 24px",
                borderRadius: 24,
                display: "flex",
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
