import React, { useState, useEffect, useMemo } from 'react';
import { StockResearchData, PortfolioHolding } from './types/stock';
import { INITIAL_VETTED_STOCKS, INITIAL_PORTFOLIO_HOLDINGS } from './data/mockStocks';
import { Navbar, ActiveTab } from './components/Navbar';
import { TickerAuditBar } from './components/TickerAuditBar';
import { CatalystScreener } from './components/CatalystScreener';
import { ExecutiveTearSheet } from './components/ExecutiveTearSheet';
import { PortfolioMonitor } from './components/PortfolioMonitor';
import { AllocatorCommandCenter } from './components/AllocatorCommandCenter';
import { WelcomeGuideModal } from './components/WelcomeGuideModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('cockpit');
  const [showWelcomeGuide, setShowWelcomeGuide] = useState<boolean>(() => {
    return !localStorage.getItem('macromind_welcome_dismissed');
  });
  const [stocks, setStocks] = useState<StockResearchData[]>(() => {
    const saved = localStorage.getItem('macromind_stocks');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((stock: StockResearchData) => {
            const vetted = INITIAL_VETTED_STOCKS.find((v) => v.ticker === stock.ticker);
            return {
              ...stock,
              isGoogleSearchGrounded: true,
              groundingSources:
                stock.groundingSources && stock.groundingSources.length > 0
                  ? stock.groundingSources
                  : vetted?.groundingSources || [
                      {
                        title: `${stock.companyName} Investor Relations & SEC Filings`,
                        url: `https://www.google.com/finance/quote/${stock.ticker}:NASDAQ`,
                      },
                      {
                        title: `${stock.ticker} Live Market Data & Real-Time Ratios`,
                        url: `https://finance.yahoo.com/quote/${stock.ticker}`,
                      },
                    ],
              customEntryTarget:
                stock.customEntryTarget !== undefined
                  ? stock.customEntryTarget
                  : vetted?.customEntryTarget,
            };
          });
        }
      } catch {
        // use default
      }
    }
    return INITIAL_VETTED_STOCKS;
  });

  const [selectedStock, setSelectedStock] = useState<StockResearchData>(() => {
    return stocks[0] || INITIAL_VETTED_STOCKS[0];
  });

  const [totalPortfolioCapital, setTotalPortfolioCapital] = useState<number>(() => {
    const saved = localStorage.getItem('macromind_capital');
    return saved ? parseFloat(saved) || 10000 : 10000;
  });

  const [portfolioHoldings, setPortfolioHoldings] = useState<PortfolioHolding[]>(() => {
    const saved = localStorage.getItem('macromind_holdings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // use default
      }
    }
    return INITIAL_PORTFOLIO_HOLDINGS;
  });

  const [isLoadingAudit, setIsLoadingAudit] = useState(false);
  const [loadingTicker, setLoadingTicker] = useState<string | undefined>(undefined);
  const [auditNotification, setAuditNotification] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('macromind_stocks', JSON.stringify(stocks));
  }, [stocks]);

  useEffect(() => {
    localStorage.setItem('macromind_holdings', JSON.stringify(portfolioHoldings));
  }, [portfolioHoldings]);

  useEffect(() => {
    localStorage.setItem('macromind_capital', totalPortfolioCapital.toString());
  }, [totalPortfolioCapital]);

  // Check if any position exceeds 8% hard cap
  const hasGuardrailAlert = useMemo(() => {
    if (totalPortfolioCapital <= 0) return false;
    return portfolioHoldings.some((h) => {
      const val = h.shares * h.currentPrice;
      const alloc = (val / totalPortfolioCapital) * 100;
      return alloc > 8.0;
    });
  }, [portfolioHoldings, totalPortfolioCapital]);

  // Handle Ticker Audit Bar submission
  const handleAuditTicker = async (ticker: string) => {
    setIsLoadingAudit(true);
    setLoadingTicker(ticker);
    setAuditNotification(null);

    try {
      const res = await fetch('/api/audit-ticker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker }),
      });

      if (!res.ok) {
        throw new Error(`Failed to audit ticker: ${res.statusText}`);
      }

      const data = await res.json();
      if (!data.stock) {
        throw new Error('Invalid audit data returned');
      }

      const auditedStock: StockResearchData = data.stock;

      // Update or prepend to stock list
      setStocks((prev) => {
        const idx = prev.findIndex((s) => s.ticker === auditedStock.ticker);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = auditedStock;
          return next;
        }
        return [auditedStock, ...prev];
      });

      setSelectedStock(auditedStock);
      setActiveTab('tearsheet');
      setAuditNotification(`Generated Tear Sheet for ${auditedStock.ticker} (${auditedStock.companyName})`);
      setTimeout(() => setAuditNotification(null), 4000);
    } catch {
      // Fallback local lookup or friendly notification
      const existing = stocks.find((s) => s.ticker === ticker.toUpperCase().trim());
      if (existing) {
        setSelectedStock(existing);
        setActiveTab('tearsheet');
      } else {
        throw new Error(`Unable to load fundamental audit for ${ticker.toUpperCase().trim()}. Please verify symbol.`);
      }
    } finally {
      setIsLoadingAudit(false);
      setLoadingTicker(undefined);
    }
  };

  // Select stock from screener to open full tear sheet
  const handleSelectStock = (stock: StockResearchData) => {
    setSelectedStock(stock);
    setActiveTab('tearsheet');
  };

  // Add position to portfolio from tear sheet
  const handleAddToPortfolio = (stock: StockResearchData, targetAllocationPercent: number) => {
    const allocatedDollars = (totalPortfolioCapital * targetAllocationPercent) / 100;
    const sharesToAdd = Math.max(0.1, Math.round((allocatedDollars / stock.currentPrice) * 10) / 10);

    setPortfolioHoldings((prev) => {
      const existingIdx = prev.findIndex((h) => h.ticker === stock.ticker);
      if (existingIdx >= 0) {
        const updated = [...prev];
        const existing = updated[existingIdx];
        const newTotalShares = Math.round((existing.shares + sharesToAdd) * 10) / 10;
        const totalCost = existing.shares * existing.avgPurchasePrice + sharesToAdd * stock.currentPrice;
        const newAvg = totalCost / newTotalShares;
        updated[existingIdx] = {
          ...existing,
          shares: newTotalShares,
          avgPurchasePrice: Math.round(newAvg * 100) / 100,
          currentPrice: stock.currentPrice,
        };
        return updated;
      }

      const newHolding: PortfolioHolding = {
        id: `hold_${stock.ticker.toLowerCase()}_${Date.now()}`,
        ticker: stock.ticker,
        companyName: stock.companyName,
        shares: sharesToAdd,
        avgPurchasePrice: stock.currentPrice,
        currentPrice: stock.currentPrice,
        sector: stock.sector,
        addedAt: new Date().toISOString().split('T')[0],
      };
      return [...prev, newHolding];
    });
  };

  // Update holding shares in portfolio monitor
  const handleUpdateHolding = (id: string, updatedShares: number, updatedAvgPrice?: number) => {
    setPortfolioHoldings((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          return {
            ...h,
            shares: updatedShares,
            avgPurchasePrice: updatedAvgPrice !== undefined ? updatedAvgPrice : h.avgPurchasePrice,
          };
        }
        return h;
      })
    );
  };

  // Remove holding
  const handleRemoveHolding = (id: string) => {
    setPortfolioHoldings((prev) => prev.filter((h) => h.id !== id));
  };

  // Direct add holding
  const handleAddHoldingDirect = (holdingData: Omit<PortfolioHolding, 'id' | 'addedAt'>) => {
    const newHolding: PortfolioHolding = {
      ...holdingData,
      id: `hold_${holdingData.ticker.toLowerCase()}_${Date.now()}`,
      addedAt: new Date().toISOString().split('T')[0],
    };
    setPortfolioHoldings((prev) => [...prev, newHolding]);
  };

  // Set or update custom entry target for a stock
  const handleUpdateEntryTarget = (ticker: string, targetPrice: number | undefined) => {
    setStocks((prev) =>
      prev.map((s) => {
        if (s.ticker === ticker) {
          return { ...s, customEntryTarget: targetPrice };
        }
        return s;
      })
    );

    setSelectedStock((prev) => {
      if (prev && prev.ticker === ticker) {
        return { ...prev, customEntryTarget: targetPrice };
      }
      return prev;
    });
  };

  // Open tear sheet by ticker
  const handleOpenTearSheetByTicker = (ticker: string) => {
    const found = stocks.find((s) => s.ticker === ticker);
    if (found) {
      setSelectedStock(found);
      setActiveTab('tearsheet');
    } else {
      handleAuditTicker(ticker);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#E2E8F0] flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Strict Top Bar Contract Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedTicker={selectedStock?.ticker}
        hasGuardrailAlert={hasGuardrailAlert}
        totalPortfolioValue={totalPortfolioCapital}
        onOpenGuide={() => setShowWelcomeGuide(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Ticker Audit Bar (Prominent at top of all views) */}
        <TickerAuditBar
          onAuditTicker={handleAuditTicker}
          isLoading={isLoadingAudit}
          loadingTicker={loadingTicker}
        />

        {/* Global notification toast if audit complete */}
        {auditNotification && (
          <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs rounded-md flex items-center justify-between transition-all font-mono">
            <span>{auditNotification}</span>
            <button
              onClick={() => setAuditNotification(null)}
              className="text-emerald-500 hover:text-white ml-2"
            >
              ×
            </button>
          </div>
        )}

        {/* View 0: Allocator Command Cockpit (Default CIO Landing) */}
        {activeTab === 'cockpit' && (
          <AllocatorCommandCenter
            stocks={stocks}
            holdings={portfolioHoldings}
            totalPortfolioCapital={totalPortfolioCapital}
            onSelectStock={handleSelectStock}
            onNavigateToTab={(tab) => setActiveTab(tab)}
            onAuditTicker={handleAuditTicker}
          />
        )}

        {/* View 1: Catalyst Screener Feed */}
        {activeTab === 'screener' && (
          <CatalystScreener
            stocks={stocks}
            onSelectStock={handleSelectStock}
            onAuditTicker={handleAuditTicker}
            isLoadingAudit={isLoadingAudit}
            loadingTicker={loadingTicker}
          />
        )}

        {/* View 2: One-Page Executive Tear Sheet */}
        {activeTab === 'tearsheet' && selectedStock && (
          <ExecutiveTearSheet
            stock={selectedStock}
            onBack={() => setActiveTab('screener')}
            onAddToPortfolio={handleAddToPortfolio}
            totalPortfolioCapital={totalPortfolioCapital}
            onUpdateEntryTarget={handleUpdateEntryTarget}
          />
        )}

        {/* View 3: Portfolio & Guardrail Monitor */}
        {activeTab === 'portfolio' && (
          <PortfolioMonitor
            holdings={portfolioHoldings}
            totalPortfolioCapital={totalPortfolioCapital}
            setTotalPortfolioCapital={setTotalPortfolioCapital}
            onUpdateHolding={handleUpdateHolding}
            onRemoveHolding={handleRemoveHolding}
            onAddHolding={handleAddHoldingDirect}
            vettedStocks={stocks}
            onOpenTearSheet={handleOpenTearSheetByTicker}
          />
        )}
      </main>

      {/* Minimalist Institutional Footer */}
      <footer className="border-t border-[#1E293B] bg-[#070A12] py-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            MACROMIND RESEARCH TERMINAL · SYSTEMATIC CAPITAL COMPOUNDING
          </span>
          <span className="text-slate-600">
            Holding Horizon: 1 Month to 1+ Years · 8% Hard Guardrail Enforced
          </span>
        </div>
      </footer>

      {/* First-time Welcome & Terminal Orientation Guide Modal */}
      <WelcomeGuideModal
        isOpen={showWelcomeGuide}
        onClose={() => setShowWelcomeGuide(false)}
        onNavigateToTab={(tab) => setActiveTab(tab)}
      />
    </div>
  );
}
