import { BASE_URL } from '@/constants/url'

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

export const HomeBreadcrumb = () => (
  <BreadcrumbJsonLd
    items={[
      {
        name: 'Home',
        url: BASE_URL,
      },
    ]}
  />
)

export const ProjectsBreadcrumb = () => (
  <BreadcrumbJsonLd
    items={[
      {
        name: 'Home',
        url: BASE_URL,
      },
      {
        name: 'Projects',
        url: `${BASE_URL}/projects`,
      },
    ]}
  />
)

export const ExperienceBreadcrumb = () => (
  <BreadcrumbJsonLd
    items={[
      {
        name: 'Home',
        url: BASE_URL,
      },
      {
        name: 'Experience',
        url: `${BASE_URL}/experiences`,
      },
    ]}
  />
)


