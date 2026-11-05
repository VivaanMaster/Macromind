import React from 'react';
import { Layers, FileText, PieChart, ShieldCheck, BookOpen } from 'lucide-react';

export type ActiveTab = 'cockpit' | 'screener' | 'tearsheet' | 'portfolio';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedTicker?: string;
  hasGuardrailAlert: boolean;
  totalPortfolioValue: number;
  onOpenGuide?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedTicker,
  hasGuardrailAlert,
  totalPortfolioValue,
  onOpenGuide,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0F19] border-b border-[#1E293B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('cockpit')}
            className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
          >
            <div className="w-8 h-8 rounded bg-emerald-600 flex items-center justify-center font-mono font-bold text-slate-950 text-sm">
              M
            </div>
            <div>
              <span className="font-sans font-extrabold text-base tracking-tight text-white block leading-none">
                MACROMIND
              </span>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider block mt-0.5">
                RESEARCH TERMINAL
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Clean Typography Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('cockpit')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'cockpit'
                ? 'bg-[#1E293B] text-emerald-400 border border-[#334155]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#131B2E]'
            }`}
          >
            Allocator Cockpit
          </button>

          <button
            onClick={() => setActiveTab('screener')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'screener'
                ? 'bg-[#1E293B] text-emerald-400 border border-[#334155]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#131B2E]'
            }`}
          >
            Catalyst Screener
          </button>

          <button
            onClick={() => setActiveTab('tearsheet')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'tearsheet'
                ? 'bg-[#1E293B] text-emerald-400 border border-[#334155]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#131B2E]'
            }`}
          >
            Executive Tear Sheet
            {selectedTicker && (
              <span className="font-mono text-[10px] text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded ml-1.5">
                {selectedTicker}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'portfolio'
                ? 'bg-[#1E293B] text-emerald-400 border border-[#334155]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#131B2E]'
            }`}
          >
            Portfolio &amp; Guardrails
            {hasGuardrailAlert && (
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block ml-1.5" title="Guardrail limit breached" />
            )}
          </button>
        </nav>

        {/* Zone 3: Status & Orientation Action Zone */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-[#131B2E] border border-[#1E293B] rounded text-xs">
            <span className="text-slate-400">Total Capital</span>
            <span className="font-mono font-semibold text-white tabular-nums">
              ${totalPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <button
            onClick={() => setActiveTab('portfolio')}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-[#1A2338] border border-[#2A3756] rounded hover:border-emerald-500/50 hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            <span className="hidden sm:inline">Guardrail:</span>{' '}
            <span className="font-mono font-semibold text-emerald-400">8.0% Max Cap</span>
          </button>

          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-emerald-400 bg-[#131B2E] hover:bg-[#1E293B] border border-[#23314B] rounded transition-colors whitespace-nowrap"
              title="Open Terminal Orientation Guide"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Guide</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
