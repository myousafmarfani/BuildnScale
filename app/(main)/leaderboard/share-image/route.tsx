import { ImageResponse } from 'next/og'
const size = { width: 1200, height: 630 }
export function GET() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 80,
        background: '#101713',
        color: '#eff4ee',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ fontSize: 24, color: '#b9e88a', marginBottom: 45 }}>
        BUILDNSCALE / AI BENCHMARKS
      </div>
      <div style={{ fontSize: 80, fontWeight: 600, letterSpacing: -3 }}>
        Choose with evidence.
      </div>
      <div style={{ fontSize: 30, color: '#a4b2a8', marginTop: 30 }}>
        Coding benchmarks. Model comparisons. Clear sources.
      </div>
    </div>,
    size
  )
}
