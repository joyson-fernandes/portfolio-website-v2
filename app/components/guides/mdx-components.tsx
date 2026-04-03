import type { MDXComponents } from 'mdx/types'

export const mdxComponents: MDXComponents = {
  h1: ({ children, ...props }) => (
    <h1 className="text-3xl md:text-4xl font-bold text-foreground mt-12 mb-4 first:mt-0" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="text-2xl font-bold text-foreground mt-10 mb-4 scroll-mt-20 border-b border-border pb-2" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="text-xl font-semibold text-foreground mt-8 mb-3 scroll-mt-20" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4 className="text-lg font-semibold text-foreground mt-6 mb-2 scroll-mt-20" {...props}>
      {children}
    </h4>
  ),
  p: ({ children, ...props }) => (
    <p className="text-muted-foreground leading-relaxed mb-4" {...props}>
      {children}
    </p>
  ),
  a: ({ href, children, ...props }) => {
    const isExternal = href?.startsWith('http')
    return (
      <a
        href={href}
        className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...props}
      >
        {children}
      </a>
    )
  },
  ul: ({ children, ...props }) => (
    <ul className="list-disc list-inside space-y-1.5 mb-4 text-muted-foreground" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="list-decimal list-inside space-y-1.5 mb-4 text-muted-foreground" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="leading-relaxed" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="border-l-4 border-primary/50 bg-primary/5 rounded-r-lg px-4 py-3 my-4 text-muted-foreground [&>p]:mb-0"
      {...props}
    >
      {children}
    </blockquote>
  ),
  pre: ({ children, ...props }) => (
    <pre
      className="rounded-xl border border-border bg-[#0a0a0a] p-4 overflow-x-auto my-4 text-sm leading-relaxed [&>code]:bg-transparent [&>code]:p-0"
      {...props}
    >
      {children}
    </pre>
  ),
  code: ({ children, ...props }) => {
    // Inline code (not inside pre)
    const isInline = typeof children === 'string'
    if (isInline) {
      return (
        <code
          className="px-1.5 py-0.5 rounded-md bg-accent text-sm font-mono text-foreground"
          {...props}
        >
          {children}
        </code>
      )
    }
    return <code {...props}>{children}</code>
  },
  table: ({ children, ...props }) => (
    <div className="overflow-x-auto my-4 rounded-xl border border-border">
      <table className="w-full text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead className="bg-card border-b border-border" {...props}>
      {children}
    </thead>
  ),
  th: ({ children, ...props }) => (
    <th className="px-4 py-2.5 text-left font-semibold text-foreground" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="px-4 py-2.5 text-muted-foreground border-t border-border" {...props}>
      {children}
    </td>
  ),
  hr: (props) => <hr className="border-border my-8" {...props} />,
  img: ({ src, alt, ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt || ''} className="rounded-xl border border-border my-4 max-w-full" {...props} />
  ),
}
