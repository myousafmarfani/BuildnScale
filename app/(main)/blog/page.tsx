import { getAllPosts } from '@/lib/posts'
import BlogContent from './BlogContent'

export default function BlogIndexPage() {
  const posts = getAllPosts()
  return <BlogContent posts={posts} />
}
