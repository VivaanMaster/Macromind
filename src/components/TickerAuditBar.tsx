import React, { useState } from 'react';
import { Search, Loader2, ArrowRight } from 'lucide-react';

interface TickerAuditBarProps {
  onAuditTicker: (ticker: string) => Promise<void>;
  isLoading: boolean;
  loadingTicker?: string;
}

const QUICK_TICKERS = ['MSFT', 'GOOGL', 'ASML', 'COST', 'UNH', 'NVDA', 'AAPL', 'LLY', 'V'];

export const TickerAuditBar: React.FC<TickerAuditBarProps> = ({
  onAuditTicker,
  isLoading,
  loadingTicker,
}) => {
  const [tickerInput, setTickerInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = tickerInput.trim().toUpperCase();
    if (!clean) return;
    setErrorMsg(null);
    try {
      await onAuditTicker(clean);
      setTickerInput('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      if (!msg || msg.includes('Failed') || msg.includes('500') || msg.includes('fetch') || msg.includes('Error')) {
        setErrorMsg(`Unable to retrieve financial data for ${clean}. Please verify the ticker symbol or select a pre-vetted compounder.`);
      } else {
        setErrorMsg(msg);
      }
    }
  };

  const handleQuickSelect = async (t: string) => {
    setErrorMsg(null);
    try {
      await onAuditTicker(t);
    } catch (err: unknown) {
      setErrorMsg(`Unable to load data for ${t}. Please try again shortly.`);
    }
  };

  return (
    <div className="w-full bg-[#0F1626] border border-[#1E293B] rounded-lg p-3 sm:p-4 mb-6 shadow-sm">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Label & Description */}
        <div className="shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">
              TICKER AUDIT ENGINE
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">Institutional 3-Hurdle Verification</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluate any stock for capital compounding, fair value & position guardrails
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex-1 max-w-lg flex items-center gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={tickerInput}
              onChange={(e) => setTickerInput(e.target.value)}
              placeholder="Enter ticker (e.g. NVDA, AAPL, AMZN, LLY)..."
              disabled={isLoading}
              className="w-full bg-[#0B0F19] text-white pl-9 pr-3 py-2 text-xs sm:text-sm font-mono uppercase tracking-wider rounded border border-[#27354F] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder:text-slate-600 disabled:opacity-50 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !tickerInput.trim()}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-slate-950 font-semibold text-xs rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap shrink-0 shadow-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Auditing...</span>
              </>
            ) : (
              <>
                <span>Run Audit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Quick shortcuts & loading state banner */}
      <div className="mt-3 pt-2.5 border-t border-[#1E293B]/60 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-1.5 text-slate-400">
          <span className="text-[11px] text-slate-500 mr-1">Quick Select:</span>
          {QUICK_TICKERS.map((symbol) => (
            <button
              key={symbol}
              onClick={() => handleQuickSelect(symbol)}
              disabled={isLoading}
              className="px-2 py-0.5 font-mono text-[11px] bg-[#141C2E] hover:bg-[#1E293B] text-slate-300 hover:text-white border border-[#23314B] rounded transition-colors disabled:opacity-50"
            >
              {symbol}
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-mono">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Analyzing {loadingTicker} against ROIC & balance sheet rules...</span>
          </div>
        )}

        {errorMsg && (
          <div className="text-rose-400 text-xs">
            {errorMsg}
          </div>
        )}
      </div>
    </div>
  );
};
