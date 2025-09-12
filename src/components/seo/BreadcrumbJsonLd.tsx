interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbJsonLdProps {
  items: BreadcrumbItem[]
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

// Usage examples for different pages:
export const HomeBreadcrumb = () => (
  <BreadcrumbJsonLd
    items={[
      {
        name: 'Home',
        url: 'https://mishrashardendu22.is-a.dev',
      },
    ]}
  />
)

export const ProjectsBreadcrumb = () => (
  <BreadcrumbJsonLd
    items={[
      {
        name: 'Home',
        url: 'https://mishrashardendu22.is-a.dev',
      },
      {
        name: 'Projects',
        url: 'https://mishrashardendu22.is-a.dev/projects',
      },
    ]}
  />
)

export const ExperienceBreadcrumb = () => (
  <BreadcrumbJsonLd
    items={[
      {
        name: 'Home',
        url: 'https://mishrashardendu22.is-a.dev',
      },
      {
        name: 'Experience',
        url: 'https://mishrashardendu22.is-a.dev/experience',
      },
    ]}
  />
)

export const BlogBreadcrumb = () => (
  <BreadcrumbJsonLd
    items={[
      {
        name: 'Home',
        url: 'https://mishrashardendu22.is-a.dev',
      },
      {
        name: 'Blog',
        url: 'https://mishrashardendu22.is-a.dev/blog',
      },
    ]}
  />
)
