/**
 * Success Prediction Types - Stub implementation
 * Note: These types should be moved to analytics or ml module
 */

export interface SuccessPrediction {
  score: number;
  confidence: number;
  factors: string[];
}

export interface PredictionResult {
  success: boolean;
  prediction?: SuccessPrediction;
  error?: string;
}