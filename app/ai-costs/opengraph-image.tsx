import { ImageResponse } from "next/og"
import { readFile } from "node:fs/promises"
import { join } from "node:path"

export const alt =
  "AI model cost calculator — cost per task and month across Claude, GPT, Gemini, and DeepSeek"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  const logo = await readFile(join(process.cwd(), "public/logo.png"))
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`

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
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <img
            src={logoSrc}
            width={44}
            height={44}
            alt=""
            style={{ borderRadius: 10, objectFit: "contain", background: "#ffffff" }}
          />
          <span
            style={{
              fontSize: 30,
              fontWeight: "bold",
              color: "#f5f5f5",
              letterSpacing: "-0.02em",
            }}
          >
            build<span style={{ color: "#5eead4" }}>n</span>scale
          </span>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 20,
            color: "#5eead4",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            marginBottom: 18,
          }}
        >
          Model economics
        </div>

        <h1
          style={{
            fontSize: 68,
            fontWeight: "bold",
            color: "#f5f5f5",
            lineHeight: "1.05",
            letterSpacing: "-0.03em",
            margin: "0 0 20px",
            maxWidth: 940,
          }}
        >
          AI model cost calculator
        </h1>

        <p
          style={{
            fontSize: 26,
            color: "#a3a3a3",
            margin: 0,
            maxWidth: 820,
            lineHeight: "1.4",
          }}
        >
          Cost per task and month across Claude, GPT, Gemini, and DeepSeek.
        </p>

        <div style={{ display: "flex", gap: 12, marginTop: 36 }}>
          {["8 models", "Dated list prices", "No login"].map((tag) => (
            <div
              key={tag}
              style={{
                padding: "8px 18px",
                borderRadius: 9999,
                border: "1px solid #262626",
                fontSize: 18,
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
