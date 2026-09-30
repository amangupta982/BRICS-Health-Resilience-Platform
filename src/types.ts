export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface EpidemiologicalAnalysis {
  severity_level: SeverityLevel;
  crisis_summary: string;
  immediate_actions: [string, string, string] | string[];
  keywords: [string, string, string, string, string] | string[];
  // Enhanced inferred medical & epidemiological telemetry
  inferred_condition?: string;
  confidence_score?: number;
  suspected_etiology?: string;
  vulnerable_population_impact?: string;
  supply_chain_deficits?: string[];
  recommended_quarantine_level?: 'None' | 'Standard Precautions' | 'Droplet / Contact' | 'Strict Isolation';
  facility_dispatch_order?: string;
  id?: string;
  timestamp?: string;
  raw_input?: string;
  region?: string;
}

export type CivicIssueType =
  | 'Pothole'
  | 'Streetlight'
  | 'Water Leakage'
  | 'Garbage'
  | 'Damaged Sidewalk'
  | 'Other';

export type CivicSeverity = 'Low' | 'Medium' | 'High' | 'Critical';

export interface CivicInspectionAnalysis {
  issueType: CivicIssueType;
  severity: CivicSeverity;
  description: string;
  confidence: number;
  isCivicIssue: boolean;
  rawObservations: string[];
  affectedInfrastructure: string;
  id?: string;
  timestamp?: string;
  imageUrl?: string;
  imageName?: string;
}

export interface PresetReport {
  id: string;
  title: string;
  location: string;
  regionCode: 'BRA' | 'RUS' | 'IND' | 'CHN' | 'ZAF' | 'EXT';
  category: 'Disease Outbreak' | 'Stockout & Medicine' | 'Facility Crisis' | 'Routine Normal' | 'Panicked Ambiguity';
  expectedSeverity: SeverityLevel;
  rawText: string;
  tags: string[];
}

export interface PresetCivicInspection {
  id: string;
  title: string;
  category: 'Civic Hazard' | 'Non-Civic Refusal Proof';
  isCivic: boolean;
  expectedType: CivicIssueType;
  expectedSeverity: CivicSeverity;
  description: string;
  imagePrompt: string;
  base64Data?: string;
  svgDataUri?: string;
}
