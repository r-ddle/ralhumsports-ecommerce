/**
 * SEO Validation Utility
 * Validates SEO implementation across the application
 */

export interface SEOValidationResult {
  page: string
  issues: string[]
  warnings: string[]
  score: number
  recommendations: string[]
}

export interface PageSEOCheck {
  url: string
  title?: string
  description?: string
  keywords?: string
  canonical?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  twitterCard?: string
  structuredData?: any[]
}

/**
 * Validates individual page SEO
 */
export function validatePageSEO(check: PageSEOCheck): SEOValidationResult {
  const issues: string[] = []
  const warnings: string[] = []
  const recommendations: string[] = []
  let score = 100

  // Title validation
  if (!check.title) {
    issues.push('Missing page title')
    score -= 20
  } else {
    if (check.title.length < 30) {
      warnings.push('Title is shorter than 30 characters')
      score -= 5
    }
    if (check.title.length > 60) {
      warnings.push('Title is longer than 60 characters and may be truncated')
      score -= 5
    }
    if (!check.title.toLowerCase().includes('ralhum sports sri lanka')) {
      warnings.push('Title should include primary keyword "ralhum sports sri lanka"')
      score -= 10
    }
  }

  // Description validation
  if (!check.description) {
    issues.push('Missing meta description')
    score -= 15
  } else {
    if (check.description.length < 120) {
      warnings.push('Description is shorter than 120 characters')
      score -= 3
    }
    if (check.description.length > 160) {
      warnings.push('Description is longer than 160 characters and may be truncated')
      score -= 5
    }
    if (!check.description.toLowerCase().includes('ralhumsports.lk')) {
      recommendations.push('Consider including "ralhumsports.lk" in description')
    }
  }

  // Keywords validation
  if (!check.keywords) {
    warnings.push('Missing meta keywords')
    score -= 5
  } else {
    const requiredKeywords = ['ralhumsports.lk', 'ralhum sports sri lanka', 'ralhum store']
    const missingKeywords = requiredKeywords.filter(
      (keyword) => !check.keywords!.toLowerCase().includes(keyword.toLowerCase()),
    )
    if (missingKeywords.length > 0) {
      warnings.push(`Missing target keywords: ${missingKeywords.join(', ')}`)
      score -= missingKeywords.length * 5
    }
  }

  // Canonical URL validation
  if (!check.canonical) {
    warnings.push('Missing canonical URL')
    score -= 5
  }

  // Open Graph validation
  if (!check.ogTitle) {
    warnings.push('Missing Open Graph title')
    score -= 3
  }
  if (!check.ogDescription) {
    warnings.push('Missing Open Graph description')
    score -= 3
  }
  if (!check.ogImage) {
    warnings.push('Missing Open Graph image')
    score -= 5
  }

  // Twitter Card validation
  if (!check.twitterCard) {
    warnings.push('Missing Twitter Card')
    score -= 3
  }

  // Structured Data validation
  if (!check.structuredData || check.structuredData.length === 0) {
    warnings.push('Missing structured data (Schema.org)')
    score -= 10
  }

  // Generate recommendations based on page type
  if (check.url === '/') {
    recommendations.push('Homepage should include Organization and LocalBusiness schema')
    recommendations.push('Consider adding WebSite schema with search action')
  } else if (check.url.includes('/products/')) {
    recommendations.push(
      'Product pages should include Product schema with pricing and availability',
    )
    recommendations.push('Add breadcrumb schema for better navigation')
  }

  return {
    page: check.url,
    issues,
    warnings,
    score: Math.max(0, score),
    recommendations,
  }
}

/**
 * Validates target keyword optimization
 */
export function validateKeywordOptimization(
  content: string,
  targetKeywords: string[],
): {
  keyword: string
  density: number
  occurrences: number
  recommendations: string[]
}[] {
  const wordCount = content.split(/\s+/).length

  return targetKeywords.map((keyword) => {
    const regex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
    const matches = content.match(regex) || []
    const occurrences = matches.length
    const density = (occurrences / wordCount) * 100

    const recommendations: string[] = []

    if (occurrences === 0) {
      recommendations.push(`Add "${keyword}" to the content`)
    } else if (density < 0.5) {
      recommendations.push(`Increase "${keyword}" density (currently ${density.toFixed(2)}%)`)
    } else if (density > 3) {
      recommendations.push(
        `Reduce "${keyword}" density to avoid keyword stuffing (currently ${density.toFixed(2)}%)`,
      )
    }

    return {
      keyword,
      density,
      occurrences,
      recommendations,
    }
  })
}

/**
 * Generates SEO report for multiple pages
 */
export function generateSEOReport(pageChecks: PageSEOCheck[]): {
  overallScore: number
  totalIssues: number
  totalWarnings: number
  pageResults: SEOValidationResult[]
  topRecommendations: string[]
} {
  const pageResults = pageChecks.map(validatePageSEO)

  const overallScore = Math.round(
    pageResults.reduce((sum, result) => sum + result.score, 0) / pageResults.length,
  )

  const totalIssues = pageResults.reduce((sum, result) => sum + result.issues.length, 0)
  const totalWarnings = pageResults.reduce((sum, result) => sum + result.warnings.length, 0)

  // Collect most common recommendations
  const allRecommendations = pageResults.flatMap((result) => result.recommendations)
  const recommendationCounts = allRecommendations.reduce(
    (acc, rec) => {
      acc[rec] = (acc[rec] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const topRecommendations = Object.entries(recommendationCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([rec]) => rec)

  return {
    overallScore,
    totalIssues,
    totalWarnings,
    pageResults,
    topRecommendations,
  }
}

/**
 * Core Web Vitals validation
 */
export interface CoreWebVitalsThresholds {
  LCP: { good: number; needsImprovement: number } // Largest Contentful Paint
  FID: { good: number; needsImprovement: number } // First Input Delay
  CLS: { good: number; needsImprovement: number } // Cumulative Layout Shift
}

export const DEFAULT_CWV_THRESHOLDS: CoreWebVitalsThresholds = {
  LCP: { good: 2500, needsImprovement: 4000 }, // milliseconds
  FID: { good: 100, needsImprovement: 300 }, // milliseconds
  CLS: { good: 0.1, needsImprovement: 0.25 }, // score
}

export function validateCoreWebVitals(
  metrics: { LCP: number; FID: number; CLS: number },
  thresholds = DEFAULT_CWV_THRESHOLDS,
): {
  LCP: { value: number; status: 'good' | 'needs-improvement' | 'poor'; recommendations: string[] }
  FID: { value: number; status: 'good' | 'needs-improvement' | 'poor'; recommendations: string[] }
  CLS: { value: number; status: 'good' | 'needs-improvement' | 'poor'; recommendations: string[] }
  overallStatus: 'good' | 'needs-improvement' | 'poor'
} {
  const getStatus = (
    value: number,
    threshold: { good: number; needsImprovement: number },
  ): 'good' | 'needs-improvement' | 'poor' => {
    if (value <= threshold.good) return 'good'
    if (value <= threshold.needsImprovement) return 'needs-improvement'
    return 'poor'
  }

  const LCP = {
    value: metrics.LCP,
    status: getStatus(metrics.LCP, thresholds.LCP),
    recommendations:
      metrics.LCP > thresholds.LCP.good
        ? [
            'Optimize images with next/image',
            'Use code splitting to reduce bundle size',
            'Implement proper caching headers',
          ]
        : [],
  }

  const FID = {
    value: metrics.FID,
    status: getStatus(metrics.FID, thresholds.FID),
    recommendations:
      metrics.FID > thresholds.FID.good
        ? [
            'Reduce JavaScript execution time',
            'Use React.lazy for code splitting',
            'Optimize third-party scripts',
          ]
        : [],
  }

  const CLS = {
    value: metrics.CLS,
    status: getStatus(metrics.CLS, thresholds.CLS),
    recommendations:
      metrics.CLS > thresholds.CLS.good
        ? [
            'Add size attributes to images',
            'Avoid inserting content above existing content',
            'Use CSS transforms for animations',
          ]
        : [],
  }

  const statuses = [LCP.status, FID.status, CLS.status]
  const overallStatus = statuses.includes('poor')
    ? 'poor'
    : statuses.includes('needs-improvement')
      ? 'needs-improvement'
      : 'good'

  return { LCP, FID, CLS, overallStatus }
}
