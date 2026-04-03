import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { getGuideBySlug, getGuideSlugs } from '@/lib/guides'
import { mdxComponents } from '@/components/guides/mdx-components'
import GuideLayout from '@/components/guides/guide-layout'
import HomelabNavigation from '@/components/layout/homelab-navigation'
import Footer from '@/components/sections/footer'

interface PageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  return getGuideSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const guide = getGuideBySlug(params.slug)
  if (!guide) return { title: 'Guide Not Found' }

  return {
    title: `${guide.meta.title} — Homelab Guides`,
    description: guide.meta.description,
    openGraph: {
      title: guide.meta.title,
      description: guide.meta.description,
      type: 'article',
      publishedTime: guide.meta.date,
      modifiedTime: guide.meta.updated,
    },
  }
}

export default function GuidePage({ params }: PageProps) {
  const guide = getGuideBySlug(params.slug)
  if (!guide) notFound()

  return (
    <>
      <HomelabNavigation />
      <GuideLayout meta={guide.meta} content={guide.content}>
        <MDXRemote
          source={guide.content}
          components={mdxComponents}
          options={{
            mdxOptions: {
              rehypePlugins: [
                rehypeSlug,
                [rehypeAutolinkHeadings, { behavior: 'wrap' }],
                [rehypePrettyCode, { theme: 'github-dark-default', keepBackground: false }],
              ],
            },
          }}
        />
      </GuideLayout>
      <Footer />
    </>
  )
}
