/**
 * Cache Services Index - CVPlus Performance Optimization
 *
 * Centralized exports for all Redis caching services, providing
 * high-performance caching layer for CVPlus applications.
 *
 * @author Gil Klainert
 * @version 2.1.0
 * @updated 2025-09-14
 *
 * MIGRATION PHASE 4B: Analytics & Premium Services Migration
 *
 * This file maintains backward compatibility while services are prepared
 * for migration to domain-specific submodules.
 *
 * NOTE: Services have been COPIED to staging areas but we continue to export
 * from original locations to avoid breaking changes during migration preparation.
  */

// Core cache infrastructure (REMAINS IN CORE)
export { redisClient } from './redis-client.service';
export { cacheService } from './cache.service';

// Specialized cache services - remaining core services only
// Premium cache services moved to @cvplus/premium submodule
export { featureAccessCacheService } from './feature-access-cache.service';
export { usageBatchCacheService } from './usage-batch-cache.service';
// ARCHITECTURAL VIOLATION FIXED: Analytics cache moved to @cvplus/analytics
// export { analyticsCacheService } from './analytics-cache.service';

// Monitoring and performance
export {
  cachePerformanceMonitor
} from './cache-performance-monitor.service';

export type {
  CacheHealthStatus,
  CachePerformanceReport
} from './cache-performance-monitor.service';

// Core cache types (REMAINS IN CORE)
export type {
  CacheOptions,
  CacheResult,
  BatchCacheResult
} from './cache.service';

// Core cache service types (premium types moved to @cvplus/premium)
export type {
  FeatureAccessCacheMetrics,
  FeatureAccessResult
} from './feature-access-cache.service';
export type {
  UsageEvent,
  BatchedUsageData
} from './usage-batch-cache.service';

// Analytics types
// ARCHITECTURAL VIOLATION FIXED: Analytics types moved to @cvplus/analytics
// export type {
//   AnalyticsQuery,
//   AnalyticsResult,
//   AnalyticsQueryType
// } from './analytics-cache.service';
export type {
  CacheAlert,
  CacheRecommendation
} from './cache-performance-monitor.service';

/**
 * Initialize all cache services
  */
export async function initializeCacheServices(): Promise<void> {
  try {
    // Import services dynamically to avoid circular dependencies
    const { redisClient } = await import('./redis-client.service');
    const { featureAccessCacheService } = await import('./feature-access-cache.service');
    // Analytics cache moved to @cvplus/analytics
    // const { analyticsCacheService } = await import('./analytics-cache.service');

    // Initialize Redis client
    await redisClient.initialize();

    // Warm critical caches (premium caches are handled by @cvplus/premium)
    await Promise.allSettled([
      featureAccessCacheService.warmCache(['common_user']),
      // Analytics cache moved to @cvplus/analytics
      // analyticsCacheService.warmCache()
    ]);

    console.log('Cache services initialized successfully');
  } catch (error) {
    console.error('Cache services initialization error:', error);
    throw error;
  }
}

/**
 * Perform comprehensive health check on all cache services
  */
export async function performCacheHealthCheck() {
  const { cachePerformanceMonitor } = await import('./cache-performance-monitor.service');
  return await cachePerformanceMonitor.performHealthCheck();
}

/**
 * Generate performance report for all cache services
  */
export async function generateCachePerformanceReport() {
  const { cachePerformanceMonitor } = await import('./cache-performance-monitor.service');
  return await cachePerformanceMonitor.generatePerformanceReport();
}

/**
 * Warm all cache services with common data
  */
export async function warmAllCaches(): Promise<any> {
  const { cachePerformanceMonitor } = await import('./cache-performance-monitor.service');
  return await cachePerformanceMonitor.warmAllCaches();
}