export type Author = {
  slug: string
  name: string
  bio: string
  avatar: string
  role: string
  github?: string
  twitter?: string
  website?: string
}

const authors: Author[] = [
  {
    slug: 'muhammad-yousaf',
    name: 'Muhammad Yousaf',
    bio: 'Founder at BuildnScale · Full-Stack and AI Engineer',
    avatar: '/author.avif',
    role: 'Founder at BuildnScale · Full-Stack and AI Engineer',
    github: 'https://github.com/muhammadyousaf',
    twitter: 'https://x.com/muhammadyousaf',
    website: 'https://www.buildnscale.dev',
  },
]

export function getAllAuthors(): Author[] {
  return authors
}

export function getAuthorBySlug(slug: string): Author | undefined {
  return authors.find(a => a.slug === slug)
}
