/**
 * T045: Security event classifier in packages/core/src/logging/SecurityClassifier.ts
 *
 * Advanced security event classification system that analyzes log entries
 * for security threats, patterns, and anomalies. Provides automated threat
 * detection and severity scoring for the CVPlus logging system.
 */

import { LogEntry, LogLevel, LogDomain } from '../types';

/**
 * Security threat categories
 */
export enum SecurityThreatCategory {
  AUTHENTICATION_ATTACK = 'authentication_attack',
  AUTHORIZATION_VIOLATION = 'authorization_violation',
  INJECTION_ATTACK = 'injection_attack',
  XSS_ATTACK = 'xss_attack',
  CSRF_ATTACK = 'csrf_attack',
  DATA_BREACH = 'data_breach',
  PRIVILEGE_ESCALATION = 'privilege_escalation',
  BRUTE_FORCE = 'brute_force',
  SESSION_HIJACKING = 'session_hijacking',
  MALICIOUS_FILE_UPLOAD = 'malicious_file_upload',
  RATE_LIMIT_VIOLATION = 'rate_limit_violation',
  SUSPICIOUS_BEHAVIOR = 'suspicious_behavior',
  ACCOUNT_TAKEOVER = 'account_takeover',
  API_ABUSE = 'api_abuse',
  UNKNOWN = 'unknown'
}

/**
 * Security severity levels
 */
export enum SecuritySeverity {
  CRITICAL = 'critical',  // Immediate threat, active attack
  HIGH = 'high',          // Serious threat, likely attack
  MEDIUM = 'medium',      // Potential threat, suspicious activity
  LOW = 'low',            // Minor security concern
  INFO = 'info'           // Security-related information
}

/**
 * Security classification result
 */
export interface SecurityClassification {
  isSecurityEvent: boolean;
  threatCategory: SecurityThreatCategory;
  severity: SecuritySeverity;
  confidence: number; // 0-1 confidence score
  riskScore: number; // 0-100 risk score
  indicators: string[];
  recommendations: string[];
  patternMatches: SecurityPattern[];
  metadata: {
    ipAddress?: string;
    userAgent?: string;
    userId?: string;
    sessionId?: string;
    endpoint?: string;
    method?: string;
    timestamp: number;
  };
}

/**
 * Security pattern definition
 */
interface SecurityPattern {
  id: string;
  name: string;
  category: SecurityThreatCategory;
  pattern: RegExp;
  severity: SecuritySeverity;
  weight: number;
  description: string;
}

/**
 * Attack frequency tracking
 */
interface AttackFrequency {
  count: number;
  firstSeen: number;
  lastSeen: number;
  ipAddresses: Set<string>;
  userIds: Set<string>;
}

/**
 * Security event classifier
 */
export class SecurityClassifier {
  private patterns: SecurityPattern[] = [];
  private attackFrequency: Map<string, AttackFrequency> = new Map();
  private ipReputationCache: Map<string, number> = new Map();
  private cleanupTimer?: NodeJS.Timeout;

  constructor() {
    this.initializePatterns();
    this.startCleanupTimer();
  }

  /**
   * Classify a log entry for security threats
   */
  classify(logEntry: LogEntry): SecurityClassification {
    const classification: SecurityClassification = {
      isSecurityEvent: false,
      threatCategory: SecurityThreatCategory.UNKNOWN,
      severity: SecuritySeverity.INFO,
      confidence: 0,
      riskScore: 0,
      indicators: [],
      recommendations: [],
      patternMatches: [],
      metadata: {
        timestamp: Date.now(),
        ipAddress: logEntry.context?.ipAddress,
        userAgent: logEntry.context?.userAgent,
        userId: logEntry.userId,
        sessionId: logEntry.correlationId,
        endpoint: logEntry.context?.endpoint,
        method: logEntry.context?.method
      }
    };

    // Quick exit for non-security domains (unless they contain security indicators)
    if (logEntry.domain !== LogDomain.SECURITY && !this.hasSecurityIndicators(logEntry)) {
      return classification;
    }

    // Pattern matching
    const patternMatches = this.matchPatterns(logEntry);
    classification.patternMatches = patternMatches;

    if (patternMatches.length === 0) {
      return classification;
    }

    // Mark as security event
    classification.isSecurityEvent = true;

    // Calculate severity and confidence
    const { severity, confidence, riskScore, threatCategory } = this.calculateThreatMetrics(patternMatches);
    classification.severity = severity;
    classification.confidence = confidence;
    classification.riskScore = riskScore;
    classification.threatCategory = threatCategory;

    // Extract indicators
    classification.indicators = this.extractIndicators(logEntry, patternMatches);

    // Generate recommendations
    classification.recommendations = this.generateRecommendations(classification);

    // Update attack frequency tracking
    this.updateAttackFrequency(classification);

    // Apply frequency-based adjustments
    this.applyFrequencyAdjustments(classification);

    return classification;
  }

  /**
   * Batch classify multiple log entries
   */
  batchClassify(logEntries: LogEntry[]): SecurityClassification[] {
    return logEntries.map(entry => this.classify(entry));
  }

  /**
   * Get security statistics
   */
  getSecurityStats(): {
    totalAttacks: number;
    attacksByCategory: Record<SecurityThreatCategory, number>;
    topAttackers: Array<{ identifier: string; count: number; category: SecurityThreatCategory }>;
    recentAttacks: number; // Last 24 hours
  } {
    const stats = {
      totalAttacks: 0,
      attacksByCategory: {} as Record<SecurityThreatCategory, number>,
      topAttackers: [] as Array<{ identifier: string; count: number; category: SecurityThreatCategory }>,
      recentAttacks: 0
    };

    // Initialize categories
    Object.values(SecurityThreatCategory).forEach(category => {
      stats.attacksByCategory[category] = 0;
    });

    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);

    this.attackFrequency.forEach((frequency, identifier) => {
      stats.totalAttacks += frequency.count;

      if (frequency.lastSeen > oneDayAgo) {
        stats.recentAttacks += frequency.count;
      }
    });

    return stats;
  }

  /**
   * Initialize security patterns
   */
  private initializePatterns(): void {
    this.patterns = [
      // SQL Injection patterns
      {
        id: 'sql_injection_1',
        name: 'SQL Injection - Union Select',
        category: SecurityThreatCategory.INJECTION_ATTACK,
        pattern: /(\b(union|select|insert|update|delete|drop|exec|execute)\b.*\b(from|where|order\s+by)\b)|('(\s*(union|select|insert|update|delete|drop)|\s*(or|and)\s*\w+\s*=\s*\w+))/i,
        severity: SecuritySeverity.HIGH,
        weight: 0.9,
        description: 'SQL injection attempt detected'
      },
      {
        id: 'sql_injection_2',
        name: 'SQL Injection - Blind',
        category: SecurityThreatCategory.INJECTION_ATTACK,
        pattern: /(\b(sleep|waitfor|benchmark)\s*\(|\b(if|case)\s*\(.*select)|('.*(\sor\s|\sand\s).*'.*=.*')/i,
        severity: SecuritySeverity.HIGH,
        weight: 0.8,
        description: 'Blind SQL injection attempt detected'
      },

      // XSS patterns
      {
        id: 'xss_script',
        name: 'XSS - Script Tag',
        category: SecurityThreatCategory.XSS_ATTACK,
        pattern: /<script[^>]*>.*<\/script>|javascript:/i,
        severity: SecuritySeverity.HIGH,
        weight: 0.9,
        description: 'Cross-site scripting attempt with script tag'
      },
      {
        id: 'xss_event_handler',
        name: 'XSS - Event Handler',
        category: SecurityThreatCategory.XSS_ATTACK,
        pattern: /\b(on\w+\s*=|eval\s*\(|alert\s*\(|confirm\s*\()/i,
        severity: SecuritySeverity.MEDIUM,
        weight: 0.7,
        description: 'XSS attempt via event handler'
      },

      // Authentication attacks
      {
        id: 'brute_force_1',
        name: 'Brute Force - Multiple Failed Logins',
        category: SecurityThreatCategory.BRUTE_FORCE,
        pattern: /failed.*login|invalid.*password|authentication.*failed/i,
        severity: SecuritySeverity.MEDIUM,
        weight: 0.6,
        description: 'Failed authentication attempt'
      },
      {
        id: 'credential_stuffing',
        name: 'Credential Stuffing',
        category: SecurityThreatCategory.AUTHENTICATION_ATTACK,
        pattern: /credential.*stuffing|password.*spray|dictionary.*attack/i,
        severity: SecuritySeverity.HIGH,
        weight: 0.8,
        description: 'Credential stuffing attack detected'
      },

      // Authorization violations
      {
        id: 'privilege_escalation_1',
        name: 'Privilege Escalation',
        category: SecurityThreatCategory.PRIVILEGE_ESCALATION,
        pattern: /privilege.*escalation|unauthorized.*access|access.*denied.*admin/i,
        severity: SecuritySeverity.HIGH,
        weight: 0.8,
        description: 'Privilege escalation attempt'
      },
      {
        id: 'unauthorized_api_access',
        name: 'Unauthorized API Access',
        category: SecurityThreatCategory.API_ABUSE,
        pattern: /api.*unauthorized|forbidden.*endpoint|invalid.*token/i,
        severity: SecuritySeverity.MEDIUM,
        weight: 0.6,
        description: 'Unauthorized API access attempt'
      },

      // File upload attacks
      {
        id: 'malicious_file_upload',
        name: 'Malicious File Upload',
        category: SecurityThreatCategory.MALICIOUS_FILE_UPLOAD,
        pattern: /\.(php|jsp|asp|exe|bat|cmd|sh|ps1)\b|file.*upload.*rejected/i,
        severity: SecuritySeverity.HIGH,
        weight: 0.8,
        description: 'Malicious file upload attempt'
      },

      // Rate limiting violations
      {
        id: 'rate_limit_exceeded',
        name: 'Rate Limit Exceeded',
        category: SecurityThreatCategory.RATE_LIMIT_VIOLATION,
        pattern: /rate.*limit.*exceeded|too.*many.*requests|429/i,
        severity: SecuritySeverity.MEDIUM,
        weight: 0.5,
        description: 'Rate limit violation'
      },

      // Session attacks
      {
        id: 'session_fixation',
        name: 'Session Fixation',
        category: SecurityThreatCategory.SESSION_HIJACKING,
        pattern: /session.*fixation|session.*hijack|csrf.*token.*missing/i,
        severity: SecuritySeverity.HIGH,
        weight: 0.7,
        description: 'Session attack attempt'
      },

      // Suspicious patterns
      {
        id: 'suspicious_user_agent',
        name: 'Suspicious User Agent',
        category: SecurityThreatCategory.SUSPICIOUS_BEHAVIOR,
        pattern: /(sqlmap|nikto|nmap|burp|zap|w3af|metasploit)/i,
        severity: SecuritySeverity.MEDIUM,
        weight: 0.6,
        description: 'Security scanning tool detected'
      },
      {
        id: 'directory_traversal',
        name: 'Directory Traversal',
        category: SecurityThreatCategory.INJECTION_ATTACK,
        pattern: /(\.\.[\/\\]){2,}|(\.\.[\/\\].*){3,}/i,
        severity: SecuritySeverity.MEDIUM,
        weight: 0.7,
        description: 'Directory traversal attempt'
      }
    ];
  }

  /**
   * Check if log entry has security indicators
   */
  private hasSecurityIndicators(logEntry: LogEntry): boolean {
    const securityKeywords = [
      'security', 'attack', 'threat', 'malicious', 'suspicious', 'unauthorized',
      'breach', 'violation', 'exploit', 'vulnerability', 'injection', 'xss',
      'csrf', 'auth', 'login', 'password', 'token', 'session', 'permission'
    ];

    const text = `${logEntry.message} ${JSON.stringify(logEntry.context || {})}`.toLowerCase();
    return securityKeywords.some(keyword => text.includes(keyword));
  }

  /**
   * Match patterns against log entry
   */
  private matchPatterns(logEntry: LogEntry): SecurityPattern[] {
    const matches: SecurityPattern[] = [];
    const searchText = `${logEntry.message} ${JSON.stringify(logEntry.context || {})}`;

    for (const pattern of this.patterns) {
      if (pattern.pattern.test(searchText)) {
        matches.push(pattern);
      }
    }

    return matches;
  }

  /**
   * Calculate threat metrics from pattern matches
   */
  private calculateThreatMetrics(patternMatches: SecurityPattern[]): {
    severity: SecuritySeverity;
    confidence: number;
    riskScore: number;
    threatCategory: SecurityThreatCategory;
  } {
    if (patternMatches.length === 0) {
      return {
        severity: SecuritySeverity.INFO,
        confidence: 0,
        riskScore: 0,
        threatCategory: SecurityThreatCategory.UNKNOWN
      };
    }

    // Calculate weighted confidence and risk score
    let totalWeight = 0;
    let weightedRiskScore = 0;
    const severityScores = {
      [SecuritySeverity.CRITICAL]: 100,
      [SecuritySeverity.HIGH]: 80,
      [SecuritySeverity.MEDIUM]: 50,
      [SecuritySeverity.LOW]: 25,
      [SecuritySeverity.INFO]: 10
    };

    // Count categories to determine primary threat
    const categoryWeights = new Map<SecurityThreatCategory, number>();

    for (const match of patternMatches) {
      totalWeight += match.weight;
      weightedRiskScore += severityScores[match.severity] * match.weight;

      const currentWeight = categoryWeights.get(match.category) || 0;
      categoryWeights.set(match.category, currentWeight + match.weight);
    }

    // Determine primary threat category
    let threatCategory = SecurityThreatCategory.UNKNOWN;
    let maxWeight = 0;
    categoryWeights.forEach((weight, category) => {
      if (weight > maxWeight) {
        maxWeight = weight;
        threatCategory = category;
      }
    });

    // Calculate final metrics
    const confidence = Math.min(totalWeight, 1);
    const riskScore = Math.min(weightedRiskScore / totalWeight, 100);

    // Determine severity based on risk score
    let severity: SecuritySeverity;
    if (riskScore >= 90) severity = SecuritySeverity.CRITICAL;
    else if (riskScore >= 70) severity = SecuritySeverity.HIGH;
    else if (riskScore >= 40) severity = SecuritySeverity.MEDIUM;
    else if (riskScore >= 20) severity = SecuritySeverity.LOW;
    else severity = SecuritySeverity.INFO;

    return { severity, confidence, riskScore, threatCategory };
  }

  /**
   * Extract security indicators from log entry and patterns
   */
  private extractIndicators(logEntry: LogEntry, patternMatches: SecurityPattern[]): string[] {
    const indicators: string[] = [];

    // Add pattern-based indicators
    patternMatches.forEach(pattern => {
      indicators.push(`Pattern: ${pattern.name}`);
    });

    // Extract context-based indicators
    const context = logEntry.context || {};

    if (context.ipAddress) {
      indicators.push(`IP: ${context.ipAddress}`);
    }

    if (context.userAgent && this.isSuspiciousUserAgent(context.userAgent)) {
      indicators.push(`Suspicious User-Agent: ${context.userAgent}`);
    }

    if (context.method && ['POST', 'PUT', 'DELETE'].includes(context.method)) {
      indicators.push(`HTTP Method: ${context.method}`);
    }

    if (context.statusCode && context.statusCode >= 400) {
      indicators.push(`HTTP Status: ${context.statusCode}`);
    }

    return indicators;
  }

  /**
   * Generate security recommendations
   */
  private generateRecommendations(classification: SecurityClassification): string[] {
    const recommendations: string[] = [];

    switch (classification.threatCategory) {
      case SecurityThreatCategory.INJECTION_ATTACK:
        recommendations.push('Implement input validation and parameterized queries');
        recommendations.push('Use ORM/ODM frameworks with built-in protection');
        break;

      case SecurityThreatCategory.XSS_ATTACK:
        recommendations.push('Implement output encoding for user-generated content');
        recommendations.push('Use Content Security Policy (CSP) headers');
        break;

      case SecurityThreatCategory.BRUTE_FORCE:
        recommendations.push('Implement account lockout mechanisms');
        recommendations.push('Add CAPTCHA after multiple failed attempts');
        recommendations.push('Consider IP-based rate limiting');
        break;

      case SecurityThreatCategory.PRIVILEGE_ESCALATION:
        recommendations.push('Review and audit user permissions');
        recommendations.push('Implement principle of least privilege');
        break;

      case SecurityThreatCategory.API_ABUSE:
        recommendations.push('Implement robust API authentication');
        recommendations.push('Add request rate limiting');
        recommendations.push('Monitor API usage patterns');
        break;

      default:
        recommendations.push('Monitor for recurring patterns');
        recommendations.push('Consider blocking suspicious IP addresses');
    }

    // Severity-based recommendations
    if (classification.severity === SecuritySeverity.CRITICAL) {
      recommendations.push('URGENT: Immediate investigation required');
      recommendations.push('Consider temporary blocking measures');
    }

    return recommendations;
  }

  /**
   * Update attack frequency tracking
   */
  private updateAttackFrequency(classification: SecurityClassification): void {
    const identifier = classification.metadata.ipAddress ||
                      classification.metadata.userId ||
                      'unknown';

    const existing = this.attackFrequency.get(identifier);
    const now = Date.now();

    if (existing) {
      existing.count++;
      existing.lastSeen = now;

      if (classification.metadata.ipAddress) {
        existing.ipAddresses.add(classification.metadata.ipAddress);
      }
      if (classification.metadata.userId) {
        existing.userIds.add(classification.metadata.userId);
      }
    } else {
      this.attackFrequency.set(identifier, {
        count: 1,
        firstSeen: now,
        lastSeen: now,
        ipAddresses: new Set(classification.metadata.ipAddress ? [classification.metadata.ipAddress] : []),
        userIds: new Set(classification.metadata.userId ? [classification.metadata.userId] : [])
      });
    }
  }

  /**
   * Apply frequency-based risk adjustments
   */
  private applyFrequencyAdjustments(classification: SecurityClassification): void {
    const identifier = classification.metadata.ipAddress ||
                      classification.metadata.userId ||
                      'unknown';

    const frequency = this.attackFrequency.get(identifier);
    if (!frequency) return;

    // Increase risk score based on attack frequency
    if (frequency.count > 10) {
      classification.riskScore = Math.min(classification.riskScore * 1.5, 100);
      classification.indicators.push(`High frequency attacker (${frequency.count} attempts)`);
    } else if (frequency.count > 5) {
      classification.riskScore = Math.min(classification.riskScore * 1.2, 100);
      classification.indicators.push(`Repeat attacker (${frequency.count} attempts)`);
    }

    // Upgrade severity for persistent attackers
    if (frequency.count > 20 && classification.severity !== SecuritySeverity.CRITICAL) {
      classification.severity = SecuritySeverity.HIGH;
    }
  }

  /**
   * Check if user agent is suspicious
   */
  private isSuspiciousUserAgent(userAgent: string): boolean {
    const suspiciousPatterns = [
      /sqlmap|nikto|nmap|burp|zap|w3af|metasploit|gobuster|dirb/i,
      /bot|crawler|spider|scraper/i,
      /curl|wget|python|java|php/i
    ];

    return suspiciousPatterns.some(pattern => pattern.test(userAgent));
  }

  /**
   * Start cleanup timer to remove old attack frequency data
   */
  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      const now = Date.now();
      const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days

      this.attackFrequency.forEach((frequency, identifier) => {
        if (now - frequency.lastSeen > maxAge) {
          this.attackFrequency.delete(identifier);
        }
      });

      // Clean IP reputation cache
      this.ipReputationCache.clear();
    }, 60 * 60 * 1000); // Run every hour
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    this.attackFrequency.clear();
    this.ipReputationCache.clear();
  }
}