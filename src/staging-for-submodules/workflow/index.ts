/**
 * Workflow Domain - Re-exports for backward compatibility
 *
 * This module will be migrated to @cvplus/workflow submodule
 * All imports should be updated to use @cvplus/workflow/backend
 */

// Timeline services
export * from './services/timeline-generation.service';
export * from './services/timeline-generation-v2.service';
export * from './services/calendar-integration.service';

// Timeline framework
export * from './timeline/timeline-processor.service';
export * from './timeline/timeline-processor-core.service';
export * from './timeline/timeline-processor-events.service';
export * from './timeline/timeline-processor-insights.service';
export * from './timeline/timeline-sanitizer.service';
export * from './timeline/timeline-sanitizer-core.service';
export * from './timeline/timeline-storage.service';
export * from './timeline/timeline-utils.service';
export * from './timeline/timeline-utils-core.service';
export * from './timeline/timeline-validator.service';

// Timeline types
export * from './types/timeline.types';