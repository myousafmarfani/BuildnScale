export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
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
  students: string;
  slug: string;
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
  name: string;
  category: string;
  description: string;
  price: string;
  discount: string;
  rating: number;
  features: string[];
  link: string;
}

export interface Service {
  title: string;
  description: string;
  price: string;
  icon: string;
  link: string;
}
