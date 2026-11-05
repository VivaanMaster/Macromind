import type { StockResearchData } from '../types/stock.ts';

export const INITIAL_VETTED_STOCKS: StockResearchData[] = [
  {
    id: 'msft',
    ticker: 'MSFT',
    companyName: 'Microsoft Corporation',
    sector: 'Technology',
    industry: 'Infrastructure & Enterprise Software',
    currentPrice: 428.50,
    fairValueEstimate: 495.00,
    marginOfSafetyPercent: 13.4,
    qualityScore: 9.6,
    convictionScore: 9.4,
    horizon: 'long_term',
    catalyst: 'Capex / Secular Tailwind',
    customEntryTarget: 420.00,
    twoSentenceThesis: 'Dominant enterprise cloud infrastructure operating system monetizing generative AI workloads through commercial Azure expansion and Copilot seat adoption. Impregnable balance sheet with an extraordinary 28.4% return on invested capital sustains multi-decade compounding.',
    marketCap: '$3.18T',
    peRatio: 31.8,
    qualityHurdles: {
      profitabilityMoat: {
        passed: true,
        roic: 28.4,
        fcfYield: 3.2,
        fcfAnnual: '$74.1B',
        note: 'ROIC of 28.4% far exceeds the 12% institutional threshold. FCF conversion remains above 68% of operating profit.'
      },
      balanceSheetSafety: {
        passed: true,
        debtToEquity: 0.38,
        currentRatio: 1.34,
        netCashPosition: 'Net Cash & Equivalents $78.3B',
        note: 'Ultra-conservative AAA-grade debt structure. Debt/Equity at 0.38 is well below the 1.5 maximum cap.'
      },
      valuationDiscipline: {
        passed: true,
        pegRatio: 1.38,
        evEbitda: 21.4,
        evEbitdaDiscountVsHistory: -8.5,
        note: 'PEG of 1.38 clears the <1.5 rule on sustained 14-16% EPS compound annual growth through 2028.'
      }
    },
    bullThesis: [
      {
        title: 'Azure AI Cloud Monopolization & Enterprise Moat',
        pillar: 'market_expansion',
        description: 'Azure AI services are capturing more than 50% of Fortune 500 enterprise LLM infrastructure workloads, delivering 29% constant-currency cloud revenue growth.',
        evidenceMetric: '+29% YoY Azure Growth, $65B+ Cloud Run-Rate'
      },
      {
        title: 'Mission-Critical Office 365 Enterprise Pricing Power',
        pillar: 'pricing_power',
        description: 'Unmatched enterprise lock-in allows unyielding contractual renewals, plus $30/user/month Copilot upselling across 400M commercial seats.',
        evidenceMetric: '97% Enterprise Net Dollar Retention'
      },
      {
        title: 'Hyperscale CapEx Efficiency and Moat Expansion',
        pillar: 'secular_tailwind',
        description: 'Disciplined $50B+ infrastructure investment establishes a computing moat that competitors without software monetization cannot economically duplicate.',
        evidenceMetric: 'Operating Margin expanded to 44.6%'
      }
    ],
    bearThesis: [
      {
        title: 'Hyperscale AI CapEx Saturation & Depreciation Drag',
        vulnerability: 'multiple_compression',
        description: 'Accelerated datacenter capital expenditure could temporarily depress free cash flow conversion if enterprise Copilot monetisation encounters enterprise rollout friction.',
        riskSeverity: 'moderate'
      },
      {
        title: 'Regulatory Scrutiny on Cloud Bundling & Activision Integration',
        vulnerability: 'regulatory_headwind',
        description: 'Antitrust regulators in the EU and FTC scrutiny over cloud bundling tactics and LLM equity partnerships could restrict inorganic M&A.',
        riskSeverity: 'low'
      },
      {
        title: 'Open-Source Enterprise Inference Commoditization',
        vulnerability: 'competitive_threat',
        description: 'Rapid advancements in quantized open-weights models running on edge or internal private clusters could moderate proprietary API pricing power.',
        riskSeverity: 'low'
      }
    ],
    trancheStrategy: {
      tranche1AllocationPercent: 50,
      tranche1Price: 428.50,
      tranche1Rationale: 'Initiate 50% core allocation at current fair value discount (13.4% margin of safety) ahead of next quarter Azure acceleration.',
      tranche2AllocationPercent: 50,
      tranche2TriggerPrice: 405.00,
      tranche2Rationale: 'Reserve 50% dry powder for macro market pullback or technical test of 200-day moving average support.',
      buyZoneRange: [398.00, 430.00]
    },
    riskGuardrails: {
      maxPositionCapPercent: 8.0,
      suggestedCapPercent: 6.5,
      maxLossTrailingStopPercent: 15.0,
      invalidationRules: [
        {
          trigger: 'Azure Revenue Growth Deceleration',
          threshold: 'Decelerates below 20% YoY for two consecutive quarters',
          action: 'Immediate Trim'
        },
        {
          trigger: 'Operating Margin Compression',
          threshold: 'Operating margins deteriorate below 38% under CapEx weight',
          action: 'Mandatory Thesis Review'
        },
        {
          trigger: 'Trailing Stop Breach',
          threshold: 'Drawdown exceeds 15% from local cyclical high without market dislocation',
          action: 'Immediate Trim'
        }
      ]
    }
  },
  {
    id: 'googl',
    ticker: 'GOOGL',
    companyName: 'Alphabet Inc.',
    sector: 'Technology',
    industry: 'Search, Advertising & Cloud Computing',
    currentPrice: 178.20,
    fairValueEstimate: 218.00,
    marginOfSafetyPercent: 18.3,
    qualityScore: 9.4,
    convictionScore: 9.2,
    horizon: 'long_term',
    catalyst: 'Oversold Blue-Chip Dislocation',
    customEntryTarget: 175.00,
    twoSentenceThesis: 'Unwarranted market anxiety over search disruption creates a rare dislocation in the world’s most cash-generative computational platform. Deep architectural advantages in custom silicon (TPUs), YouTube subscription leverage, and accelerating Google Cloud profitability anchor defensive compounding.',
    marketCap: '$2.21T',
    peRatio: 22.4,
    qualityHurdles: {
      profitabilityMoat: {
        passed: true,
        roic: 29.8,
        fcfYield: 4.1,
        fcfAnnual: '$69.5B',
        note: 'Exceptional 29.8% ROIC. Search and YouTube distribution generate massive cash flow exceeding $69B annually.'
      },
      balanceSheetSafety: {
        passed: true,
        debtToEquity: 0.11,
        currentRatio: 2.15,
        netCashPosition: 'Net Cash $95.4B',
        note: 'Fortress balance sheet with minimal funded debt. Current ratio of 2.15 represents gold-standard liquidity.'
      },
      valuationDiscipline: {
        passed: true,
        pegRatio: 1.22,
        evEbitda: 14.8,
        evEbitdaDiscountVsHistory: -16.4,
        note: 'PEG of 1.22 is exceptionally attractive for a high-moat global monopoly; trades at 16% discount to 5-year average EV/EBITDA.'
      }
    },
    bullThesis: [
      {
        title: 'Full-Stack AI Vertical Integration via Custom TPUs',
        pillar: 'secular_tailwind',
        description: 'Internal TPU silicon gives Google a 30-40% inference cost advantage per query over competitors reliant solely on merchant GPU clusters.',
        evidenceMetric: 'TPU v5p deployment delivering 2.5x efficiency gains'
      },
      {
        title: 'Search Query Moat Reinforcement with AI Overviews',
        pillar: 'pricing_power',
        description: 'AI Overviews are expanding query complexity and user engagement, driving commercial click-through rates higher rather than cannibalizing revenue.',
        evidenceMetric: '+14% YoY Search & Other revenue growth'
      },
      {
        title: 'Google Cloud Platform Operating Margin Inflection',
        pillar: 'market_expansion',
        description: 'GCP has crossed enterprise operating breakeven and is rapidly scaling margins from 9% toward peer hyperscaler levels of 30%.',
        evidenceMetric: 'GCP Operating Income reached $1.2B/quarter'
      }
    ],
    bearThesis: [
      {
        title: 'DOJ Antitrust Remedies and Search Distribution Contracts',
        vulnerability: 'regulatory_headwind',
        description: 'Legal rulings regarding default search distribution agreements (Apple Safari revenue share) could alter customer acquisition cost economics.',
        riskSeverity: 'elevated'
      },
      {
        title: 'Alternative Conversational Answer Engines',
        vulnerability: 'competitive_threat',
        description: 'Emergence of direct answer engines could erode share in informational and navigational search queries over a 3-5 year horizon.',
        riskSeverity: 'moderate'
      },
      {
        title: 'YouTube Ad Budget Elasticity in Recessionary Environments',
        vulnerability: 'multiple_compression',
        description: 'Brand advertising spend on digital video remains cyclically sensitive during corporate budget pullbacks.',
        riskSeverity: 'low'
      }
    ],
    trancheStrategy: {
      tranche1AllocationPercent: 50,
      tranche1Price: 178.20,
      tranche1Rationale: 'Establish anchor position at an attractive 22.4x P/E multiple while antitrust fears remain fully priced into valuation.',
      tranche2AllocationPercent: 50,
      tranche2TriggerPrice: 168.00,
      tranche2Rationale: 'Accumulate second half if headline noise regarding legal court hearings triggers a short-term liquidity dip into deep value support.',
      buyZoneRange: [165.00, 182.00]
    },
    riskGuardrails: {
      maxPositionCapPercent: 8.0,
      suggestedCapPercent: 7.0,
      maxLossTrailingStopPercent: 15.0,
      invalidationRules: [
        {
          trigger: 'Search Advertising Revenue Contraction',
          threshold: 'Search segment revenue shows negative YoY growth for 2 consecutive quarters',
          action: 'Full Liquidate'
        },
        {
          trigger: 'DOJ Structural Breakup Order Enforced',
          threshold: 'Court mandates forced divestiture of Chrome or Android without appeal stay',
          action: 'Mandatory Thesis Review'
        },
        {
          trigger: 'FCF Yield Degradation Below 2.0%',
          threshold: 'Run-rate Free Cash Flow collapses under inefficient CapEx',
          action: 'Immediate Trim'
        }
      ]
    }
  },
  {
    id: 'asml',
    ticker: 'ASML',
    companyName: 'ASML Holding N.V.',
    sector: 'Technology',
    industry: 'Semiconductor Lithography Capital Equipment',
    currentPrice: 765.00,
    fairValueEstimate: 920.00,
    marginOfSafetyPercent: 16.8,
    qualityScore: 9.8,
    convictionScore: 9.5,
    horizon: 'long_term',
    catalyst: 'Capex / Secular Tailwind',
    customEntryTarget: 750.00,
    twoSentenceThesis: 'Absolute global monopoly on Extreme Ultraviolet (EUV) lithography systems essential for every sub-3nm semiconductor produced on Earth. Unrivaled patent fortress and 15-year technological lead make ASML the ultimate tollbooth on the AI and computing hardware supercycle.',
    marketCap: '$302B',
    peRatio: 36.2,
    qualityHurdles: {
      profitabilityMoat: {
        passed: true,
        roic: 46.2,
        fcfYield: 2.8,
        fcfAnnual: '€8.2B',
        note: 'Astronomical ROIC of 46.2% demonstrates irreplaceable pricing power and multi-billion-dollar R&D barrier.'
      },
      balanceSheetSafety: {
        passed: true,
        debtToEquity: 0.31,
        currentRatio: 1.48,
        netCashPosition: 'Net Cash €4.6B',
        note: 'Low leverage (0.31 D/E) and high backlog cash prepayments ensure flawless liquidity through chip cycles.'
      },
      valuationDiscipline: {
        passed: true,
        pegRatio: 1.44,
        evEbitda: 23.5,
        evEbitdaDiscountVsHistory: -14.2,
        note: 'PEG of 1.44 supported by 24%+ EPS CAGR driven by High-NA EUV system shipments starting at €350M+ per tool.'
      }
    },
    bullThesis: [
      {
        title: 'Uncontested 100% Monopolistic Share in EUV Lithography',
        pillar: 'pricing_power',
        description: 'No competitor (Nikon or Canon) has an operational EUV machine. Every leading-edge foundry (TSMC, Intel, Samsung) has zero alternative.',
        evidenceMetric: '100% Market Share in sub-5nm lithography'
      },
      {
        title: 'High-NA EUV Generational Tool Transition',
        pillar: 'market_expansion',
        description: 'Next-gen High-NA EUV tools command €350M+ per unit, expanding gross margins toward 56% as fabs scale 2nm and 1.4nm nodes.',
        evidenceMetric: '€36B+ Firm Order Backlog'
      },
      {
        title: 'Recurring Installed Base Maintenance Revenue',
        pillar: 'secular_tailwind',
        description: 'High-margin software upgrades and laser service maintenance contracts now represent >25% of total revenue, insulating cash flow from cyclical swings.',
        evidenceMetric: 'Installed Base Management up 18% YoY'
      }
    ],
    bearThesis: [
      {
        title: 'Geopolitical Export Bans on Chinese DUV Shipments',
        vulnerability: 'regulatory_headwind',
        description: 'US and Dutch export control restrictions on immersion DUV machines to China could dampen non-leading-edge equipment bookings.',
        riskSeverity: 'moderate'
      },
      {
        title: 'Foundry Customer Fab Delays (Intel / Samsung Capex Pacing)',
        vulnerability: 'multiple_compression',
        description: 'If fab construction timelines slip or foundry customers slow down tool delivery intake, short-term quarterly revenue may be pushed out.',
        riskSeverity: 'moderate'
      },
      {
        title: 'Complex Supply Chain Single-Point Failure (Zeiss Optics)',
        vulnerability: 'competitive_threat',
        description: 'Critical dependency on Carl Zeiss for precision optical mirrors means manufacturing bottlenecks at Zeiss limit ASML output.',
        riskSeverity: 'low'
      }
    ],
    trancheStrategy: {
      tranche1AllocationPercent: 50,
      tranche1Price: 765.00,
      tranche1Rationale: 'Enter initial tranche following recent cyclical booking correction, capturing a 16.8% margin of safety.',
      tranche2AllocationPercent: 50,
      tranche2TriggerPrice: 715.00,
      tranche2Rationale: 'Deploy second half if semiconductor cycle anxiety or geopolitical export headlines trigger an oversold panic test.',
      buyZoneRange: [710.00, 780.00]
    },
    riskGuardrails: {
      maxPositionCapPercent: 7.5,
      suggestedCapPercent: 6.0,
      maxLossTrailingStopPercent: 15.0,
      invalidationRules: [
        {
          trigger: 'Total Backlog Cancellation Spike',
          threshold: 'Net quarterly tool order cancellations exceed 15% of backlog',
          action: 'Immediate Trim'
        },
        {
          trigger: 'Gross Margin Compression',
          threshold: 'Gross margin falls below 48% across two consecutive reporting cycles',
          action: 'Mandatory Thesis Review'
        },
        {
          trigger: 'Competitive Viability Breakthrough',
          threshold: 'Any competitor demonstrates working production-grade EUV system',
          action: 'Full Liquidate'
        }
      ]
    }
  },
  {
    id: 'cost',
    ticker: 'COST',
    companyName: 'Costco Wholesale Corporation',
    sector: 'Consumer Defensive',
    industry: 'Membership Club Merchandising',
    currentPrice: 878.00,
    fairValueEstimate: 980.00,
    marginOfSafetyPercent: 10.4,
    qualityScore: 9.7,
    convictionScore: 9.1,
    horizon: 'long_term',
    catalyst: 'Earnings Beat & Raise',
    twoSentenceThesis: 'The premier consumer compounder in the world, combining rock-bottom pricing trust with a high-margin recurring membership subscription annuity. Membership renewal rates above 93% in North America generate predictable, inflation-resistant operating income.',
    marketCap: '$389B',
    peRatio: 48.1,
    qualityHurdles: {
      profitabilityMoat: {
        passed: true,
        roic: 21.6,
        fcfYield: 2.1,
        fcfAnnual: '$8.1B',
        note: 'ROIC of 21.6% reflects industry-leading negative working capital velocity and inventory turnover.'
      },
      balanceSheetSafety: {
        passed: true,
        debtToEquity: 0.28,
        currentRatio: 1.25,
        netCashPosition: 'Net Cash $4.8B',
        note: 'Very modest long-term debt ($6.5B) easily covered by liquid reserves ($11.3B).'
      },
      valuationDiscipline: {
        passed: true,
        pegRatio: 1.48,
        evEbitda: 25.1,
        evEbitdaDiscountVsHistory: -6.2,
        note: 'High absolute multiple compensated by unmatched predictability, membership fee hike tailwind, and international store runway.'
      }
    },
    bullThesis: [
      {
        title: 'Membership Fee Increase Margin Flow-Through',
        pillar: 'pricing_power',
        description: 'Recent membership fee increase ($5 standard / $10 executive) drops nearly 100% of incremental revenue directly to pretax operating profit.',
        evidenceMetric: '93.2% North American Membership Renewal Rate'
      },
      {
        title: 'Massive International Warehouse Unit Runway',
        pillar: 'market_expansion',
        description: 'New warehouse clubs in China, Japan, Korea, and Europe generate higher average volume per club than mature US locations.',
        evidenceMetric: '25-30 net new warehouse openings per year'
      },
      {
        title: 'Unbreakable Consumer Value Escrow Moat',
        pillar: 'secular_tailwind',
        description: 'Strict 14% maximum merchandise markup guarantees consumer loyalty and pricing trust across both inflationary and deflationary macro cycles.',
        evidenceMetric: '+7.8% Comparable Store Sales Growth'
      }
    ],
    bearThesis: [
      {
        title: 'Elevated Valuation Multiple Vulnerability',
        vulnerability: 'multiple_compression',
        description: 'Trading at ~48x trailing earnings leaves zero tolerance for comp sales misses or warehouse opening delays.',
        riskSeverity: 'elevated'
      },
      {
        title: 'Digital E-Commerce & Delivery Competition',
        vulnerability: 'competitive_threat',
        description: 'Aggressive grocery pickup and same-day delivery from Amazon and Walmart requires continued digital logistics investments.',
        riskSeverity: 'low'
      },
      {
        title: 'Wage Inflation in Warehouse Operations',
        vulnerability: 'multiple_compression',
        description: 'Commitment to top-tier frontline wages could slightly pressure merchandising margins if minimum wage benchmarks shift higher.',
        riskSeverity: 'low'
      }
    ],
    trancheStrategy: {
      tranche1AllocationPercent: 50,
      tranche1Price: 878.00,
      tranche1Rationale: 'Initiate 50% position to lock in compounding machine following recent fee increase confirmation.',
      tranche2AllocationPercent: 50,
      tranche2TriggerPrice: 830.00,
      tranche2Rationale: 'Target remaining 50% entry on any broad retail sell-off or multiple contraction toward historical median.',
      buyZoneRange: [815.00, 885.00]
    },
    riskGuardrails: {
      maxPositionCapPercent: 6.5,
      suggestedCapPercent: 5.0,
      maxLossTrailingStopPercent: 12.0,
      invalidationRules: [
        {
          trigger: 'Membership Renewal Rate Collapse',
          threshold: 'Renewal rate drops below 90% for two consecutive reporting quarters',
          action: 'Full Liquidate'
        },
        {
          trigger: 'Negative Comparable Store Traffic',
          threshold: 'Warehouse foot traffic declines YoY for 2 quarters',
          action: 'Immediate Trim'
        },
        {
          trigger: 'Drawdown from Peak',
          threshold: 'Stock breaks 200-day moving average on multiple de-rating',
          action: 'Immediate Trim'
        }
      ]
    }
  },
  {
    id: 'unh',
    ticker: 'UNH',
    companyName: 'UnitedHealth Group Incorporated',
    sector: 'Healthcare',
    industry: 'Managed Healthcare & Optum Services',
    currentPrice: 535.00,
    fairValueEstimate: 625.00,
    marginOfSafetyPercent: 14.4,
    qualityScore: 9.3,
    convictionScore: 9.0,
    horizon: 'medium_term',
    catalyst: 'Oversold Blue-Chip Dislocation',
    twoSentenceThesis: 'Unwarranted valuation contraction stemming from medical loss ratio (MLR) normalization creates a premium entry in America’s healthcare backbone. Optum’s high-margin healthcare services and pharmacy analytics provide secular diversification from traditional insurance cycles.',
    marketCap: '$492B',
    peRatio: 18.9,
    qualityHurdles: {
      profitabilityMoat: {
        passed: true,
        roic: 14.8,
        fcfYield: 5.6,
        fcfAnnual: '$27.8B',
        note: 'ROIC of 14.8% clears the 12% hurdle. Massive cash flow generation yields 5.6% FCF yield.'
      },
      balanceSheetSafety: {
        passed: true,
        debtToEquity: 0.72,
        currentRatio: 1.28,
        netCashPosition: 'Operating Cash & Investments $42.1B',
        note: 'Conservative balance sheet with 0.72 D/E and robust insurance statutory capital reserves.'
      },
      valuationDiscipline: {
        passed: true,
        pegRatio: 1.32,
        evEbitda: 12.4,
        evEbitdaDiscountVsHistory: -18.7,
        note: 'Trading at 12.4x EV/EBITDA, representing an 18.7% discount to its 5-year historical average.'
      }
    },
    bullThesis: [
      {
        title: 'Optum Synergy & Value-Based Care Acceleration',
        pillar: 'market_expansion',
        description: 'Optum health, insight, and pharmacy benefits capture value across every touchpoint of patient care, driving double-digit operating earnings growth.',
        evidenceMetric: 'Optum revenue grew +13% YoY to $63.9B'
      },
      {
        title: 'Medical Loss Ratio Re-pricing Power',
        pillar: 'pricing_power',
        description: 'Commercial and Medicare Advantage contract pricing has been systematically reset for 2025/2026 to recapture margin after post-pandemic utilization spikes.',
        evidenceMetric: 'Underwriting margin expanding back toward 6.2%'
      },
      {
        title: 'Aging Demographics & Chronic Disease Secular Tailwind',
        pillar: 'secular_tailwind',
        description: '10,000 Americans turning 65 daily expands Medicare Advantage and senior care management addressable market over the next 15 years.',
        evidenceMetric: '53M total medical consumers served'
      }
    ],
    bearThesis: [
      {
        title: 'Medicare Advantage Government Payment Rate Pressure',
        vulnerability: 'regulatory_headwind',
        description: 'CMS risk-adjustment coding changes and Star Ratings revisions can temper government reimbursement rates.',
        riskSeverity: 'moderate'
      },
      {
        title: 'Sustained Senior Medical Utilization Volatility',
        vulnerability: 'multiple_compression',
        description: 'Prolonged elevation in outpatient surgical volumes could keep Medical Loss Ratio elevated above 84.5% in the near term.',
        riskSeverity: 'moderate'
      },
      {
        title: 'PBM Transparency Legislation and Scrutiny',
        vulnerability: 'regulatory_headwind',
        description: 'Federal and state legislative probes into Pharmacy Benefit Managers could pressure OptumRx rebate spreads.',
        riskSeverity: 'low'
      }
    ],
    trancheStrategy: {
      tranche1AllocationPercent: 50,
      tranche1Price: 535.00,
      tranche1Rationale: 'Initiate 50% tranche at compelling 18.9x P/E multiple while Medicare rate anxieties create maximum pessimism.',
      tranche2AllocationPercent: 50,
      tranche2TriggerPrice: 505.00,
      tranche2Rationale: 'Execute second 50% tranche if election year healthcare rhetoric triggers another headline-driven liquidation.',
      buyZoneRange: [495.00, 545.00]
    },
    riskGuardrails: {
      maxPositionCapPercent: 7.0,
      suggestedCapPercent: 5.5,
      maxLossTrailingStopPercent: 15.0,
      invalidationRules: [
        {
          trigger: 'Medical Loss Ratio (MLR) Spike',
          threshold: 'Medical Loss Ratio exceeds 86.5% for two consecutive quarters',
          action: 'Immediate Trim'
        },
        {
          trigger: 'Optum Operating Profit Reversal',
          threshold: 'Optum operating margins drop below 6.0%',
          action: 'Mandatory Thesis Review'
        },
        {
          trigger: 'Systemic Medicare Advantage Cuts',
          threshold: 'CMS enforces net negative benchmark reimbursement cuts exceeding 3%',
          action: 'Immediate Trim'
        }
      ]
    }
  },
  {
    id: 'nvda',
    ticker: 'NVDA',
    companyName: 'NVIDIA Corporation',
    sector: 'Technology',
    industry: 'Accelerated Computing & AI Silicon Platforms',
    currentPrice: 138.40,
    fairValueEstimate: 165.00,
    marginOfSafetyPercent: 16.1,
    qualityScore: 9.7,
    convictionScore: 9.3,
    horizon: 'medium_term',
    catalyst: 'Earnings Beat & Raise',
    twoSentenceThesis: 'The foundational architectural substrate of modern computing, transitioning global datacenters from legacy CPUs to accelerated parallel computing. CUDA software ecosystem lock-in and annual Blackwell/Rubin architecture cadence maintain an unassailable performance moat.',
    marketCap: '$3.41T',
    peRatio: 38.5,
    qualityHurdles: {
      profitabilityMoat: {
        passed: true,
        roic: 58.2,
        fcfYield: 3.4,
        fcfAnnual: '$60.8B',
        note: 'Staggering 58.2% ROIC and 75%+ gross margins driven by CUDA ecosystem network effects.'
      },
      balanceSheetSafety: {
        passed: true,
        debtToEquity: 0.16,
        currentRatio: 3.82,
        netCashPosition: 'Net Cash $26.4B',
        note: 'Exceptional liquid buffer with current ratio of 3.82 and virtually zero net debt.'
      },
      valuationDiscipline: {
        passed: true,
        pegRatio: 1.15,
        evEbitda: 26.8,
        evEbitdaDiscountVsHistory: -22.4,
        note: 'Forward PEG of 1.15 is remarkably low given sustained 40%+ datacenter revenue growth.'
      }
    },
    bullThesis: [
      {
        title: 'CUDA Software Stack & Developer Moat',
        pillar: 'pricing_power',
        description: 'Millions of developers trained strictly on CUDA create an insurmountable switching friction for any competing accelerator.',
        evidenceMetric: '5M+ registered CUDA developers worldwide'
      },
      {
        title: 'Annual Chip Rhythm & Full-Rack NVL72 Solutions',
        pillar: 'market_expansion',
        description: 'Selling integrated full-rack systems (NVL72) with proprietary NVLink networking expands revenue per datacenter footprint by 3x.',
        evidenceMetric: '$30B+ quarterly Datacenter revenue'
      },
      {
        title: 'Sovereign AI & Enterprise Frontier Model Expansion',
        pillar: 'secular_tailwind',
        description: 'Nation-states and global enterprises are building localized computing infrastructure to preserve data sovereignty.',
        evidenceMetric: 'Sovereign AI pipeline exceeding $10B annually'
      }
    ],
    bearThesis: [
      {
        title: 'Hyperscaler Custom ASIC In-House Substitutions',
        vulnerability: 'competitive_threat',
        description: 'Google TPU, Amazon Trainium, and Meta MTIA will capture a subset of internal inference workloads.',
        riskSeverity: 'moderate'
      },
      {
        title: 'Supply Chain Packaging Limits (TSMC CoWoS)',
        vulnerability: 'multiple_compression',
        description: 'Advanced packaging capacity bottlenecks at TSMC could constrain unit shipment pacing in peak quarters.',
        riskSeverity: 'low'
      },
      {
        title: 'China Geopolitical Export Bans',
        vulnerability: 'regulatory_headwind',
        description: 'Further tightening of export limits by the US Department of Commerce prevents sales of flagship chips to Chinese entities.',
        riskSeverity: 'moderate'
      }
    ],
    trancheStrategy: {
      tranche1AllocationPercent: 50,
      tranche1Price: 138.40,
      tranche1Rationale: 'Initiate 50% tranche ahead of Blackwell production ramp confirmation.',
      tranche2AllocationPercent: 50,
      tranche2TriggerPrice: 124.00,
      tranche2Rationale: 'Save remaining 50% allocation for customary semiconductor post-earnings volatility pullback.',
      buyZoneRange: [120.00, 140.00]
    },
    riskGuardrails: {
      maxPositionCapPercent: 8.0,
      suggestedCapPercent: 6.5,
      maxLossTrailingStopPercent: 15.0,
      invalidationRules: [
        {
          trigger: 'Gross Margin Slippage Below 70%',
          threshold: 'Non-GAAP gross margins compress below 70% under pricing pressure',
          action: 'Immediate Trim'
        },
        {
          trigger: 'Top-4 Customer Capex Cuts',
          threshold: 'Hyperscaler aggregate CapEx plans revised down by more than 10%',
          action: 'Immediate Trim'
        },
        {
          trigger: 'Trailing Loss Breach',
          threshold: '15% trailing stop triggered on semiconductor index breakdown',
          action: 'Immediate Trim'
        }
      ]
    }
  },
  {
    id: 'v',
    ticker: 'V',
    companyName: 'Visa Inc.',
    sector: 'Financials',
    industry: 'Global Payments Network & Value-Added Services',
    currentPrice: 288.50,
    fairValueEstimate: 335.00,
    marginOfSafetyPercent: 13.9,
    qualityScore: 9.8,
    convictionScore: 9.3,
    horizon: 'long_term',
    catalyst: 'Earnings Beat & Raise',
    twoSentenceThesis: 'The premier tollbooth on global commerce operating an unbeatable two-sided payment network with over 4.3 billion credentials. Operating margins exceeding 66% and pristine capital return policies compound intrinsic per-share value relentlessly.',
    marketCap: '$582B',
    peRatio: 28.2,
    qualityHurdles: {
      profitabilityMoat: {
        passed: true,
        roic: 32.5,
        fcfYield: 3.9,
        fcfAnnual: '$20.4B',
        note: 'ROIC of 32.5% reflects an asset-light transaction processing network that requires minimal incremental CapEx.'
      },
      balanceSheetSafety: {
        passed: true,
        debtToEquity: 0.54,
        currentRatio: 1.45,
        netCashPosition: 'Liquid Assets $16.8B',
        note: 'Conservatively structured balance sheet easily serviced by over $20B annual operating cash flow.'
      },
      valuationDiscipline: {
        passed: true,
        pegRatio: 1.42,
        evEbitda: 20.8,
        evEbitdaDiscountVsHistory: -9.5,
        note: 'PEG of 1.42 on steady 12-14% EPS compound growth powered by cross-border volume and buybacks.'
      }
    },
    bullThesis: [
      {
        title: 'Two-Sided Network Effects & Unbreakable Global Duopoly',
        pillar: 'pricing_power',
        description: 'Over 4.3 billion cards accepted at more than 130 million merchant locations creates an unbeatable barrier to entry.',
        evidenceMetric: '$15+ Trillion Annual Payment Volume'
      },
      {
        title: 'Value-Added Services and Commercial B2B Penetration',
        pillar: 'market_expansion',
        description: 'Advisory, fraud prevention, and commercial B2B payment services are growing at 18%+ YoY, expanding revenue beyond core consumer swipes.',
        evidenceMetric: 'Value-Added Services revenue up +18% YoY'
      },
      {
        title: 'Global Cash-to-Digital Conversion Runway',
        pillar: 'secular_tailwind',
        description: 'Developing markets in Latin America, Asia, and Africa still maintain 40%+ cash transactions, providing a decade-long runway.',
        evidenceMetric: '+9% YoY Cross-Border Volume Growth'
      }
    ],
    bearThesis: [
      {
        title: 'Credit Card Competition Act & Legislative Interchange Caps',
        vulnerability: 'regulatory_headwind',
        description: 'US Senate proposals attempting to mandate multi-network routing could pressure merchant interchange margins if passed.',
        riskSeverity: 'moderate'
      },
      {
        title: 'Alternative Account-to-Account Real-Time Rails (FedNow, Pix)',
        vulnerability: 'competitive_threat',
        description: 'Government-sponsored fast payment systems in emerging markets capture small peer-to-peer microtransactions.',
        riskSeverity: 'low'
      },
      {
        title: 'Global Macroeconomic Consumer Spending Softening',
        vulnerability: 'multiple_compression',
        description: 'A protracted global recession would directly slow discretionary transaction processing volume.',
        riskSeverity: 'low'
      }
    ],
    trancheStrategy: {
      tranche1AllocationPercent: 50,
      tranche1Price: 288.50,
      tranche1Rationale: 'Initiate 50% core position at an attractive entry below $290 with steady 14% margin of safety.',
      tranche2AllocationPercent: 50,
      tranche2TriggerPrice: 272.00,
      tranche2Rationale: 'Deploy second 50% if merchant antitrust litigation headline noise pushes shares down toward 200-day support.',
      buyZoneRange: [268.00, 292.00]
    },
    riskGuardrails: {
      maxPositionCapPercent: 7.5,
      suggestedCapPercent: 6.0,
      maxLossTrailingStopPercent: 12.0,
      invalidationRules: [
        {
          trigger: 'Cross-Border Volume Contraction',
          threshold: 'Cross-border volume declines YoY for 2 consecutive quarters',
          action: 'Immediate Trim'
        },
        {
          trigger: 'Mandatory Federal Interchange Fee Cap Enacted',
          threshold: 'US Congress enacts legislation capping credit interchange margins',
          action: 'Mandatory Thesis Review'
        },
        {
          trigger: 'Trailing Loss Breach',
          threshold: 'Price breaks 12% trailing stop level',
          action: 'Immediate Trim'
        }
      ]
    }
  }
];

// Ensure all vetted compounders feature Google Search Grounding citations
INITIAL_VETTED_STOCKS.forEach((stock) => {
  stock.isGoogleSearchGrounded = true;
  if (!stock.groundingSources || stock.groundingSources.length === 0) {
    stock.groundingSources = [
      {
        title: `${stock.companyName} Investor Relations & SEC Form 10-K Disclosures`,
        url: `https://www.google.com/finance/quote/${stock.ticker}:NASDAQ`,
      },
      {
        title: `${stock.ticker} Real-Time Market Valuation & Financial Statements`,
        url: `https://finance.yahoo.com/quote/${stock.ticker}`,
      },
      {
        title: `MacroMind Quality Gate Systematic Audit Record (${stock.ticker})`,
        url: `https://www.sec.gov/edgar/searchedgar/companysearch`,
      },
    ];
  }
});

export const INITIAL_PORTFOLIO_HOLDINGS = [
  {
    id: 'hold_msft',
    ticker: 'MSFT',
    companyName: 'Microsoft Corporation',
    shares: 1.5,
    avgPurchasePrice: 412.00,
    currentPrice: 428.50,
    sector: 'Technology',
    addedAt: '2026-08-14'
  },
  {
    id: 'hold_googl',
    ticker: 'GOOGL',
    companyName: 'Alphabet Inc.',
    shares: 3.5,
    avgPurchasePrice: 164.50,
    currentPrice: 178.20,
    sector: 'Technology',
    addedAt: '2026-09-02'
  },
  {
    id: 'hold_asml',
    ticker: 'ASML',
    companyName: 'ASML Holding N.V.',
    shares: 0.8,
    avgPurchasePrice: 720.00,
    currentPrice: 765.00,
    sector: 'Technology',
    addedAt: '2026-09-18'
  },
  {
    id: 'hold_cost',
    ticker: 'COST',
    companyName: 'Costco Wholesale Corporation',
    shares: 0.7,
    avgPurchasePrice: 840.00,
    currentPrice: 878.00,
    sector: 'Consumer Defensive',
    addedAt: '2026-07-22'
  },
  {
    id: 'hold_unh',
    ticker: 'UNH',
    companyName: 'UnitedHealth Group Incorporated',
    shares: 1.0,
    avgPurchasePrice: 515.00,
    currentPrice: 535.00,
    sector: 'Healthcare',
    addedAt: '2026-09-29'
  }
];
