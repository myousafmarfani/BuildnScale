import { Roadmap, Project, AffiliateResource } from '@/types/blog';

export const roadmaps: Roadmap[] = [
  {
    title: 'Full-Stack Developer',
    description: 'Master modern web development from frontend to backend',
    modules: '12 modules',
    duration: '6 months',
    students: '2.5K+',
    slug: 'full-stack-developer',
  },
  {
    title: 'AI Engineer',
    description: 'Learn ML, DL, and AI application development',
    modules: '10 modules',
    duration: '8 months',
    students: '1.8K+',
    slug: 'ai-engineer',
  },
  {
    title: 'DevOps & Cloud',
    description: 'AWS, Docker, Kubernetes, and CI/CD pipelines',
    modules: '8 modules',
    duration: '4 months',
    students: '1.2K+',
    slug: 'devops-cloud',
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

export const affiliateResources: AffiliateResource[] = [
  {
    name: 'Hostinger',
    category: 'Web Hosting',
    description: 'Premium web hosting with 99.9% uptime and free SSL',
    price: '$2.99/mo',
    discount: '75% OFF',
    rating: 4.8,
    features: ['Free Domain', 'SSL Certificate', '24/7 Support'],
    link: 'https://hostinger.com?ref=affiliate',
  },
  {
    name: 'SiteGround',
    category: 'Web Hosting',
    description: 'Managed WordPress hosting with superior speed',
    price: '$3.99/mo',
    discount: '60% OFF',
    rating: 4.9,
    features: ['Free CDN', 'Daily Backup', 'Expert Support'],
    link: 'https://siteground.com?ref=affiliate',
  },
  {
    name: 'MongoDB Atlas',
    category: 'Database',
    description: 'Fully managed cloud database with auto-scaling',
    price: 'Free - $57/mo',
    discount: '$300 Credits',
    rating: 4.8,
    features: ['Auto-scaling', 'Backup', 'Multi-cloud'],
    link: 'https://mongodb.com/atlas',
  },
];
