import Link from 'next/link'
import { IconArrowUpRight } from '@tabler/icons-react'
import { Brand } from '@/components/layout/Brand'
import { TOOLS } from '@/lib/tools-registry'
export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-site py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <Brand className="w-fit" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              A little less friction.
              <br />A little more shipped.
            </p>
            <div className="mt-5 flex flex-col items-start gap-4">
              <a
                className="inline-flex items-center gap-2 text-sm text-teal"
                href="https://github.com/myousafmarfani/BuildnScale"
                target="_blank"
                rel="noopener noreferrer"
              >
                Built in the open <IconArrowUpRight className="h-4 w-4" />
              </a>
              <a
                href="https://peerlist.io/myousafmarfani/project/buildnscale"
                target="_blank"
                rel="noreferrer"
                className="inline-flex max-w-full"
              >
                <img
                  src="https://peerlist.io/api/v1/projects/embed/PRJHNN7KGPNOGE8AMCNARG66BJGDGG?showUpvote=false&theme=dark"
                  alt="BuildnScale"
                  loading="lazy"
                  className="max-w-full"
                  style={{ width: 'auto', height: '72px' }}
                />
              </a>
            </div>
          </div>
          <div>
            <h2 className="mb-4 text-xs font-mono uppercase tracking-widest text-muted">
              Your toolkit
            </h2>
            <div className="grid gap-2.5">
              {TOOLS.map((tool) => (
                <Link
                  key={tool.slug}
                  className="text-sm text-muted hover:text-fg"
                  href={`/tools/${tool.slug}`}
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="mb-4 text-xs font-mono uppercase tracking-widest text-muted">
              Around here
            </h2>
            <div className="grid gap-2.5">
              {[
                ['/leaderboard', 'AI benchmarks'],
                ['/compare', 'Compare AI models'],
                ['/leaderboard/methodology', 'Benchmark methodology'],
                ['/blog', 'Build log'],
                ['/roadmap', 'Roadmap'],
                ['/changelog', 'Changelog'],
                ['/write-for-us', 'Write for us'],
                ['/tools#workspace-data', 'Back up your workspace'],
                ['/privacy', 'Privacy'],
                ['/terms', 'Terms'],
              ].map(([href, label]) => (
                <Link
                  key={href}
                  className="text-sm text-muted hover:text-fg"
                  href={href}
                >
                  {label}
                </Link>
              ))}
              <a
                href="https://github.com/myousafmarfani/BuildnScale/issues/new"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted hover:text-fg"
              >
                Suggest a tool ↗
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-wrap justify-between gap-3 border-t border-border pt-6 text-xs text-muted">
          <span>
            © {new Date().getFullYear()} BuildnScale · Muhammad Yousaf
          </span>
          <span>Free to use. Built for your next small win.</span>
        </div>
      </div>
    </footer>
  )
}
