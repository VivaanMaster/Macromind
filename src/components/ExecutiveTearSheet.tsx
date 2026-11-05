import React, { useState } from 'react';
import { StockResearchData } from '../types/stock';
import { 
  ArrowLeft, 
  Printer, 
  PlusCircle, 
  ExternalLink
} from 'lucide-react';

interface ExecutiveTearSheetProps {
  stock: StockResearchData;
  onBack: () => void;
  onAddToPortfolio: (stock: StockResearchData, targetAllocationPercent: number) => void;
  totalPortfolioCapital: number;
  onUpdateEntryTarget?: (ticker: string, targetPrice: number | undefined) => void;
}

export const ExecutiveTearSheet: React.FC<ExecutiveTearSheetProps> = ({
  stock,
  onBack,
  onAddToPortfolio,
  totalPortfolioCapital,
  onUpdateEntryTarget,
}) => {
  const [targetCapPercent, setTargetCapPercent] = useState<number>(stock.riskGuardrails.suggestedCapPercent);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);
  const [entryTargetInput, setEntryTargetInput] = useState<string>(
    stock.customEntryTarget
      ? stock.customEntryTarget.toString()
      : stock.trancheStrategy.tranche2TriggerPrice.toString()
  );
  const [targetSavedToast, setTargetSavedToast] = useState<boolean>(false);

  // Position sizing calculation based on user's portfolio capital
  const allocatedDollars = (totalPortfolioCapital * targetCapPercent) / 100;
  const estimatedShares = Math.max(0.1, Math.round((allocatedDollars / stock.currentPrice) * 10) / 10);

  const handleSaveTarget = () => {
    const val = parseFloat(entryTargetInput);
    if (!isNaN(val) && val > 0 && onUpdateEntryTarget) {
      onUpdateEntryTarget(stock.ticker, val);
      setTargetSavedToast(true);
      setTimeout(() => setTargetSavedToast(false), 3000);
    }
  };

  const handleClearTarget = () => {
    if (onUpdateEntryTarget) {
      onUpdateEntryTarget(stock.ticker, undefined);
      setEntryTargetInput(stock.trancheStrategy.tranche2TriggerPrice.toString());
      setTargetSavedToast(false);
    }
  };

  const handleAdd = () => {
    onAddToPortfolio(stock, targetCapPercent);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  // Pillar name formatting
  const getPillarLabel = (p: string) => {
    switch (p) {
      case 'pricing_power':
        return 'Pillar 1: Structural Pricing Power';
      case 'market_expansion':
        return 'Pillar 2: Market Share Expansion';
      case 'secular_tailwind':
        return 'Pillar 3: Secular Compounder Tailwind';
      default:
        return 'Strategic Moat Pillar';
    }
  };

  const getVulnerabilityLabel = (v: string) => {
    switch (v) {
      case 'competitive_threat':
        return 'Vulnerability 1: Competitive Threats & Substitution';
      case 'regulatory_headwind':
        return 'Vulnerability 2: Regulatory & Antitrust Headwinds';
      case 'multiple_compression':
        return 'Vulnerability 3: Multiple Compression & Cyclicality';
      default:
        return 'Primary Vulnerability';
    }
  };

  return (
    <div className="space-y-6 pb-12 print:text-black print:bg-white">
      {/* Top action header: navigation, status, print & add to portfolio */}
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Screener Feed</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141C2E] hover:bg-[#1E293B] border border-[#23314B] text-slate-300 hover:text-white text-xs font-medium rounded transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Export Memorandum (Print)</span>
          </button>

          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-xs rounded transition-colors shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{addedSuccess ? 'Added to Portfolio!' : 'Add to Portfolio Simulator'}</span>
          </button>
        </div>
      </div>

      {/* Main One-Page Memorandum Container */}
      <div className="bg-[#0B0F19] border border-[#1E293B] rounded-lg p-6 lg:p-8 space-y-8 shadow-sm">
        
        {/* Section 1: Header & Institutional Verdict */}
        <div className="border-b border-[#1E293B] pb-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <span className="font-mono font-extrabold text-2xl lg:text-3xl text-white tracking-tight">
                  {stock.ticker}
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-lg font-semibold text-slate-200">
                  {stock.companyName}
                </span>
                {stock.isAiAudited && (
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                    Autonomous Due Diligence
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1">
                <span>{stock.sector}</span>
                <span className="text-slate-600">/</span>
                <span>{stock.industry}</span>
                <span className="text-slate-600">·</span>
                <span>Market Cap: <strong className="text-slate-200 font-mono">{stock.marketCap}</strong></span>
                <span className="text-slate-600">·</span>
                <span>Horizon: <strong className="text-cyan-400 font-mono">{stock.horizon === 'long_term' ? 'Long-Term Compounder (1+ Yr)' : 'Medium-Term Position'}</strong></span>
              </div>
            </div>

            {/* Conviction Score Card */}
            <div className="flex items-center gap-4 bg-[#0F1626] border border-[#1E293B] rounded-lg p-3.5 shrink-0">
              <div>
                <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  Conviction Score
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-mono text-2xl font-extrabold text-emerald-400 tabular-nums">
                    {stock.convictionScore}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">/ 10</span>
                </div>
              </div>

              <div className="h-10 w-px bg-[#1E293B]" />

              <div>
                <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  Quality Grade
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-mono text-2xl font-extrabold text-white tabular-nums">
                    {stock.qualityScore}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">/ 10</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2-Sentence Core Investment Thesis */}
          <div className="mt-5 p-4 bg-[#0D1424] border border-[#1E293B] rounded-lg">
            <span className="text-[10px] font-mono font-bold tracking-wider text-emerald-400 uppercase block mb-1">
              Executive Verdict &amp; Thesis
            </span>
            <p className="text-sm text-slate-200 font-medium leading-relaxed">
              {stock.twoSentenceThesis}
            </p>
          </div>

          {/* 3 Mandatory Hurdles Verification Bar */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex items-center justify-between p-2.5 bg-[#0D1424] border border-[#1B253B] rounded text-xs">
              <span className="text-slate-300">
                ROIC: <strong className="font-mono text-emerald-400">{stock.qualityHurdles.profitabilityMoat.roic}%</strong> (&gt;12%)
              </span>
              <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-1.5 py-0.5 rounded">PASSED</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-[#0D1424] border border-[#1B253B] rounded text-xs">
              <span className="text-slate-300">
                D/E: <strong className="font-mono text-emerald-400">{stock.qualityHurdles.balanceSheetSafety.debtToEquity}</strong> (&lt;1.5)
              </span>
              <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-1.5 py-0.5 rounded">PASSED</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-[#0D1424] border border-[#1B253B] rounded text-xs">
              <span className="text-slate-300">
                PEG: <strong className="font-mono text-emerald-400">{stock.qualityHurdles.valuationDiscipline.pegRatio}</strong> (&lt;1.5)
              </span>
              <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-1.5 py-0.5 rounded">PASSED</span>
            </div>
          </div>
        </div>

        {/* Section 2 & 3: 3-Point Bull Thesis & Devil's Advocate Bear Case in 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Section 2: 3-Point Bull Thesis */}
          <div className="space-y-4">
            <div className="pb-2 border-b border-[#1E293B]">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                01. 3-Point Structural Compounder Bull Thesis
              </h3>
            </div>

            <div className="space-y-3">
              {stock.bullThesis.map((bull, idx) => (
                <div key={idx} className="p-3.5 bg-[#0F1626] border border-[#1E293B] rounded-lg">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                      {getPillarLabel(bull.pillar)}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1">
                    {bull.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-2">
                    {bull.description}
                  </p>
                  <div className="text-[11px] font-mono text-slate-300 bg-[#0B0F19] px-2.5 py-1 rounded border border-[#1A253B]">
                    <span className="text-slate-500 mr-1.5">Proof Metric:</span>
                    <span className="text-emerald-400 font-semibold">{bull.evidenceMetric}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Devil's Advocate Bear Case */}
          <div className="space-y-4">
            <div className="pb-2 border-b border-[#1E293B]">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                02. Devil&apos;s Advocate Bear Case (Primary Vulnerabilities)
              </h3>
            </div>

            <div className="space-y-3">
              {stock.bearThesis.map((bear, idx) => (
                <div key={idx} className="p-3.5 bg-[#0F1626] border border-[#1E293B] rounded-lg">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-mono text-rose-400 font-semibold">
                      {getVulnerabilityLabel(bear.vulnerability)}
                    </span>
                    <span className={`text-[10px] font-mono uppercase px-1.5 py-0.2 rounded border ${
                      bear.riskSeverity === 'elevated'
                        ? 'text-rose-400 bg-rose-950/40 border-rose-800/40'
                        : bear.riskSeverity === 'moderate'
                        ? 'text-amber-400 bg-amber-950/40 border-amber-800/40'
                        : 'text-slate-400 bg-slate-900 border-slate-700'
                    }`}>
                      {bear.riskSeverity} risk
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1">
                    {bear.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {bear.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Valuation & 2-Tranche Accumulation Guidance */}
        <div className="p-5 bg-[#0F1626] border border-[#1E293B] rounded-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#1E293B]">
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                03. Valuation Discipline &amp; 2-Tranche Entry Strategy
              </h3>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span>Current Price: <strong className="font-mono text-white">${stock.currentPrice.toFixed(2)}</strong></span>
              <span className="text-slate-600">·</span>
              <span>Fair Value: <strong className="font-mono text-emerald-400">${stock.fairValueEstimate.toFixed(2)}</strong></span>
              <span className="text-slate-600">·</span>
              <span>Margin of Safety: <strong className="font-mono text-emerald-400">+{stock.marginOfSafetyPercent}%</strong></span>
            </div>
          </div>

          {/* Visual Valuation Spectrum Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>Deep Buy Zone (${stock.trancheStrategy.buyZoneRange[0].toFixed(2)})</span>
              <span>Current Price (${stock.currentPrice.toFixed(2)})</span>
              <span>Fair Value (${stock.fairValueEstimate.toFixed(2)})</span>
            </div>
            <div className="h-3 w-full bg-[#0B0F19] rounded-full overflow-hidden flex border border-[#1E293B]">
              <div className="h-full bg-emerald-700/80 w-1/3" title="Buy Zone" />
              <div className="h-full bg-emerald-500/70 w-1/3" title="Fair Value Zone" />
              <div className="h-full bg-amber-600/50 w-1/3" title="Fully Valued" />
            </div>
          </div>

          {/* 2-Tranche Structure Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-3.5 bg-[#0B0F19] border border-[#1E293B] rounded-lg">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-white">
                  Tranche 1 (50% Core Allocation)
                </span>
                <span className="font-mono text-xs text-emerald-400 font-semibold">
                  Entry: ${stock.trancheStrategy.tranche1Price.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {stock.trancheStrategy.tranche1Rationale}
              </p>
            </div>

            <div className="p-3.5 bg-[#0B0F19] border border-[#1E293B] rounded-lg">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-white">
                  Tranche 2 (50% Pullback Reserve)
                </span>
                <span className="font-mono text-xs text-cyan-400 font-semibold">
                  Trigger: ${stock.trancheStrategy.tranche2TriggerPrice.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {stock.trancheStrategy.tranche2Rationale}
              </p>
            </div>
          </div>

          {/* Custom Entry Target Price Module */}
          <div className="pt-3 border-t border-[#1E293B]">
            <div className="p-4 bg-[#0B0F19] border border-[#1E293B] rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Custom Entry Target Order Rule
                  </span>
                </div>
                <div>
                  {stock.customEntryTarget ? (
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Active Target: ${stock.customEntryTarget.toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono text-slate-500 bg-[#141C2E] px-2 py-0.5 rounded">
                      No Target Set
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                <div className="lg:col-span-5 space-y-2">
                  <label className="block text-[11px] text-slate-400">
                    Set your desired entry price (monitored in Portfolio tab):
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-slate-500 font-mono text-xs">
                        $
                      </span>
                      <input
                        type="number"
                        step="0.5"
                        min="1"
                        value={entryTargetInput}
                        onChange={(e) => setEntryTargetInput(e.target.value)}
                        placeholder="e.g. 415.00"
                        className="w-full bg-[#0F1626] border border-[#27354F] focus:border-emerald-500 text-white font-mono text-xs pl-6 pr-2 py-1.5 rounded focus:outline-none tabular-nums"
                      />
                    </div>
                    <button
                      onClick={handleSaveTarget}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-xs rounded transition-colors whitespace-nowrap"
                    >
                      {stock.customEntryTarget ? 'Update Target' : 'Set Target'}
                    </button>
                    {stock.customEntryTarget && (
                      <button
                        onClick={handleClearTarget}
                        className="px-2.5 py-1.5 bg-[#162138] hover:bg-rose-900/60 hover:text-rose-300 border border-[#23314B] text-slate-400 text-xs rounded transition-colors"
                        title="Clear Target"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Quick preset buttons */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-400 pt-1">
                    <span className="text-slate-500">Presets:</span>
                    <button
                      onClick={() => setEntryTargetInput(stock.trancheStrategy.tranche2TriggerPrice.toString())}
                      className="px-1.5 py-0.5 bg-[#141C2E] hover:bg-[#1E293B] border border-[#23314B] rounded font-mono text-slate-300"
                    >
                      Tranche 2 (${stock.trancheStrategy.tranche2TriggerPrice.toFixed(2)})
                    </button>
                    <button
                      onClick={() => setEntryTargetInput(stock.trancheStrategy.buyZoneRange[0].toString())}
                      className="px-1.5 py-0.5 bg-[#141C2E] hover:bg-[#1E293B] border border-[#23314B] rounded font-mono text-slate-300"
                    >
                      Buy Zone Min (${stock.trancheStrategy.buyZoneRange[0].toFixed(2)})
                    </button>
                    <button
                      onClick={() => setEntryTargetInput((Math.round(stock.currentPrice * 0.95 * 10) / 10).toString())}
                      className="px-1.5 py-0.5 bg-[#141C2E] hover:bg-[#1E293B] border border-[#23314B] rounded font-mono text-slate-300"
                    >
                      -5% Dip
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-7 bg-[#0F1626] border border-[#1E293B] rounded p-3">
                  {stock.customEntryTarget ? (
                    (() => {
                      const target = stock.customEntryTarget;
                      const priceDiff = stock.currentPrice - target;
                      const pctDiff = (priceDiff / stock.currentPrice) * 100;
                      const isTriggerHit = stock.currentPrice <= target;
                      const isApproaching = !isTriggerHit && pctDiff <= 3.5;

                      return (
                        <div className="space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Current vs Target:</span>
                            <span className="font-mono font-semibold text-white">
                              ${stock.currentPrice.toFixed(2)} vs ${target.toFixed(2)}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Proximity Status:</span>
                            {isTriggerHit ? (
                              <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-700 px-2 py-0.5 rounded flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                                IN BUY ZONE (Trigger Hit)
                              </span>
                            ) : isApproaching ? (
                              <span className="font-mono text-xs font-bold text-amber-400 bg-amber-950/80 border border-amber-700 px-2 py-0.5 rounded flex items-center gap-1.5">
                                APPROACHING ({pctDiff.toFixed(1)}% away)
                              </span>
                            ) : (
                              <span className="font-mono text-xs text-slate-300 bg-slate-900 border border-slate-700 px-2 py-0.5 rounded">
                                MONITORING ({pctDiff.toFixed(1)}% away)
                              </span>
                            )}
                          </div>

                          {/* Proximity visual meter */}
                          <div className="pt-1">
                            <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-1">
                              <span>Target: ${target.toFixed(2)}</span>
                              <span>{isTriggerHit ? 'Trigger Active' : `${pctDiff.toFixed(1)}% Gap to Trigger`}</span>
                              <span>Market: ${stock.currentPrice.toFixed(2)}</span>
                            </div>
                            <div className="h-2 w-full bg-[#0B0F19] rounded-full overflow-hidden border border-[#1E293B]">
                              <div
                                className={`h-full transition-all ${
                                  isTriggerHit ? 'bg-emerald-400' : isApproaching ? 'bg-amber-400' : 'bg-cyan-500'
                                }`}
                                style={{ width: `${Math.min(100, Math.max(15, 100 - pctDiff * 8))}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="text-slate-500 text-xs py-2 text-center">
                      Set a custom entry target price above to monitor this stock and receive automatic visual alerts in the Portfolio Monitor when market prices drop into your buy trigger.
                    </div>
                  )}

                  {targetSavedToast && (
                    <div className="mt-2 text-[11px] font-mono text-emerald-400 text-center">
                      ✓ Entry target saved! Monitored in Portfolio tab with proximity alert.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Strict Risk Guardrails, Position Sizing & Thesis Invalidation */}
        <div className="p-5 bg-[#0F1626] border border-[#1E293B] rounded-lg space-y-5">
          <div className="pb-2 border-b border-[#1E293B]">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              04. Institutional Risk Guardrails &amp; Position Sizing
            </h3>
          </div>

          {/* Max Position Cap Warning & Calculator */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* Position Cap Rule */}
            <div className="p-4 bg-[#0B0F19] border border-[#1E293B] rounded-lg flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">
                  Hard Portfolio Guardrail
                </span>
                <div className="text-sm font-bold text-white mb-1.5">
                  5.0% - 8.0% Max Position Cap
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Never exceed 8.0% total portfolio capital on any single ticker. Concentration above 8.0% triggers an immediate automatic trimming recommendation.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1E293B] flex items-center justify-between text-xs">
                <span className="text-slate-400">Suggested Target Cap:</span>
                <span className="font-mono font-bold text-emerald-400">{stock.riskGuardrails.suggestedCapPercent}%</span>
              </div>
            </div>

            {/* Trailing Stop Loss Rule */}
            <div className="p-4 bg-[#0B0F19] border border-[#1E293B] rounded-lg flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">
                  Downside Guardrail
                </span>
                <div className="text-sm font-bold text-white mb-1.5">
                  {stock.riskGuardrails.maxLossTrailingStopPercent}% Trailing Stop
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Structural circuit breaker: A price breakdown exceeding {stock.riskGuardrails.maxLossTrailingStopPercent}% from cyclic highs triggers mandatory fundamental review and partial trimming.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1E293B] flex items-center justify-between text-xs">
                <span className="text-slate-400">Stop Price Level:</span>
                <span className="font-mono font-bold text-rose-400">
                  ${(stock.currentPrice * (1 - stock.riskGuardrails.maxLossTrailingStopPercent / 100)).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Interactive Position Sizing Widget */}
            <div className="p-4 bg-[#0B0F19] border border-[#1E293B] rounded-lg">
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block mb-1">
                Portfolio Sizer (${totalPortfolioCapital.toLocaleString()} Total)
              </span>

              <div className="space-y-3 mt-2 text-xs">
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Desired Allocation Cap:</span>
                    <span className="font-mono text-white font-semibold">{targetCapPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="8"
                    step="0.5"
                    value={targetCapPercent}
                    onChange={(e) => setTargetCapPercent(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500 h-1 bg-[#1E293B] rounded"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-600 mt-0.5">
                    <span>2.0%</span>
                    <span>5.0%</span>
                    <span>8.0% (Hard Cap)</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#1E293B] flex items-center justify-between">
                  <span className="text-slate-400">Calculated Capital:</span>
                  <span className="font-mono font-bold text-emerald-400">${allocatedDollars.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Recommended Shares:</span>
                  <span className="font-mono font-bold text-white">{estimatedShares} shares</span>
                </div>
              </div>
            </div>
          </div>

          {/* Thesis Invalidation Rules Table */}
          <div>
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2">
              Concrete Thesis Invalidation Rules &amp; Exit Triggers
            </h4>
            <div className="border border-[#1E293B] rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#0B0F19] text-slate-400 font-mono text-[11px] border-b border-[#1E293B]">
                  <tr>
                    <th className="py-2.5 px-3">Trigger Metric</th>
                    <th className="py-2.5 px-3">Invalidation Threshold</th>
                    <th className="py-2.5 px-3 text-right">Required Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E293B] bg-[#0F1626]">
                  {stock.riskGuardrails.invalidationRules.map((rule, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3 font-semibold text-white">
                        {rule.trigger}
                      </td>
                      <td className="py-2.5 px-3 text-slate-300">
                        {rule.threshold}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                          rule.action === 'Full Liquidate'
                            ? 'text-rose-400 bg-rose-950/60 border-rose-800/60'
                            : rule.action === 'Immediate Trim'
                            ? 'text-amber-400 bg-amber-950/60 border-amber-800/60'
                            : 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60'
                        }`}>
                          {rule.action}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Section 6: Google Search Grounded & Verified Intelligence */}
        {stock.groundingSources && stock.groundingSources.length > 0 && (
          <div className="p-5 bg-[#0F1626] border border-[#1E293B] rounded-lg space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#1E293B]">
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                  05. Verified Filings &amp; Grounded Sources
                </h3>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Live Verification Active (SEC Filings &amp; Market Intelligence)</span>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              Institutional due diligence synthesized with real-time web retrieval, SEC 10-K/10-Q disclosures, and live market intelligence:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
              {stock.groundingSources.map((source, idx) => (
                <a
                  key={idx}
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start justify-between gap-2 p-2.5 bg-[#0B0F19] hover:bg-[#131D33] border border-[#1E293B] hover:border-emerald-500/50 rounded transition-colors group text-xs"
                >
                  <div className="min-w-0">
                    <span className="font-medium text-slate-200 group-hover:text-emerald-300 line-clamp-1 block">
                      {source.title}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono truncate block mt-0.5">
                      {source.url.replace(/^https?:\/\//, '')}
                    </span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 shrink-0 mt-0.5" />
                </a>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
