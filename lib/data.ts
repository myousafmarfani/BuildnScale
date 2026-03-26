import { Roadmap, Project } from '@/types/blog';
export { affiliateResources, getAllResources, getResourceBySlug, getResourcesBySlugs } from '@/lib/resources';

export const roadmaps: Roadmap[] = [
  {
    title: 'Full-Stack Developer',
    description: 'A practical, opinionated full-stack developer roadmap for 2026. Learn HTML, CSS, JavaScript, TypeScript, React, Next.js, APIs, databases, authentication, testing, and DevOps by building production-style projects.',
    modules: '10 modules',
    duration: '8-12 months',
    status: 'published',
    slug: 'full-stack-developer',
  },
  {
    title: 'AI Engineer',
    description: 'A step-by-step AI Engineer roadmap for 2026. Learn Python, Machine Learning, Deep Learning, LLMs, LangChain, RAG, MLOps, and Agentic AI — built from real production experience.',
    modules: '8 modules',
    duration: '6-8 months',
    status: 'published',
    slug: 'ai-engineer',
  },
  {
    title: 'DevOps',
    description: 'Cloud infrastructure, CI/CD, observability, and platform reliability.',
    modules: 'TBD',
    duration: 'TBD',
    status: 'coming-soon',
  },
];

export const projects: Project[] = [
  {
    title: 'AI-Powered Task Manager',
    description: 'Full-stack app with AI assistant and real-time collaboration',
    tech: ['Next.js', 'FastAPI', 'PostgreSQL'],
    image: 'https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?w=600&q=80',
    github: 'https://github.com/myousafmarfani',
  },
  {
    title: 'Multi-Agent Emergency Response',
    description: 'Coordinated AI agents for emergency handling',
    tech: ['Python', 'LangChain', 'React'],
    image: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&q=80',
    github: 'https://github.com/myousafmarfani',
  },
  {
    title: 'Real-time Analytics Dashboard',
    description: 'Live data visualization with WebSocket connections',
    tech: ['Next.js', 'Socket.io', 'MongoDB'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
    github: 'https://github.com/myousafmarfani',
  },
];

