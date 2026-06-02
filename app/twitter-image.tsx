import { ImageResponse } from "next/og"

export const alt = "buildnscale.dev — Productivity tools for developers who ship"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "#0d0d0d",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "#5eead4" }} />
            <span style={{ fontSize: 28, fontWeight: "bold", color: "#f5f5f5", letterSpacing: "-0.02em" }}>
              build<span style={{ color: "#5eead4" }}>n</span>scale
            </span>
          </div>
          <h1
            style={{
              fontSize: 64,
              fontWeight: "bold",
              color: "#f5f5f5",
              lineHeight: "1.1",
              letterSpacing: "-0.03em",
              margin: "0 0 16px",
              maxWidth: 900,
            }}
          >
            Productivity tools for developers who ship.
          </h1>
          <p style={{ fontSize: 24, color: "#a3a3a3", margin: 0, maxWidth: 700, lineHeight: "1.4" }}>
            Free, open-source, no-signup. Daily Planner · Pomodoro · Habit Tracker · Markdown Notes
          </p>
        </div>
        <div
          style={{
            position: "absolute",
            top: 40,
            right: 80,
            display: "flex",
            gap: 16,
          }}
        >
          {["Dev", "Ship", "Scale"].map((tag) => (
            <div
              key={tag}
              style={{
                padding: "8px 18px",
                borderRadius: 9999,
                border: "1px solid #262626",
                fontSize: 16,
                color: "#737373",
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
