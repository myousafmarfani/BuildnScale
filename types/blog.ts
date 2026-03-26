export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  updatedAt?: string;
  readTime: string;
  tags: string[];
  image: string;
  content: string;
  heroSectionPost?: boolean;
  author: {
    name: string;
    avatar: string;
  };
}

export interface Roadmap {
  title: string;
  description: string;
  modules: string;
  duration: string;
  status: 'published' | 'coming-soon';
  slug?: string;
}

export interface Project {
  title: string;
  description: string;
  tech: string[];
  image: string;
  link?: string;
  github?: string;
}

export interface AffiliateResource {
  slug: string;
  name: string;
  category: string;
  url: string;
  description: string;
  tags: string[];
  price: string;
  badge?: string;
  discount: string;
  rating?: number;
  features: string[];
  longDescription: string;
  whatItIs: string;
  keyFeatures: {
    title: string;
    description: string;
  }[];
  useCases: {
    title: string;
    description: string;
  }[];
  pros: string[];
  cons: string[];
  pricing: {
    plan: string;
    price: string;
    features: string[];
  }[];
  alternatives: string[];
  relatedArticles: string[];
  gettingStarted: string;
  seoTitle: string;
  seoDescription: string;
  lastVerified: string;
  link: string;
}

export interface Service {
  title: string;
  description: string;
  price: string;
  icon: string;
  link: string;
}
