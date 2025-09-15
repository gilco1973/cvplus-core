/**
 * Secure Environment Configuration System
 * Provides comprehensive validation, sanitization, and security for environment variables
 */

import * as functions from 'firebase-functions';
import { config as loadDotenv } from 'dotenv';
import * as path from 'path';

// Load environment variables from .env file
// This must happen before any validation or configuration loading
if (process.env.NODE_ENV !== 'production') {
  const envPath = path.resolve(__dirname, '../../.env');
  loadDotenv({ path: envPath });

  // Log successful env loading for debugging
  if (process.env.PROJECT_ID) {
    functions.logger.info('Environment variables loaded successfully from .env file');
  }
}

// Security event types for monitoring
export enum SecurityEventType {
  MISSING_REQUIRED_VAR = 'MISSING_REQUIRED_VAR',
  INVALID_FORMAT = 'INVALID_FORMAT',
  SUSPICIOUS_VALUE = 'SUSPICIOUS_VALUE',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  CONFIG_ACCESS_ATTEMPT = 'CONFIG_ACCESS_ATTEMPT',
  WEAK_API_KEY = 'WEAK_API_KEY'
}

// Configuration validation result
interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Security logger for configuration issues
class SecurityLogger {
  static logSecurityEvent(
    event: SecurityEventType,
    details: Record<string, any> = {},
    sensitive = false
  ): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      severity: SecurityLogger.getSeverity(event),
      ...(!sensitive && details) // Only log details if not sensitive
    };

    if (logEntry.severity === 'CRITICAL') {
      functions.logger.error('Security Event', logEntry);
    } else {
      functions.logger.warn('Security Event', logEntry);
    }
  }

  private static getSeverity(event: SecurityEventType): 'CRITICAL' | 'HIGH' | 'MEDIUM' {
    const criticalEvents = [
      SecurityEventType.MISSING_REQUIRED_VAR,
      SecurityEventType.SUSPICIOUS_VALUE,
      SecurityEventType.WEAK_API_KEY
    ];
    return criticalEvents.includes(event) ? 'CRITICAL' : 'HIGH';
  }
}

// Environment validation utilities
class EnvironmentValidator {
  // Sanitize string values
  static sanitizeString(value: string | undefined): string | undefined {
    if (!value || typeof value !== 'string') return undefined;

    // Remove potentially dangerous characters
    const sanitized = value.trim().replace(/[<>'"]/g, '');

    return sanitized || undefined;
  }

  // Cryptographically validate API key format and strength
  static validateApiKey(value: string | undefined, keyName: string): string | undefined {
    if (!value) return undefined;

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /script/i,
      /javascript/i,
      /eval/i,
      /<[^>]*>/,
      /['"`]/
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(value)) {
        SecurityLogger.logSecurityEvent(
          SecurityEventType.SUSPICIOUS_VALUE,
          { keyName, reason: 'Contains suspicious patterns' },
          true
        );
        return undefined;
      }
    }

    // Cryptographic validation - check entropy and format patterns
    if (!EnvironmentValidator.validateApiKeyEntropy(value, keyName)) {
      return undefined;
    }

    // Provider-specific format validation
    if (!EnvironmentValidator.validateApiKeyFormat(value, keyName)) {
      return undefined;
    }

    return value;
  }

  // Validate API key entropy for cryptographic strength
  private static validateApiKeyEntropy(value: string, keyName: string): boolean {
    // Basic length requirements by provider type
    const minLengths: Record<string, number> = {
      'OPENAI_API_KEY': 51,          // OpenAI keys start with "sk-" and are 51 chars
      'STRIPE_SECRET_KEY': 32,       // Stripe secret keys are 32+ chars
      'ELEVENLABS_API_KEY': 32,      // ElevenLabs keys are 32+ chars
      'DID_API_KEY': 32,            // D-ID keys are 32+ chars
      'SYNTHESIA_API_KEY': 32,      // Synthesia keys are 32+ chars
      'HEYGEN_API_KEY': 32,         // HeyGen keys are 32+ chars
      'RUNWAYML_API_KEY': 32,       // RunwayML keys are 32+ chars
      'SERPER_API_KEY': 32,         // Serper keys are 32+ chars
      'PINECONE_API_KEY': 36,       // Pinecone keys are typically 36+ chars
      'SENDGRID_API_KEY': 69,       // SendGrid keys start with "SG." and are 69 chars
      'RESEND_API_KEY': 32,         // Resend keys are 32+ chars
      'WEB_API_KEY': 32,            // Firebase web API keys are 32+ chars
    };

    const minLength = minLengths[keyName] || 32;

    if (value.length < minLength) {
      SecurityLogger.logSecurityEvent(
        SecurityEventType.WEAK_API_KEY,
        { keyName, reason: `Length ${value.length} below minimum ${minLength}` },
        true
      );
      return false;
    }

    // Check character diversity for entropy
    const uniqueChars = new Set(value).size;
    const minUniqueChars = Math.max(8, Math.floor(value.length * 0.3));

    if (uniqueChars < minUniqueChars) {
      SecurityLogger.logSecurityEvent(
        SecurityEventType.WEAK_API_KEY,
        { keyName, reason: 'Low character entropy' },
        true
      );
      return false;
    }

    return true;
  }

  // Validate API key format patterns by provider
  private static validateApiKeyFormat(value: string, keyName: string): boolean {
    const formatPatterns: Record<string, RegExp> = {
      'OPENAI_API_KEY': /^sk-[a-zA-Z0-9]{48}$/,
      'STRIPE_SECRET_KEY': /^sk_(test_|live_)?[a-zA-Z0-9]{24,}$/,
      'ELEVENLABS_API_KEY': /^[a-f0-9]{32}$/i,
      'SENDGRID_API_KEY': /^SG\.[a-zA-Z0-9_-]{22}\.[a-zA-Z0-9_-]{43}$/,
      'PINECONE_API_KEY': /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i
    };

    const pattern = formatPatterns[keyName];
    if (pattern && !pattern.test(value)) {
      SecurityLogger.logSecurityEvent(
        SecurityEventType.INVALID_FORMAT,
        { keyName, reason: 'Invalid format pattern' },
        true
      );
      return false;
    }

    return true;
  }

  // Validate URL format
  static validateUrl(value: string | undefined, allowedHosts: string[] = []): string | undefined {
    if (!value) return undefined;

    try {
      const url = new URL(value);

      // Only allow https in production
      if (process.env.NODE_ENV === 'production' && url.protocol !== 'https:') {
        SecurityLogger.logSecurityEvent(
          SecurityEventType.INVALID_FORMAT,
          { reason: 'HTTP not allowed in production' }
        );
        return undefined;
      }

      // Check allowed hosts if specified
      if (allowedHosts.length > 0 && !allowedHosts.includes(url.hostname)) {
        SecurityLogger.logSecurityEvent(
          SecurityEventType.INVALID_FORMAT,
          { reason: 'Host not in allowlist', hostname: url.hostname }
        );
        return undefined;
      }

      return value;
    } catch (error) {
      SecurityLogger.logSecurityEvent(
        SecurityEventType.INVALID_FORMAT,
        { reason: 'Invalid URL format', error: (error as Error).message }
      );
      return undefined;
    }
  }

  // Validate email format
  static validateEmail(value: string | undefined): string | undefined {
    if (!value) return undefined;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value)) {
      SecurityLogger.logSecurityEvent(
        SecurityEventType.INVALID_FORMAT,
        { reason: 'Invalid email format' }
      );
      return undefined;
    }

    return value;
  }

  // Validate boolean string
  static validateBoolean(value: string | undefined, defaultValue = false): boolean {
    if (!value) return defaultValue;

    return ['true', '1', 'yes', 'on'].includes(value.toLowerCase());
  }
}

// Secure configuration interface
interface SecureConfig {
  baseUrl?: string;
  firebase: {
    apiKey?: string;
    authDomain?: string;
    projectId?: string;
    messagingSenderId?: string;
    appId?: string;
  };
  storage: {
    bucketName?: string;
  };
  stripe: {
    secretKey?: string;
    webhookSecret?: string;
    pricing: {
      priceIdDev?: string;
      priceIdStaging?: string;
      priceIdProd?: string;
    };
  };
  email: {
    user?: string;
    password?: string;
    from?: string;
    sendgridApiKey?: string;
    resendApiKey?: string;
  };
  rag: {
    openaiApiKey?: string;
    pineconeApiKey?: string;
    pineconeEnvironment?: string;
    pineconeIndex?: string;
  };
  openai: {
    apiKey?: string;
  };
  elevenLabs: {
    apiKey?: string;
    host1VoiceId?: string;
    host2VoiceId?: string;
  };
  videoGeneration: {
    didApiKey?: string;
    synthesiaApiKey?: string;
    heygenApiKey?: string;
    runwaymlApiKey?: string;
    avatars: {
      professional: {
        id?: string;
        voiceId?: string;
      };
      friendly: {
        id?: string;
        voiceId?: string;
      };
      energetic: {
        id?: string;
        voiceId?: string;
      };
    };
  };
  search: {
    serperApiKey?: string;
  };
  redis: {
    host?: string;
    port?: number;
    password?: string;
    tls?: any;
  };
  features: {
    publicProfiles: {
      baseUrl: string;
    };
    enableVideoGeneration: boolean;
    enablePodcastGeneration: boolean;
    enablePublicProfiles: boolean;
    enableRagChat: boolean;
  };
}

// Required environment variables
const REQUIRED_VARIABLES = [
  'PROJECT_ID',
  'STORAGE_BUCKET'
];

// Critical variables that should be present for full functionality
const CRITICAL_VARIABLES = [
  'OPENAI_API_KEY',
  'WEB_API_KEY',
  'AUTH_DOMAIN'
];

// Environment configuration loader
class SecureEnvironmentLoader {
  private static instance: SecureConfig | null = null;
  private static validationResult: ValidationResult | null = null;

  // Get secure configuration (singleton pattern)
  static getConfig(): SecureConfig {
    if (!SecureEnvironmentLoader.instance) {
      const result = SecureEnvironmentLoader.loadAndValidate();
      SecureEnvironmentLoader.instance = result.config;
      SecureEnvironmentLoader.validationResult = result.validation;

      // Log validation results
      if (!result.validation.isValid) {
        functions.logger.error('Configuration validation failed', {
          errors: result.validation.errors,
          warnings: result.validation.warnings
        });
      }
    }

    return SecureEnvironmentLoader.instance;
  }

  // Get validation result
  static getValidationResult(): ValidationResult | null {
    return SecureEnvironmentLoader.validationResult;
  }

  // Load and validate configuration
  private static loadAndValidate(): { config: SecureConfig; validation: ValidationResult } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate required variables
    REQUIRED_VARIABLES.forEach(varName => {
      if (!process.env[varName]) {
        errors.push(`Missing required environment variable: ${varName}`);
        SecurityLogger.logSecurityEvent(
          SecurityEventType.MISSING_REQUIRED_VAR,
          { variable: varName }
        );
      }
    });

    // Check critical variables
    CRITICAL_VARIABLES.forEach(varName => {
      if (!process.env[varName]) {
        warnings.push(`Missing critical environment variable: ${varName} - some features may not work`);
      }
    });

    // Build secure configuration - NO HARDCODED PRODUCTION DEFAULTS
    const config: SecureConfig = {
      baseUrl: EnvironmentValidator.sanitizeString(process.env.BASE_URL),
      firebase: {
        apiKey: EnvironmentValidator.validateApiKey(process.env.WEB_API_KEY, 'WEB_API_KEY'),
        authDomain: EnvironmentValidator.sanitizeString(process.env.AUTH_DOMAIN),
        projectId: EnvironmentValidator.sanitizeString(process.env.PROJECT_ID),
        messagingSenderId: EnvironmentValidator.sanitizeString(process.env.MESSAGING_SENDER_ID),
        appId: EnvironmentValidator.sanitizeString(process.env.APP_ID)
      },
      storage: {
        bucketName: EnvironmentValidator.sanitizeString(process.env.STORAGE_BUCKET)
      },
      stripe: {
        secretKey: EnvironmentValidator.validateApiKey(process.env.STRIPE_SECRET_KEY, 'STRIPE_SECRET_KEY'),
        webhookSecret: EnvironmentValidator.sanitizeString(process.env.STRIPE_WEBHOOK_SECRET),
        pricing: {
          priceIdDev: EnvironmentValidator.sanitizeString(process.env.STRIPE_PRICE_ID_DEV),
          priceIdStaging: EnvironmentValidator.sanitizeString(process.env.STRIPE_PRICE_ID_STAGING),
          priceIdProd: EnvironmentValidator.sanitizeString(process.env.STRIPE_PRICE_ID_PROD)
        }
      },
      email: {
        user: EnvironmentValidator.validateEmail(process.env.EMAIL_USER),
        password: EnvironmentValidator.sanitizeString(process.env.EMAIL_PASSWORD),
        from: EnvironmentValidator.validateEmail(process.env.EMAIL_FROM),
        sendgridApiKey: EnvironmentValidator.validateApiKey(process.env.SENDGRID_API_KEY, 'SENDGRID_API_KEY'),
        resendApiKey: EnvironmentValidator.validateApiKey(process.env.RESEND_API_KEY, 'RESEND_API_KEY')
      },
      rag: {
        openaiApiKey: EnvironmentValidator.validateApiKey(process.env.OPENAI_API_KEY, 'OPENAI_API_KEY'),
        pineconeApiKey: EnvironmentValidator.validateApiKey(process.env.PINECONE_API_KEY, 'PINECONE_API_KEY'),
        pineconeEnvironment: EnvironmentValidator.sanitizeString(process.env.PINECONE_ENVIRONMENT),
        pineconeIndex: EnvironmentValidator.sanitizeString(process.env.PINECONE_INDEX)
      },
      openai: {
        apiKey: EnvironmentValidator.validateApiKey(process.env.OPENAI_API_KEY, 'OPENAI_API_KEY')
      },
      elevenLabs: {
        apiKey: EnvironmentValidator.validateApiKey(process.env.ELEVENLABS_API_KEY, 'ELEVENLABS_API_KEY'),
        host1VoiceId: EnvironmentValidator.sanitizeString(process.env.ELEVENLABS_HOST1_VOICE_ID),
        host2VoiceId: EnvironmentValidator.sanitizeString(process.env.ELEVENLABS_HOST2_VOICE_ID)
      },
      videoGeneration: {
        didApiKey: EnvironmentValidator.validateApiKey(process.env.DID_API_KEY, 'DID_API_KEY'),
        synthesiaApiKey: EnvironmentValidator.validateApiKey(process.env.SYNTHESIA_API_KEY, 'SYNTHESIA_API_KEY'),
        heygenApiKey: EnvironmentValidator.validateApiKey(process.env.HEYGEN_API_KEY, 'HEYGEN_API_KEY'),
        runwaymlApiKey: EnvironmentValidator.validateApiKey(process.env.RUNWAYML_API_KEY, 'RUNWAYML_API_KEY'),
        avatars: {
          professional: {
            id: EnvironmentValidator.sanitizeString(process.env.DID_PROFESSIONAL_AVATAR_ID),
            voiceId: EnvironmentValidator.sanitizeString(process.env.DID_PROFESSIONAL_VOICE_ID)
          },
          friendly: {
            id: EnvironmentValidator.sanitizeString(process.env.DID_FRIENDLY_AVATAR_ID),
            voiceId: EnvironmentValidator.sanitizeString(process.env.DID_FRIENDLY_VOICE_ID)
          },
          energetic: {
            id: EnvironmentValidator.sanitizeString(process.env.DID_ENERGETIC_AVATAR_ID),
            voiceId: EnvironmentValidator.sanitizeString(process.env.DID_ENERGETIC_VOICE_ID)
          }
        }
      },
      search: {
        serperApiKey: EnvironmentValidator.validateApiKey(process.env.SERPER_API_KEY, 'SERPER_API_KEY')
      },
      features: {
        publicProfiles: {
          baseUrl: EnvironmentValidator.validateUrl(
            process.env.PUBLIC_PROFILES_BASE_URL,
            ['getmycv-ai.web.app', 'localhost']
          ) || ''
        },
        enableVideoGeneration: EnvironmentValidator.validateBoolean(process.env.ENABLE_VIDEO_GENERATION),
        enablePodcastGeneration: EnvironmentValidator.validateBoolean(process.env.ENABLE_PODCAST_GENERATION),
        enablePublicProfiles: EnvironmentValidator.validateBoolean(process.env.ENABLE_PUBLIC_PROFILES),
        enableRagChat: EnvironmentValidator.validateBoolean(process.env.ENABLE_RAG_CHAT)
      },
      redis: {
        host: EnvironmentValidator.sanitizeString(process.env.REDIS_HOST),
        port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : undefined,
        password: EnvironmentValidator.sanitizeString(process.env.REDIS_PASSWORD),
        tls: process.env.REDIS_TLS === 'true' ? {} : undefined
      }
    };

    const validation: ValidationResult = {
      isValid: errors.length === 0,
      errors,
      warnings
    };

    return { config, validation };
  }
}

// Export secure configuration
export const config = SecureEnvironmentLoader.getConfig();

// Export utility functions for monitoring and health checks
export const environmentUtils = {
  getValidationResult: () => SecureEnvironmentLoader.getValidationResult(),
  isServiceAvailable: (serviceName: keyof SecureConfig): boolean => {
    const config = SecureEnvironmentLoader.getConfig();
    const service = config[serviceName];

    if (typeof service === 'object' && service !== null) {
      return Object.values(service).some(value =>
        value !== undefined && value !== null && value !== ''
      );
    }

    return false;
  }
};