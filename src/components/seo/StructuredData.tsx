import {
  XProfile,
  GitHubProject,
  LinkedInProfile,
  YouTubeChannel,
  LeetCodeProfile,
  CodeChefProfile,
  CodeforcesProfile,
} from '@/data/static_link'

export function PersonJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': 'https://mishrashardendu22.is-a.dev/#person',
    name: 'Shardendu Mishra',
    givenName: 'Shardendu',
    familyName: 'Mishra',
    alternateName: ['ShardenduMishra22', 'MishraShardendu22'],
    description:
      'Software Developer and Engineer passionate about building impactful applications with modern technologies. Specializing in Go, React, and cloud-native solutions.',
    url: 'https://mishrashardendu22.is-a.dev',
    image: {
      '@type': 'ImageObject',
      url: 'https://mishrashardendu22.is-a.dev/Professional.webp',
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
      '@type': 'EducationalOrganization',
      name: 'Indian Institute of Information Technology, Dharwad',
      alternateName: 'IIIT Dharwad',
      url: 'https://www.iiitdwd.ac.in/',
    },
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'Indian Institute of Information Technology, Dharwad',
      alternateName: 'IIIT Dharwad',
      url: 'https://www.iiitdwd.ac.in/',
    },
    knowsAbout: [
      'Go Programming',
      'Golang',
      'React',
      'Next.js',
      'TypeScript',
      'JavaScript',
      'Software Development',
      'Web Development',
      'Full Stack Development',
      'Cloud Computing',
      'Docker',
      'Kubernetes',
      'MongoDB',
      'PostgreSQL',
      'Git',
      'Linux',
      'Competitive Programming',
      'Data Structures and Algorithms',
      'System Design',
      'Open Source',
    ],
    knowsLanguage: [
      {
        '@type': 'Language',
        name: 'English',
      },
      {
        '@type': 'Language',
        name: 'Hindi',
      },
    ],
    nationality: {
      '@type': 'Country',
      name: 'India',
    },
    homeLocation: {
      '@type': 'Place',
      name: 'India',
    },
    email: 'mailto:shardendumishra01@gmail.com',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'shardendumishra01@gmail.com',
      contactType: 'professional',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function WebsiteJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://mishrashardendu22.is-a.dev/#website',
    name: 'Shardendu Mishra - Portfolio',
    alternateName: 'ShardenduMishra22 Portfolio',
    description:
      'Software Developer and Engineer passionate about building impactful applications with modern technologies.',
    url: 'https://mishrashardendu22.is-a.dev',
    inLanguage: 'en-US',
    author: {
      '@id': 'https://mishrashardendu22.is-a.dev/#person',
    },
    creator: {
      '@id': 'https://mishrashardendu22.is-a.dev/#person',
    },
    copyrightHolder: {
      '@id': 'https://mishrashardendu22.is-a.dev/#person',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://mishrashardendu22.is-a.dev/?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
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
    '@id': 'https://mishrashardendu22.is-a.dev/#organization',
    name: 'Shardendu Mishra - Software Development Services',
    alternateName: 'ShardenduMishra22',
    description:
      'Professional software development services specializing in Go, React, and modern web technologies.',
    url: 'https://mishrashardendu22.is-a.dev',
    logo: {
      '@type': 'ImageObject',
      url: 'https://mishrashardendu22.is-a.dev/Professional.webp',
    },
    image: {
      '@type': 'ImageObject',
      url: 'https://mishrashardendu22.is-a.dev/Professional.webp',
    },
    sameAs: [LinkedInProfile, GitHubProject, XProfile, YouTubeChannel],
    founder: {
      '@id': 'https://mishrashardendu22.is-a.dev/#person',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'shardendumishra01@gmail.com',
      contactType: 'customer service',
      availableLanguage: ['English', 'Hindi'],
    },
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
    serviceType: [
      'Web Development',
      'Software Development',
      'Full Stack Development',
      'Go Programming',
      'React Development',
      'Technical Consulting',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
