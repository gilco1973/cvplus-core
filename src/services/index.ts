/**
 * Shared Services Index - Enhanced Service Layer Architecture
 *
 * Centralized exports for all shared service components, including
 * enhanced base services, mixins, and utilities.
 *
 * @author Gil Klainert
 * @version 2.1.0
 * @updated 2025-09-14
 *
 * MIGRATION PHASE 4B: Analytics & Premium Services Migration
 * Staging areas prepared for domain services migration
 */

// Core service architecture
export { BaseService, ServiceConfig, ServiceHealth } from './base-service';
export { EnhancedBaseService, EnhancedServiceConfig } from './enhanced-base-service';
export { Logger, LogLevel, LogContext } from './logger';
export { ServiceRegistry } from './service-registry';

// Mixins for common functionality
export {
  CacheableMixin,
  CacheOptions,
  CacheResult,
  CacheMetricsData,
  createCacheableMixin
} from './cache-mixin';
export {
  DatabaseMixin,
  DatabaseOptions,
  QueryResult,
  QueryFilter,
  DatabaseOperation,
  DatabaseError,
  createDatabaseMixin
} from './database-mixin';
export {
  ApiClientMixin,
  ApiClientOptions,
  ApiRequestOptions,
  ApiResponse,
  ApiError,
  RateLimitState,
  createApiClientMixin
} from './api-client-mixin';

// Cache services (re-exports from cache index)
export * from './cache';

// MIGRATION PHASE 4B: Domain Services Staging
// The following services have been COPIED to staging areas for migration preparation:
//
// Analytics Domain (staging-for-submodules/analytics/services/):
// - analytics-cache.service.ts
// - cache-performance-monitor.service.ts
//
// Premium Domain (staging-for-submodules/premium/services/):
// - subscription-cache.service.ts
// - pricing-cache.service.ts
// - feature-access-cache.service.ts
// - usage-batch-cache.service.ts
//
// External Data Domain (staging-for-submodules/external-data/services/):
// - Complete external-data/ directory with adapters and enrichment services
//
// NOTE: Original exports maintained for backward compatibility.
// Staging areas prepared for future submodule migration.

// Service factory functions
export function createServiceRegistry(): ServiceRegistry {
  return ServiceRegistry.getInstance({
    autoInitialize: true,
    healthCheckInterval: 60000
  });
}

/**
 * Initialize enhanced services with common patterns
 */
export async function initializeEnhancedServices(): Promise<void> {
  const registry = createServiceRegistry();

  // Services will be registered by their respective modules
  // This function provides a common initialization pattern

  await registry.initializeAll();
  console.log('Enhanced services initialized successfully');
}

/**
 * Perform health check on all registered services
 */
export async function performServicesHealthCheck(): Promise<Record<string, ServiceHealth>> {
  const registry = ServiceRegistry.getInstance();
  return await registry.getHealthStatus();
}

/**
 * Cleanup all services (for graceful shutdown)
 */
export async function cleanupAllServices(): Promise<void> {
  const registry = ServiceRegistry.getInstance();
  await registry.cleanupAll();
  console.log('All services cleaned up successfully');
}