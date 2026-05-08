export interface EventSearchRequest {
  location: string;
  date: string;
  eventType: string;
  interests: string[];
  budget: string;
  transportationPreference: string;
  indoorOutdoorPreference: string;
  notes?: string;
}

export interface BudgetAnalysis {
  estimatedTicketCost: string;
  estimatedTransportationCost: string;
  estimatedFoodAndDrinkCost: string;
  estimatedFees: string;
  estimatedTotalCost: string;
  budgetFit: "under_budget" | "near_budget" | "over_budget";
  costSavingTips: string[];
}

export interface WeatherAnalysis {
  venueType: "indoor" | "outdoor" | "mixed" | "unknown";
  expectedTemperature: string;
  precipitationRisk: string;
  windRisk: string;
  comfortLevel: "great" | "okay" | "poor" | "unknown";
  weatherRisk: "low" | "medium" | "high";
  recommendation: string;
}

export interface RecommendedEvent {
  eventName: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  category: string;
  priceRange: string;
  description: string;
  matchScore: number;
  matchReason: string;
  sourceUrl?: string;
  budgetAnalysis: BudgetAnalysis;
  weatherAnalysis: WeatherAnalysis;
}

export interface ItineraryTimelineItem {
  time: string;
  activity: string;
  location: string;
  notes: string;
}

export interface RecommendedItinerary {
  title: string;
  summary: string;
  totalEstimatedCost: string;
  weatherSummary: string;
  timeline: ItineraryTimelineItem[];
  backupPlan: string;
  whyThisPlanWorks: string[];
}

export interface SeekrAgentActivity {
  agentName: string;
  status: "complete" | "failed" | "running";
  summary: string;
}

export interface EventFinderOutput {
  appName?: string;
  userRequest: string;
  location: string;
  summary?: string;
  agentActivity?: SeekrAgentActivity[];
  recommendedEvents: RecommendedEvent[];
  recommendedItinerary: RecommendedItinerary;
  dataSource?: "live" | "mock";
}
