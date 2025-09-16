export interface ParsedCV {
  id?: string;
  personalInfo?: {
    fullName?: string;
    email?: string;
    phone?: string;
    location?: string;
  };
  summary?: string;
  experience?: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    description?: string;
  }>;
  education?: Array<{
    institution: string;
    degree: string;
    field?: string;
    year?: string;
  }>;
  skills?: string[];
  languages?: Array<{
    language: string;
    proficiency: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    date?: string;
  }>;
}

export interface JobRequirements {
  skills?: string[];
  experience?: string[];
  education?: string[];
  certifications?: string[];
}

export interface JobMatchScore {
  overall: number;
  skills: number;
  experience: number;
  education: number;
  certifications: number;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: JobRequirements;
  location?: string;
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  type: 'full-time' | 'part-time' | 'contract' | 'temporary';
  postedDate: Date;
  expiryDate?: Date;
  company?: {
    name: string;
    industry?: string;
  };
}