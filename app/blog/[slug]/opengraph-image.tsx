import { ImageResponse } from '@vercel/og';
import { getPostBySlug } from '@/lib/blog';

export const runtime = 'nodejs';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '56px',
          background: 'linear-gradient(135deg, #0F172A 0%, #111827 60%, #1E293B 100%)',
          color: '#F8FAFC',
          fontFamily: 'system-ui, -apple-system, Segoe UI, sans-serif',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            padding: '8px 14px',
            borderRadius: 999,
            background: 'rgba(59, 130, 246, 0.22)',
            color: '#BFDBFE',
            fontSize: 22,
            fontWeight: 600,
          }}
        >
          BuildnScale
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div
            style={{
              fontSize: 58,
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: '-0.03em',
              maxWidth: '1050px',
            }}
          >
            {post?.title ?? 'BuildnScale Engineering Article'}
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {(post?.tags?.slice(0, 4) ?? ['Next.js', 'FastAPI', 'Agentic AI']).map((tag) => (
              <div
                key={tag}
                style={{
                  borderRadius: 999,
                  border: '1px solid rgba(191, 219, 254, 0.45)',
                  padding: '8px 14px',
                  color: '#DBEAFE',
                  fontSize: 20,
                  fontWeight: 500,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size
  );
}
