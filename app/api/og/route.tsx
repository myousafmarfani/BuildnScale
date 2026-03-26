import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '72px',
          background: 'linear-gradient(135deg, #0B1220 0%, #111827 60%, #1F2937 100%)',
          color: '#F8FAFC',
          fontFamily: 'system-ui, -apple-system, Segoe UI, sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 78,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
          }}
        >
          BuildnScale
        </div>
        <div
          style={{
            marginTop: 18,
            fontSize: 34,
            fontWeight: 500,
            color: '#BFDBFE',
          }}
        >
          Full-Stack & Agentic AI Engineering
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
