import React, { useState } from 'react';
import { PortfolioHolding, StockResearchData } from '../types/stock';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  AlertTriangle
} from 'lucide-react';

interface PortfolioMonitorProps {
  holdings: PortfolioHolding[];
  totalPortfolioCapital: number;
  setTotalPortfolioCapital: (cap: number) => void;
  onUpdateHolding: (id: string, updatedShares: number, updatedAvgPrice?: number) => void;
  onRemoveHolding: (id: string) => void;
  onAddHolding: (holding: Omit<PortfolioHolding, 'id' | 'addedAt'>) => void;
  vettedStocks: StockResearchData[];
  onOpenTearSheet: (ticker: string) => void;
}

export const PortfolioMonitor: React.FC<PortfolioMonitorProps> = ({
  holdings,
  totalPortfolioCapital,
  setTotalPortfolioCapital,
  onUpdateHolding,
  onRemoveHolding,
  onAddHolding,
  vettedStocks,
  onOpenTearSheet,
}) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTicker, setNewTicker] = useState(() => vettedStocks[0]?.ticker || 'MSFT');
  const [newShares, setNewShares] = useState('1.0');
  const [newPrice, setNewPrice] = useState(() => (vettedStocks[0]?.currentPrice || 428.50).toString());

  // Total invested across all holdings
  const totalInvested = holdings.reduce((sum, h) => sum + h.shares * h.currentPrice, 0);
  const cashReserve = Math.max(0, totalPortfolioCapital - totalInvested);
  const cashReservePercent = totalPortfolioCapital > 0 ? (cashReserve / totalPortfolioCapital) * 100 : 0;

  // Maximum single position allocation
  const holdingsWithMetrics = holdings.map((h) => {
    const currentValue = h.shares * h.currentPrice;
    const costBasis = h.shares * h.avgPurchasePrice;
    const pnlDollars = currentValue - costBasis;
    const pnlPercent = costBasis > 0 ? (pnlDollars / costBasis) * 100 : 0;
    const allocationPercent = totalPortfolioCapital > 0 ? (currentValue / totalPortfolioCapital) * 100 : 0;
    const isExceeded = allocationPercent > 8.0;
    const isWarning = allocationPercent > 7.0 && allocationPercent <= 8.0;

    // Calculate trim needed if exceeded
    const targetValue = (totalPortfolioCapital * 6.5) / 100;
    const excessValue = Math.max(0, currentValue - targetValue);
    const sharesToTrim = excessValue > 0 ? Math.round((excessValue / h.currentPrice) * 10) / 10 : 0;

    return {
      ...h,
      currentValue,
      costBasis,
      pnlDollars,
      pnlPercent,
      allocationPercent,
      isExceeded,
      isWarning,
      excessValue,
      sharesToTrim,
    };
  });

  // Check if any position breaches the 8.0% cap
  const breachedHoldings = holdingsWithMetrics.filter((h) => h.isExceeded);
  const hasGuardrailAlert = breachedHoldings.length > 0;

  // Tracked stocks with custom entry targets
  const trackedEntryTargets = vettedStocks
    .filter((s) => s.customEntryTarget !== undefined && s.customEntryTarget > 0)
    .map((s) => {
      const target = s.customEntryTarget!;
      const diff = s.currentPrice - target;
      const pctDiff = (diff / s.currentPrice) * 100;
      const isTriggerHit = s.currentPrice <= target;
      const isApproaching = !isTriggerHit && pctDiff <= 3.5;
      return {
        stock: s,
        target,
        diff,
        pctDiff,
        isTriggerHit,
        isApproaching,
      };
    });

  const approachingOrHitTargets = trackedEntryTargets.filter(
    (t) => t.isTriggerHit || t.isApproaching
  );

  const handleQuickAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    const stock = vettedStocks.find((s) => s.ticker === newTicker);
    const sharesNum = parseFloat(newShares);
    const priceNum = parseFloat(newPrice);

    if (isNaN(sharesNum) || sharesNum <= 0) return;
    if (isNaN(priceNum) || priceNum <= 0) return;

    onAddHolding({
      ticker: newTicker,
      companyName: stock ? stock.companyName : `${newTicker} Corp`,
      shares: sharesNum,
      avgPurchasePrice: priceNum,
      currentPrice: stock ? stock.currentPrice : priceNum,
      sector: stock ? stock.sector : 'General Equities',
    });

    setIsAddOpen(false);
  };

  const handleTickerChange = (ticker: string) => {
    setNewTicker(ticker);
    const s = vettedStocks.find((x) => x.ticker === ticker);
    if (s) {
      setNewPrice(s.currentPrice.toString());
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Portfolio Risk Simulator & Guardrail Header */}
      <div className="bg-[#0F1626] border border-[#1E293B] rounded-lg p-5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-[#1E293B]">
          <div>
            <div>
              <h2 className="text-xs font-mono font-bold tracking-wider text-white uppercase">
                Portfolio Risk Guardrail &amp; Cap Monitor
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Strict 8.0% position limits prevent catastrophe while letting core compounders run
            </p>
          </div>

          {/* Interactive Capital Input */}
          <div className="flex items-center gap-2.5 bg-[#0B0F19] border border-[#1E293B] rounded-md px-3 py-1.5">
            <span className="text-xs text-slate-400">Total Portfolio Capital:</span>
            <div className="flex items-center font-mono text-sm font-semibold text-white">
              <span className="text-slate-500 mr-0.5">$</span>
              <input
                type="number"
                min="1000"
                step="500"
                value={totalPortfolioCapital}
                onChange={(e) => setTotalPortfolioCapital(Math.max(100, parseFloat(e.target.value) || 0))}
                className="w-28 bg-transparent text-white font-mono font-bold focus:outline-none focus:text-emerald-400 tabular-nums"
              />
            </div>
          </div>
        </div>

        {/* 4 Summary Metric Strips */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
          <div className="p-3 bg-[#0B0F19] rounded border border-[#1B253B]">
            <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider">
              Total Invested
            </span>
            <span className="font-mono text-base font-bold text-white tabular-nums">
              ${totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="block text-[10px] text-slate-400 mt-0.5">
              {((totalInvested / (totalPortfolioCapital || 1)) * 100).toFixed(1)}% of Capital
            </span>
          </div>

          <div className="p-3 bg-[#0B0F19] rounded border border-[#1B253B]">
            <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider">
              Cash Dry Powder
            </span>
            <span className="font-mono text-base font-bold text-emerald-400 tabular-nums">
              ${cashReserve.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="block text-[10px] text-slate-400 mt-0.5">
              {cashReservePercent.toFixed(1)}% Available
            </span>
          </div>

          <div className="p-3 bg-[#0B0F19] rounded border border-[#1B253B]">
            <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider">
              Position Count
            </span>
            <span className="font-mono text-base font-bold text-white tabular-nums">
              {holdings.length}
            </span>
            <span className="block text-[10px] text-slate-400 mt-0.5">
              Target: 12 - 18 Equities
            </span>
          </div>

          <div className="p-3 bg-[#0B0F19] rounded border border-[#1B253B]">
            <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider">
              Guardrail Status
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              {hasGuardrailAlert ? (
                <>
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span className="font-mono text-xs font-bold text-rose-400">
                    BREACH DETECTED
                  </span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono text-xs font-bold text-emerald-400">
                    ALL CLEAR (&lt;8.0%)
                  </span>
                </>
              )}
            </div>
            <span className="block text-[10px] text-slate-400 mt-0.5">
              {hasGuardrailAlert ? `${breachedHoldings.length} over 8.0% cap` : 'Zero concentration alerts'}
            </span>
          </div>
        </div>
      </div>

      {/* Concentrated Risk Alert Banner (Triggered if any holding exceeds 8%) */}
      {hasGuardrailAlert && (
        <div className="bg-rose-950/40 border border-rose-800/60 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider font-mono">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Concentration Risk Guardrail Alert: Position Exceeds 8.0% Hard Cap</span>
          </div>

          <div className="space-y-1.5 text-xs text-slate-300">
            {breachedHoldings.map((bh) => (
              <div key={bh.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2 bg-[#0B0F19] rounded border border-rose-900/40">
                <div>
                  <span className="font-mono font-bold text-white mr-2">{bh.ticker}</span>
                  <span className="text-slate-400 text-xs">Allocation:</span>{' '}
                  <span className="font-mono font-bold text-rose-400">{bh.allocationPercent.toFixed(1)}%</span>{' '}
                  <span className="text-slate-500">(&gt; 8.0% cap)</span>
                </div>
                <div className="text-xs text-amber-300 font-mono">
                  Recommended action: Trim{' '}
                  <strong className="text-white font-bold">{bh.sharesToTrim} shares</strong> (~${bh.excessValue.toFixed(0)}) to reach safe 6.5% target
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approaching Entry Target Alert Banner */}
      {approachingOrHitTargets.length > 0 && (
        <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-emerald-400 font-bold text-xs uppercase tracking-wider font-mono">
              Custom Entry Target Proximity Alert: Securities Approaching Buy Trigger
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-900/60 px-2 py-0.5 rounded">
              {approachingOrHitTargets.length} Active Signal{approachingOrHitTargets.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="space-y-1.5 text-xs text-slate-300">
            {approachingOrHitTargets.map((item) => (
              <div
                key={item.stock.ticker}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-[#0B0F19] rounded border border-emerald-900/40"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-bold text-white">{item.stock.ticker}</span>
                  <span className="text-slate-400 text-xs truncate max-w-[150px]">{item.stock.companyName}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400 text-xs">Market:</span>
                  <span className="font-mono text-white font-semibold">${item.stock.currentPrice.toFixed(2)}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400 text-xs">Your Target:</span>
                  <span className="font-mono text-emerald-400 font-semibold">${item.target.toFixed(2)}</span>
                </div>

                <div className="flex items-center gap-2">
                  {item.isTriggerHit ? (
                    <span className="font-mono text-[10px] text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-700 px-2 py-0.5 rounded flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      IN BUY ZONE
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] text-amber-400 font-bold bg-amber-950/80 border border-amber-700 px-2 py-0.5 rounded flex items-center gap-1.5">
                      APPROACHING ({item.pctDiff.toFixed(1)}% away)
                    </span>
                  )}
                  <button
                    onClick={() => onOpenTearSheet(item.stock.ticker)}
                    className="px-2.5 py-1 bg-[#162138] hover:bg-emerald-600 hover:text-slate-950 text-slate-200 text-xs font-medium rounded transition-colors whitespace-nowrap"
                  >
                    View Tear Sheet
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Holdings Table & Controls Header */}
      <div className="bg-[#0F1626] border border-[#1E293B] rounded-lg overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#1E293B] flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Current Portfolio Positions &amp; Allocation Caps
            </h3>
          </div>

          <button
            onClick={() => setIsAddOpen(!isAddOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-xs rounded transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Position</span>
          </button>
        </div>

        {/* Add Holding Sub-Form */}
        {isAddOpen && (
          <form onSubmit={handleQuickAddStock} className="p-4 bg-[#0B0F19] border-b border-[#1E293B] flex flex-wrap items-end gap-3 text-xs">
            <div>
              <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">
                Select Ticker
              </label>
              <select
                value={newTicker}
                onChange={(e) => handleTickerChange(e.target.value)}
                className="bg-[#0F1626] border border-[#1E293B] text-white px-3 py-1.5 rounded font-mono focus:outline-none focus:border-emerald-500"
              >
                {vettedStocks.map((s) => (
                  <option key={s.ticker} value={s.ticker}>
                    {s.ticker} - {s.companyName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">
                Shares
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={newShares}
                onChange={(e) => setNewShares(e.target.value)}
                className="w-24 bg-[#0F1626] border border-[#1E293B] text-white px-2.5 py-1.5 rounded font-mono focus:outline-none focus:border-emerald-500 tabular-nums"
              />
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">
                Purchase Price ($)
              </label>
              <input
                type="number"
                step="0.5"
                min="1"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="w-28 bg-[#0F1626] border border-[#1E293B] text-white px-2.5 py-1.5 rounded font-mono focus:outline-none focus:border-emerald-500 tabular-nums"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold rounded transition-colors"
            >
              Add to Holdings
            </button>

            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="px-3 py-1.5 text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </form>
        )}

        {/* Holdings Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#1E293B] bg-[#0D1424] text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Ticker</th>
                <th className="py-3 px-4">Shares</th>
                <th className="py-3 px-4 text-right">Avg Cost</th>
                <th className="py-3 px-4 text-right">Current Price</th>
                <th className="py-3 px-4 text-right">Current Value</th>
                <th className="py-3 px-4 text-right">Portfolio %</th>
                <th className="py-3 px-4 text-right">Unrealized P&amp;L</th>
                <th className="py-3 px-4 text-center">Risk Guardrail</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              {holdingsWithMetrics.map((h) => (
                <tr key={h.id} className="hover:bg-[#152037] transition-colors">
                  <td className="py-3 px-4">
                    <button
                      onClick={() => onOpenTearSheet(h.ticker)}
                      className="text-left font-mono"
                    >
                      <div className="font-bold text-white hover:text-emerald-400">
                        {h.ticker}
                      </div>
                      <div className="text-[10px] text-slate-400 font-sans">{h.companyName}</div>
                    </button>
                  </td>

                  {/* Share adjustments */}
                  <td className="py-3 px-4 font-mono text-white whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onUpdateHolding(h.id, Math.max(0.1, Math.round((h.shares - 0.5) * 10) / 10))}
                        className="w-5 h-5 flex items-center justify-center bg-[#0B0F19] hover:bg-[#1E293B] text-slate-400 hover:text-white rounded border border-[#1E293B]"
                      >
                        -
                      </button>
                      <span className="tabular-nums font-semibold w-10 text-center">{h.shares}</span>
                      <button
                        onClick={() => onUpdateHolding(h.id, Math.round((h.shares + 0.5) * 10) / 10)}
                        className="w-5 h-5 flex items-center justify-center bg-[#0B0F19] hover:bg-[#1E293B] text-slate-400 hover:text-white rounded border border-[#1E293B]"
                      >
                        +
                      </button>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-right font-mono text-slate-300 tabular-nums">
                    ${h.avgPurchasePrice.toFixed(2)}
                  </td>

                  <td className="py-3 px-4 text-right font-mono text-white tabular-nums">
                    ${h.currentPrice.toFixed(2)}
                  </td>

                  <td className="py-3 px-4 text-right font-mono font-semibold text-white tabular-nums">
                    ${h.currentValue.toFixed(2)}
                  </td>

                  {/* Allocation % with Visual Bar */}
                  <td className="py-3 px-4 text-right font-mono tabular-nums whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1.5 bg-[#0B0F19] rounded-full overflow-hidden border border-[#1E293B]">
                        <div
                          className={`h-full ${
                            h.isExceeded
                              ? 'bg-rose-500'
                              : h.isWarning
                              ? 'bg-amber-400'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, (h.allocationPercent / 8.0) * 100)}%` }}
                        />
                      </div>
                      <span
                        className={`font-bold ${
                          h.isExceeded
                            ? 'text-rose-400'
                            : h.isWarning
                            ? 'text-amber-400'
                            : 'text-slate-200'
                        }`}
                      >
                        {h.allocationPercent.toFixed(1)}%
                      </span>
                    </div>
                  </td>

                  {/* P&L */}
                  <td className="py-3 px-4 text-right font-mono tabular-nums whitespace-nowrap">
                    <span className={h.pnlDollars >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      {h.pnlDollars >= 0 ? '+' : ''}${h.pnlDollars.toFixed(2)} ({h.pnlPercent >= 0 ? '+' : ''}{h.pnlPercent.toFixed(1)}%)
                    </span>
                  </td>

                  {/* Risk Alert Badge */}
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    {h.isExceeded ? (
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase font-bold text-rose-400 bg-rose-950/60 border border-rose-800/60 px-2 py-0.5 rounded">
                        <AlertTriangle className="w-3 h-3 text-rose-400" />
                        OVERWEIGHT &gt;8%
                      </span>
                    ) : h.isWarning ? (
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase font-bold text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded">
                        WATCH &gt;7%
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
                        NOMINAL
                      </span>
                    )}
                  </td>

                  {/* Action buttons */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => onRemoveHolding(h.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Remove Holding"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty Holdings State */}
        {holdings.length === 0 && (
          <div className="p-8 text-center text-xs text-slate-400">
            No active positions. Add a holding above or click &quot;Add to Portfolio Simulator&quot; on any Executive Tear Sheet.
          </div>
        )}
      </div>

      {/* Custom Entry Targets & Proximity Radar Module */}
      <div className="bg-[#0F1626] border border-[#1E293B] rounded-lg overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Custom Entry Target Order Rules &amp; Proximity Radar
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {trackedEntryTargets.length} Monitored Target{trackedEntryTargets.length !== 1 ? 's' : ''}
          </span>
        </div>

        {trackedEntryTargets.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#1E293B] bg-[#0D1424] text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Ticker</th>
                  <th className="py-3 px-4 text-right">Market Price</th>
                  <th className="py-3 px-4 text-right">Your Target</th>
                  <th className="py-3 px-4 text-right">Distance to Target</th>
                  <th className="py-3 px-4">Proximity Progress</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]">
                {trackedEntryTargets.map((item) => (
                  <tr key={item.stock.ticker} className="hover:bg-[#152037] transition-colors">
                    <td className="py-3 px-4">
                      <button
                        onClick={() => onOpenTearSheet(item.stock.ticker)}
                        className="text-left font-mono"
                      >
                        <div className="font-bold text-white hover:text-emerald-400">
                          {item.stock.ticker}
                        </div>
                        <div className="text-[10px] text-slate-400 font-sans">{item.stock.companyName}</div>
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right font-mono text-white tabular-nums">
                      ${item.stock.currentPrice.toFixed(2)}
                    </td>

                    <td className="py-3 px-4 text-right font-mono text-emerald-400 font-semibold tabular-nums">
                      ${item.target.toFixed(2)}
                    </td>

                    <td className="py-3 px-4 text-right font-mono tabular-nums whitespace-nowrap">
                      <span className={item.isTriggerHit ? 'text-emerald-400 font-bold' : item.isApproaching ? 'text-amber-400 font-semibold' : 'text-slate-300'}>
                        {item.diff <= 0 ? 'Trigger Hit' : `+$${item.diff.toFixed(2)} (+${item.pctDiff.toFixed(1)}%)`}
                      </span>
                    </td>

                    {/* Proximity visual meter */}
                    <td className="py-3 px-4 min-w-[140px]">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono text-slate-500">
                          <span>Target</span>
                          <span>{item.isTriggerHit ? 'In Zone' : `${item.pctDiff.toFixed(1)}% away`}</span>
                        </div>
                        <div className="h-2 w-full bg-[#0B0F19] rounded-full overflow-hidden border border-[#1E293B]">
                          <div
                            className={`h-full transition-all ${
                              item.isTriggerHit
                                ? 'bg-emerald-400'
                                : item.isApproaching
                                ? 'bg-amber-400'
                                : 'bg-cyan-500'
                            }`}
                            style={{
                              width: `${Math.min(100, Math.max(10, 100 - item.pctDiff * 7))}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {item.isTriggerHit ? (
                        <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-700 px-2 py-0.5 rounded">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                          IN BUY ZONE
                        </span>
                      ) : item.isApproaching ? (
                        <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase font-bold text-amber-400 bg-amber-950/80 border border-amber-700 px-2 py-0.5 rounded">
                          APPROACHING
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase font-semibold text-slate-300 bg-slate-900 border border-slate-700 px-2 py-0.5 rounded">
                          MONITORING
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            // Quick add position at target
                            const targetAlloc = (totalPortfolioCapital * item.stock.riskGuardrails.suggestedCapPercent) / 100;
                            const shares = Math.max(0.1, Math.round((targetAlloc / item.target) * 10) / 10);
                            onAddHolding({
                              ticker: item.stock.ticker,
                              companyName: item.stock.companyName,
                              shares,
                              avgPurchasePrice: item.target,
                              currentPrice: item.stock.currentPrice,
                              sector: item.stock.sector,
                            });
                          }}
                          className="px-2 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded transition-colors"
                          title="Execute purchase at target price"
                        >
                          Execute Buy
                        </button>
                        <button
                          onClick={() => onOpenTearSheet(item.stock.ticker)}
                          className="px-2 py-1 text-[11px] font-medium bg-[#1E293B] hover:bg-slate-700 text-slate-200 rounded transition-colors"
                        >
                          Tear Sheet
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-400 space-y-2">
            <p>
              No custom entry targets currently defined.
            </p>
            <p className="text-slate-500 text-[11px]">
              Open any stock&apos;s <strong className="text-slate-300">Executive Tear Sheet</strong> and scroll to <strong className="text-slate-300">Section 4 (Valuation &amp; Entry Strategy)</strong> to set a custom target entry order rule.
            </p>
          </div>
        )}
      </div>

      {/* Institutional Capital Allocation Principles Ledger */}
      <div className="bg-[#0D1424] border border-[#1E293B] rounded-lg overflow-hidden">
        <div className="px-4 py-2.5 bg-[#0F1626] border-b border-[#1E293B]">
          <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
            MacroMind Invariant Rules of Capital Preservation
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#1E293B] bg-[#0B0F19] text-xs text-slate-400">
          <div className="p-3.5 space-y-1">
            <span className="text-white font-mono font-semibold block text-xs">
              01. Asymmetric Payoff Ceiling
            </span>
            <p className="leading-relaxed">
              Concentration produces returns; diversification preserves capital. Never allow emotional conviction to override the 8.0% position size ceiling.
            </p>
          </div>

          <div className="p-3.5 space-y-1">
            <span className="text-white font-mono font-semibold block text-xs">
              02. Two-Tranche Liquidity Reserve
            </span>
            <p className="leading-relaxed">
              Never deploy 100% of target capital at market highs. Reserve 50% for secondary tranches during macro volatility and technical dislocations.
            </p>
          </div>

          <div className="p-3.5 space-y-1">
            <span className="text-white font-mono font-semibold block text-xs">
              03. Objective Fundamental Exit Triggers
            </span>
            <p className="leading-relaxed">
              Sell immediately when structural fundamentals break (e.g. margin degradation for 2 consecutive quarters), not because prices fluctuate.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
