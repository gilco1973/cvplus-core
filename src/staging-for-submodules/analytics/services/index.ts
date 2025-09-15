/**
 * Analytics Services - Staging for Migration
 *
 * This staging area contains analytics and performance monitoring services
 * that will be moved to the @cvplus/analytics submodule.
 *
 * Domain: Analytics, Performance Monitoring, Metrics
 * Target Submodule: @cvplus/analytics
 * Migration Phase: 4B
 */

// Analytics cache services - only export what actually exists
export { analyticsCacheService } from './analytics-cache.service';
export { cachePerformanceMonitor } from './cache-performance-monitor.service';

// Type exports - only export what actually exists
export type {
  AnalyticsQuery,
  AnalyticsQueryType,
  AnalyticsResult,
  AnalyticsCacheMetrics
} from './analytics-cache.service';

export type {
  CacheHealthStatus,
  CachePerformanceReport,
  CacheAlert,
  CacheRecommendation
} from './cache-performance-monitor.service';

// Note: Utility functions will be exported once they are properly implemented in the services