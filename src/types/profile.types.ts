export interface ContactMethod {
  type: 'email' | 'linkedin' | 'github' | 'website' | 'other';
  label: string;
  value: string;
  icon?: string;
}

export interface ProfessionalProfile {
  fullName: string;
  professionalTitle: string;
  specialization: string;
  profilePhotoUrl?: string;
  location?: string;
  contactMethods: ContactMethod[];
}

export interface WorkExperienceEntry {
  id: string;
  company: string;
  jobTitle: string;
  startDate: string;
  endDate?: string;
  location?: string;
  achievements: string[];
}

export interface Skill {
  name: string;
  proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export type SkillsCategory = Record<string, Skill[]>;

export interface EducationRecord {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  graduationDate: string;
  location?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  // Computed fields
  isExpired?: boolean;
  daysUntilExpiration?: number;
}
