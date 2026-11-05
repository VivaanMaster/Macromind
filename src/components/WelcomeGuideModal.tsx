import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Layers, 
  FileText, 
  PieChart, 
  Search, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Target
} from 'lucide-react';

import { ActiveTab } from './Navbar';

interface WelcomeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab: (tab: ActiveTab) => void;
}

export const WelcomeGuideModal: React.FC<WelcomeGuideModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
}) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!isOpen) return null;

  const handleDismiss = () => {
    if (dontShowAgain) {
      localStorage.setItem('macromind_welcome_dismissed', 'true');
    }
    onClose();
  };

  const handleAction = (tab: ActiveTab) => {
    if (dontShowAgain) {
      localStorage.setItem('macromind_welcome_dismissed', 'true');
    }
    onNavigateToTab(tab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] bg-[#0B0F19] border border-[#1E293B] rounded-xl shadow-2xl flex flex-col overflow-hidden text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="px-5 sm:px-6 py-4 bg-[#0D1424] border-b border-[#1E293B] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-emerald-600 flex items-center justify-center font-mono font-bold text-slate-950 text-xs">
              M
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs tracking-wider text-emerald-400 uppercase">
                  MACROMIND TERMINAL
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-xs text-slate-400 font-mono">System Orientation Guide</span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Autonomous AI Investment Research Terminal
              </h2>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-[#1E293B] transition-colors focus:outline-none"
            title="Close guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="px-5 sm:px-6 py-5 overflow-y-auto space-y-6 text-xs sm:text-sm leading-relaxed">
          
          {/* Executive Overview Banner */}
          <div className="p-4 sm:p-5 bg-[#0F1626] border border-[#1E293B] rounded-lg">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="font-semibold text-white text-sm">
                  Systematic Fundamental Due Diligence for Long-Term Capital Compounders
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Macromind is engineered for disciplined position investors and long-term compounders (holding horizon: 1 month to 1+ years). It replaces speculative social chatter and expensive broker fees with rigorous fundamental screening, structured one-page tear sheets, and strict portfolio risk guardrails.
                </p>
              </div>
            </div>
          </div>

          {/* Section: 3 Core Terminal Modules */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-[#1E293B]">
              <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                Core Terminal Modules
              </h4>
              <span className="text-[11px] font-mono text-slate-500">3-Tab Workflow</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* Module 1 */}
              <div className="p-4 bg-[#0D1424] border border-[#1E293B] rounded-lg space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold mb-1">
                    <Layers className="w-4 h-4" />
                    <span>1. Catalyst Screener</span>
                  </div>
                  <h5 className="font-bold text-white text-xs mb-1">
                    3 Invariant Quality Hurdles
                  </h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Evaluates equities against non-negotiable rules:
                  </p>
                  <ul className="mt-1.5 space-y-1 text-[11px] text-slate-300 font-mono">
                    <li className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-emerald-400" />
                      <span>ROIC &gt; 12% &amp; Positive FCF</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-emerald-400" />
                      <span>Debt/Equity &lt; 1.5 &amp; CR &gt; 1.2</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-emerald-400" />
                      <span>PEG &lt; 1.5 or EV/EBITDA discount</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-2 text-[10px] text-slate-500 font-mono">
                  Filter by Horizon &amp; Catalyst type.
                </div>
              </div>

              {/* Module 2 */}
              <div className="p-4 bg-[#0D1424] border border-[#1E293B] rounded-lg space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold mb-1">
                    <FileText className="w-4 h-4" />
                    <span>2. Executive Tear Sheet</span>
                  </div>
                  <h5 className="font-bold text-white text-xs mb-1">
                    One-Page Investment Memo
                  </h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Deep fundamental thesis and valuation guidance:
                  </p>
                  <ul className="mt-1.5 space-y-1 text-[11px] text-slate-300 font-mono">
                    <li className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-emerald-400" />
                      <span>3-Point Structural Bull Thesis</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-emerald-400" />
                      <span>Devil&apos;s Advocate Bear Vulnerabilities</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-emerald-400" />
                      <span>2-Tranche Strategy &amp; Custom Entry Target</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-2 text-[10px] text-slate-500 font-mono">
                  Printable institutional memorandum.
                </div>
              </div>

              {/* Module 3 */}
              <div className="p-4 bg-[#0D1424] border border-[#1E293B] rounded-lg space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold mb-1">
                    <PieChart className="w-4 h-4" />
                    <span>3. Portfolio &amp; Guardrails</span>
                  </div>
                  <h5 className="font-bold text-white text-xs mb-1">
                    Strict 8.0% Position Ceiling
                  </h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Interactive capital simulator and radar:
                  </p>
                  <ul className="mt-1.5 space-y-1 text-[11px] text-slate-300 font-mono">
                    <li className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-emerald-400" />
                      <span>Hard 8.0% Concentration Alert</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-emerald-400" />
                      <span>Automated Share Trim Rebalancing</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-emerald-400" />
                      <span>Entry Target Proximity Radar</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-2 text-[10px] text-slate-500 font-mono">
                  Protects portfolio downside.
                </div>
              </div>
            </div>
          </div>

          {/* Section: Live Ticker Audit Bar */}
          <div className="p-4 bg-[#0D1424] border border-[#1E293B] rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono text-xs font-bold text-white uppercase">
                  Instant Ticker Audit Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Type any ticker (e.g., NVDA, AAPL, AMZN, LLY, TSLA) into the top audit bar to instantly synthesize financial statements against the 3 quality hurdles.
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-1 font-mono text-[11px] text-slate-400 bg-[#0B0F19] px-2.5 py-1 rounded border border-[#1E293B]">
              <span>Try:</span>
              <span className="text-emerald-400 font-semibold">MSFT</span>
              <span className="text-slate-600">·</span>
              <span className="text-emerald-400 font-semibold">ASML</span>
              <span className="text-slate-600">·</span>
              <span className="text-emerald-400 font-semibold">COST</span>
            </div>
          </div>

          {/* Section: Where to Start */}
          <div className="space-y-3">
            <div className="pb-1 border-b border-[#1E293B]">
              <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                Where to Start (Recommended 4-Step Flow)
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-start gap-3 p-3 bg-[#0F1626] border border-[#1E293B] rounded-lg">
                <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-400 font-mono font-bold flex items-center justify-center text-xs shrink-0">
                  1
                </span>
                <div>
                  <strong className="text-white block font-semibold mb-0.5">Explore Pre-Vetted Compounders</strong>
                  <span className="text-slate-400">
                    Review the vetted equities in the Catalyst Screener feed. Switch between Grid Cards and High-Density Table views.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-[#0F1626] border border-[#1E293B] rounded-lg">
                <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-400 font-mono font-bold flex items-center justify-center text-xs shrink-0">
                  2
                </span>
                <div>
                  <strong className="text-white block font-semibold mb-0.5">Examine an Executive Tear Sheet</strong>
                  <span className="text-slate-400">
                    Click &quot;Open Full Tear Sheet&quot; to review the 3-point bull case, devil&apos;s advocate risks, and 2-tranche entry buy zone.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-[#0F1626] border border-[#1E293B] rounded-lg">
                <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-400 font-mono font-bold flex items-center justify-center text-xs shrink-0">
                  3
                </span>
                <div>
                  <strong className="text-white block font-semibold mb-0.5">Set a Custom Entry Target Price</strong>
                  <span className="text-slate-400">
                    Define your target buy price inside the Tear Sheet. The Portfolio Radar will alert you when market prices drop toward your trigger.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-[#0F1626] border border-[#1E293B] rounded-lg">
                <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-400 font-mono font-bold flex items-center justify-center text-xs shrink-0">
                  4
                </span>
                <div>
                  <strong className="text-white block font-semibold mb-0.5">Simulate &amp; Guard Your Portfolio</strong>
                  <span className="text-slate-400">
                    Test your position sizing in the Portfolio Monitor. Verify no stock exceeds the 8.0% concentration risk ceiling.
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="px-5 sm:px-6 py-4 bg-[#0D1424] border-t border-[#1E293B] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="rounded bg-[#0B0F19] border-[#1E293B] text-emerald-500 focus:ring-emerald-500"
            />
            <span>Don&apos;t show on startup (reopen anytime via Guide in header)</span>
          </label>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => handleAction('screener')}
              className="px-3 py-2 bg-[#131B2E] hover:bg-[#1E293B] text-slate-300 font-semibold text-xs rounded border border-[#23314B] transition-colors"
            >
              <span>Catalyst Screener</span>
            </button>
            <button
              onClick={() => handleAction('cockpit')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-slate-950 font-semibold text-xs rounded transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>Enter Terminal (Allocator Cockpit)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
