/**
 * Dashboard and analytics-related models
 */

/**
 * Git commit data for analytics
 */
export interface CommitData {
  date: string
  count: number
}

/**
 * GitHub profile and statistics
 */
export interface GitHubData {
  name?: string
  location?: string
  bio?: string
  followers: number
  public_repos: number
}

/**
 * LeetCode profile and statistics
 */
export interface LeetCodeData {
  profile: {
    realName?: string
    ranking: number
  }
  submitStats: {
    acSubmissionNum: Array<{ count: number }>
  }
}

/**
 * Repository information
 */
export interface Repository {
  name: string
  url: string
  stars: number
}

/**
 * Consolidated dashboard data
 */
export interface DashboardData {
  github?: GitHubData
  leetcode?: LeetCodeData
  commits?: CommitData[]
  languages?: Record<string, number>
  stars?: number
  topRepos?: Repository[]
}

/**
 * Chart theme configuration
 */
export interface ChartTheme {
  text: string
  grid: string
  background: string
  primary: string
}
