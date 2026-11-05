import React, { useState, useMemo } from 'react';
import { 
  StockResearchData, 
  HorizonType, 
  CatalystType 
} from '../types/stock';
import { 
  ExternalLink, 
  LayoutGrid, 
  Table as TableIcon,
  Filter,
  Info
} from 'lucide-react';

interface CatalystScreenerProps {
  stocks: StockResearchData[];
  onSelectStock: (stock: StockResearchData) => void;
  onAuditTicker: (ticker: string) => Promise<void>;
  isLoadingAudit: boolean;
  loadingTicker?: string;
}

export const CatalystScreener: React.FC<CatalystScreenerProps> = ({
  stocks,
  onSelectStock,
}) => {
  const [selectedHorizon, setSelectedHorizon] = useState<string>('all');
  const [selectedCatalyst, setSelectedCatalyst] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Filter stocks based on user selection
  const filteredStocks = useMemo(() => {
    return stocks.filter((stock) => {
      // Horizon filter
      if (selectedHorizon !== 'all' && stock.horizon !== selectedHorizon) {
        return false;
      }
      // Catalyst filter
      if (selectedCatalyst !== 'all' && stock.catalyst !== selectedCatalyst) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchTicker = stock.ticker.toLowerCase().includes(query);
        const matchName = stock.companyName.toLowerCase().includes(query);
        const matchSector = stock.sector.toLowerCase().includes(query);
        if (!matchTicker && !matchName && !matchSector) {
          return false;
        }
      }
      return true;
    });
  }, [stocks, selectedHorizon, selectedCatalyst, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Mandatory Quality Gate Invariants - Unified Specification Matrix */}
      <div className="bg-[#0D1424] border border-[#1E293B] rounded-lg overflow-hidden">
        <div className="px-4 py-2.5 bg-[#0F1626] border-b border-[#1E293B] flex items-center justify-between">
          <div>
            <h2 className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
              Mandatory Quality Gate Invariants (All Vetted Securities Pass All 3)
            </h2>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
            Systematic Filter Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#1E293B] bg-[#0B0F19]">
          <div className="p-3.5 space-y-1">
            <div className="text-xs font-semibold text-white">
              1. Profitability &amp; Moat
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Mandatory Positive Free Cash Flow (<span className="text-emerald-400 font-mono font-medium">FCF &gt; 0</span>) and Return on Invested Capital (<span className="text-emerald-400 font-mono font-medium">ROIC &gt; 12%</span>).
            </p>
          </div>

          <div className="p-3.5 space-y-1">
            <div className="text-xs font-semibold text-white">
              2. Balance Sheet Safety
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Solvency discipline: Debt-to-Equity (<span className="text-emerald-400 font-mono font-medium">D/E &lt; 1.5</span>) and liquidity buffer Current Ratio (<span className="text-emerald-400 font-mono font-medium">CR &gt; 1.2</span>).
            </p>
          </div>

          <div className="p-3.5 space-y-1">
            <div className="text-xs font-semibold text-white">
              3. Valuation Discipline
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Growth at sensible multiples: PEG Ratio (<span className="text-emerald-400 font-mono font-medium">PEG &lt; 1.5</span>) or EV/EBITDA trading at a structural historical discount.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#0F1626] border border-[#1E293B] rounded-lg p-3 sm:p-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Horizon & Catalyst Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Filter className="w-3.5 h-3.5" />
              <span>Horizon:</span>
            </div>
            <div className="flex items-center gap-1 p-1 bg-[#0B0F19] border border-[#1E293B] rounded-md">
              <button
                onClick={() => setSelectedHorizon('all')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                  selectedHorizon === 'all'
                    ? 'bg-[#1E293B] text-emerald-400 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All Horizons
              </button>
              <button
                onClick={() => setSelectedHorizon('medium_term')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                  selectedHorizon === 'medium_term'
                    ? 'bg-[#1E293B] text-emerald-400 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Medium-Term
              </button>
              <button
                onClick={() => setSelectedHorizon('long_term')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                  selectedHorizon === 'long_term'
                    ? 'bg-[#1E293B] text-emerald-400 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Long-Term
              </button>
            </div>

            <div className="h-4 w-px bg-[#1E293B] hidden xl:block" />

            {/* Restored Catalyst Filter (Segmented Buttons) */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span>Catalyst:</span>
            </div>
            <div className="flex items-center gap-1 p-1 bg-[#0B0F19] border border-[#1E293B] rounded-md">
              <button
                onClick={() => setSelectedCatalyst('all')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                  selectedCatalyst === 'all'
                    ? 'bg-[#1E293B] text-emerald-400 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedCatalyst('Earnings Beat & Raise')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                  selectedCatalyst === 'Earnings Beat & Raise'
                    ? 'bg-[#1E293B] text-emerald-400 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Earnings Beat
              </button>
              <button
                onClick={() => setSelectedCatalyst('Oversold Blue-Chip Dislocation')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                  selectedCatalyst === 'Oversold Blue-Chip Dislocation'
                    ? 'bg-[#1E293B] text-emerald-400 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Oversold Dislocation
              </button>
              <button
                onClick={() => setSelectedCatalyst('Capex / Secular Tailwind')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                  selectedCatalyst === 'Capex / Secular Tailwind'
                    ? 'bg-[#1E293B] text-emerald-400 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Secular Tailwind
              </button>
            </div>
          </div>

          {/* Search & View Mode Toggle */}
          <div className="flex items-center justify-between sm:justify-end gap-3">
            <input
              type="text"
              placeholder="Search ticker or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#0B0F19] text-white text-xs px-3 py-1.5 rounded border border-[#1E293B] focus:outline-none focus:border-emerald-500 w-full sm:w-48 placeholder:text-slate-600"
            />

            <div className="flex items-center gap-1 p-1 bg-[#0B0F19] border border-[#1E293B] rounded-md shrink-0">
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'cards' ? 'bg-[#1E293B] text-emerald-400' : 'text-slate-500 hover:text-slate-300'
                }`}
                title="Grid Card View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'table' ? 'bg-[#1E293B] text-emerald-400' : 'text-slate-500 hover:text-slate-300'
                }`}
                title="Table View"
              >
                <TableIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Screened Count Summary */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <div>
          Showing <span className="font-mono text-emerald-400 font-semibold">{filteredStocks.length}</span> high-conviction opportunities
        </div>
        <div className="text-[11px] text-slate-500">
          Ranked by Quality &amp; Conviction Score
        </div>
      </div>

      {/* Card Grid View */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStocks.map((stock) => (
            <div
              key={stock.id}
              className="bg-[#0F1626] border border-[#1E293B] hover:border-emerald-500/40 rounded-lg p-5 flex flex-col justify-between transition-all group"
            >
              <div>
                {/* Header: Ticker, Horizon, Quality Score */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-mono font-bold text-lg text-white group-hover:text-emerald-400 transition-colors">
                        {stock.ticker}
                      </h3>
                      {stock.isAiAudited && (
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-1.5 py-0.2 rounded">
                          AI Audited
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 truncate max-w-[200px]">
                      {stock.companyName}
                    </div>
                  </div>

                  {/* Quality Score & Price */}
                  <div className="text-right">
                    <div className="font-mono text-sm font-semibold text-white tabular-nums">
                      ${stock.currentPrice.toFixed(2)}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Score: <span className="font-mono font-bold text-emerald-400">{stock.qualityScore}</span>/10
                    </div>
                  </div>
                </div>

                {/* Tags: Horizon & Catalyst */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 my-2.5">
                  <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 rounded">
                    {stock.horizon === 'long_term' ? 'Long-Term (1+ Yr)' : 'Medium-Term (1–6 Mo)'}
                  </span>
                  <span className="text-[11px] text-slate-300 bg-[#162138] border border-[#243555] px-2 py-0.5 rounded truncate max-w-[170px]" title={stock.catalyst}>
                    {stock.catalyst}
                  </span>
                </div>

                {/* Two-sentence Thesis Snippet */}
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 my-3">
                  {stock.twoSentenceThesis}
                </p>

                {/* Key Metric Tabular Pills */}
                <div className="grid grid-cols-4 gap-1.5 py-2.5 my-2 border-y border-[#1E293B]/80 text-center">
                  <div className="p-1.5 bg-[#0B0F19] rounded">
                    <span className="block text-[10px] text-slate-500 uppercase tracking-wider">ROIC</span>
                    <span className="font-mono text-xs font-semibold text-emerald-400 tabular-nums">
                      {stock.qualityHurdles.profitabilityMoat.roic}%
                    </span>
                  </div>
                  <div className="p-1.5 bg-[#0B0F19] rounded">
                    <span className="block text-[10px] text-slate-500 uppercase tracking-wider">FCF Yield</span>
                    <span className="font-mono text-xs font-semibold text-emerald-400 tabular-nums">
                      {stock.qualityHurdles.profitabilityMoat.fcfYield}%
                    </span>
                  </div>
                  <div className="p-1.5 bg-[#0B0F19] rounded">
                    <span className="block text-[10px] text-slate-500 uppercase tracking-wider">D / E</span>
                    <span className="font-mono text-xs font-semibold text-slate-200 tabular-nums">
                      {stock.qualityHurdles.balanceSheetSafety.debtToEquity}
                    </span>
                  </div>
                  <div className="p-1.5 bg-[#0B0F19] rounded">
                    <span className="block text-[10px] text-slate-500 uppercase tracking-wider">PEG</span>
                    <span className="font-mono text-xs font-semibold text-slate-200 tabular-nums">
                      {stock.qualityHurdles.valuationDiscipline.pegRatio}
                    </span>
                  </div>
                </div>

                {/* 3 Quality Hurdles Verification Status */}
                <div className="space-y-1 my-3 text-[11px]">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Moat &amp; ROIC (&gt;12%)</span>
                    <span className="font-mono text-emerald-400 text-[10px] bg-emerald-950/40 border border-emerald-800/40 px-1.5 py-0.2 rounded">PASSED</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Solvency &amp; Liquidity (D/E &lt;1.5)</span>
                    <span className="font-mono text-emerald-400 text-[10px] bg-emerald-950/40 border border-emerald-800/40 px-1.5 py-0.2 rounded">PASSED</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Valuation Discipline (PEG &lt;1.5)</span>
                    <span className="font-mono text-emerald-400 text-[10px] bg-emerald-950/40 border border-emerald-800/40 px-1.5 py-0.2 rounded">PASSED</span>
                  </div>
                </div>
              </div>

              {/* Action: Open Tear Sheet */}
              <div className="pt-3 border-t border-[#1E293B]">
                <button
                  onClick={() => onSelectStock(stock)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#131D33] hover:bg-emerald-600 hover:text-slate-950 text-slate-200 font-medium text-xs rounded transition-colors group-hover:border-emerald-500/40"
                >
                  <span>Open Full Tear Sheet</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* High-Density Data Table View */
        <div className="bg-[#0F1626] border border-[#1E293B] rounded-lg overflow-x-auto shadow-sm">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#1E293B] bg-[#0D1424] text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Ticker</th>
                <th className="py-3 px-4">Company</th>
                <th className="py-3 px-4 text-right">Price</th>
                <th className="py-3 px-4 text-right">Fair Value</th>
                <th className="py-3 px-4 text-right">Margin of Safety</th>
                <th className="py-3 px-4 text-right">ROIC</th>
                <th className="py-3 px-4 text-right">FCF Yield</th>
                <th className="py-3 px-4 text-right">D/E</th>
                <th className="py-3 px-4 text-right">PEG</th>
                <th className="py-3 px-4 text-center">Quality Score</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              {filteredStocks.map((stock) => (
                <tr
                  key={stock.id}
                  onClick={() => onSelectStock(stock)}
                  className="hover:bg-[#152037] cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-bold text-white whitespace-nowrap">
                    {stock.ticker}
                  </td>
                  <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                    {stock.companyName}
                    <span className="block text-[10px] text-slate-500 font-sans">{stock.sector}</span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-white tabular-nums">
                    ${stock.currentPrice.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-300 tabular-nums">
                    ${stock.fairValueEstimate.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-400 font-semibold tabular-nums">
                    +{stock.marginOfSafetyPercent}%
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-400 tabular-nums">
                    {stock.qualityHurdles.profitabilityMoat.roic}%
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-400 tabular-nums">
                    {stock.qualityHurdles.profitabilityMoat.fcfYield}%
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-300 tabular-nums">
                    {stock.qualityHurdles.balanceSheetSafety.debtToEquity}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-300 tabular-nums">
                    {stock.qualityHurdles.valuationDiscipline.pegRatio}
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-emerald-400 tabular-nums">
                    {stock.qualityScore}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectStock(stock);
                      }}
                      className="px-2.5 py-1 text-[11px] font-medium bg-[#1E293B] hover:bg-emerald-600 hover:text-slate-950 text-slate-200 rounded transition-colors"
                    >
                      Tear Sheet
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {filteredStocks.length === 0 && (
        <div className="p-12 text-center bg-[#0F1626] border border-[#1E293B] rounded-lg">
          <Info className="w-8 h-8 text-slate-500 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-white mb-1">No Securities Match Criteria</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            No vetted stocks match the current filter combination. Try resetting the horizon filter or search query, or run an audit on a new ticker.
          </p>
          <button
            onClick={() => {
              setSelectedHorizon('all');
              setSelectedCatalyst('all');
              setSearchQuery('');
            }}
            className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-600 text-slate-950 rounded hover:bg-emerald-500 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
