/**
 * ML Pipeline Types - Stub implementation
 * Note: These types should be moved to analytics or ml module
 */

export interface MLPipeline {
  id: string;
  name: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
}

export interface MLModel {
  id: string;
  name: string;
  version: string;
  accuracy?: number;
}