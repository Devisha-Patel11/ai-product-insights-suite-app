export enum Sentiment {
  POSITIVE = 'Positive',
  NEUTRAL = 'Neutral',
  NEGATIVE = 'Negative'
}

export enum PriorityLevel {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low'
}

export interface FeedbackAnalysisItem {
  id: string;
  sourceSnippet: string;
  sentiment: Sentiment;
  painPoints: string[];
  priority: PriorityLevel;
  timestamp: number; // For trend analysis
}

export enum FeatureStatus {
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed'
}

export interface FeatureRequestItem {
  id: string;
  featureName: string;
  impactDescription: string;
  urgencyDescription: string;
  priorityScore: number; // 1-10
  reasoning: string;
  status: FeatureStatus;
}