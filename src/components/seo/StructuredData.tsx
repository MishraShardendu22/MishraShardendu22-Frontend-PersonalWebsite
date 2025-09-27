import {
  XProfile,
  GitHubProject,
  LinkedInProfile,
  YouTubeChannel,
  LeetCodeProfile,
  CodeChefProfile,
  CodeforcesProfile,
} from '@/data/static_link'
import { BASE_URL } from '@/constants/url'

export function PersonJsonLd() {
  const personData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${BASE_URL}/#person`,
    name: 'Shardendu Mishra',
    givenName: 'Shardendu',
    familyName: 'Mishra',
    alternateName: ['ShardenduMishra22', 'MishraShardendu22'],
    description:
      'Software Developer and Engineer passionate about building impactful applications with modern technologies. Specializing in Go, React, and cloud-native solutions.',
    url: BASE_URL,
    image: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/Professional.webp`,
      width: 512,
      height: 512,
    },
    sameAs: [
      LinkedInProfile,
      GitHubProject,
      XProfile,
      YouTubeChannel,
      LeetCodeProfile,
      CodeChefProfile,
      CodeforcesProfile,
    ],
    jobTitle: 'Software Developer',
    worksFor: {
      '@type': 'Organization',
      name: 'Self-employed',
    },
    knowsAbout: [
      'Software Development',
      'Web Development',
      'Go Programming',
      'React',
      'TypeScript',
      'Next.js',
      'Node.js',
      'Cloud Computing',
      'System Design',
    ],
    alumniOf: [
      {
        '@type': 'EducationalOrganization',
        name: 'Indian Institute of Information Technology, Dharwad',
        url: 'https://www.iiitdwd.ac.in/',
      },
      {
        '@type': 'EducationalOrganization',
        name: 'Delhi Public School, Kalyanpur',
        url: 'https://dpskalyanpur.com/',
      },
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kanpur',
      addressRegion: 'Uttar Pradesh',
      addressCountry: 'IN',
    },
    email: 'shardendumishra01@gmail.com',
    telephone: '+91-XXXXXXXXXX',
    birthPlace: {
      '@type': 'Place',
      name: 'Kanpur, India',
    },
    nationality: 'Indian',
    gender: 'Male',
    birthDate: '2004-06-22',
    hasOccupation: {
      '@type': 'Occupation',
      name: 'Software Developer',
      occupationLocation: {
        '@type': 'Country',
        name: 'India',
      },
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(personData) }}
    />
  )
}

export function WebsiteJsonLd() {
  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    name: 'Shardendu Mishra - Portfolio',
    alternateName: 'ShardenduMishra22 Portfolio',
    description:
      'Software Developer and Engineer passionate about building impactful applications with modern technologies.',
    url: BASE_URL,
    inLanguage: 'en-US',
    author: {
      '@id': `${BASE_URL}/#person`,
    },
    creator: {
      '@id': `${BASE_URL}/#person`,
    },
    copyrightHolder: {
      '@id': `${BASE_URL}/#person`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
    />
  )
}

export const StructuredData = () => {
  const personData = {
    '@type': 'Person',
    '@id': `${BASE_URL}/#person`,
    name: 'Shardendu Mishra',
    givenName: 'Shardendu',
    familyName: 'Mishra',
    alternateName: ['ShardenduMishra22', 'MishraShardendu22'],
    description:
      'Software Developer and Engineer passionate about building impactful applications with modern technologies. Specializing in Go, React, and cloud-native solutions.',
    url: BASE_URL,
    image: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/Professional.webp`,
      width: 512,
      height: 512,
    },
    sameAs: [
      LinkedInProfile,
      GitHubProject,
      XProfile,
      YouTubeChannel,
      LeetCodeProfile,
      CodeChefProfile,
      CodeforcesProfile,
    ],
    jobTitle: 'Software Developer',
    worksFor: {
      '@type': 'Organization',
      name: 'Self-employed',
    },
    knowsAbout: [
      'Software Development',
      'Web Development',
      'Go Programming',
      'React',
      'TypeScript',
      'Next.js',
      'Node.js',
      'Cloud Computing',
      'System Design',
    ],
    alumniOf: [
      {
        '@type': 'EducationalOrganization',
        name: 'Indian Institute of Information Technology, Dharwad',
        url: 'https://www.iiitdwd.ac.in/',
      },
      {
        '@type': 'EducationalOrganization',
        name: 'Delhi Public School, Kalyanpur',
        url: 'https://dpskalyanpur.com/',
      },
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kanpur',
      addressRegion: 'Uttar Pradesh',
      addressCountry: 'IN',
    },
    email: 'shardendumishra01@gmail.com',
    telephone: '+91-XXXXXXXXXX',
    birthPlace: {
      '@type': 'Place',
      name: 'Kanpur, India',
    },
    nationality: 'Indian',
    gender: 'Male',
    birthDate: '2004-06-22',
    hasOccupation: {
      '@type': 'Occupation',
      name: 'Software Developer',
      occupationLocation: {
        '@type': 'Country',
        name: 'India',
      },
    },
  }

  const websiteData = {
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    name: 'Shardendu Mishra - Portfolio',
    alternateName: 'ShardenduMishra22 Portfolio',
    description:
      'Software Developer and Engineer passionate about building impactful applications with modern technologies.',
    url: BASE_URL,
    inLanguage: 'en-US',
    author: {
      '@id': `${BASE_URL}/#person`,
    },
    creator: {
      '@id': `${BASE_URL}/#person`,
    },
    copyrightHolder: {
      '@id': `${BASE_URL}/#person`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [personData, websiteData],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function OrganizationJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${BASE_URL}/#organization`,
    name: 'Shardendu Mishra - Software Development Services',
    alternateName: 'ShardenduMishra22',
    description:
      'Professional software development services specializing in Go, React, and modern web technologies.',
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/Professional.webp`,
    },
    image: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/Professional.webp`,
    },
    sameAs: [LinkedInProfile, GitHubProject, XProfile, YouTubeChannel],
    founder: {
      '@id': `${BASE_URL}/#person`,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'shardendumishra01@gmail.com',
      contactType: 'Customer Service',
      availableLanguage: ['English', 'Hindi'],
    },
    areaServed: 'Worldwide',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Software Development Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Web Development',
            description: 'Custom web application development using modern technologies',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Backend Development',
            description: 'Scalable backend systems using Go, Node.js, and cloud technologies',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Frontend Development',
            description: 'Modern frontend applications using React, Next.js, and TypeScript',
          },
        },
      ],
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
