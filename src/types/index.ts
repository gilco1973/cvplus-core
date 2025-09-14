export interface Job {
  id: string;
  userId: string;
  status: 'pending' | 'processing' | 'analyzed' | 'generating' | 'completed' | 'failed';
  fileUrl?: string;
  mimeType?: string;
  isUrl?: boolean;
  parsedData?: any;
  generatedCV?: {
    html: string;
    pdfUrl: string;
    docxUrl: string;
  };
  selectedTemplate?: string;
  selectedFeatures?: string[];
  error?: string;
  createdAt: any;
  updatedAt: any;
}

export interface CVTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: 'modern' | 'classic' | 'creative' | 'minimal' | 'executive';
  isPremium: boolean;
  config: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      text: string;
      background: string;
    };
    fonts: {
      heading: string;
      body: string;
    };
    layout: string;
  };
}

export interface GeneratedFeature {
  id: string;
  widget: string;
  scripts?: string[];
  styles?: string[];
  data?: any;
  requirements?: {
    scripts?: string[];
    styles?: string[];
    apiKeys?: string[];
  };
}

// ============================================================================
// MIDDLEWARE & ARCHITECTURE TYPES
// ============================================================================

export * from './middleware';

// ============================================================================
// ALL OTHER EXISTING TYPES
// ============================================================================

export * from './api';
export type {
  PersonalInfo,
  Language
} from './cv';
export * from './cv-template';
export * from './error';
export type {
  ParsedCV
} from './enhanced-models';
export * from './firebase';
export * from './industry-specialization';
export * from './status';
export * from './utility';