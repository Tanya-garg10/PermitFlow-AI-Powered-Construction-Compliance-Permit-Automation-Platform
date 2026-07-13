export type UserRole = 'Contractor' | 'Architect' | 'Municipal Officer' | 'Admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  otpVerified: boolean;
}

export interface ExtractedData {
  projectType: string;
  totalArea: number;
  floors: number;
  height: number;
  parkingSpaces: number;
  fireSafetyStatus: string;
  structuralNotes: string;
  environmentalNotes: string;
  occupancyType: string;
  farValue: number; // Floor Area Ratio
  setbackFront: number; // in meters
  setbackSides: number; // in meters
}

export interface ComplianceIssue {
  id: string;
  category: 'Zoning' | 'BuildingCode' | 'Environmental' | 'FireSafety' | 'Parking';
  ruleName: string;
  expected: string;
  actual: string;
  status: 'Pass' | 'Warning' | 'Violation' | 'Missing';
  message: string;
  suggestion: string;
}

export interface ComplianceReport {
  projectId: string;
  complianceScore: number;
  issues: ComplianceIssue[];
  requiredApprovals: string[];
  timelineEstDays: number;
  generatedAt: string;
}

export interface GovernmentForm {
  applicantName: string;
  applicantAddress: string;
  surveyNumber: string;
  plotArea: number;
  proposedHeight: number;
  proposedFloors: number;
  buildingUse: string;
  ownerName: string;
  architectLicense: string;
  estimatedCost: string;
}

export interface Project {
  id: string;
  name: string;
  location: string;
  plotArea: number;
  buildingType: 'Residential' | 'Commercial' | 'Industrial' | 'Mixed Use';
  floors: number;
  height: number;
  blueprintUrl?: string;
  siteImageUrl?: string;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Document Verification' | 'Approved' | 'Rejected' | 'Completed';
  complianceScore: number;
  createdAt: string;
  creatorId: string;
  creatorName: string;
  extractedData?: ExtractedData;
  complianceReport?: ComplianceReport;
  formDetails?: GovernmentForm;
  officerNotes?: string;
  documentsRequested?: string[];
  duplicateDetected?: boolean;
  riskScore?: 'Low' | 'Medium' | 'High';
}

export interface Regulation {
  id: string;
  category: string;
  name: string;
  description: string;
  limitType: 'max' | 'min' | 'exact';
  value: number;
  unit: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  audioData?: string; // Base64 PCM or WAV
  timestamp: string;
}

export interface AppNotification {
  id: string;
  type: 'email' | 'sms' | 'alert';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface AppAnalytics {
  permitStatusCounts: { name: string; value: number }[];
  approvalRateHistory: { month: string; rate: number }[];
  violationTypes: { category: string; count: number }[];
  averageApprovalTime: { category: string; days: number }[];
  projectsPerMonth: { month: string; projects: number }[];
}
