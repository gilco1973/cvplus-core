/**
 * T046: Performance metrics collector in packages/core/src/logging/PerformanceCollector.ts
 *
 * Advanced performance metrics collection system that gathers, analyzes, and reports
 * performance data across the CVPlus ecosystem. Provides comprehensive monitoring
 * for response times, resource usage, and system efficiency.
 */

import { LoggerFactory } from './LoggerFactory';
import { LogDomain } from '../types';

/**
 * Performance metric types
 */
export enum MetricType {
  RESPONSE_TIME = 'response_time',
  THROUGHPUT = 'throughput',
  ERROR_RATE = 'error_rate',
  CPU_USAGE = 'cpu_usage',
  MEMORY_USAGE = 'memory_usage',
  DISK_IO = 'disk_io',
  NETWORK_IO = 'network_io',
  DATABASE_QUERY = 'database_query',
  CACHE_HIT_RATE = 'cache_hit_rate',
  API_LATENCY = 'api_latency',
  CUSTOM = 'custom'
}

/**
 * Metric unit types
 */
export enum MetricUnit {
  MILLISECONDS = 'ms',
  SECONDS = 's',
  MINUTES = 'min',
  BYTES = 'bytes',
  KILOBYTES = 'kb',
  MEGABYTES = 'mb',
  PERCENTAGE = '%',
  COUNT = 'count',
  RATE_PER_SECOND = 'rps',
  RATE_PER_MINUTE = 'rpm'
}

/**
 * Performance metric data point
 */
export interface PerformanceMetric {
  id: string;
  name: string;
  type: MetricType;
  value: number;
  unit: MetricUnit;
  timestamp: number;
  tags: Record<string, string>;
  context: {
    service?: string;
    endpoint?: string;
    userId?: string;
    sessionId?: string;
    correlationId?: string;
    environment?: string;
    version?: string;
  };
  duration?: number; // For time-based metrics
  metadata?: Record<string, any>;
}

/**
 * Aggregated metric statistics
 */
export interface MetricStats {
  count: number;
  sum: number;
  min: number;
  max: number;
  avg: number;
  median: number;
  p95: number;
  p99: number;
  stdDev: number;
  timeWindow: string;
  firstSample: number;
  lastSample: number;
}

/**
 * Performance alert threshold
 */
interface PerformanceThreshold {
  metricName: string;
  threshold: number;
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
}

/**
 * Timer for measuring performance
 */
export class PerformanceTimer {
  private startTime: number;
  private endTime?: number;
  private name: string;
  private tags: Record<string, string>;

  constructor(name: string, tags: Record<string, string> = {}) {
    this.name = name;
    this.tags = tags;
    this.startTime = Date.now();
  }

  /**
   * Stop the timer and return duration
   */
  stop(): number {
    this.endTime = Date.now();
    return this.getDuration();
  }

  /**
   * Get current duration
   */
  getDuration(): number {
    const endTime = this.endTime || Date.now();
    return endTime - this.startTime;
  }

  /**
   * Get timer metadata
   */
  getMetadata(): { name: string; tags: Record<string, string>; startTime: number; endTime?: number } {
    return {
      name: this.name,
      tags: this.tags,
      startTime: this.startTime,
      endTime: this.endTime
    };
  }
}

/**
 * Performance metrics collector
 */
export class PerformanceCollector {
  private logger = LoggerFactory.createLogger('performance-collector');
  private metrics: Map<string, PerformanceMetric[]> = new Map();
  private activeTimers: Map<string, PerformanceTimer> = new Map();
  private thresholds: PerformanceThreshold[] = [];
  private flushInterval: number = 60000; // 1 minute
  private maxMetricsPerType: number = 1000;
  private flushTimer?: NodeJS.Timeout;

  constructor(options: {
    flushInterval?: number;
    maxMetricsPerType?: number;
    enableAutoFlush?: boolean;
  } = {}) {
    this.flushInterval = options.flushInterval || 60000;
    this.maxMetricsPerType = options.maxMetricsPerType || 1000;

    if (options.enableAutoFlush !== false) {
      this.startAutoFlush();
    }
  }

  /**
   * Record a performance metric
   */
  recordMetric(metric: Omit<PerformanceMetric, 'id' | 'timestamp'>): string {
    const fullMetric: PerformanceMetric = {
      ...metric,
      id: this.generateMetricId(),
      timestamp: Date.now()
    };

    // Store metric
    const key = this.getMetricKey(metric.name, metric.type);
    if (!this.metrics.has(key)) {
      this.metrics.set(key, []);
    }

    const metricArray = this.metrics.get(key)!;
    metricArray.push(fullMetric);

    // Trim if too many metrics
    if (metricArray.length > this.maxMetricsPerType) {
      metricArray.splice(0, metricArray.length - this.maxMetricsPerType);
    }

    // Check thresholds
    this.checkThresholds(fullMetric);

    // Log metric at debug level
    this.logger.debug('Performance metric recorded', {
      domain: LogDomain.PERFORMANCE,
      event: 'METRIC_RECORDED',
      metricId: fullMetric.id,
      metricName: fullMetric.name,
      metricType: fullMetric.type,
      value: fullMetric.value,
      unit: fullMetric.unit
    });

    return fullMetric.id;
  }

  /**
   * Start a performance timer
   */
  startTimer(name: string, tags: Record<string, string> = {}): string {
    const timerId = this.generateTimerId(name);
    const timer = new PerformanceTimer(name, tags);
    this.activeTimers.set(timerId, timer);

    this.logger.debug('Performance timer started', {
      domain: LogDomain.PERFORMANCE,
      event: 'TIMER_STARTED',
      timerId,
      timerName: name,
      tags
    });

    return timerId;
  }

  /**
   * Stop a performance timer and record the metric
   */
  stopTimer(timerId: string, additionalContext?: Record<string, any>): PerformanceMetric | null {
    const timer = this.activeTimers.get(timerId);
    if (!timer) {
      this.logger.warn('Timer not found', {
        domain: LogDomain.PERFORMANCE,
        event: 'TIMER_NOT_FOUND',
        timerId
      });
      return null;
    }

    const duration = timer.stop();
    this.activeTimers.delete(timerId);

    // Record as metric
    const metricId = this.recordMetric({
      name: timer.getMetadata().name,
      type: MetricType.RESPONSE_TIME,
      value: duration,
      unit: MetricUnit.MILLISECONDS,
      tags: timer.getMetadata().tags,
      context: additionalContext || {},
      duration,
      metadata: {
        timerId,
        startTime: timer.getMetadata().startTime,
        endTime: timer.getMetadata().endTime
      }
    });

    // Get the recorded metric
    const metric = this.findMetricById(metricId);

    this.logger.debug('Performance timer stopped', {
      domain: LogDomain.PERFORMANCE,
      event: 'TIMER_STOPPED',
      timerId,
      duration,
      metricId
    });

    return metric;
  }

  /**
   * Record response time metric
   */
  recordResponseTime(
    name: string,
    duration: number,
    context: Record<string, any> = {},
    tags: Record<string, string> = {}
  ): string {
    return this.recordMetric({
      name,
      type: MetricType.RESPONSE_TIME,
      value: duration,
      unit: MetricUnit.MILLISECONDS,
      tags,
      context,
      duration
    });
  }

  /**
   * Record throughput metric
   */
  recordThroughput(
    name: string,
    requestCount: number,
    timeWindowMs: number,
    tags: Record<string, string> = {}
  ): string {
    const rps = requestCount / (timeWindowMs / 1000);
    return this.recordMetric({
      name,
      type: MetricType.THROUGHPUT,
      value: rps,
      unit: MetricUnit.RATE_PER_SECOND,
      tags,
      metadata: {
        requestCount,
        timeWindowMs
      },
      context: {}
    });
  }

  /**
   * Record error rate metric
   */
  recordErrorRate(
    name: string,
    errorCount: number,
    totalCount: number,
    tags: Record<string, string> = {}
  ): string {
    const errorRate = totalCount > 0 ? (errorCount / totalCount) * 100 : 0;
    return this.recordMetric({
      name,
      type: MetricType.ERROR_RATE,
      value: errorRate,
      unit: MetricUnit.PERCENTAGE,
      tags,
      metadata: {
        errorCount,
        totalCount
      },
      context: {}
    });
  }

  /**
   * Record memory usage metric
   */
  recordMemoryUsage(
    name: string,
    memoryUsedBytes: number,
    tags: Record<string, string> = {}
  ): string {
    return this.recordMetric({
      name,
      type: MetricType.MEMORY_USAGE,
      value: memoryUsedBytes,
      unit: MetricUnit.BYTES,
      tags,
      context: {}
    });
  }

  /**
   * Record database query performance
   */
  recordDatabaseQuery(
    queryName: string,
    duration: number,
    resultCount?: number,
    tags: Record<string, string> = {}
  ): string {
    return this.recordMetric({
      name: queryName,
      type: MetricType.DATABASE_QUERY,
      value: duration,
      unit: MetricUnit.MILLISECONDS,
      tags,
      metadata: {
        resultCount
      },
      context: {},
      duration
    });
  }

  /**
   * Record cache hit rate
   */
  recordCacheHitRate(
    cacheName: string,
    hits: number,
    total: number,
    tags: Record<string, string> = {}
  ): string {
    const hitRate = total > 0 ? (hits / total) * 100 : 0;
    return this.recordMetric({
      name: cacheName,
      type: MetricType.CACHE_HIT_RATE,
      value: hitRate,
      unit: MetricUnit.PERCENTAGE,
      tags,
      metadata: {
        hits,
        misses: total - hits,
        total
      },
      context: {}
    });
  }

  /**
   * Get metrics for a specific name and type
   */
  getMetrics(name: string, type: MetricType, limit?: number): PerformanceMetric[] {
    const key = this.getMetricKey(name, type);
    const metrics = this.metrics.get(key) || [];

    if (limit && limit > 0) {
      return metrics.slice(-limit);
    }

    return [...metrics];
  }

  /**
   * Get aggregated statistics for metrics
   */
  getMetricStats(name: string, type: MetricType, timeWindow?: string): MetricStats | null {
    const metrics = this.getMetrics(name, type);
    if (metrics.length === 0) {
      return null;
    }

    // Filter by time window if specified
    let filteredMetrics = metrics;
    if (timeWindow) {
      const now = Date.now();
      const windowMs = this.parseTimeWindow(timeWindow);
      if (windowMs > 0) {
        filteredMetrics = metrics.filter(m => now - m.timestamp <= windowMs);
      }
    }

    if (filteredMetrics.length === 0) {
      return null;
    }

    const values = filteredMetrics.map(m => m.value).sort((a, b) => a - b);
    const sum = values.reduce((acc, val) => acc + val, 0);
    const avg = sum / values.length;

    // Calculate standard deviation
    const variance = values.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    // Ensure we have values (already checked above, but make TypeScript happy)
    if (values.length === 0 || filteredMetrics.length === 0) {
      return null;
    }

    return {
      count: filteredMetrics.length,
      sum,
      min: values[0]!,
      max: values[values.length - 1]!,
      avg,
      median: this.calculatePercentile(values, 0.5),
      p95: this.calculatePercentile(values, 0.95),
      p99: this.calculatePercentile(values, 0.99),
      stdDev,
      timeWindow: timeWindow || 'all',
      firstSample: filteredMetrics[0]!.timestamp,
      lastSample: filteredMetrics[filteredMetrics.length - 1]!.timestamp
    };
  }

  /**
   * Get all metric names and types
   */
  getAvailableMetrics(): Array<{ name: string; type: MetricType; count: number }> {
    const result: Array<{ name: string; type: MetricType; count: number }> = [];

    this.metrics.forEach((metrics, key) => {
      const [name, type] = this.parseMetricKey(key);
      result.push({
        name,
        type: type as MetricType,
        count: metrics.length
      });
    });

    return result;
  }

  /**
   * Set performance threshold for alerting
   */
  setThreshold(threshold: PerformanceThreshold): void {
    // Remove existing threshold for the same metric
    this.thresholds = this.thresholds.filter(t => t.metricName !== threshold.metricName);
    this.thresholds.push(threshold);

    this.logger.info('Performance threshold set', {
      domain: LogDomain.PERFORMANCE,
      event: 'THRESHOLD_SET',
      metricName: threshold.metricName,
      threshold: threshold.threshold,
      operator: threshold.operator,
      severity: threshold.severity
    });
  }

  /**
   * Remove performance threshold
   */
  removeThreshold(metricName: string): void {
    this.thresholds = this.thresholds.filter(t => t.metricName !== metricName);

    this.logger.info('Performance threshold removed', {
      domain: LogDomain.PERFORMANCE,
      event: 'THRESHOLD_REMOVED',
      metricName
    });
  }

  /**
   * Flush metrics to persistent storage or external systems
   */
  flush(): void {
    const totalMetrics = Array.from(this.metrics.values()).reduce((sum, arr) => sum + arr.length, 0);

    if (totalMetrics === 0) {
      return;
    }

    this.logger.info('Flushing performance metrics', {
      domain: LogDomain.PERFORMANCE,
      event: 'METRICS_FLUSH',
      totalMetrics,
      metricTypes: this.metrics.size,
      activeTimers: this.activeTimers.size
    });

    // In a real implementation, you would:
    // 1. Send metrics to external monitoring systems (Prometheus, DataDog, etc.)
    // 2. Store metrics in time-series database
    // 3. Update dashboards and alerts

    // For now, we'll just log summary statistics
    this.metrics.forEach((_, key) => {
      const [name, type] = this.parseMetricKey(key);
      const stats = this.getMetricStats(name, type as MetricType, '1h');

      if (stats) {
        this.logger.debug('Metric summary', {
          domain: LogDomain.PERFORMANCE,
          event: 'METRIC_SUMMARY',
          metricName: name,
          metricType: type,
          ...stats
        });
      }
    });
  }

  /**
   * Clear all collected metrics
   */
  clear(): void {
    this.metrics.clear();
    this.activeTimers.clear();

    this.logger.info('Performance metrics cleared', {
      domain: LogDomain.PERFORMANCE,
      event: 'METRICS_CLEARED'
    });
  }

  /**
   * Stop the collector and clean up resources
   */
  stop(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = undefined;
    }

    // Final flush
    this.flush();
    this.clear();
  }

  /**
   * Start automatic flushing
   */
  private startAutoFlush(): void {
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  /**
   * Check if metric exceeds any thresholds
   */
  private checkThresholds(metric: PerformanceMetric): void {
    const applicableThresholds = this.thresholds.filter(
      t => t.enabled && t.metricName === metric.name
    );

    for (const threshold of applicableThresholds) {
      let violated = false;

      switch (threshold.operator) {
        case 'gt':
          violated = metric.value > threshold.threshold;
          break;
        case 'gte':
          violated = metric.value >= threshold.threshold;
          break;
        case 'lt':
          violated = metric.value < threshold.threshold;
          break;
        case 'lte':
          violated = metric.value <= threshold.threshold;
          break;
        case 'eq':
          violated = metric.value === threshold.threshold;
          break;
      }

      if (violated) {
        this.logger.warn('Performance threshold exceeded', {
          domain: LogDomain.PERFORMANCE,
          event: 'THRESHOLD_EXCEEDED',
          metricId: metric.id,
          metricName: metric.name,
          metricValue: metric.value,
          threshold: threshold.threshold,
          operator: threshold.operator,
          severity: threshold.severity
        });
      }
    }
  }

  /**
   * Find a metric by ID
   */
  private findMetricById(metricId: string): PerformanceMetric | null {
    for (const metrics of this.metrics.values()) {
      const metric = metrics.find(m => m.id === metricId);
      if (metric) {
        return metric;
      }
    }
    return null;
  }

  /**
   * Calculate percentile from sorted values
   */
  private calculatePercentile(sortedValues: number[], percentile: number): number {
    if (sortedValues.length === 0) {
      return 0;
    }

    const index = (sortedValues.length - 1) * percentile;
    const lower = Math.floor(index);
    const upper = Math.ceil(index);

    if (lower === upper) {
      return sortedValues[lower] ?? 0;
    }

    const weight = index - lower;
    const lowerValue = sortedValues[lower] ?? 0;
    const upperValue = sortedValues[upper] ?? 0;
    return lowerValue * (1 - weight) + upperValue * weight;
  }

  /**
   * Parse time window string to milliseconds
   */
  private parseTimeWindow(timeWindow: string): number {
    const match = timeWindow.match(/^(\d+)([smhd])$/);
    if (!match || !match[1] || !match[2]) {
      return 0;
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's': return value * 1000;
      case 'm': return value * 60 * 1000;
      case 'h': return value * 60 * 60 * 1000;
      case 'd': return value * 24 * 60 * 60 * 1000;
      default: return 0;
    }
  }

  /**
   * Generate metric key for storage
   */
  private getMetricKey(name: string, type: MetricType): string {
    return `${name}:${type}`;
  }

  /**
   * Parse metric key back to name and type
   */
  private parseMetricKey(key: string): [string, string] {
    const parts = key.split(':');
    return [parts[0] || '', parts[1] || ''];
  }

  /**
   * Generate unique metric ID
   */
  private generateMetricId(): string {
    return `metric_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  /**
   * Generate unique timer ID
   */
  private generateTimerId(name: string): string {
    return `timer_${name}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}