import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { ToolCatalog } from '@/components/workspace/ToolCatalog'
import { WorkspaceData } from '@/components/workspace/WorkspaceData'
import { TOOLS } from '@/lib/tools-registry'
export default function ToolsPage() {
  return (
    <>
      <Nav />
      <main className="container-site pb-20">
        <header className="pb-10 pt-14 sm:pt-16">
          <p className="eyebrow mb-4">
            THE EVERYDAY TOOLKIT / {String(TOOLS.length).padStart(2, '0')} TOOLS
          </p>
          <h1
            className="hero-title"
            style={{ fontSize: 'clamp(36px,5vw,56px)' }}
          >
            A tool for your next step.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">
            Find a little focus. Clear a small task. Build a better routine.
            Pick a tool and get straight to work.
          </p>
        </header>
        <ToolCatalog />
        <div className="mt-16">
          <WorkspaceData />
        </div>
        <div className="mt-8 flex flex-wrap justify-between gap-3 text-sm text-muted">
          <span>Missing something you would use?</span>
          <a
            href="https://github.com/myousafmarfani/BuildnScale/issues/new"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal"
          >
            Suggest a tool on GitHub ↗
          </a>
        </div>
      </main>
      <Footer />
    </>
  )
}
