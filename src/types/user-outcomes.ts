/**
 * User Outcomes Types - Stub implementation
 * Note: These types should be moved to analytics module
 */

export interface UserOutcome {
  userId: string;
  outcomeType: string;
  timestamp: Date;
  metrics?: Record<string, any>;
}