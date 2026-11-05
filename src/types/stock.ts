export type HorizonType = 'medium_term' | 'long_term';
export type CatalystType = 
  | 'Earnings Beat & Raise' 
  | 'Oversold Blue-Chip Dislocation' 
  | 'Capex / Secular Tailwind';

export interface QualityHurdles {
  profitabilityMoat: {
    passed: boolean;
    roic: number; // e.g. 24.5 (requirement: > 12%)
    fcfYield: number; // e.g. 3.8 (requirement: > 0)
    fcfAnnual: string; // e.g. "$67.8B"
    note: string;
  };
  balanceSheetSafety: {
    passed: boolean;
    debtToEquity: number; // e.g. 0.42 (requirement: < 1.5)
    currentRatio: number; // e.g. 1.85 (requirement: > 1.2)
    netCashPosition: string; // e.g. "Net Cash $24.2B" or "Manageable Debt"
    note: string;
  };
  valuationDiscipline: {
    passed: boolean;
    pegRatio: number; // e.g. 1.35 (requirement: < 1.5)
    evEbitda: number; // e.g. 18.2
    evEbitdaDiscountVsHistory: number; // e.g. -12% discount
    note: string;
  };
}

export interface BullThesisPoint {
  title: string;
  pillar: 'pricing_power' | 'market_expansion' | 'secular_tailwind';
  description: string;
  evidenceMetric: string;
}

export interface BearThesisPoint {
  title: string;
  vulnerability: 'competitive_threat' | 'regulatory_headwind' | 'multiple_compression';
  description: string;
  riskSeverity: 'low' | 'moderate' | 'elevated';
}

export interface TrancheEntryStrategy {
  tranche1AllocationPercent: number; // e.g. 50%
  tranche1Price: number; // current or immediate entry
  tranche1Rationale: string;
  tranche2AllocationPercent: number; // e.g. 50%
  tranche2TriggerPrice: number; // pullback buy zone price
  tranche2Rationale: string;
  buyZoneRange: [number, number]; // e.g. [405, 425]
}

export interface ThesisInvalidationRule {
  trigger: string;
  threshold: string;
  action: 'Immediate Trim' | 'Full Liquidate' | 'Mandatory Thesis Review';
}

export interface RiskGuardrails {
  maxPositionCapPercent: number; // standard 5% to 8%
  suggestedCapPercent: number; // e.g. 6.5%
  maxLossTrailingStopPercent: number; // e.g. 15%
  invalidationRules: ThesisInvalidationRule[];
}

export interface SearchSource {
  title: string;
  url: string;
}

export interface StockResearchData {
  id: string;
  ticker: string;
  companyName: string;
  sector: string;
  industry: string;
  currentPrice: number;
  fairValueEstimate: number;
  marginOfSafetyPercent: number; // e.g. 16.5% discount
  qualityScore: number; // 1 - 10
  convictionScore: number; // 1 - 10
  horizon: HorizonType;
  catalyst: CatalystType;
  twoSentenceThesis: string;
  marketCap: string;
  peRatio: number;
  qualityHurdles: QualityHurdles;
  bullThesis: [BullThesisPoint, BullThesisPoint, BullThesisPoint];
  bearThesis: [BearThesisPoint, BearThesisPoint, BearThesisPoint];
  trancheStrategy: TrancheEntryStrategy;
  riskGuardrails: RiskGuardrails;
  isAiAudited?: boolean;
  auditedAt?: string;
  groundingSources?: SearchSource[];
  isGoogleSearchGrounded?: boolean;
  customEntryTarget?: number;
}

export interface PortfolioHolding {
  id: string;
  ticker: string;
  companyName: string;
  shares: number;
  avgPurchasePrice: number;
  currentPrice: number;
  sector: string;
  addedAt: string;
}
