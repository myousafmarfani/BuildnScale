import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'

export type Post = {
  slug: string
  title: string
  category: string
  date: string
  readTime: number
  excerpt: string
  contentHtml: string
  headings: { id: string; text: string }[]
  authorSlug: string
}

const postsDirectory = path.join(process.cwd(), 'content', 'blog')

export function getAllPosts(): Post[] {
  if (!fs.existsSync(postsDirectory)) return []
  const fileNames = fs.readdirSync(postsDirectory)
  const posts = fileNames
    .filter(fn => fn.endsWith('.md'))
    .map(fn => getPostBySlug(fn.replace(/\.md$/, '')))
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

function extractHeadings(raw: string) {
  const headings: { id: string; text: string }[] = []
  const regex = /^## (.+)$/gm
  let match
  while ((match = regex.exec(raw)) !== null) {
    const text = match[1]
    headings.push({ id: slugify(text), text })
  }
  return headings
}

function addHeadingIds(html: string, headings: { id: string; text: string }[]) {
  let result = html
  for (const h of headings) {
    const search = `<h2>${h.text}</h2>`
    const replace = `<h2 id="${h.id}">${h.text}</h2>`
    result = result.split(search).join(replace)
  }
  return result
}

export function getPostBySlug(slug: string): Post {
  const fullPath = path.join(postsDirectory, `${slug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  const headings = extractHeadings(content)
  const parsed = marked.parse(content, { gfm: true }) as string
  const contentHtml = addHeadingIds(parsed, headings)

  return {
    slug,
    title: data.title || '',
    category: data.category || '',
    date: data.date || '',
    readTime: data.readTime || 0,
    excerpt: data.excerpt || '',
    contentHtml,
    headings,
    authorSlug: data.author || 'muhammad-yousaf',
  }
}
