export interface Fees {
  dossier: number;
  serviceBase: number;
  originalServiceBase: number;
  serviceDiscounted: number;
  discountAmount: number;
  total: number;
}

export type ProgramType = '' | 'bachelor' | 'master' | 'special' | 'resident';

export interface StudentInfo {
  fullName: string;
  nationalId: string;
  birthDate: string;
  guardianName?: string;
  guardianId?: string;
  phone: string;
  email: string;
  program: ProgramType;
  fees: Fees;
}

export interface ContractRecord {
  id: string;
  studentInfo: StudentInfo;
  signatureDataUrl: string;
  signedAt: string; // ISO date string
  ipAddress: string;
  status: 'signed' | 'pending' | 'rejected';
  sellerCode?: string;
  sellerName?: string;
}

export interface Seller {
  id: string;
  code: string;
  name: string;
  email?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
}

export interface BrandingConfig {
  logoUrl: string;
  stampUrl: string;
  watermarkUrl: string;
  companyPhone: string;
}

export interface PricingTier {
  fileFees: number;
  serviceFees: number;
  originalPrice: number;
}

export interface PricingConfig {
  bachelor: PricingTier;
  master: PricingTier;
  special: PricingTier;
  resident: PricingTier;
  reapplication: number; // Service fee for re-application
  reapplicationOriginal: number; // Original fee for re-application
}

export enum AppStep {
  LANDING = 0,
  FORM_INPUT = 1,
  CONTRACT_REVIEW = 2,
  SIGNATURE = 3,
  SUCCESS = 4,
  ADMIN_LOGIN = 5,
  ADMIN_DASHBOARD = 6,
  ADMIN_SETTINGS = 7
}
