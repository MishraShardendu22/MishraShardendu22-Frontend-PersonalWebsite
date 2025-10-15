import {
  XProfile,
  GitHubProject,
  LinkedInProfile,
  YouTubeChannel,
  LeetCodeProfile,
} from '@/data/static_link'
import { BASE_URL } from '@/constants/url'

export const seoConfig = {
  baseUrl: BASE_URL,
  siteName: 'Shardendu Mishra Portfolio',
  siteDescription:
    'Software Developer and Engineer passionate about building impactful applications with modern technologies. Specializing in Go, React, and cloud-native solutions.',

  author: {
    name: 'Shardendu Mishra',
    email: 'shardendumishra01@gmail.com',
    twitter: '@Shardendu_M',
    github: 'MishraShardendu22',
    linkedin: 'shardendumishra22',
    image: '/Professional.webp',
  },

  images: {
    ogImage: '/og-image.png',
    fallbackImage: '/Professional.webp',
    icon: '/favicon.ico',
    appleIcon: '/icons/icon-192.png',
  },

  keywords: {
    general: [
      'Shardendu Mishra',
      'Software Developer',
      'Software Engineer',
      'Full Stack Developer',
      'Portfolio',
    ],
    technologies: [
      'Go Developer',
      'Golang Expert',
      'React Developer',
      'Next.js Developer',
      'TypeScript Developer',
      'JavaScript Developer',
      'MongoDB',
      'PostgreSQL',
      'Docker',
      'Kubernetes',
    ],
    education: [
      'IIIT Dharwad',
      'Indian Institute of Information Technology',
      'Computer Science',
      'Software Engineering Student',
    ],
    skills: [
      'Web Development',
      'Software Engineering',
      'Cloud Native Development',
      'Open Source Contributor',
      'Competitive Programming',
      'System Design',
      'Data Structures',
      'Algorithms',
      'Backend Development',
      'Frontend Development',
      'API Development',
      'Database Design',
    ],
    location: ['India', 'Bangalore', 'Karnataka'],
    platforms: ['LeetCode', 'GitHub', 'LinkedIn', 'CodeChef', 'Codeforces'],
  },

  social: {
    twitter: XProfile,
    linkedin: LinkedInProfile,
    github: GitHubProject,
    youtube: YouTubeChannel,
    leetcode: LeetCodeProfile,
  },

  pages: {
    home: {
      title: 'Shardendu Mishra | Software Developer and Engineer',
      description:
        'Software Developer and Engineer passionate about building impactful applications with modern technologies. Specializing in Go, React, and cloud-native solutions.',
    },
    projects: {
      title: 'Projects | Shardendu Mishra',
      description:
        'Explore my software development projects including web applications, mobile apps, and open-source contributions built with modern technologies.',
    },
    experience: {
      title: 'Experience | Shardendu Mishra',
      description:
        'My professional experience and journey as a software developer, including internships, projects, and technical contributions.',
    },
    certifications: {
      title: 'Certifications | Shardendu Mishra',
      description:
        'Professional certifications and achievements in software development, cloud technologies, and programming.',
    },
    volunteer: {
      title: 'Volunteer Experience | Shardendu Mishra',
      description:
        'Community contributions, volunteer work, and leadership roles in various organizations and initiatives.',
    },
  },

  verification: {
    google: null,
    bing: null,
    yandex: null,
  },

  organization: {
    name: 'Shardendu Mishra - Software Development Services',
    type: 'ProfessionalService',
    description:
      'Professional software development services specializing in Go, React, and modern web technologies.',
    areaServed: 'India',
    serviceTypes: [
      'Web Development',
      'Software Development',
      'Full Stack Development',
      'Go Programming',
      'React Development',
      'Technical Consulting',
    ],
  },
}

export function getAllKeywords(): string[] {
  const { keywords } = seoConfig
  return [
    ...keywords.general,
    ...keywords.technologies,
    ...keywords.education,
    ...keywords.skills,
    ...keywords.location,
    ...keywords.platforms,
  ]
}

export function getPageMetadata(page: keyof typeof seoConfig.pages) {
  const pageConfig = seoConfig.pages[page]
  const allKeywords = getAllKeywords()

  return {
    title: pageConfig.title,
    description: pageConfig.description,
    keywords: allKeywords,
    openGraph: {
      title: pageConfig.title,
      description: pageConfig.description,
      url: `${seoConfig.baseUrl}${page === 'home' ? '' : `/${page}`}`,
      siteName: seoConfig.siteName,
      images: [
        {
          url: seoConfig.images.ogImage,
          width: 1200,
          height: 630,
          alt: pageConfig.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageConfig.title,
      description: pageConfig.description,
      creator: seoConfig.author.twitter,
      images: [seoConfig.images.ogImage],
    },
  }
}
