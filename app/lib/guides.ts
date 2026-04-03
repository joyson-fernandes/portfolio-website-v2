import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { GuideMeta, Guide } from '@/lib/guide-types'

export type { GuideMeta, Guide }
export { GUIDE_CATEGORIES } from '@/lib/guide-types'

const GUIDES_DIR = path.join(process.cwd(), 'content', 'guides')

export function getGuides(): GuideMeta[] {
  if (!fs.existsSync(GUIDES_DIR)) return []

  const files = fs.readdirSync(GUIDES_DIR).filter((f) => f.endsWith('.mdx'))

  const guides = files
    .map((file) => {
      const raw = fs.readFileSync(path.join(GUIDES_DIR, file), 'utf-8')
      const { data } = matter(raw)
      return data as GuideMeta
    })
    .filter((g) => g.published !== false)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return guides
}

export function getGuideBySlug(slug: string): Guide | null {
  if (!fs.existsSync(GUIDES_DIR)) return null

  const filePath = path.join(GUIDES_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  return {
    meta: data as GuideMeta,
    content,
  }
}

export function getGuideSlugs(): string[] {
  if (!fs.existsSync(GUIDES_DIR)) return []

  return fs
    .readdirSync(GUIDES_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace('.mdx', ''))
}
