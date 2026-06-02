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
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "9999px",
              background: "#5eead4",
            }}
          />
          <span style={{ fontSize: 18, color: "#5eead4", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            open-source · productivity tools
          </span>
        </div>
        <h1
          style={{
            fontSize: "56px",
            fontWeight: "bold",
            color: "#f5f5f5",
            lineHeight: "1.1",
            letterSpacing: "-0.03em",
            margin: "0 0 24px 0",
            maxWidth: "800px",
          }}
        >
          Productivity tools for developers who actually{" "}
          <span style={{ color: "#5eead4" }}>ship.</span>
        </h1>
        <p
          style={{
            fontSize: "22px",
            color: "#a3a3a3",
            margin: "0 0 48px 0",
            maxWidth: "600px",
            lineHeight: "1.5",
          }}
        >
          Free, fast, no-signup tools. Daily Planner, Pomodoro, Habit Tracker, and more.
        </p>
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          {["Daily Planner", "Pomodoro", "Habit Tracker", "Markdown Notes", "Rate Calculator"].map(
            (name, i) => (
              <div
                key={name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "9999px",
                    background: "#5eead4",
                    opacity: 1 - i * 0.15,
                  }}
                />
                <span
                  style={{
                    fontSize: "14px",
                    color: i === 0 ? "#f5f5f5" : "#525252",
                  }}
                >
                  {name}
                </span>
              </div>
            )
          )}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "80px",
            display: "flex",
            gap: "32px",
            fontSize: "14px",
            color: "#525252",
          }}
        >
          <span>buildnscale.dev</span>
          <span>✓ No account required</span>
          <span>✓ Free forever</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
