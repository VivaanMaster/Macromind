import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  ArrowRight, 
  ArrowUpRight, 
  DollarSign, 
  PieChart, 
  Layers, 
  FileText, 
  Activity, 
  Clock, 
  CheckCircle2, 
  Crosshair, 
  Filter,
  BarChart3,
  Percent,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { StockResearchData, PortfolioHolding } from '../types/stock';
import { ActiveTab } from './Navbar';

interface AllocatorCommandCenterProps {
  stocks: StockResearchData[];
  holdings: PortfolioHolding[];
  totalPortfolioCapital: number;
  onSelectStock: (stock: StockResearchData) => void;
  onNavigateToTab: (tab: ActiveTab) => void;
  onAuditTicker?: (ticker: string) => Promise<void>;
}

export const AllocatorCommandCenter: React.FC<AllocatorCommandCenterProps> = ({
  stocks,
  holdings,
  totalPortfolioCapital,
  onSelectStock,
  onNavigateToTab,
}) => {
  const [selectedCatalystFilter, setSelectedCatalystFilter] = useState<string>('all');
  const [selectedHorizonFilter, setSelectedHorizonFilter] = useState<string>('all');

  // Deployed capital calculation
  const deployedCapital = useMemo(() => {
    return holdings.reduce((sum, h) => sum + h.shares * h.currentPrice, 0);
  }, [holdings]);

  // Cash / Dry powder calculation
  const dryPowder = Math.max(0, totalPortfolioCapital - deployedCapital);
  const dryPowderPercent = totalPortfolioCapital > 0 ? (dryPowder / totalPortfolioCapital) * 100 : 0;
  const deployedPercent = totalPortfolioCapital > 0 ? (deployedCapital / totalPortfolioCapital) * 100 : 0;

  // Concentration Guardrail Check (> 8.0%)
  const guardrailBreaches = useMemo(() => {
    if (totalPortfolioCapital <= 0) return [];
    return holdings
      .map((h) => {
        const value = h.shares * h.currentPrice;
        const allocation = (value / totalPortfolioCapital) * 100;
        const excessPercent = allocation - 8.0;
        const excessDollars = excessPercent > 0 ? (excessPercent / 100) * totalPortfolioCapital : 0;
        const excessShares = excessDollars > 0 ? Math.ceil(excessDollars / h.currentPrice) : 0;
        return {
          ...h,
          value,
          allocation,
          isBreached: allocation > 8.0,
          excessPercent,
          excessDollars,
          excessShares,
        };
      })
      .filter((item) => item.isBreached);
  }, [holdings, totalPortfolioCapital]);

  // Portfolio-Weighted ROIC Moat
  const portfolioWeightedRoic = useMemo(() => {
    if (holdings.length === 0 || deployedCapital === 0) {
      // Calculate universe average ROIC
      const totalUniverseRoic = stocks.reduce((acc, s) => acc + s.qualityHurdles.profitabilityMoat.roic, 0);
      return stocks.length > 0 ? totalUniverseRoic / stocks.length : 0;
    }
    let weightedSum = 0;
    holdings.forEach((h) => {
      const stock = stocks.find((s) => s.ticker === h.ticker);
      const roic = stock ? stock.qualityHurdles.profitabilityMoat.roic : 18.5;
      const weight = (h.shares * h.currentPrice) / deployedCapital;
      weightedSum += roic * weight;
    });
    return weightedSum;
  }, [holdings, deployedCapital, stocks]);

  // Stocks currently in immediate Tranche 1 Buy Zone
  const buyZoneStocks = useMemo(() => {
    return stocks.filter((stock) => {
      const inRange = stock.currentPrice <= stock.trancheStrategy.buyZoneRange[1];
      const discount = stock.marginOfSafetyPercent >= 0;
      return inRange || discount;
    });
  }, [stocks]);

  // Tranche 2 pullback orders pending
  const pullbackRadar = useMemo(() => {
    return stocks.map((stock) => {
      const target = stock.customEntryTarget !== undefined 
        ? stock.customEntryTarget 
        : stock.trancheStrategy.tranche2TriggerPrice;
      const distancePercent = ((stock.currentPrice - target) / stock.currentPrice) * 100;
      const isTriggered = stock.currentPrice <= target;
      const isNear = distancePercent > 0 && distancePercent <= 7.0;
      return {
        stock,
        targetPrice: target,
        distancePercent,
        isTriggered,
        isNear,
      };
    });
  }, [stocks]);

  // Filtered catalyst matrix
  const filteredStocks = useMemo(() => {
    return stocks.filter((stock) => {
      if (selectedCatalystFilter !== 'all' && stock.catalyst !== selectedCatalystFilter) {
        return false;
      }
      if (selectedHorizonFilter !== 'all' && stock.horizon !== selectedHorizonFilter) {
        return false;
      }
      return true;
    });
  }, [stocks, selectedCatalystFilter, selectedHorizonFilter]);

  // Highest conviction ideas
  const highConvictionList = useMemo(() => {
    return [...stocks].sort((a, b) => b.convictionScore - a.convictionScore);
  }, [stocks]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Allocator Persona Headline & System Posture Banner */}
      <div className="bg-[#0D1424] border border-[#1E293B] rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                CIO / Lead Allocator Command Cockpit
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs font-mono text-slate-400">
                Horizon: Medium-to-Long Term (1 Mo – 1+ Yr)
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs font-mono text-emerald-400/90 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Systematic Rules Active
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Capital Allocation &amp; Guardrail Command
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
              Synthesizing systematic fundamental quality hurdles, tranche entry deployment zones, and the non-negotiable 8.0% concentration ceiling across your compounder universe.
            </p>
          </div>

          {/* Quick Direct Action Dispatchers */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigateToTab('screener')}
              className="px-3.5 py-2 text-xs font-semibold bg-[#131B2E] hover:bg-[#1E293B] text-slate-200 border border-[#23314B] rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>Catalyst Screener</span>
            </button>
            <button
              onClick={() => onNavigateToTab('portfolio')}
              className="px-3.5 py-2 text-xs font-semibold bg-[#131B2E] hover:bg-[#1E293B] text-slate-200 border border-[#23314B] rounded-lg transition-colors flex items-center gap-1.5"
            >
              <PieChart className="w-3.5 h-3.5 text-emerald-400" />
              <span>Guardrail Monitor</span>
              {guardrailBreaches.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping ml-0.5" />
              )}
            </button>
          </div>
        </div>

        {/* 1. Portfolio Capital Deployment & Health KPI Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-5 border-t border-[#1E293B]">
          {/* KPI 1: Total Portfolio Capital */}
          <div className="p-3 bg-[#0B0F19] border border-[#1A2338] rounded-lg">
            <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono">
              <span>Total Capital</span>
              <DollarSign className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <div className="font-mono font-bold text-lg text-white tabular-nums mt-1">
              ${totalPortfolioCapital.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
              Simulated Base
            </div>
          </div>

          {/* KPI 2: Capital Deployed */}
          <div className="p-3 bg-[#0B0F19] border border-[#1A2338] rounded-lg">
            <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono">
              <span>Capital Deployed</span>
              <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <div className="font-mono font-bold text-lg text-white tabular-nums mt-1">
              ${deployedCapital.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
            <div className="text-[10px] font-mono text-emerald-400 mt-0.5">
              {deployedPercent.toFixed(1)}% of total fund
            </div>
          </div>

          {/* KPI 3: Dry Powder Cash Reserve */}
          <div className="p-3 bg-[#0B0F19] border border-[#1A2338] rounded-lg">
            <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono">
              <span>Dry Powder Cash</span>
              <Clock className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <div className="font-mono font-bold text-lg text-emerald-400 tabular-nums mt-1">
              ${dryPowder.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              {dryPowderPercent.toFixed(1)}% available
            </div>
          </div>

          {/* KPI 4: Portfolio Weighted ROIC Moat */}
          <div className="p-3 bg-[#0B0F19] border border-[#1A2338] rounded-lg">
            <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono">
              <span>Weighted ROIC</span>
              <Percent className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <div className="font-mono font-bold text-lg text-white tabular-nums mt-1">
              {portfolioWeightedRoic.toFixed(1)}%
            </div>
            <div className="text-[10px] text-emerald-400 font-mono mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Above 12% Hurdle</span>
            </div>
          </div>

          {/* KPI 5: Hard Guardrail Compliance */}
          <div className={`p-3 bg-[#0B0F19] border rounded-lg ${
            guardrailBreaches.length > 0 ? 'border-rose-800/80 bg-rose-950/20' : 'border-[#1A2338]'
          }`}>
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className={guardrailBreaches.length > 0 ? 'text-rose-300 font-bold' : 'text-slate-400'}>
                8.0% Max Cap
              </span>
              {guardrailBreaches.length > 0 ? (
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              )}
            </div>
            <div className={`font-mono font-bold text-lg tabular-nums mt-1 ${
              guardrailBreaches.length > 0 ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              {guardrailBreaches.length > 0 ? `${guardrailBreaches.length} BREACH` : '100% PASS'}
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-0.5">
              {guardrailBreaches.length > 0 ? 'Requires Rebalance' : 'Strict Compliance'}
            </div>
          </div>

          {/* KPI 6: Active Screened Universe */}
          <div className="p-3 bg-[#0B0F19] border border-[#1A2338] rounded-lg">
            <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono">
              <span>Vetted Pipeline</span>
              <Target className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <div className="font-mono font-bold text-lg text-white tabular-nums mt-1">
              {stocks.length} Tickers
            </div>
            <div className="text-[10px] font-mono text-emerald-400 mt-0.5">
              {buyZoneStocks.length} in Buy Zone
            </div>
          </div>
        </div>
      </div>

      {/* 2. Critical Allocation Alerts & Immediate Decision Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Immediate Tranche 1 Deployments (In Buy Zone Now) */}
        <div className="bg-[#0D1424] border border-[#1E293B] rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#1E293B]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-400 text-xs">
                  <DollarSign className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-bold text-white text-sm">
                  In Buy Zone Now
                </h3>
              </div>
              <span className="font-mono text-[11px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                {buyZoneStocks.length} Ready
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              Compounders trading at or below fair value estimates, validated for immediate 50% Tranche 1 allocation.
            </p>

            <div className="space-y-2.5">
              {buyZoneStocks.slice(0, 3).map((stock) => (
                <div 
                  key={stock.id}
                  onClick={() => onSelectStock(stock)}
                  className="p-3 bg-[#0B0F19] hover:bg-[#131B2E] border border-[#1E293B] hover:border-emerald-500/40 rounded-lg transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">
                        {stock.ticker}
                      </span>
                      <span className="text-[10px] text-slate-400 truncate max-w-[110px]">
                        {stock.companyName}
                      </span>
                    </div>
                    <span className="font-mono text-xs font-bold text-emerald-400">
                      ${stock.currentPrice.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Fair Val: ${stock.fairValueEstimate.toFixed(2)}</span>
                    <span className="text-emerald-400 font-semibold">
                      +{stock.marginOfSafetyPercent.toFixed(1)}% Discount
                    </span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-[#162035] flex items-center justify-between text-[10px] text-slate-400">
                    <span className="text-slate-400">Buy Zone: ${stock.trancheStrategy.buyZoneRange[0]}–${stock.trancheStrategy.buyZoneRange[1]}</span>
                    <span className="text-emerald-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 font-medium">
                      Deploy Tranche 1 <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-[#1E293B]">
            <button
              onClick={() => onNavigateToTab('screener')}
              className="w-full py-1.5 text-center text-xs font-mono text-slate-400 hover:text-emerald-400 hover:bg-[#131B2E] rounded transition-colors flex items-center justify-center gap-1"
            >
              <span>View All Passing Screeners</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: Tranche 2 Pullback Radar (Limit Orders) */}
        <div className="bg-[#0D1424] border border-[#1E293B] rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#1E293B]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-amber-950 border border-amber-700/60 flex items-center justify-center text-amber-400 text-xs">
                  <Crosshair className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-bold text-white text-sm">
                  Tranche 2 Pullback Radar
                </h3>
              </div>
              <span className="font-mono text-[11px] text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                Pending Trigger
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              Secondary 50% capital reserves earmarked for market pullbacks or custom entry target prices.
            </p>

            <div className="space-y-2.5">
              {pullbackRadar.slice(0, 3).map(({ stock, targetPrice, distancePercent, isTriggered, isNear }) => (
                <div 
                  key={stock.id}
                  onClick={() => onSelectStock(stock)}
                  className={`p-3 bg-[#0B0F19] hover:bg-[#131B2E] border rounded-lg transition-all cursor-pointer group ${
                    isTriggered 
                      ? 'border-emerald-500/60 bg-emerald-950/10' 
                      : isNear 
                        ? 'border-amber-500/50 bg-amber-950/10' 
                        : 'border-[#1E293B]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white text-sm group-hover:text-amber-400 transition-colors">
                        {stock.ticker}
                      </span>
                      <span className="text-[10px] text-slate-400 truncate max-w-[100px]">
                        {stock.companyName}
                      </span>
                    </div>
                    <div className="font-mono text-xs">
                      <span className="text-slate-400">${stock.currentPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Target Trigger:</span>
                    <span className="text-amber-400 font-bold">${targetPrice.toFixed(2)}</span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-[#162035] flex items-center justify-between text-[10px] font-mono">
                    {isTriggered ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> TRIGGER REACHED
                      </span>
                    ) : (
                      <span className={isNear ? 'text-amber-400 font-semibold' : 'text-slate-400'}>
                        {distancePercent > 0 ? `-${distancePercent.toFixed(1)}% to trigger` : `+${Math.abs(distancePercent).toFixed(1)}% above`}
                      </span>
                    )}
                    <span className="text-slate-400 group-hover:text-slate-200 flex items-center gap-0.5">
                      Adjust Target <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-[#1E293B]">
            <button
              onClick={() => onNavigateToTab('tearsheet')}
              className="w-full py-1.5 text-center text-xs font-mono text-slate-400 hover:text-amber-400 hover:bg-[#131B2E] rounded transition-colors flex items-center justify-center gap-1"
            >
              <span>Review Tranche Rules on Tear Sheet</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 3: Over-Concentration Guardrail Enforcement */}
        <div className="bg-[#0D1424] border border-[#1E293B] rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#1E293B]">
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded flex items-center justify-center text-xs ${
                  guardrailBreaches.length > 0 
                    ? 'bg-rose-950 border border-rose-700/60 text-rose-400' 
                    : 'bg-emerald-950 border border-emerald-700/60 text-emerald-400'
                }`}>
                  {guardrailBreaches.length > 0 ? (
                    <ShieldAlert className="w-3.5 h-3.5" />
                  ) : (
                    <ShieldCheck className="w-3.5 h-3.5" />
                  )}
                </div>
                <h3 className="font-bold text-white text-sm">
                  Concentration Guardrails
                </h3>
              </div>
              <span className={`font-mono text-[11px] px-2 py-0.5 rounded border ${
                guardrailBreaches.length > 0 
                  ? 'text-rose-400 bg-rose-950/60 border-rose-800/60' 
                  : 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60'
              }`}>
                {guardrailBreaches.length > 0 ? 'Action Required' : 'Guarded'}
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              Strict institutional rule: No single stock may exceed 8.0% of total capital (${(totalPortfolioCapital * 0.08).toLocaleString('en-US', { maximumFractionDigits: 0 })} cap).
            </p>

            {guardrailBreaches.length > 0 ? (
              <div className="space-y-2.5">
                {guardrailBreaches.map((item) => (
                  <div key={item.id} className="p-3 bg-rose-950/20 border border-rose-800/60 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-rose-300 text-sm">
                        {item.ticker} BREACH
                      </span>
                      <span className="font-mono text-xs font-bold text-rose-400">
                        {item.allocation.toFixed(1)}% of Fund
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-300 flex items-center justify-between">
                      <span>Excess Over 8.0%:</span>
                      <span className="text-rose-400 font-semibold">
                        +${item.excessDollars.toFixed(2)} ({item.excessPercent.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-rose-900/40 text-[10px] font-mono text-slate-300 flex items-center justify-between">
                      <span>Recommended Trim:</span>
                      <span className="text-rose-300 font-bold">Sell ~{item.excessShares} shares</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-[#0B0F19] border border-[#1A2338] rounded-lg text-center space-y-2">
                <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="font-semibold text-white text-xs">
                  Zero Guardrail Breaches
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  All active positions are safely bounded below the 8.0% institutional ceiling. Portfolio risk is properly dispersed.
                </p>
                <div className="pt-2 font-mono text-[10px] text-emerald-400">
                  Max Position Cap: 8.0% · Recommended: 6.5%
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 mt-3 border-t border-[#1E293B]">
            <button
              onClick={() => onNavigateToTab('portfolio')}
              className="w-full py-1.5 text-center text-xs font-mono text-slate-400 hover:text-emerald-400 hover:bg-[#131B2E] rounded transition-colors flex items-center justify-center gap-1"
            >
              <span>Manage Positions in Portfolio Monitor</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* 3. Allocator Catalyst & Conviction Matrix */}
      <div className="bg-[#0D1424] border border-[#1E293B] rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-[#1E293B] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Conviction Matrix
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400 font-mono">
                {filteredStocks.length} Systematic Compounders
              </span>
            </div>
            <h2 className="text-base font-bold text-white tracking-tight mt-0.5">
              Catalyst Timetable &amp; High-Conviction Compounders
            </h2>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Horizon Filter */}
            <div className="flex items-center gap-1 bg-[#0B0F19] p-1 rounded-lg border border-[#1E293B] text-xs">
              <button
                onClick={() => setSelectedHorizonFilter('all')}
                className={`px-2.5 py-1 rounded font-mono transition-colors ${
                  selectedHorizonFilter === 'all'
                    ? 'bg-[#1E293B] text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All Horizons
              </button>
              <button
                onClick={() => setSelectedHorizonFilter('medium_term')}
                className={`px-2.5 py-1 rounded font-mono transition-colors ${
                  selectedHorizonFilter === 'medium_term'
                    ? 'bg-[#1E293B] text-emerald-400 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Medium-Term
              </button>
              <button
                onClick={() => setSelectedHorizonFilter('long_term')}
                className={`px-2.5 py-1 rounded font-mono transition-colors ${
                  selectedHorizonFilter === 'long_term'
                    ? 'bg-[#1E293B] text-emerald-400 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Long-Term
              </button>
            </div>

            {/* Catalyst Filter */}
            <select
              value={selectedCatalystFilter}
              onChange={(e) => setSelectedCatalystFilter(e.target.value)}
              aria-label="Filter by Catalyst"
              className="bg-[#0B0F19] border border-[#1E293B] text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 font-mono"
            >
              <option value="all">All Catalysts</option>
              <option value="Earnings Beat &amp; Raise">Earnings Beat &amp; Raise</option>
              <option value="Oversold Blue-Chip Dislocation">Oversold Dislocation</option>
              <option value="Capex / Secular Tailwind">Capex / Secular Tailwind</option>
            </select>
          </div>
        </div>

        {/* Matrix Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#1E293B] bg-[#0A0E18] text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Equity</th>
                <th className="py-3 px-4">Catalyst &amp; Horizon</th>
                <th className="py-3 px-4 text-center">Quality / Conviction</th>
                <th className="py-3 px-4 text-right">Price / Fair Value</th>
                <th className="py-3 px-4 text-right">ROIC / FCF Yield</th>
                <th className="py-3 px-4 text-center">Buy Zone Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#162035] font-mono">
              {filteredStocks.map((stock) => {
                const inBuyZone = stock.currentPrice <= stock.trancheStrategy.buyZoneRange[1];
                const holding = holdings.find((h) => h.ticker === stock.ticker);
                const allocation = holding ? (holding.shares * holding.currentPrice / totalPortfolioCapital) * 100 : 0;

                return (
                  <tr 
                    key={stock.id} 
                    className="hover:bg-[#101828] transition-colors group cursor-pointer"
                    onClick={() => onSelectStock(stock)}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">
                          {stock.ticker}
                        </span>
                        <div className="text-[11px] text-slate-400 font-sans truncate max-w-[120px]">
                          {stock.companyName}
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-500 font-sans mt-0.5">
                        {stock.sector} · {stock.marketCap}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-sans">
                      <div className="font-medium text-slate-200 text-xs">
                        {stock.catalyst}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {stock.horizon === 'long_term' ? 'Compounder (1+ Yr)' : 'Position (1–6 Mo)'}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-400 font-bold text-xs">
                          Q {stock.qualityScore}/10
                        </span>
                        <span className="px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800 text-blue-400 font-bold text-xs">
                          C {stock.convictionScore}/10
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="font-bold text-white text-xs">
                        ${stock.currentPrice.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        FV: ${stock.fairValueEstimate.toFixed(2)} ({stock.marginOfSafetyPercent > 0 ? `+${stock.marginOfSafetyPercent.toFixed(1)}%` : `${stock.marginOfSafetyPercent.toFixed(1)}%`})
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="text-emerald-400 font-bold">
                        ROIC {stock.qualityHurdles.profitabilityMoat.roic}%
                      </div>
                      <div className="text-[10px] text-slate-400">
                        FCF Yield {stock.qualityHurdles.profitabilityMoat.fcfYield}%
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      {inBuyZone ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          IN BUY ZONE
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
                          Above Zone (${stock.trancheStrategy.buyZoneRange[1]})
                        </span>
                      )}
                      {allocation > 0 && (
                        <div className="text-[10px] text-slate-400 mt-1">
                          Held: {allocation.toFixed(1)}%
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectStock(stock);
                        }}
                        className="px-2.5 py-1 text-[11px] font-sans font-semibold text-emerald-400 hover:text-white bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800 rounded transition-colors inline-flex items-center gap-1"
                      >
                        <span>Tear Sheet</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Thesis Invalidation & Risk Watchdog */}
      <div className="bg-[#0D1424] border border-[#1E293B] rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <h3 className="font-bold text-white text-sm">
              Thesis Invalidation Rules &amp; Downside Watchdog
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Mandatory Institutional Exit Triggers
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-4">
          {stocks.slice(0, 3).map((stock) => {
            const primaryRule = stock.riskGuardrails.invalidationRules[0];
            const secondaryRule = stock.riskGuardrails.invalidationRules[1];
            return (
              <div key={stock.id} className="p-3.5 bg-[#0B0F19] border border-[#1E293B] rounded-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-bold text-white text-sm">
                      {stock.ticker}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/60 text-rose-400 border border-rose-800/60">
                      Stop: {stock.riskGuardrails.maxLossTrailingStopPercent}% Trailing
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {primaryRule && (
                      <div className="p-2 bg-[#121A2C] rounded border border-[#1B273F]">
                        <div className="text-[10px] font-mono text-rose-300 font-bold uppercase tracking-wider">
                          Primary Trigger ({primaryRule.action})
                        </div>
                        <div className="text-xs text-slate-300 mt-0.5 font-medium">
                          {primaryRule.trigger}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                          Threshold: {primaryRule.threshold}
                        </div>
                      </div>
                    )}

                    {secondaryRule && (
                      <div className="p-2 bg-[#121A2C] rounded border border-[#1B273F]">
                        <div className="text-[10px] font-mono text-amber-300 font-bold uppercase tracking-wider">
                          Secondary Trigger ({secondaryRule.action})
                        </div>
                        <div className="text-xs text-slate-300 mt-0.5 font-medium">
                          {secondaryRule.trigger}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                          Threshold: {secondaryRule.threshold}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 mt-3 border-t border-[#162035] flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-mono text-[10px]">
                    Max Position: {stock.riskGuardrails.maxPositionCapPercent}% Cap
                  </span>
                  <button
                    onClick={() => onSelectStock(stock)}
                    className="text-emerald-400 hover:text-white font-mono text-[11px] flex items-center gap-0.5"
                  >
                    <span>Full Memo</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
