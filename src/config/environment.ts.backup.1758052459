/**
 * Environment Configuration
 * Provides environment-specific settings and variables
 */

export interface EnvironmentConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  FIREBASE_PROJECT_ID: string;
  REGION: string;
  API_BASE_URL: string;
  CORS_ORIGINS: string[];
  redis?: {
    host?: string;
    port?: number;
    password?: string;
    tls?: any;
  };
  email?: {
    from?: string;
    sendgridApiKey?: string;
    resendApiKey?: string;
    user?: string;
    password?: string;
  };
  search?: {
    serperApiKey?: string;
  };
}

export const environment: EnvironmentConfig = {
  NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || 'getmycv-ai',
  REGION: process.env.FIREBASE_REGION || 'us-central1',
  API_BASE_URL: process.env.API_BASE_URL || 'https://api.cvplus.app',
  CORS_ORIGINS: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000', 'https://cvplus.app'],
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : undefined,
    password: process.env.REDIS_PASSWORD,
    tls: process.env.REDIS_TLS === 'true' ? {} : undefined
  },
  email: {
    from: process.env.EMAIL_FROM,
    sendgridApiKey: process.env.SENDGRID_API_KEY,
    resendApiKey: process.env.RESEND_API_KEY,
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD
  },
  search: {
    serperApiKey: process.env.SERPER_API_KEY
  }
};

export default environment;