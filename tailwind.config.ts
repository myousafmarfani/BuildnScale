import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        raised: "var(--color-raised)",
        overlay: "var(--color-overlay)",
        fg: "var(--color-fg)",
        muted: "var(--color-muted)",
        tertiary: "var(--color-tertiary)",
        border: "var(--color-border)",
        "border-strong": "var(--color-border-strong)",
        teal: "var(--color-teal)",
        "teal-hover": "var(--color-teal-hover)",
        "teal-subtle": "var(--color-teal-subtle)",
        "teal-muted": "var(--color-teal-muted)",
        amber: "var(--color-amber)",
        "amber-hover": "var(--color-amber-hover)",
        "amber-subtle": "var(--color-amber-subtle)",
        "amber-muted": "var(--color-amber-muted)",
        danger: "var(--color-danger)",
        info: "var(--color-info)",
        "info-subtle": "var(--color-info-subtle)",
        "info-muted": "var(--color-info-muted)",
      },
      fontFamily: {
        display: ["'JetBrains Mono'", "monospace"],
        body: ["'DM Sans'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        kbd: "3px",
        sm: "5px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        pill: "9999px",
      },
      maxWidth: {
        site: "1100px",
        narrow: "800px",
        article: "720px",
      },
      spacing: {
        "4.5": "18px",
        "13": "52px",
        "18": "72px",
      },
      fontSize: {
        "2xs": ["10px", { lineHeight: "14px" }],
        xs: ["11px", { lineHeight: "16px" }],
        sm: ["13px", { lineHeight: "18px" }],
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
      },
    },
  },
  plugins: [],
}
export default config
