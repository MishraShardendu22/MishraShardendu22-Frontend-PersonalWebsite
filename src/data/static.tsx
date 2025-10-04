import {
  Home,
  Code,
  Mail,
  User,
  Heart,
  Award,
  Clock,
  Glasses,
  Briefcase,
  GraduationCap,
} from 'lucide-react'

// =============================================================================
// PERSONAL INFORMATION
// =============================================================================

export const personalInfo = {
  name: 'Shardendu Mishra',
  givenName: 'Shardendu',
  familyName: 'Mishra',
  email: 'shardendumishra01@gmail.com',
  telephone: '+91-8707359576',
  jobTitle: 'Software Developer',
  birthDate: '2004-06-22',
  gender: 'Male',
  nationality: 'Indian',

  alternateName: ['ShardenduMishra22', 'MishraShardendu22'],

  description:
    'Software Developer and Engineer passionate about building impactful applications with modern technologies. Specializing in Go, React, and cloud-native solutions.',

  bio: {
    short:
      'Software Developer and Engineer passionate about building impactful applications with modern technologies.',
    long: 'Software Developer and Engineer passionate about building impactful applications with modern technologies. Specializing in Go, React, and cloud-native solutions.',
  },

  address: {
    locality: 'Kanpur',
    region: 'Uttar Pradesh',
    country: 'IN',
    countryName: 'India',
  },

  birthPlace: 'Kanpur, India',

  currentLocation: {
    city: 'Bangalore',
    state: 'Karnataka',
    country: 'India',
  },

  image: {
    profile: '/Professional.webp',
    ogImage: '/og-image.png',
    fallbackImage: '/Professional.webp',
    width: 512,
    height: 512,
  },
}

// ========================================================================
// SOCIAL MEDIA LINKS
// ========================================================================

export const socialLinks = {
  twitter: {
    url: 'https://x.com/Shardendu_M',
    handle: '@Shardendu_M',
    username: 'Shardendu_M',
  },

  github: {
    personal: 'https://github.com/MishraShardendu22',
    learning: 'https://github.com/ShardenduMishra22',
    organization: 'https://github.com/Team-Parashuram',
    username: 'MishraShardendu22',
  },

  linkedin: {
    url: 'https://www.linkedin.com/in/shardendumishra22',
    username: 'shardendumishra22',
  },

  youtube: {
    url: 'https://www.youtube.com/@Shardendu_Mishra',
    channel: '@Shardendu_Mishra',
  },

  leetcode: {
    url: 'https://leetcode.com/u/ShardenduMishra22',
    username: 'ShardenduMishra22',
  },

  codechef: {
    url: process.env.NEXT_PUBLIC_BASE_URL + '/coming_soon',
    username: '',
  },

  codeforces: {
    url: process.env.NEXT_PUBLIC_BASE_URL + '/coming_soon',
    username: '',
  },

  resume: 'https://drive.google.com/file/d/1F-ORaZyX8iMmBFhX2i-rtn21rdDMnsew/view?usp=sharing',
}

// Backward compatibility exports
export const XProfile = socialLinks.twitter.url
export const GitHubProject = socialLinks.github.personal
export const GitHubLearning = socialLinks.github.learning
export const GitHubOrganistaion = socialLinks.github.organization
export const LeetCodeProfile = socialLinks.leetcode.url
export const YouTubeChannel = socialLinks.youtube.url
export const LinkedInProfile = socialLinks.linkedin.url
export const resumeLink = socialLinks.resume
export const CodeChefProfile = socialLinks.codechef.url
export const CodeforcesProfile = socialLinks.codeforces.url

// =============================================================================
// NAVIGATION
// =============================================================================

export const navItems = [
  { href: '#hero', label: 'Home', icon: Home },
  { href: '#education', label: 'Education', icon: GraduationCap },
  { href: '#skills', label: 'Skills', icon: Code },
  { href: '#timeline', label: 'Timeline', icon: Clock },
  { href: '#projects', label: 'Projects', icon: Briefcase },
  { href: '#experience', label: 'Experience', icon: User },
  { href: '#volunteer', label: 'Volunteer', icon: Heart },
  { href: '#certifications', label: 'Certifications', icon: Award },
  { href: '#contact', label: 'Contact', icon: Mail },
  { href: '/blog', label: 'Blog', icon: Glasses },
]

// =============================================================================
// EDUCATION
// =============================================================================

export const educationData = {
  college: {
    name: 'Indian Institute of Information Technology, Dharwad',
    shortName: 'IIIT Dharwad',
    degree: 'Bachelor of Technology',
    field: 'Computer Science and Engineering',
    batch: '2023-2027',
    startYear: '2023',
    endYear: '2027',
    location: 'Dharwad, Karnataka, India',
    website: 'https://www.iiitdwd.ac.in/',
    logo: '/iiit-dharwad-logo.png', // Add your logo path
    cgpa: '', // Add if you want to display
    achievements: [], // Add your achievements
  },

  school: {
    name: 'Delhi Public School, Kalyanpur',
    shortName: 'DPS Kalyanpur',
    batch: '2008-2022',
    startYear: '2008',
    endYear: '2022',
    location: 'Kanpur, Uttar Pradesh, India',
    website: 'https://dpskalyanpur.com/',
    logo: '/dps-logo.png', // Add your logo path

    class12: {
      percentage: '96.4%',
      board: 'CBSE',
      stream: 'PCM and Computer Science',
      year: '2022',
    },

    class10: {
      percentage: '84%',
      board: 'CBSE',
      year: '2020',
    },
  },

  languages: ['Hindi', 'French', 'English'],
}

// Backward compatibility
export const CollegeBatch = educationData.college.batch
export const CollegeWebsite = educationData.college.website
export const CollegeLocation = educationData.college.location
export const CollegeName = educationData.college.name
export const SchoolBatch = educationData.school.batch
export const SchoolName = educationData.school.name
export const SchoolLocation = educationData.school.location
export const Class12thPercentage = educationData.school.class12.percentage
export const Class12thCourse = educationData.school.class12.stream
export const Class10thPercentage = educationData.school.class10.percentage
export const Languages = educationData.languages

// =============================================================================
// SEO & METADATA
// =============================================================================

export const seoMetadata = {
  siteName: 'Shardendu Mishra Portfolio',
  siteDescription:
    'Software Developer and Engineer passionate about building impactful applications with modern technologies. Specializing in Go, React, and cloud-native solutions.',

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

    location: ['India', 'Bangalore', 'Karnataka', 'Kanpur'],

    platforms: ['LeetCode', 'GitHub', 'LinkedIn', 'CodeChef', 'Codeforces'],
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
    blog: {
      title: 'Blog | Shardendu Mishra',
      description:
        'Technical articles, tutorials, and insights about software development, programming, and technology trends.',
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

// =============================================================================
// PROFESSIONAL INFORMATION
// =============================================================================

export const professionalInfo = {
  occupation: {
    name: 'Software Developer',
    location: 'India',
    employmentType: 'Self-employed',
  },

  worksFor: {
    type: 'Organization',
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
    'Data Structures',
    'Algorithms',
    'Backend Development',
    'Frontend Development',
    'Database Design',
    'API Development',
    'Docker',
    'Kubernetes',
    'PostgreSQL',
    'MongoDB',
  ],

  expertise: {
    primary: ['Go', 'React', 'TypeScript', 'Next.js'],
    secondary: ['Node.js', 'MongoDB', 'PostgreSQL', 'Docker', 'Kubernetes'],
    learning: [], // Technologies currently learning
  },
}

// =============================================================================
// CONTACT INFORMATION
// =============================================================================

export const contactInfo = {
  email: personalInfo.email,
  phone: personalInfo.telephone,

  preferredContactMethods: ['email', 'linkedin'],

  availability: {
    status: 'available', // 'available' | 'busy' | 'not-available'
    message: 'Open to opportunities and collaborations',
  },

  workingHours: {
    timezone: 'Asia/Kolkata',
    preferredHours: '9:00 AM - 6:00 PM IST',
  },
}

// =============================================================================
// HERO SECTION DATA
// =============================================================================

export const heroData = {
  greeting: "Hi, I'm",
  name: personalInfo.name,
  titles: ['Software Developer', 'Full Stack Engineer', 'Go Enthusiast', 'Problem Solver'],
  tagline: personalInfo.description,

  cta: {
    primary: {
      text: 'View Projects',
      href: '#projects',
    },
    secondary: {
      text: 'Contact Me',
      href: '#contact',
    },
  },

  stats: {
    // These should come from backend in the future
    yearsOfExperience: new Date().getFullYear() - 2022,
    projectsCompleted: 0, // Will be fetched from backend
    technologiesUsed: 0, // Will be fetched from backend
    certifications: 0, // Will be fetched from backend
  },
}

// =============================================================================
// ALUMNI OF (Educational Organizations)
// =============================================================================

export const alumniOf = [
  {
    type: 'EducationalOrganization',
    name: educationData.college.name,
    url: educationData.college.website,
  },
  {
    type: 'EducationalOrganization',
    name: educationData.school.name,
    url: educationData.school.website,
  },
]

// =============================================================================
// FOOTER DATA
// =============================================================================

export const footerData = {
  copyright: {
    year: new Date().getFullYear(),
    holder: personalInfo.name,
    message: `© ${new Date().getFullYear()} ${personalInfo.name}. All rights reserved.`,
  },

  sections: [
    {
      title: 'Quick Links',
      links: [
        { label: 'Home', href: '/' },
        { label: 'Projects', href: '/projects' },
        { label: 'Blog', href: '/blog' },
        { label: 'Experience', href: '/experiences' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Certifications', href: '/certifications' },
        { label: 'Volunteer', href: '/volunteer' },
        { label: 'Resume', href: socialLinks.resume, external: true },
      ],
    },
    {
      title: 'Connect',
      links: [
        { label: 'GitHub', href: socialLinks.github.personal, external: true },
        { label: 'LinkedIn', href: socialLinks.linkedin.url, external: true },
        { label: 'Twitter', href: socialLinks.twitter.url, external: true },
        { label: 'Email', href: `mailto:${personalInfo.email}`, external: true },
      ],
    },
  ],

  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],

  builtWith: {
    message: 'Built with Next.js, TypeScript, and Tailwind CSS',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
  },
}

// =============================================================================
// THEME CONFIGURATION
// =============================================================================

export const themeConfig = {
  defaultTheme: 'system', // 'light' | 'dark' | 'system'

  colors: {
    primary: '#3b82f6', // blue-500
    secondary: '#8b5cf6', // violet-500
    accent: '#f59e0b', // amber-500
  },

  // Chart colors for different languages/technologies
  languageColors: {
    Go: '#00ADD8',
    TypeScript: '#3178C6',
    JavaScript: '#F7DF1E',
    Python: '#3776AB',
    Java: '#007396',
    'C++': '#00599C',
    React: '#61DAFB',
    'Node.js': '#339933',
    MongoDB: '#47A248',
    PostgreSQL: '#4169E1',
    Docker: '#2496ED',
    Kubernetes: '#326CE5',
  },
}

// =============================================================================
// API ENDPOINTS CONFIGURATION (for future backend integration)
// =============================================================================

export const apiEndpoints = {
  // These will be used when migrating to backend
  profile: '/api/profile',
  skills: '/api/skills',
  projects: '/api/projects',
  experiences: '/api/experiences',
  certifications: '/api/certifications',
  volunteer: '/api/volunteer',
  education: '/api/education',
  contact: '/api/contact',
  blog: '/api/blog',
  stats: '/api/stats',
}

// =============================================================================
// FEATURE FLAGS
// =============================================================================

export const featureFlags = {
  enableBlog: true,
  enableComments: true,
  enableAnalytics: true,
  enableNewsletter: false,
  enableDarkMode: true,
  enableAnimations: true,
  enableProgressiveWebApp: true,
  enableOfflineMode: true,
}

// =============================================================================
// ANALYTICS & TRACKING
// =============================================================================

export const analyticsConfig = {
  googleAnalytics: {
    enabled: false,
    trackingId: '', // Add your GA tracking ID
  },

  microsoftClarity: {
    enabled: false,
    projectId: '', // Add your Clarity project ID
  },

  hotjar: {
    enabled: false,
    siteId: '', // Add your Hotjar site ID
  },
}

// =============================================================================
// MISCELLANEOUS
// =============================================================================

export const miscConfig = {
  blog: {
    postsPerPage: 10,
    featuredPostsCount: 3,
    enableComments: true,
    enableSharing: true,
  },

  // Projects settings
  projects: {
    projectsPerPage: 6,
    featuredProjectsCount: 3,
    showGitHubStats: true,
  },

  // Experience settings
  experience: {
    itemsPerPage: 5,
  },

  // Certifications settings
  certifications: {
    itemsPerPage: 6,
  },

  // Contact form settings
  contactForm: {
    enableRecaptcha: false,
    recaptchaSiteKey: '', // Add your reCAPTCHA site key
  },

  // Newsletter settings
  newsletter: {
    enabled: false,
    provider: '', // 'mailchimp' | 'convertkit' | 'custom'
    apiKey: '',
  },
}

// =============================================================================
// CUSTOM ICONS (SVG Components)
// =============================================================================

export const GoLangIcon = ({ className = 'h-16 w-16 text-blue-500 m-2' }) => (
  <svg
    className={className}
    viewBox="0 0 640 512"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Go programming language"
    fill="currentColor"
  >
    <path d="M400.1 194.8C389.2 197.6 380.2 199.1 371 202.4C363.7 204.3 356.3 206.3 347.8 208.5L347.2 208.6C343 209.8 342.6 209.9 338.7 205.4C334 200.1 330.6 196.7 324.1 193.5C304.4 183.9 285.4 186.7 267.7 198.2C246.5 211.9 235.6 232.2 235.9 257.4C236.2 282.4 253.3 302.9 277.1 306.3C299.1 309.1 316.9 301.7 330.9 285.8C333 283.2 334.9 280.5 337 277.5V277.5L337 277.5C337.8 276.5 338.5 275.4 339.3 274.2H279.2C272.7 274.2 271.1 270.2 273.3 264.9C277.3 255.2 284.8 239 289.2 230.9C290.1 229.1 292.3 225.1 296.1 225.1H397.2C401.7 211.7 409 198.2 418.8 185.4C441.5 155.5 468.1 139.9 506 133.4C537.8 127.8 567.7 130.9 594.9 149.3C619.5 166.1 634.7 188.9 638.8 218.8C644.1 260.9 631.9 295.1 602.1 324.4C582.4 345.3 557.2 358.4 528.2 364.3C522.6 365.3 517.1 365.8 511.7 366.3C508.8 366.5 506 366.8 503.2 367.1C474.9 366.5 449 358.4 427.2 339.7C411.9 326.4 401.3 310.1 396.1 291.2C392.4 298.5 388.1 305.6 382.1 312.3C360.5 341.9 331.2 360.3 294.2 365.2C263.6 369.3 235.3 363.4 210.3 344.7C187.3 327.2 174.2 304.2 170.8 275.5C166.7 241.5 176.7 210.1 197.2 184.2C219.4 155.2 248.7 136.8 284.5 130.3C313.8 124.1 341.8 128.4 367.1 145.6C383.6 156.5 395.4 171.4 403.2 189.5C405.1 192.3 403.8 193.9 400.1 194.8zM48.3 200.4C47.05 200.4 46.74 199.8 47.36 198.8L53.91 190.4C54.53 189.5 56.09 188.9 57.34 188.9H168.6C169.8 188.9 170.1 189.8 169.5 190.7L164.2 198.8C163.6 199.8 162 200.7 161.1 200.7L48.3 200.4zM1.246 229.1C0 229.1-.3116 228.4 .3116 227.5L6.855 219.1C7.479 218.2 9.037 217.5 10.28 217.5H152.4C153.6 217.5 154.2 218.5 153.9 219.4L151.4 226.9C151.1 228.1 149.9 228.8 148.6 228.8L1.246 229.1zM75.72 255.9C75.1 256.8 75.41 257.7 76.65 257.7L144.6 258C145.5 258 146.8 257.1 146.8 255.9L147.4 248.4C147.4 247.1 146.8 246.2 145.5 246.2H83.2C81.95 246.2 80.71 247.1 80.08 248.1L75.72 255.9zM577.2 237.9C577 235.3 576.9 233.1 576.5 230.9C570.9 200.1 542.5 182.6 512.9 189.5C483.9 196 465.2 214.4 458.4 243.7C452.8 268 464.6 292.6 487 302.6C504.2 310.1 521.3 309.2 537.8 300.7C562.4 287.1 575.8 268 577.4 241.2C577.3 240 577.3 238.9 577.2 237.9z" />
  </svg>
)

export const FedoraIcon = ({ className = 'h-12 w-12 m-2' }) => (
  <svg
    className={className}
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Fedora Linux"
  >
    <g transform="translate(-347.05639,93.46344)">
      <path
        d="m -733.62329,72.267944 c 0,203.804876 -165.21649,369.021366 -369.02141,369.021366 -203.8048,0 -369.0213,-165.21649 -369.0213,-369.021366 0,-203.804874 165.2165,-369.021364 369.0213,-369.021364 203.80492,0 369.02141,165.21649 369.02141,369.021364 z"
        fill="#294172"
        transform="matrix(0.49053894,-0.49053894,0.49053894,0.49053894,1108.4963,-413.80382)"
      />
      <path
        d="m 622.59048,-29.496022 c -95.23181,2e-5 -172.46231,77.187025 -172.53191,172.404642 l 0,133.45241 c 0.053,21.61957 17.5724,39.14266 39.206,39.14261 l 0.1899,10e-6 133.19911,1e-5 c 95.2431,-0.0354 172.40491,-77.21746 172.40481,-172.46846 0,-95.274737 -77.19471,-172.531612 -172.46831,-172.531652 z m 50.6068,40.916035 c 6.7867,3e-5 11.641,0.76101 17.9247,2.40693 9.1541,2.39878 16.6521,9.88632 16.6578,18.62119 0,10.55597 -7.677,18.24125 -19.1279,18.24131 -5.4577,-2e-5 -7.463,-1.07679 -15.4545,-1.07678 -23.573,2e-5 -42.6482,19.11338 -42.6896,42.68952 l 10e-5,36.925907 c 0,3.33164 2.6793,6.01702 6.0169,6.01702 l 28.0586,-2e-5 c 10.4588,1e-5 18.9291,8.39152 18.9379,18.87462 0,10.49205 -8.482,18.81129 -18.9382,18.81096 l -34.0756,-1e-5 0,43.06957 3e-4,0.0634 c 0,44.71053 -36.29381,80.94558 -81.00901,80.94541 -6.7836,2e-5 -11.5832,-0.76545 -17.8611,-2.40687 -9.1575,-2.3955 -16.6553,-9.88955 -16.6578,-18.62119 0,-10.5555 7.6772,-18.24132 19.128,-18.24128 5.4517,-2e-5 7.4078,1.07677 15.3909,1.07676 23.5758,-6e-5 42.7141,-19.11569 42.7531,-42.68945 l 0,-37.11582 c 0,-3.32763 -2.6849,-6.01712 -6.0171,-6.01711 l -28.0585,-0.063 c -10.4587,-3e-5 -18.938,-8.32257 -18.938,-18.81137 -0.01,-10.55363 8.5562,-18.87455 19.1279,-18.87461 l 33.8858,7e-5 -10e-5,-42.816267 4e-4,-0.0626 c 0,-44.71697 36.22791,-80.94547 80.94541,-80.94551 z"
        fill="#ffffff"
      />
    </g>
  </svg>
)

// =============================================================================
// EXPORT ALL
// =============================================================================

const staticData = {
  personalInfo,
  socialLinks,
  navItems,
  educationData,
  seoMetadata,
  professionalInfo,
  contactInfo,
  heroData,
  alumniOf,
  footerData,
  themeConfig,
  apiEndpoints,
  featureFlags,
  analyticsConfig,
  miscConfig,
  GoLangIcon,
  FedoraIcon,
}

export default staticData
