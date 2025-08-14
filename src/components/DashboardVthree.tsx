import { useState, useEffect, useMemo } from 'react';

// --- UI Component Imports ---
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';

// Child Components Imports
import { BlockDetailView, BlocksView } from './deprecated/Blocks';
//import { IndicatorsView } from './Indicators';
import { IndicatorV2 } from './IndicatorsV2';
import { BlocksV2 } from './BlocksV2';
import { RankingView } from './Ranking';
import { parseCSVData, CSVData } from '@/utils/csvParser';

// import CSV files as raw text
import DashboardrawData         from '../database/currentdata.csv?raw';
import PreviousQuarterrawData   from '../database/prevdata.csv?raw';
import BaselinerawData          from '../database/basedata.csv?raw';

export const DashV3 = () => {
  const [activeTab, setActiveTab]                     = useState<'indicator'|'blocks'|'ranking'>('indicator');
  const [dashboardData, setDashboardData]             = useState<CSVData[]>([]);
  const [previousQuarterData, setPreviousQuarterData] = useState<CSVData[]>([]);
  const [baselineData, setBaselineData]               = useState<CSVData[]>([]);
  const [loading, setLoading]                         = useState(true);
  const [error, setError]                             = useState<string|null>(null);
  const [selectedBlock, setSelectedBlock]             = useState<CSVData|null>(null);

  // Parse the imported CSV text once on mount
  useEffect(() => {
    try {
      setDashboardData(parseCSVData(DashboardrawData));
      setPreviousQuarterData(parseCSVData(PreviousQuarterrawData));
      setBaselineData(parseCSVData(BaselinerawData));
    } catch (e: any) {
      console.error('Error parsing CSVs:', e);
      setError('Failed to parse one or more data files. Check console for details.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Prepare a ranking sorted by balancedCompositeScore
  const rankedData = useMemo(() => {
    return [...dashboardData].sort((a, b) => b.balancedCompositeScore - a.balancedCompositeScore);
  }, [dashboardData]);

  // Map sno → rank
  const rankingMap = useMemo(() => {
    const map: Record<number, number> = {};
    rankedData.forEach((row, idx) => {
      map[row.sno] = idx + 1;
    });
    return map;
  }, [rankedData]);
  // 2) Previous-quarter ranking
const rankedPrevious = useMemo(() => {
  return [...previousQuarterData].sort(
    (a, b) => b.balancedCompositeScore - a.balancedCompositeScore
  );
}, [previousQuarterData]);

const previousRankingMap = useMemo(() => {
  const map: Record<number, number> = {};
  rankedPrevious.forEach((row, idx) => {
    map[row.sno] = idx + 1;
  });
  return map;
}, [rankedPrevious]);

  // const handleSelectBlock = (block: CSVData) => {
  //   setSelectedBlock(block);
  //   setActiveTab('blocks');
  // };

  const renderContent = () => {
    if (loading) {
      return <div className="text-center p-10">Loading data…</div>;
    }
    if (error) {
      return (
        <div className="text-center p-10 text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
          {error}
        </div>
      );
    }

    // If a block is selected, show its detail view
    if (activeTab === 'blocks' && selectedBlock) {
      return <BlockDetailView block={selectedBlock} onBack={() => setSelectedBlock(null)} />;
    }

    // Otherwise show the chosen tab
    switch (activeTab) {
      case 'indicator':
        return (
          <IndicatorV2
            data={dashboardData}
            previous={previousQuarterData}
            baseline={baselineData}
          />
        );
      case 'blocks':
        return (
          <BlocksV2
            data={dashboardData}
            baselineData={baselineData}
            // onBlockSelect={handleSelectBlock}
            rankingMap={rankingMap}
          />
        );
      case 'ranking':
        return <RankingView data={rankedData} rankingMap={rankingMap} previousRankingMap={previousRankingMap}/>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-[hsl(var(--primary))]">
            Aspirational Blocks Dashboard
          </h1>
          <p className="text-[hsl(var(--accent))]">
            Analyzing key development indicators across blocks.
          </p>
        </header>

        <nav className="border-b mb-6">
          <div className="flex space-x-4">
            <Button
              variant="ghost"
              onClick={() => { setActiveTab('indicator'); setSelectedBlock(null); }}
              className={`pb-3 rounded-none ${
                activeTab === 'indicator'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              Indicators
            </Button>
            <Button
              variant="ghost"
              onClick={() => setActiveTab('blocks')}
              className={`pb-3 rounded-none ${
                activeTab === 'blocks'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              Block Profile
            </Button>
            <Button
              variant="ghost"
              onClick={() => { setActiveTab('ranking'); setSelectedBlock(null); }}
              className={`pb-3 rounded-none ${
                activeTab === 'ranking'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              Ranking
            </Button>
          </div>
        </nav>

        {renderContent()}
      </div>
      {/* Citation in bottom right */}
      <div
      className="
        fixed bottom-1 right-2
        text-gray-400 text-xs
        opacity-50 hover:opacity-80
        pr-2
        pointer-events-none
        z-50
        transition-opacity duration-300
      "
    >
      2025, Himanshu C
    </div>
    </div>
  );
};

export default DashV3;