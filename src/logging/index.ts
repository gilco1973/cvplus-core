/**
 * CVPlus Core Logging Module
 * Comprehensive logging system for CVPlus platform
 *
 * Exports:
 * - LoggerFactory: Create and manage logger instances
 * - CorrelationService: Track requests across services
 * - PiiRedaction: Automatically redact sensitive information
 * - LogFormatter: Format logs for different outputs
 * - FirebaseTransport: Custom Winston transport for Firebase Cloud Logging
 * - LogStream: Real-time log streaming and filtering
 * - AlertRule: Intelligent alerting system for log events
 * - AuditTrail: Compliance-focused audit logging
 * - LogArchive: Long-term log storage and archival
 * - Types: TypeScript interfaces and enums
 */

// Core services
export { LoggerFactory } from './LoggerFactory';
export { CorrelationService } from './CorrelationService';
export { PiiRedaction } from './PiiRedaction';
export { LogFormatter } from './LogFormatter';

// Import for internal use in this file
import { LoggerFactory } from './LoggerFactory';
import { CorrelationService } from './CorrelationService';

// Firebase integration
export { FirebaseTransport } from './FirebaseTransport';
export type { FirebaseTransportOptions } from './FirebaseTransport';

// Data models and systems (classes only, not conflicting with interface names)
export { LogStreamManager, globalStreamManager } from './LogStream';
export { AlertRuleManager, globalAlertManager } from './AlertRule';
export { globalAuditTrail } from './AuditTrail';
export { LogArchive, globalLogArchive } from './LogArchive';

// Types and interfaces (includes LogStream, AlertRule, AuditTrail interfaces)
export * from './types';

// Re-export classes with different names to avoid conflicts
export { LogStream as LogStreamClass } from './LogStream';
export { AlertRule as AlertRuleClass } from './AlertRule';
export { AuditTrail as AuditTrailClass } from './AuditTrail';

// Enums for data models
export { AlertConditionType } from './AlertRule';
export { AuditEventType } from './AuditTrail';
export { ArchiveStorageType, CompressionType } from './LogArchive';

// Package logger factory and implementations
export { default as PackageLoggerFactory } from './PackageLoggerFactory';
export {
  BasePackageLogger,
  AnalyticsLogger,
  PremiumLogger,
  RecommendationsLogger,
  ProfilesLogger,
  AdminLogger,
  WorkflowLogger,
  PaymentsLogger,
  createPackageLogger,
  analyticsLogger,
  premiumLogger,
  recommendationsLogger,
  profilesLogger,
  adminLogger,
  workflowLogger,
  paymentsLogger,
  packageLogging
} from './PackageLoggerFactory';

// Re-export commonly used types for convenience
export type {
  Logger,
  LoggerConfig,
  LogEntry,
  LogStream,
  AlertRule,
  AuditEntry,
  PiiRedactionConfig,
  TransportConfig
} from './types';

export {
  LogLevel,
  LogDomain
} from './types';

// Import LogLevel and Logger for internal use in this file
import { LogLevel, Logger } from './types';

/**
 * Quick start utility for creating a logger with sensible defaults
 */
export function createLogger(serviceName: string, level: LogLevel = LogLevel.INFO): Logger {
  return LoggerFactory.createLogger(serviceName, { level });
}

/**
 * Express middleware for automatic correlation ID handling
 */
export const correlationMiddleware = CorrelationService.middleware();

/**
 * Default logger instance for immediate use
 */
export const logger: Logger = LoggerFactory.createLogger('@cvplus/core');

/**
 * Version information
 */
export const VERSION = '1.0.0';